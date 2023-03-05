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
        delete response.data.axiosUIData;
        if (axiosUIData) {
          addData(axiosUIData);
        }
        return response;
      }
    );
    intercepted.current = true;
  }, [addData]);

  return { axiosData, clearData };
}
