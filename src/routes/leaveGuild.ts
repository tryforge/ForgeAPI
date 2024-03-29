import * as url from 'node:url';
import { RouteOptions } from "..";

export const data = {
    url: '/:guildID/leave',
    method: "post",
    auth: true,
    handler: async function (ctx) {
        if(!ctx.request.url) return ctx.reply.end(JSON.stringify({message: "An error occured"}));
        const guildId = url.parse(ctx.request.url).pathname?.split('/')[1]
        const server = ctx.client.guilds.cache.get(guildId ?? '')
        if(!server) return ctx.reply.end(JSON.stringify({message: "Invalid Server"}));
        ctx.reply.end(JSON.stringify({message: `Successfully left ${server.name}`}))
        server.leave()
    }
} as RouteOptions