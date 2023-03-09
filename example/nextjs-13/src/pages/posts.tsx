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

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function Posts(pageProps: PageProps) {
  const [posts, setPosts] = React.useState<Post[]>(pageProps.data);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: "90vw",
      }}
    >
      {posts.map((post) => (
        <div
        key={`${post.id}`}
          style={{
            backgroundColor: "rgb(16, 22, 29)",
            padding: 10,
          }}
        >
          {post.title}
        </div>
      ))}

      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          const nextId = (posts.filter(post => post.userId === 1).at(-1)?.id ?? 0) + 1;
          axios.get(`/api/get-post/${nextId}`).then((res) => {
            setPosts([...posts, res.data]);
          });
        }}
      >
        Load more...
      </button>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          axios.get(`/api/post-post`).then((res) => {
            setPosts([...posts, {...JSON.parse(res.data.body), id: res.data.id}]);
          });
        }}
      >
        POST something
      </button>
    </div>
  );
}
