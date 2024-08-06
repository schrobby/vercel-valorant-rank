import { VercelRequest, VercelResponse } from "@vercel/node";
import 'unofficial-valorant-api';

const vapi = new HenrikDevValorantAPI(process.env.API_KEY);

export default function (request: VercelRequest, response: VercelResponse) {
    
}