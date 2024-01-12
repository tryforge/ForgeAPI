import { ForgeAPI } from "..";
import { RouteOptions } from "../core"
import pidusage from 'pidusage';

async function getUsage(){
    const stats = await pidusage(process.pid)
    return {
        cpu: stats.cpu,
        ram: stats.memory,
        ping: ForgeAPI.client.ws.ping,
        uptime: ForgeAPI.client.uptime
    }
}

export default {
    url: '/usage',
    method: "get",
    handler: async function (_,reply) {
        reply.end(JSON.stringify(await getUsage()))
    },
    wsHandler: async function(ws){
        setInterval(async () => {
            ws.send(JSON.stringify(await getUsage()))
        },1000)
    }
} as RouteOptions