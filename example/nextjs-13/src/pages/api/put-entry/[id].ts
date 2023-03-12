import type { NextApiRequest, NextApiResponse } from "next";
import putEntry from "@/axios-request-handler/put-entry";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const result = await putEntry(request.query, request.body);

    return response.status(result.status).send(result);
  } catch (error: any) {
    console.error(error);
    return response.status(error.status ?? 500).send(error);
  }
}
