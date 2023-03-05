import "@/styles/globals.css";
import { AppProps } from "@/types";
import axios from "axios";
import { AxiosUIWrapperSSR } from "axios-ui";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <AxiosUIWrapperSSR
          initialData={pageProps.axiosUIData}
          axios={axios}
          renderShortUrl={(url: string) => url.split(".com")[1]}
        />
      </div>
      <Component {...pageProps} />
    </>
  );
}
