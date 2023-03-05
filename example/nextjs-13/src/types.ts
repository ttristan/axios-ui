import type { AppProps as NextAppProps } from 'next/app'
import { AxiosUIData } from "axios-ui/types";

export type AppProps = NextAppProps<{
    axiosUIData?: AxiosUIData
}>