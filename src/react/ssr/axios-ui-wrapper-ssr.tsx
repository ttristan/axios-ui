import { Axios, AxiosUIData } from "../../types";
import AxiosUI, { AxiosUIProps } from "../axios-ui";
import { AxiosUIContextProvider } from "../axios-ui-context";
import useAxiosInterceptorSSR from "./use-axios-interceptor-ssr";

type ForwardedAxiosUIProps = Omit<
  AxiosUIProps,
  "axiosData" | "clearData"
>;
type Props = ForwardedAxiosUIProps & {
  axios: Axios;
  initialData?: AxiosUIData;
};

export default function AxiosUIWrapperSSR({
  axios,
  initialData,
  ...axiosUIProps
}: Props) {
  return (
    <AxiosUIContextProvider initialData={initialData}>
      <UIWrapper axios={axios} axiosUIProps={axiosUIProps} />
    </AxiosUIContextProvider>
  );
}

const UIWrapper = ({
  axios,
  axiosUIProps,
}: {
  axios: Axios;
  axiosUIProps: ForwardedAxiosUIProps;
}) => {
  const { axiosData, clearData } = useAxiosInterceptorSSR(axios);

  return (
    <AxiosUI
      {...axiosUIProps}
      axiosData={axiosData}
      clearData={clearData}
    />
  );
};
