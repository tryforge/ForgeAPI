# How to host ForgeAPI on Pterodactyl?

If you have purchased a Pterodactyl-hosted server from a provider and already have access to the dashboard, follow these steps to set up ForgeAPI.

---

## Step 1: Access Your Pterodactyl Server

1. Log in to the Pterodactyl panel provided by your hosting provider.
2. Navigate to your Node.js server.

---

## Step 2: Add Dependencies

1. Navigate to the **Startup** tab.
2. Locate the field labeled **Additional Node Packages**.
3. Add the following packages:

    ```txt
    https://github.com/tryforge/forgeAPI/ https://github.com/tryforge/forgeScript/
    ```

4. Save the changes.

---

## Step 3: Configure Your Bot

1. Navigate to the **File Manager**.
2. Create a new file named `index.js` and add the following example code:

```js
const { ForgeClient } = require("@tryforge/forgescript");
const { ForgeAPI } = require("@tryforge/forge.api");

const api = new ForgeAPI({
  // Your port should be displayed on your dashboard under "Address" as IP:PORT use the port numbers.
  // If your port is not displayed on your dashboard ask your provider for your IP and Port.
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

- Replace "Your-Token" with your bot token.
- Save the file.

---

### Step 4: Add Router Files for Your API

1. In the File Manager, create a folder named `api` (or use the folder name specified in `api.router.load`).
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

### Step 5: Start the Bot

1. Go to the Startup tab.
2. Ensure the Startup Command is set to:

    ```bash
    node index.js
    ```

3. Return to the **Console** and **click** Start to run your bot.

---

### Step 6: Access Your API

1. Ask your hosting provider for your server's external IP and port if it is not provided on the dashboard.
2. Use the URL format below to access your API endpoint:

    ```txt
    http://<server-ip>:<port>/botStats
    ```
