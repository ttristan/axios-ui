import type { AppProps as NextAppProps } from 'next/app'
import { AxiosUIData } from "axios-ui";

export type AppProps = NextAppProps<{
    axiosUIData?: AxiosUIData
}>