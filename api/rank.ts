import type { VercelRequest, VercelResponse } from "@vercel/node";
import ValorantApi from "unofficial-valorant-api";

const vapi = new ValorantApi(process.env.API_KEY);

export default function (request: VercelRequest, response: VercelResponse) {
  const { name, tag } = request.query;

  console.info(`API Key: ${process.env.API_KEY}`);

  if (!name || !tag) {
    response.status(400).send("Name and tag are required");
    return;
  }

  response.send(`${name}#${tag}`);
}