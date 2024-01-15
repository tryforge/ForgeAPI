import { RouteOptions, ForgeAPI } from "..";

export const data = {
    url: '/commands',
    method: "get",
    auth: true,
    handler: async function (ctx) {
        ctx.reply.end(JSON.stringify(ForgeAPI.client.commands.toArray().map(s=>{return s.data})))
    },
    wsHandler: async function(ctx) {
        ctx.ws.send(JSON.stringify(ForgeAPI.client.commands.toArray().map(s=>{return s.data})))
        ctx.client.commands.on('update', () => ctx.ws.send(JSON.stringify(ForgeAPI.client.commands.toArray().map(s=>{return s.data}))))
    }
} as RouteOptions