import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface AxiosInterceptorManager<V> {
  use(onFulfilled?: ((value: V) => V | Promise<V>) | null, onRejected?: ((error: any) => any) | null): number;
  eject(id: number): void;
  clear(): void;
}
export type Axios = {
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
}
export type InterceptId = string;
export type DebugRequestId = string;

export type AxiosUIData = Record<
  DebugRequestId,
  { request: AxiosUIRequestData; response?: AxiosUIResponseData }
>;

export type AxiosUIRequestData = {
  requestId: string;
  debugToken?: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  time: number;
  body: Object | null;
};
export type AxiosUIResponseData = {
  requestId: string;
  url: string;
  headers: Record<string, string>;
  data: Object;
  time: number;
};

export type InterceptedAxiosRequest = InternalAxiosRequestConfig;
export type InterceptedAxiosResponse<T = unknown, D = unknown> = AxiosResponse<
  T,
  D
> & {
  config: InternalAxiosRequestConfig<D> & {
    _debugRequestId?: string;
    _debugInterceptId?: string;
  };
};
