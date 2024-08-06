import type { VercelRequest, VercelResponse } from "@vercel/node";
import ValorantApi, { APIResponse } from "unofficial-valorant-api";

const vapi = new ValorantApi(process.env.API_KEY as string);

console.info(`API Key: ${process.env.API_KEY}`);

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  const { name, tag, puuid } = request.query;

  if (!((name && tag) || puuid)) {
    response
      .status(400)
      .send("Missing required parameters (name and tag or puuid)");
    return;
  }

  console.info(`Fetching rank for ${name && tag ? `${name}#${tag}` : puuid}`);

  var { error, data: accountData } = 
      name && tag
          ? await vapi.getAccount({ name: name as string, tag: name as string })
          : await vapi.getAccountByPUUID({ puuid: puuid as string });
  
  if (error) {
    response.status(500).send(error.message);
    return;
  }
  
  var { error, data: rankData } = await vapi.getMMRByPUUID({ version: "v2", region: accountData?.["region"], puuid: accountData?.["puuid"] });

  if (error) {
    response.status(500).send(error.message);
    return;
  }

  const { current_data: currentData, highest_rank: highestRank } = rankData as any;
  const message = `${currentData?.["currenttier_patched"]} (${currentData?.["ranking_in_tier"]}rr) [${currentData?.["elo"]} MMR] - \
    Peak: ${highestRank?.["patched_tier"]} in ${highestRank?.["season"].toUpperCase()} - Last match: ${currentData?.["mmr_change_to_last_game"]}rr`;

  response.send(message);
}
