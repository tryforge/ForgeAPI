"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
async function guilds(client) {
    return JSON.stringify(await Promise.all(client.guilds.cache.map(async (s) => {
        return {
            id: s.id,
            name: s.name,
            description: s.description,
            icon: s.iconURL({ size: 4096 }),
            members: s.memberCount,
            onlineMembers: client.options.intents.has('GuildMembers') ? (await s.members.fetch()).filter((s) => s.presence?.status != 'offline' && s.presence?.status != undefined).size : 'unknown',
            owner: s.ownerId,
            joinedTimestamp: s.joinedTimestamp,
            shard: s.shardId
        };
    })));
}
exports.data = {
    url: '/guilds',
    method: "get",
    auth: true,
    handler: async function (ctx) {
        ctx.reply.end(await guilds(ctx.client));
    },
    wsHandler: async function (ctx) {
        ctx.ws.send(await guilds(ctx.client));
        ctx.client.on('guildCreate', async () => ctx.ws.send(await guilds(ctx.client)));
        ctx.client.on('presenceUpdate', async () => ctx.ws.send(await guilds(ctx.client)));
        ctx.client.on('guildUpdate', async () => ctx.ws.send(await guilds(ctx.client)));
        ctx.client.on('guildDelete', async () => ctx.ws.send(await guilds(ctx.client)));
    }
};
//# sourceMappingURL=guilds.js.map