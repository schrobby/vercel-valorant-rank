import type { VercelRequest, VercelResponse } from "@vercel/node";
import ValorantApi, { APIResponse } from "unofficial-valorant-api";

const vapi = new ValorantApi(process.env.API_KEY as string);

console.info(`API Key: ${process.env.API_KEY}`);

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  const { puuid } = request.query;

  if (!puuid) {
    response
      .status(400)
      .send("Missing required parameters (name and tag or puuid)");
    return;
  }

  var { error, data: accountData } = await vapi.getAccountByPUUID({
    puuid: puuid as string,
  });

  if (error) {
    response.status(500).send(`Error fetching account info: ${error.message}`);
    return;
  }

  var { error, data: rankData } = await vapi.getMMRByPUUID({
    version: "v2",
    region: accountData?.["region"],
    puuid: accountData?.["puuid"],
  });

  if (error) {
    response.status(500).send(`Error fetching rank info: ${error.message}`);
    return;
  }

  const {
    current_data: {
      currenttierpatched: rank,
      ranking_in_tier: rr,
      mmr_change_to_last_game: rrChange,
      elo,
    },
    highest_rank: {
      patched_tier: highestRank,
      season,
    },
  } = rankData as any;

  const message = `${rank} (${rr}rr) [${elo}] - Peak: ${highestRank} in ${season.toUpperCase()} - Last game: ${rrChange}rr`;

  response.send(message);
}
