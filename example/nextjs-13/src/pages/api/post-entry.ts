import type { NextApiRequest, NextApiResponse } from 'next'
import postEntry from '@/axios-request-handler/post-entry';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const result = await postEntry();

    return response.status(result.status).send(result);
  } catch (error) {
    console.error(error);
    return response.status(500);
  }
};
