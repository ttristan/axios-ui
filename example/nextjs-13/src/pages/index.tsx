import getEntries from "@/axios-request-handler/get-entries";
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
    const { axiosUIData, ...postResponse } = await getEntries();
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

type Entry = {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function Home(pageProps: PageProps) {
  const [entries, setEntries] = React.useState<Entry[]>(pageProps.data);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: "90vw",
      }}
    >
      {entries.map((entry) => (
        <div
        key={`${entry.id}`}
          style={{
            backgroundColor: "rgb(16, 22, 29)",
            padding: 10,
          }}
        >
          {entry.title}
        </div>
      ))}

      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          const nextId = (entries.filter(entry => entry.userId === 1).at(-1)?.id ?? 0) + 1;
          axios.get(`/api/get-entry/${nextId}`).then((res) => {
            setEntries([...entries, res.data]);
          });
        }}
      >
        Load more...
      </button>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          axios.get(`/api/post-entry`).then((res) => {
            setEntries([...entries, {...JSON.parse(res.data.body), id: res.data.id}]);
          });
        }}
      >
        POST something
      </button>
    </div>
  );
}
