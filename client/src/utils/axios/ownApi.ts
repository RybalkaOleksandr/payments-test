import { updateToken } from "@utils/updateToken";
import { notification } from "antd";
import axios, {
  InternalAxiosRequestConfig,
  AxiosHeaders,
  AxiosResponse,
} from "axios";
import {
  buildStorage,
  setupCache,
  NotEmptyStorageValue,
  StorageValue,
} from "axios-cache-interceptor";
import i18next from "i18next";
import localforage from "localforage";
import Cookies from "universal-cookie";

interface IAxiosResponseWithRetry extends AxiosResponse {
  _retry?: boolean;
  signal?: AbortSignal;
}

interface IFailedRequest {
  resolve: (value?: any) => void;
  reject: (error: IAxiosResponseWithRetry | null) => void;
}

interface IResponseErrorParam {
  response: { status: number; data: { message: string } };
  config: IAxiosResponseWithRetry;
}

const cookies = new Cookies();

export const forageStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: "my-cache",
});

const storage = buildStorage({
  async find(key: string): Promise<StorageValue> {
    return forageStore.getItem<StorageValue>(key) as Promise<StorageValue>;
  },
  async set(key: string, value: NotEmptyStorageValue): Promise<void> {
    await forageStore.setItem(key, value);
  },
  async remove(key: string): Promise<void> {
    await forageStore.removeItem(key);
  },
});

export const removeRelatedCache = async (baseKey: string) => {
  /* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
  const keys = await forageStore.keys((err, keys) => keys);

  keys.map((key) => {
    return key.includes(baseKey) ? forageStore.removeItem(key) : key;
  });
};

const baseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
});

export const axiosInstance = setupCache(baseAxios, {
  ttl: 15 * 60 * 1000,
  storage: storage,
});

const addHeader = (requestConfig: InternalAxiosRequestConfig) => {
  return new Promise(
    async (resolve: (arg1: InternalAxiosRequestConfig) => void) => {
      const accessToken = await cookies.get("accessToken");

      const headers = new AxiosHeaders({
        ...requestConfig.headers,
        Authorization: `Bearer ${accessToken}`,
      });

      return resolve({ ...requestConfig, headers });
    }
  );
};

axiosInstance.interceptors.request.use(
  async (requestConfig): Promise<InternalAxiosRequestConfig> =>
    addHeader(requestConfig)
);

let isRefreshing = false;
let failedQueue: IFailedRequest[] = [];

const processQueue = (error: IAxiosResponseWithRetry | null) => {
  failedQueue.forEach(({ resolve, reject }: IFailedRequest) =>
    error ? reject(error) : resolve()
  );
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: IResponseErrorParam) => {
    const { response, config: originalRequest } = error;

    if (originalRequest.signal?.aborted) {
      return error;
    }

    const accessToken = await cookies.get("accessToken");

    if (
      response?.status !== 401 ||
      originalRequest._retry ||
      (response?.status === 401 && !accessToken)
    ) {
      return Promise.reject({
        ...response,
        message:
          response?.data?.message ||
          `${i18next.t("common:serverError")} ${response?.status || ""}`,
      });
    }

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosInstance.request(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise(function (resolve, reject) {
      updateToken()
        .then(() => {
          processQueue(null);
          resolve(axiosInstance.request(originalRequest));
        })
        .catch((err) => {
          if (err && err.code === "login_required") {
            // reject isn't called to prevent other error notifications displaying
            failedQueue = [];
            notification.warning({
              message:
                "Re-login is required; you will be redirected to the login page.",
              duration: 5,
              onClose: () => {
                window.location.assign("/logout");
              },
            });
            return;
          }
          processQueue(err);
          reject(err);
        })
        .then(() => {
          isRefreshing = false;
        });
    });
  }
);
