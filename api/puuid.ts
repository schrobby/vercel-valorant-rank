import type { VercelRequest, VercelResponse } from "@vercel/node";
import ValorantApi, { APIResponse } from "unofficial-valorant-api";

const vapi = new ValorantApi(process.env.API_KEY as string);

export default async function (
    request: VercelRequest,
    response: VercelResponse
  ) {
    const { name, tag} = request.query;
  
    if (!name && !tag) {
      response
        .status(400)
        .send("Missing required parameters (name, tag, region)");
      return;
    }
  
    console.info(`Fetching puuid for ${name}#${tag}`);
  
    const { error, data } = await vapi.getAccount({
        name: name as string,
        tag: tag as string
    });
    
    if (error) {
      response.status(500).send(`Error fetching account info: ${error.message}`);
      return;
    }

    const puuid = data?.["puuid"];
    response.json({ puuid });
  }