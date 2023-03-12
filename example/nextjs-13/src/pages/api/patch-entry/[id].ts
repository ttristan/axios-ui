import type { NextApiRequest, NextApiResponse } from "next";
import patchEntry from "@/axios-request-handler/patch-entry";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const result = await patchEntry(request.query, request.body);

    return response.status(result.status).send(result);
  } catch (error: any) {
    console.error(error);
    return response.status(error.status ?? 500).send(error);
  }
}
