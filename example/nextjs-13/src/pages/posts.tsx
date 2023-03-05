import getPosts from "@/axios-request-handler/get-posts";
import axios from "axios";
import { GetServerSideProps } from "next";
import React from "react";
import { AxiosUIData } from "../../../../src/types";

type PageProps = {
  data: any;
  axiosUIData?: AxiosUIData; // add axios logger data to page props ad initial data for the UI
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { axiosUIData, ...postResponse } = await getPosts();
    const pageProps: PageProps = {
      data: postResponse.data,
      axiosUIData,
    };
    return Promise.resolve({
      props: pageProps,
    });
  } catch (error) {
    console.error(error);
    return Promise.resolve({
      props: {},
    });
  }
};

export default function Posts(pageProps: PageProps) {
  const [posts, setPosts] = React.useState(pageProps.data);

  return (
    <>
      <pre
        style={{
          fontFamily: "monospace",
          maxWidth: "90vw",
          maxHeight: "40vw",
          resize: "both",
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          overflow: "scroll",
          backgroundColor: "rgb(16, 22, 29)",
          padding: 10,
        }}
      >
        {JSON.stringify(posts, null, 2)}
      </pre>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          const nextId = posts.at(-1).id + 1;
          axios.get(`/api/get-post/${nextId}`).then((res) => {
            setPosts([...posts, res.data]);
          });
        }}
      >
        Load more...
      </button>
    </>
  );
}
