module.exports = {
  url: '/variable/:name/:type/:value/:id?/:guildID?',
  method: "post",
  auth: true,
  handler: async function (ctx) {
    const { name, type, value, id, guildID } = ctx.req.params;

    if (type === 'message' || type === 'user') {
      if (!id) {
        return ctx.res.status(400).send({ error: ":id is required for this type." });
      }
    } else if (type === 'role' || type === 'member' || type === 'channel') {
      if (!id || !guildID) {
        return ctx.res.status(400).send({ error: ":id and :guildID are required for this type." });
      }
    } else if (type === 'guild') {
      if (!id) {
        return ctx.res.status(400).send({ error: ":id is required for yhis type." });
      }
    } else if (type === 'global') {
    } else {
      return ctx.res.status(400).send({ error: "Invalid type, available types are 'guild'/'global'/'user'/'member'/'message'/'channel'/'role'" });
    }

    let data;
    switch (type) {
      case 'message':
      case 'user':
        data = { name, id, value, type };
        break;
      case 'role':
      case 'member':
      case 'channel':
        data = { name, id, value, type, guildId: guildID };
        break;
      case 'guild':
        data = { name, id, value, type };
        break;
      case 'global':
        data = { name, value, type: 'custom' };
        break;
      default:
        return ctx.res.status(400).send({ error: "Invalid type" });
    }

    try {
      await ctx.client.db.set(data);
      ctx.res.status(200).send({ success: true });
    } catch (error) {
      console.error("Error setting value:", error);
      ctx.res.status(500).send({ error: "Internal server error" });
    }
  },
};
