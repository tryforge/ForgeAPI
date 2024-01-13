import { ForgeAPI } from "..";
import { RouteOptions } from "../core"

export default {
    url: '/commands',
    method: "get",
    handler: async function (_,reply) {
        reply.end(JSON.stringify(ForgeAPI.client.commands.toArray().map(s=>{return s.data})))
    }
} as RouteOptions