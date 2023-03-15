import React from "react";

import { useAxiosUIContext } from "../axios-ui-context";
import { Axios, AxiosUIData, InterceptedAxiosResponse } from "../../types";

export default function useAxiosInterceptorSSR(axios: Axios) {
  const { axiosData, addData, clearData } = useAxiosUIContext();

  const intercepted = React.useRef(false);
  React.useEffect(() => {
    if (intercepted.current === true) {
      return;
    }

    axios.interceptors.response.use(
      (
        response: InterceptedAxiosResponse<{
          axiosUIData?: AxiosUIData;
        }>
      ) => {
        const { axiosUIData } = response.data;
        if (axiosUIData) {
          delete response.data.axiosUIData;
          addData(axiosUIData);
        }
        return response;
      },
      (error) => {
        const axiosUIData = error?.response?.data?.axiosUIData;
        if (axiosUIData) {
          delete error.response.data.axiosUIData;
          addData(axiosUIData);
        }
        throw error;
      }
    );
    intercepted.current = true;
  }, [addData]);

  return { axiosData, clearData };
}
