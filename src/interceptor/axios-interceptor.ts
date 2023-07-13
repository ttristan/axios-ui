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
        try {
          // bail if the expected debug header value is not set
          if (this.debugHeader) {
            const { key, value } = this.debugHeader;
            if (
              typeof config.headers?.get === "function" &&
              config.headers.get(key) !== undefined &&
              config.headers.get(key) !== value
            ) {
              return config;
            }
            if (
              config.data?.headers?.[key] &&
              config.data.headers[key] !== value
            ) {
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
        } catch (error) {
          console.error("Error in Axios UI (Request Interceptor)", error);
          return config;
        }
      },
      (error) => {
        this.clear();
        return Promise.resolve(error?.config);
      }
    );

    this.responseInterceptor = this.axios.interceptors.response.use(
      (response: InterceptedAxiosResponse) => {
        this.addResponse(response);
        return response;
      },
      (error) => {
        if (error.response) {
          this.addResponse(error.response, error);
        }

        this.clear();
        return Promise.resolve(error.response);
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
    const { url, headers, method, data } = request;

    let headersObject: Record<string, string> = {};

    if (data?.body && data.headers) {
      headersObject = data.headers;
    } else {
      for (const headerName in headers) {
        headersObject[headerName] = String(headers.get(headerName));
      }
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
          body: data?.body ? JSON.parse(data.body) : null,
        },
      },
    };
  }

  private addResponse(response: InterceptedAxiosResponse, error: unknown | null = null) {
    try {
      const { config, headers, data, status } = response;

      const debugRequestId = config._debugRequestId;
      const debugInterceptId = config._debugInterceptId;

      if (this.interceptId !== debugInterceptId) {
        // do not handle unrelated responses
        return;
      }
      if (!debugRequestId) {
        throw `debugRequestId missing in response config: ${JSON.stringify(
          config
        )}`;
      }

      this.requests[this.interceptId] = {
        ...this.requests[this.interceptId],
        [debugRequestId]: {
          ...this.requests[this.interceptId][debugRequestId],
          response: {
            status,
            requestId: debugRequestId,
            url: config.url ?? "",
            headers: JSON.parse(JSON.stringify(headers)),
            data: data as Object,
            time: Date.now(),
            error: error?.toString() ?? null,
          },
        },
      };
    } catch (error) {
      console.error("Error in Axios UI (addResponse)", error);
    }
  }

  public getData(options: { eject: boolean } = { eject: true }): AxiosUIData {
    if (options.eject) {
      // eject interceptors when data is consumed to clean up listeners
      this.eject();
    }
    const data = this.requests[this.interceptId];

    if (!data) {
      return {};
    }

    return data;
  }
}
