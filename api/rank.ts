import type { VercelRequest, VercelResponse } from "@vercel/node";
import ValorantApi from "unofficial-valorant-api";

const vapi = new ValorantApi(process.env.API_KEY as string);

export default async function (req: VercelRequest, res: VercelResponse) {
  const { puuid } = req.query;
  
  if (!puuid) {
    return res.status(400).send("Missing required parameter: puuid");
  }

  try {
    const { data: accountData } = await vapi.getAccountByPUUID({ puuid: puuid as string });
    const { data: rankData } = await vapi.getMMRByPUUID({
      version: "v2",
      region: accountData?.["region"],
      puuid: accountData?.["puuid"],
    });

    const {
      current_data: { currenttierpatched: rank, ranking_in_tier: rr, mmr_change_to_last_game: rrChange, elo },
      highest_rank: { patched_tier: highestRank, season },
    } = rankData as any;

    const message = `${rank} (${rr}rr) [${elo} MMR] - Peak: ${highestRank} in ${season.toUpperCase()} - Last game: ${rrChange}rr`;
    res.send(message);
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}