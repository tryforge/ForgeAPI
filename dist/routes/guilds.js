"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
async function guilds() {
    return JSON.stringify(await Promise.all(__1.ForgeAPI.client.guilds.cache.map(async (s) => {
        return {
            id: s.id,
            name: s.name,
            description: s.description,
            icon: s.iconURL({ size: 4096 }),
            members: s.memberCount,
            onlineMembers: __1.ForgeAPI.client.options.intents.has('GuildMembers') ? (await s.members.fetch()).filter((s) => s.presence?.status != 'offline' && s.presence?.status != undefined).size : 'unknown',
            owner: s.ownerId,
            joinedTimestamp: s.joinedTimestamp,
            shard: s.shardId
        };
    })));
}
exports.default = {
    url: '/guilds',
    method: "get",
    handler: async function (_, reply) {
        reply.end(await guilds());
    },
    wsHandler: async function (ws) {
        ws.send(await guilds());
        __1.ForgeAPI.client.on('guildCreate', async () => ws.send(await guilds()));
        __1.ForgeAPI.client.on('presenceUpdate', async () => ws.send(await guilds()));
        __1.ForgeAPI.client.on('guildUpdate', async () => ws.send(await guilds()));
        __1.ForgeAPI.client.on('guildDelete', async () => ws.send(await guilds()));
    }
};
//# sourceMappingURL=guilds.js.map