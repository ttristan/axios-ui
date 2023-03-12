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
};

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
          const nextId =
            (entries.filter((entry) => entry.userId === 1).at(-1)?.id ?? 0) + 1;
          axios.get(`/api/get-entry/${nextId}`).then((res) => {
            setEntries([...entries, res.data]);
          });
        }}
      >
        Test: Load more... (GET)
      </button>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          axios
            .post(`/api/post-entry`, {
              title: "Some example",
              body: "Some body",
              userId: 12,
            })
            .then((res) => {
              setEntries([
                ...entries,
                { ...JSON.parse(res.data.body), id: res.data.id },
              ]);
            });
        }}
      >
        Test: POST
      </button>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          axios
            .put(`/api/put-entry/1`, {
              id: 1,
              userId: 1,
              title: `Updated Entry (PUT) (${Math.random().toString()})`,
              body: "Some body",
            })
            .then((res) => {
              const updatedEntries = entries.map((entry) => {
                if (entry.id !== 1 || entry.userId !== 1) {
                  return entry;
                }
                return {
                  ...entry,
                  ...JSON.parse(res.data.body),
                };
              });
              setEntries(updatedEntries);
            });
        }}
      >
        Test: PUT
      </button>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          axios
            .patch(`/api/patch-entry/1`, {
              title: `Updated Entry (PATCH) (${Math.random().toString()})`,
            })
            .then((res) => {
              const updatedEntries = entries.map((entry) => {
                if (entry.id !== 1 || entry.userId !== 1) {
                  return entry;
                }
                return {
                  ...entry,
                  ...JSON.parse(res.data.body),
                };
              });
              setEntries(updatedEntries);
            });
        }}
      >
        Test: PATCH
      </button>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          axios
            .delete(`/api/delete-entry/5`)
            .then((res) => {
              console.log("res", res);
              const updatedEntries = entries.filter(entry => entry.id !== 5);
              setEntries(updatedEntries);
            });
        }}
      >
        Test: Delete
      </button>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          axios
            .get(`/api/get-entry/214124`)
        }}
      >
        Test: Failed GET request
      </button>
      <button
        style={{ marginTop: 16 }}
        onClick={() => {
          axios
            .put(`/api/put-entry/11224444`, {
              id: 120030,
              userId: 1,
              title: `Updated Entry (PUT) (${Math.random().toString()})`,
              body: "Some body",
            })
            .then((res) => {
              setEntries([...entries, res.data]);
            })
            .catch((e) => e);
        }}
      >
        Test: Failed PUT request
      </button>
    </div>
  );
}
