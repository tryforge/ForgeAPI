import * as url from 'node:url';
import { RouteOptions } from "../core"
import { ForgeAPI } from "..";

export default {
    url: '/:guildID/leave',
    method: "post",
    handler: async function (request, reply) {
        if(!request.url) return reply.end(JSON.stringify({message: "An error occured"}));;
        const guildId = url.parse(request.url).pathname?.split('/')[1]
        const server = ForgeAPI.client.guilds.cache.get(guildId ?? '')
        if(!server) return reply.end(JSON.stringify({message: "Invalid Server"}));
        reply.end(JSON.stringify({message: `Successfully left ${server.name}`}))
        server.leave()
    }
} as RouteOptions