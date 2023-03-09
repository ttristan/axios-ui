## Axios UI (Work in Progress)

![Preview](https://github.com/ttristan/axios-ui/raw/main/docs/preview.png)

## TODO

* [x] make it work
* [x] Next.js example
* [ ] Add client side example (using vite, esbuild or similar)
* [ ] Add examples for POST/PATCH/PUT/DELETE + failing requests
* [ ] Update Docs

## How To Use

### Getting Started

```
npm install axios-ui --save-dev
```

### Example: Next.js
> Example available in `/example/nextjs-13`

#### Next.js Pages using getServerSideProps
> see Example: `/example/nextjs-13/pages/index.ts`

- each route using the interceptor should add `axiosUIData` to the page props

- add the following to your server side requests:

```javascript
// register interceptor
const { axiosInterceptor, debugToken } = registerAxiosInterceptor(...);
axiosInterceptor.intercept();

// request with debugToken header (necessary in SSR context)
axios.get(..., { headers: { 'x-axios-debug': debugToken } });

// consume intercepted request/response data
const axiosUIData = axiosInterceptor.getData();

// return data from your handler
return {...yourData, axiosUIData};
```

- provide axiosUIData as pageProps in getServerSideProps

```javascript
export const getServerSideProps = async (context) => {
  const data = ({ axiosUIData, ...yourPageProps } = yourRequestHandler());
  // add axiosUIData to pageProps
  return Promise.resolve({
    props: {
      ...yourPageProps,
      axiosUIData,
    },
  });
};
```

- embed AxiosUI in your App (`\_app.ts`)

```jsx
export default function App({ Component, pageProps }: AppProps) {
  <>
    <AxiosUIWrapperSSR axios={axios} initialData={pageProps.axiosUIData} />
    <Component {...pageProps} />
  </>;
}
```

#### Next.js /api Routes
> see Example: `/example/nextjs-13/pages/api/get-entry/[id].ts`

- Next.js api route responses should return the axiosUIData object for the client to pick up

```javascript
// register interceptor
const { axiosInterceptor, debugToken } = registerAxiosInterceptor(...);
axiosInterceptor.intercept();

// request with debugToken header (necessary in SSR context)
axios.get(..., { headers: { 'x-axios-debug': debugToken } });

// consume intercepted request/response data
const axiosUIData = axiosInterceptor.getData();

// resopnd with data from your handler
return response.status(200).json({...yourData, axiosUIData});
```
