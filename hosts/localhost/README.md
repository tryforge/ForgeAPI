# How to host ForgeAPI on localhost?

If you want to test or run ForgeAPI locally, follow these steps to set up ForgeAPI.

---

## Step 1: Add Dependencies

- Add the packages:

  ```bash
  npm i @tryforge/forge.api @tryforge/forgescript
  ```

## Step 2: Configure Your Bot

1. in your main folder.
2. Create a new file named `index.js` (or modify your old one) and add the following example code:

```js
const { ForgeClient } = require("@tryforge/forgescript");
const { ForgeAPI } = require("@tryforge/forge.api");

const api = new ForgeAPI({
  // This port can be anything you want.
  // (note that on linux port 1 to 1023 require root access so use something over that)
  port: 3000,
  auth: {
    type: 0,
  },
});

const client = new ForgeClient({
  intents: ["Guilds","GuildMessages","DirectMessages","MessageContent",],
  prefixes: ["!"],
  events: ["messageCreate"],
  // We call our ForgeAPI config in the Forgescript's extensions option
  extensions: [api],
});

// Use a folder called "api" to load the routes
api.router.load("./api");

client.login(
  "Your-Token",
);
```

- Replace "Your-Token" with your bot token.

### Step 3: Add Router Files for Your API

1. Create a folder named `api`
(or use the folder name specified in `api.router.load`) in the same place your index.js is.
2. Inside the `api` folder, create a new file, e.g., `botStats.js`.
3. Add the following content to the file:

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

4. Save the file.

---

### Step 4: Start the Bot

run your bot in node:

```bash
node index.js
```

---

### Step 5: Access Your API

- Use one of the the URL format below to access your API endpoint:

    ```txt
    http://localhost:3000/botStats
    http://127.0.0.1:3000/botStats
    ```
