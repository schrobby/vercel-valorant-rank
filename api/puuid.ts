import type { VercelRequest, VercelResponse } from "@vercel/node";
import ValorantApi from "unofficial-valorant-api";

const vapi = new ValorantApi(process.env.API_KEY as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name, tag } = req.query;

  if (!name || !tag) {
    return res.status(400).send("Missing required parameters: name and tag");
  }

  try {
    const { data } = await vapi.getAccount({
      name: name as string,
      tag: tag as string
    });

    res.json({ puuid: data?.["puuid"] });
  } catch (error: any) {
    res.status(500).send(`Error fetching account info: ${error.message}`);
  }
}