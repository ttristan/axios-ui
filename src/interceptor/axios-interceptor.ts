import {
  InterceptId,
  InterceptedAxiosRequest,
  InterceptedAxiosResponse,
  AxiosUIData,
  Axios,
} from "../types";
import getUuid from "../util/uuid";

export default class AxiosInterceptor {
  private axios: Axios;
  private interceptId: string;

  private requestInterceptor: number | null = null;
  private responseInterceptor: number | null = null;
  private requests: Record<InterceptId, AxiosUIData> = {};

  private debugHeader: { key: string; value: string } | null = null;

  private timeout = 5000;
  private forceEjectTimeout: NodeJS.Timeout | null = null;

  constructor(
    axios: Axios,
    interceptId: string,
    options?: { timeout?: number; debugHeader: { key: string; value: string } }
  ) {
    this.axios = axios;
    this.interceptId = interceptId;
    if (options?.debugHeader) {
      this.debugHeader = options.debugHeader;
    }
    if (options?.timeout) {
      this.timeout = options.timeout;
    }
  }

  public clear(): void {
    this.axios.interceptors.request.clear();
    this.axios.interceptors.response.clear();
  }

  public intercept(): void {
    this.requestInterceptor = this.axios.interceptors.request.use(
      (config) => {
        if (this.debugHeader) {
          // bail if the expected debug header value is not set
          const { key, value } = this.debugHeader;
          if (config.headers.get(key) !== value) {
            return config;
          }
        }

        const debugRequestId = getUuid();

        this.addRequest(this.interceptId, debugRequestId, config);

        const interceptedConfig: InterceptedAxiosResponse["config"] = {
          ...config,
          _debugRequestId: debugRequestId,
          _debugInterceptId: this.interceptId,
        };
        return interceptedConfig;
      },
      (error) => {
        this.clear();
        return Promise.reject(error);
      }
    );

    this.responseInterceptor = this.axios.interceptors.response.use(
      (response: InterceptedAxiosResponse) => {
        const debugRequestId = response.config._debugRequestId;
        const debugInterceptId = response.config._debugInterceptId;

        if (this.interceptId !== debugInterceptId) {
          // do not intercept unrelated responses
          return response;
        }
        if (!debugRequestId) {
          throw `debugRequestId missing in response config: ${JSON.stringify(
            response.config
          )}`;
        }
        this.addResponse(this.interceptId, debugRequestId, response);

        return response;
      },
      (error) => {
        this.clear();
        return Promise.reject(error);
      }
    );

    // make sure listeners are ejected eventually
    this.forceEjectTimeout = setTimeout(() => {
      this.eject();
    }, this.timeout);
  }

  public eject(): void {
    if (this.forceEjectTimeout) {
      clearTimeout(this.forceEjectTimeout);
      this.forceEjectTimeout = null;
    }

    // Strict null check here as interceptor IDs are 0 based numbers, this cost me >4 hours of debugging
    if (this.requestInterceptor) {
      this.axios.interceptors.request.eject(this.requestInterceptor);
      this.requestInterceptor = null;
    }
    if (this.responseInterceptor !== null) {
      this.axios.interceptors.response.eject(this.responseInterceptor);
      this.responseInterceptor = null;
    }
  }

  private addRequest(
    interceptId: string,
    debugRequestId: string,
    request: InterceptedAxiosRequest
  ) {
    const { url, headers, method } = request;
    let headersObject: Record<string, string> = {};

    for (const headerName in headers) {
      headersObject[headerName] = String(headers.get(headerName));
    }

    this.requests[interceptId] = {
      ...this.requests[interceptId],
      [debugRequestId]: {
        request: {
          requestId: debugRequestId,
          debugToken: this.debugHeader?.value,
          method: method?.toUpperCase() ?? "",
          url: url ?? "",
          headers: headersObject,
          time: Date.now(),
        },
      },
    };
  }

  private addResponse(
    interceptId: string,
    debugRequestId: string,
    response: InterceptedAxiosResponse
  ) {
    const { config, headers, data } = response;

    this.requests[interceptId] = {
      ...this.requests[interceptId],
      [debugRequestId]: {
        ...this.requests[interceptId][debugRequestId],
        response: {
          requestId: debugRequestId,
          url: config.url ?? "",
          headers: JSON.parse(JSON.stringify(headers)),
          data: data as Object,
          time: Date.now(),
        },
      },
    };
  }

  public getData(
    options: { eject: boolean } = { eject: true }
  ): AxiosUIData {
    if (options.eject) {
      // eject interceptors when data is consumed to clean up listeners
      this.eject();
    }
    return this.requests[this.interceptId];
  }
}
