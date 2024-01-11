import { ForgeAPI } from "..";
import { RouteOptions } from "../core"
import pidusage from 'pidusage';

async function getUsage(){
    const stats = await pidusage(process.pid)
    return {
        cpu: stats.cpu,
        ram: stats.memory,
        ping: ForgeAPI.client.ws.ping
    }
}
export default {
    url: '/usage',
    method: "get",
    handler: async function (request, reply) {
        reply.end(JSON.stringify(await getUsage()))
    },
    wsHandler: async function(ws, request){
        setInterval(async () => {
            ws.send(JSON.stringify(await getUsage()))
        },1000)
    }
} as RouteOptions