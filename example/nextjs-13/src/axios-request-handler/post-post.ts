import { postExamplePost } from "@/axios-request-handler/request-json-placeholder";
import { DEBUG_HEADER, IS_DEV } from "@/constats";

import { registerAxiosInterceptor } from "axios-ui";
import { AxiosUIData } from "axios-ui";
import axios, { AxiosResponse } from "axios";

export default async function postPost(): Promise<
  AxiosResponse & { axiosUIData: AxiosUIData }
> {
  // register the interceptor, here using the helper to disable the logger for production and with a debug token as a request header
  const { axiosInterceptor, debugToken } = registerAxiosInterceptor(
    axios,
    !IS_DEV,
    DEBUG_HEADER
  );
  axiosInterceptor.intercept();

  const result = await postExamplePost(debugToken);

  const axiosUIData = axiosInterceptor.getData();

  // add logger data for client to intercept and show in the UI
  return { status: result.status, ...result.data, axiosUIData };
}
