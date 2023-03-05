import type { NextApiRequest, NextApiResponse } from 'next'
import getPost from "@/axios-request-handler/get-post";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const result = await getPost(request.query);

    return response.status(200).send(result);
  } catch (error) {
    console.error(error);
    return response.status(500);
  }
};
