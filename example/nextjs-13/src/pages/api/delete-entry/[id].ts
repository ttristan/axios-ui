import type { NextApiRequest, NextApiResponse } from "next";
import deleteEntry from "@/axios-request-handler/delete-entry";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const result = await deleteEntry(request.query);

    return response.status(result.status).send(result);
  } catch (error: any) {
    console.error(error);
    return response.status(error.status ?? 500).send(error);
  }
}
