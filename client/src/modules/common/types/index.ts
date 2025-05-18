import { CacheProperties } from "axios-cache-interceptor";

export interface IPagination {
  current: number;
  pageSize: number;
}

export interface IRequestCacheOptions {
  signal?: AbortSignal;
}

export interface ICanceler {
  (reason?: any): void;
  (): void;
}

export interface IOwnApiOptions {
  cache: false | Partial<CacheProperties<any, any>> | undefined;
  setCancel?: (canceler: ICanceler) => void;
}

export interface IOptions {
  setCancel?: (canceler: ICanceler) => void;
}

export interface IExecuteStore<CurrentStorePropsType = undefined> {
  data: CurrentStorePropsType;
  ownApiOptions?: IOwnApiOptions;
}
