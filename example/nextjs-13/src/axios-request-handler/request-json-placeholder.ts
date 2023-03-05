// using https://jsonplaceholder.typicode.com/guide/

import { DEBUG_HEADER } from "@/constats";
import axios from "axios";

const buildHeaders = (debugToken?: string) => {
  if (!debugToken) {
    return {}
  }

  return {
    headers: {
      Accept: 'application/json',
      [DEBUG_HEADER]: debugToken
     },
  }
}

export const getExamplePost = (id: string, debugToken?: string) => {
  return axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`, buildHeaders(debugToken));
};

export const getExamplePosts = (debugToken?: string) => {
  return axios.get(`https://jsonplaceholder.typicode.com/posts?userId=1`, buildHeaders(debugToken));
};
