# How to host ForgeAPI on Replit?

## Login to replit

first login to replit and make a replit workspace.
choose a `node.js` workspace

### install ForgeAPI and ForgeScript

```bash
npm install https://github.com/tryforge/forgeAPI/
npm install https://github.com/tryforge/forgeScript/
```

### make your bot index in index.js

should look something like:

```js
const { ForgeClient } = require("@tryforge/forgescript");
const { ForgeAPI } = require("@tryforge/forge.api");

const api = new ForgeAPI({
  port: 420,
  auth: {
    type: 0,
  },
});

const client = new ForgeClient({
  intents: ["Guilds","GuildMessages","DirectMessages","MessageContent",],
  prefixes: ["!"],
  events: ["messageCreate"],
  extensions: [api],
});

api.router.load("./api");

client.login(
  "Your-Token",
);
```

than you make a folder called api (or what you put in `router.load`),

### add a your router file in your folder

this is a example of a router file

```js
module.exports = {
  url: "/botStats",
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
};
```

### now you can run your bot

if your bot is running you can click the `replit.dev` in your webview and it will give you a domain,
you can use this domain/endpoint for your api.

### and now your ForgeAPI instence is running in replit

## Example Video

> Click [here] for a video preview

[here]: https://cloud.lynnux.xyz/index.php/s/BZyLgp2JNStXj2x
