module.exports = {
  url: '/variable/:name/:type/:id?/:guildID?',
  method: "delete",
  auth: true,
  handler: async function (ctx) {
    const { name, type, id, guildID } = ctx.req.params;

    if (type === 'message' || type === 'user') {
      if (!id) {
        return ctx.res.status(400).send({ error: "id is required for 'message' and 'user' types" });
      }
    } else if (type === 'role' || type === 'member' || type === 'channel') {
      if (!id || !guildID) {
        return ctx.res.status(400).send({ error: "id and guildID are required for 'role', 'member', and 'channel' types" });
      }
    } else if (type === 'guild') {
      if (!id) {
        return ctx.res.status(400).send({ error: "id is required for 'guild' type" });
      }
    } else if (type === 'global') {
    } else {
      return ctx.res.status(400).send({ error: "Invalid type" });
    }

    let data;
    switch (type) {
      case 'message':
      case 'user':
        data = { name, id, type };
        break;
      case 'role':
      case 'member':
      case 'channel':
        data = { name, id, type, guildId: guildID };
        break;
      case 'guild':
        data = { name, id, type };
        break;
      case 'global':
        data = { name, type: 'custom' };
        break;
      default:
        return ctx.res.status(400).send({ error: "Invalid type" });
    }

    try {
      await ctx.client.db.delete(data);
      ctx.res.status(200).send({ success: true });
    } catch (error) {
      console.error("Error deleting value:", error);
      ctx.res.status(500).send({ error: "Internal server error" });
    }
  },
};
