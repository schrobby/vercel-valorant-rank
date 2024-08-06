import type { VercelRequest, VercelResponse } from "@vercel/node";
import ValorantApi from "unofficial-valorant-api";
import { Regions } from "unofficial-valorant-api";

const vapi = new ValorantApi(process.env.API_KEY as string);

export default async function (req: VercelRequest, res: VercelResponse) {
  const { puuid, region } = req.query;
  
  if (!puuid || !region) {
    return res.status(400).send("Missing required parameter: puuid or region");
  }

  try {
    const { data: rankData } = await vapi.getMMRByPUUID({
      version: "v2",
      puuid: puuid as string,
      region: region as Regions,
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