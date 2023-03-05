import { Axios } from "../types";
import getUuid from "../util/uuid";
import AxiosInterceptor from "./axios-interceptor";
import AxiosInterceptorNoop from "./axios-interceptor-noop";

export const registerAxiosInterceptor = (
  axios: Axios,
  disable: boolean,
  debugHeaderKey: string
): {
  axiosInterceptor: AxiosInterceptor | AxiosInterceptorNoop;
  debugToken?: string;
} => {
  if (disable) {
    return {
      axiosInterceptor: new AxiosInterceptorNoop(),
      debugToken: undefined,
    };
  }

  const debugToken = getUuid();

  const axiosInterceptor = new AxiosInterceptor(axios, debugToken, {
    debugHeader: { key: debugHeaderKey, value: debugToken },
  });

  return { axiosInterceptor, debugToken };
};
