import { ForgeClient } from "@tryforge/forgescript";
import { RouteOptions } from "..";
import pidusage from 'pidusage';

async function getUsage(client: ForgeClient){
    const stats = await pidusage(process.pid)
    return {
        cpu: stats.cpu,
        ram: stats.memory,
        ping: client.ws.ping,
        uptime: client.uptime
    }
}

export const data = {
    url: '/usage',
    method: "get",
    auth: true,
    handler: async function (ctx) {
        ctx.reply.end(JSON.stringify(await getUsage(ctx.client)))
    },
    wsHandler: async function(ctx){
        setInterval(async () => {
            ctx.ws.send(JSON.stringify(await getUsage(ctx.client)))
        },1000)
    }
} as RouteOptions