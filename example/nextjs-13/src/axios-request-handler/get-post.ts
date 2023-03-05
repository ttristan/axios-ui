import { getExamplePost } from "@/axios-request-handler/request-json-placeholder";
import { DEBUG_HEADER, IS_DEV } from "@/constats";

import { registerAxiosInterceptor } from "axios-ui";
import { AxiosUIData } from "axios-ui/types";
import axios, { AxiosResponse } from "axios";

export default async function getPost(
  query: Partial<{
    [key: string]: string | string[];
  }>
): Promise<AxiosResponse & { axiosUIData: AxiosUIData }> {
  const { id } = query;
  if (typeof id !== "string") {
    throw "id is not a string";
  }

  // register the interceptor, here using the helper to disable the logger for production and with a debug token as a request header
  const { axiosInterceptor, debugToken } = registerAxiosInterceptor(
    axios,
    !IS_DEV,
    DEBUG_HEADER
  );
  axiosInterceptor.intercept();

  const result = await getExamplePost(id, debugToken);

  const axiosUIData = axiosInterceptor.getData();

  // add logger data for client to intercept and show in the UI
  return { ...result.data, axiosUIData };
}
