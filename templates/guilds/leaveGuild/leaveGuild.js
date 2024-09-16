const url = require('url');

module.exports = {
  url: '/:guildID/leave',
  method: "Delete",
  auth: true,
  handler: async function (ctx) {
    if (!ctx.req.url) return ctx.res.send(JSON.stringify({ message: "An error occurred" }));

    const guildId = url.parse(ctx.req.url).pathname?.split('/')[1];
    const server = ctx.client.guilds.cache.get(guildId ?? '');

    if (!server) return ctx.res.send(JSON.stringify({ message: "Invalid Server" }));

    ctx.res.send(JSON.stringify({ message: `Successfully left ${server.name}` }));
    server.leave();
  },
}