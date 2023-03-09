import type { NextApiRequest, NextApiResponse } from 'next'
import getEntry from "@/axios-request-handler/get-entry";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const result = await getEntry(request.query);

    return response.status(result.status).send(result);
  } catch (error) {
    console.error(error);
    return response.status(500);
  }
};
