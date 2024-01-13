import { RouteOptions, ForgeAPI } from "..";

export default {
    url: '/commands',
    method: "get",
    handler: async function (ctx) {
        ctx.reply.end(JSON.stringify(ForgeAPI.client.commands.toArray().map(s=>{return s.data})))
    },
    wsHandler: async function(ctx) {
        ctx.ws.send
    }
} as RouteOptions