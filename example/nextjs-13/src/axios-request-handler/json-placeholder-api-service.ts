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

export const getExampleEntry = (id: string, debugToken?: string) => {
  return axios.get(`https://jsonplaceholder.typicode.com/posts/${id}?userId=1`, buildHeaders(debugToken));
};

export const getExampleEntries = (debugToken?: string) => {
  return axios.get(`https://jsonplaceholder.typicode.com/posts?userId=1`, buildHeaders(debugToken));
};

export const postExampleEntry = (body: Object, debugToken?: string) => {
  return axios.post('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      ...buildHeaders(debugToken).headers,
    },
  })
}
