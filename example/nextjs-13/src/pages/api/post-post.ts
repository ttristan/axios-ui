import type { NextApiRequest, NextApiResponse } from 'next'
import postPost from '@/axios-request-handler/post-post';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const result = await postPost();

    return response.status(result.status).send(result);
  } catch (error) {
    console.error(error);
    return response.status(500);
  }
};
