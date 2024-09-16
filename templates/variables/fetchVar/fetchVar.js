module.exports = {
  url: '/variable/fetch/:name/:type/:id?/:guildid?',
  method: "get",
  auth: true,
  handler: async function (ctx) {
    const { name, type, id, guildid } = ctx.req.params;

    if ((type === 'role' || type === 'channel' || type === 'member') && !guildid) {
      return ctx.res.status(400).send({ error: "guildid is required for this type" });
    }

    if (type !== 'global' && !id) {
      return ctx.res.status(400).send({ error: "id is required for all types except 'global'" });
    }

    let identifier;
    if (type === 'role' || type === 'channel' || type === 'member') {
      if (guildid) {
        identifier = `${type}_${name}_${guildid}_${id}`;
      } else {
        return ctx.res.status(400).send({ error: "guildid is required for 'role' or 'member' type" });
      }
    } else if (type === 'global') {
      identifier = `custom_${name}_undifined`;
    } else {
      identifier = `${type}_${name}_${id}`;
    }

    try {
      const result = await ctx.client.db.get({ identifier });

      if (!result) {
        ctx.res.status(404).send({ error: `The ${type} variable called ${name} for ${id} wasn't found.` });
      } else {
        ctx.res.send(JSON.stringify({ result: result.toJSON ? result.toJSON() : result }));
      }
    } catch (error) {
      ctx.res.status(500).send({ error: "Internal server error" });
    }
  },
}