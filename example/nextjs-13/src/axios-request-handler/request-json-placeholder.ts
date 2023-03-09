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
  return axios.get(`https://jsonplaceholder.typicode.com/posts/${id}?userId=1`, buildHeaders(debugToken));
};

export const getExamplePosts = (debugToken?: string) => {
  return axios.get(`https://jsonplaceholder.typicode.com/posts?userId=1`, buildHeaders(debugToken));
};

export const postExamplePost = (debugToken?: string) => {
  return axios.post('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Some example',
      body: 'Some body',
      userId: 12,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      ...buildHeaders(debugToken).headers,
    },
  })
}
