import { patchExampleEntry } from "@/axios-request-handler/json-placeholder-api-service";
import { DEBUG_HEADER, IS_DEV } from "@/constats";

import { registerAxiosInterceptor } from "axios-ui";
import { AxiosUIData } from "axios-ui";
import axios, { AxiosResponse } from "axios";

export default async function patchEntry(
  query: Partial<{
    [key: string]: string | string[];
  }>,
  body: Object
): Promise<AxiosResponse & { axiosUIData: AxiosUIData }> {
  const { id } = query;
  if (typeof id !== "string") {
    throw { status: 400, message: "Error in patchEntry: id is not a string" };
  }

  // register the interceptor, here using the helper to disable the logger for production and with a debug token as a request header
  const { axiosInterceptor, debugToken } = registerAxiosInterceptor(
    axios,
    !IS_DEV,
    DEBUG_HEADER
  );
  axiosInterceptor.intercept();

  const result = await patchExampleEntry(id, body, debugToken);

  const axiosUIData = axiosInterceptor.getData();

  // add logger data for client to intercept and show in the UI
  return { status: result.status, ...result.data, axiosUIData };
}
