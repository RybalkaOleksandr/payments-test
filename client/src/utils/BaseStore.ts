import { action, observable, runInAction, makeObservable, when } from "mobx";

import type {
  ICanceler,
  IExecuteStore,
  IOwnApiOptions,
} from "@modules/common/types";

import { CustomError } from "./CustomError";

type CommonParams = {
  onSuccess?: (params?: any) => void;
  onError?: (params?: any) => void;
};

type ActionParams<T> = {
  data?: T;
} & CommonParams;

/* tslint:disable:no-any */
abstract class BaseStore<Type = {}> {
  public status: "notRun" | "loading" | "loaded" | "error" = "notRun";

  public cancel: ICanceler | null = null;

  public isLoaded = false;

  public isLoading = false;

  public error: CustomError | null = null;

  public setCancel = (cancel: ICanceler | null) => {
    runInAction(() => (this.cancel = cancel));
  };

  constructor() {
    makeObservable<BaseStore<Type>, "runAction">(this, {
      status: observable,
      cancel: observable,
      isLoaded: observable,
      isLoading: observable,
      error: observable,
      setCancel: action,
      runAction: action,
      reload: action,
      load: action,
      execute: action,
      cancelRequest: action,
    });
  }

  protected async runAction(
    params?: ActionParams<Type>,
    ownApiOptions?: IOwnApiOptions
  ) {
    this.cancelRequest();
    await when(() => !this.isLoading);

    runInAction(async () => {
      this.status = "loading";
      this.isLoaded = false;
      this.isLoading = true;
    });

    try {
      const response = await this.onExecute({
        data: params?.data,
        ownApiOptions,
      });

      runInAction(() => {
        this.error = null;
        this.status = "loaded";
        this.isLoaded = true;
        this.isLoading = false;
        params?.onSuccess && params.onSuccess(response);
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
        this.status = "error";
        this.isLoaded = false;
        params?.onError && params.onError(error);
      });
    }
  }

  public abstract onExecute({
    data,
    ownApiOptions,
  }: IExecuteStore<Type | undefined>): Promise<any>;

  public resetStore() {
    this.cancelRequest();

    runInAction(() => {
      this.status = "notRun";
      this.isLoading = false;
      this.isLoaded = false;
      this.error = null;
    });
  }

  // preferably used only for GET requests to improve code readability (it always sends a request and never takes data from the cache)
  public async reload(params?: ActionParams<Type>) {
    const ownApiOptions = {
      cache: { override: true },
      setCancel: this.setCancel,
    };
    await this.runAction(params, ownApiOptions);
  }

  // preferably used only for GET requests to improve code readability (if data exists in cache, it will be taken from cache)
  public async load(params?: ActionParams<Type>) {
    if (this.status !== "loading") {
      await this.runAction(params);
    }
  }

  // preferably used for POST, PUT, PATCH, DELETE requests to improve code readability
  public async execute(params?: ActionParams<Type>) {
    await this.runAction(params);
  }

  public cancelRequest = () => {
    if (this.cancel) {
      this.cancel();
      this.setCancel(null);
    }
  };
}

export default BaseStore;
