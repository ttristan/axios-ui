import * as React from "react";

import { AxiosUIData } from "../types";

type AxiosUIContext = {
  axiosData: AxiosUIData;
  addData: (data: AxiosUIData) => void;
  clearData: () => void;
};

const AxiosUIContext = React.createContext<AxiosUIContext>({
  axiosData: {},
  addData: () => {},
  clearData: () => {},
});

export const useAxiosUIContext = () => {
  return React.useContext(AxiosUIContext);
};

export const AxiosUIContextProvider = ({
  children,
  initialData,
}: React.PropsWithChildren<{ initialData?: AxiosUIData }>) => {
  const axiosDataRef = React.useRef<AxiosUIData>(initialData ?? {});
  const [axiosData, setAxiosData] = React.useState<AxiosUIData>(
    initialData ?? {}
  );

  React.useEffect(() => {
    if (!initialData) {
      return;
    }
    addData(initialData);
  }, [initialData]);

  const addData = (newData: AxiosUIData) => {
    axiosDataRef.current = { ...axiosDataRef.current, ...newData };
    setAxiosData(axiosDataRef.current);
  };

  const clearData = () => {
    axiosDataRef.current = {};
    setAxiosData(axiosDataRef.current);
  };

  return (
    <AxiosUIContext.Provider value={{ axiosData, addData, clearData }}>
      {children}
    </AxiosUIContext.Provider>
  );
};
