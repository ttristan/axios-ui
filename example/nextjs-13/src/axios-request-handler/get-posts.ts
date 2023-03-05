import { getExamplePosts } from "@/axios-request-handler/request-json-placeholder";
import { DEBUG_HEADER, IS_DEV } from "@/constats";

import axios, { AxiosResponse } from "axios";
import { registerAxiosInterceptor } from "axios-ui";
import { AxiosUIData } from "axios-ui";

export default async function getPosts(): Promise<
  AxiosResponse & { axiosUIData: AxiosUIData }
> {
  // register the interceptor, here using the helper to disable the logger for production and with a debug token as a request header
  const { axiosInterceptor, debugToken } = registerAxiosInterceptor( axios, !IS_DEV, DEBUG_HEADER);
  axiosInterceptor.intercept();

  const result = await getExamplePosts(debugToken);
  const axiosUIData = axiosInterceptor.getData() ?? null;

  // add logger data for client to intercept and show in the UI
  return { ...result, axiosUIData };
}
