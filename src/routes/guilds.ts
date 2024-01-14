import { ForgeClient } from "forgescript";
import { RouteOptions } from "..";

async function guilds(client: ForgeClient) {
    return JSON.stringify(await Promise.all(client.guilds.cache.map(async s => {
        return {
            id: s.id,
            name: s.name,
            description: s.description,
            icon: s.iconURL({size:4096}),
            members: s.memberCount,
            onlineMembers: client.options.intents.has('GuildMembers') ? (await s.members.fetch()).filter((s) => s.presence?.status != 'offline' && s.presence?.status != undefined).size : 'unknown',
            owner: s.ownerId,
            joinedTimestamp: s.joinedTimestamp,
            shard: s.shardId
        }
    })))
}

export const data = {
    url: '/guilds',
    method: "get",
    handler: async function (ctx) {
        ctx.reply.end(await guilds(ctx.client))
    },
    wsHandler: async function(ctx){
        ctx.ws.send(await guilds(ctx.client))
        ctx.client.on('guildCreate', async () => ctx.ws.send(await guilds(ctx.client)))
        ctx.client.on('presenceUpdate', async () => ctx.ws.send(await guilds(ctx.client)))
        ctx.client.on('guildUpdate', async () => ctx.ws.send(await guilds(ctx.client)))
        ctx.client.on('guildDelete', async () => ctx.ws.send(await guilds(ctx.client)))
    }
} as RouteOptions