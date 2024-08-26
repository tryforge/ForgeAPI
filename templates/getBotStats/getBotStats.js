module.exports = {
  url: '/botStats',
  method: "Get",
  auth: true,
  handler: async function (ctx) {
    ctx.res.send(`{
      "client": {
        "name": "${ctx.client.user.username}",
        "id": ${ctx.client.user.id},
        "ping": ${ctx.client.ws.ping},
        "uptime": "${ctx.client.uptime}ms"
      },
      "guildCount": ${ctx.client.guilds.cache.size},
      "userCount": ${ctx.client.guilds.cache.reduce((x, y) => x + (y.memberCount || 0), 0)},
      "commandCount": ${ctx.client.commands["commands"].reduce((x, y) => x + y.length, 0)}
    }`);
  },
}