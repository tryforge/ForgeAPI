# ForgeAPI
ForgeAPI, the best way to interact with your ForgeScript bot and it's server.

[![forgeAPI](https://img.shields.io/github/package-json/v/tryforge/ForgeAPI/main?label=forgeapi&color=5c16d4)](https://github.com/tryforge/ForgeDB/)
[![forgescript](https://img.shields.io/github/package-json/v/tryforge/ForgeScript/main?label=forgescript&color=5c16d4)](https://github.com/tryforge/ForgeScript/)
[![Discord](https://img.shields.io/discord/739934735387721768?logo=discord)](https://discord.gg/hcJgjzPvqb)

## How to use
Download this npm package:
```bash
npm i forgeapi
```

Now, in your client initialization:
```ts
const { ForgeAPI } = require("forgeapi")

// I'll assume client, can be bot or anything else
const client = new ForgeClient({
    ...options // The options you currently have
    extensions: [
        new ForgeAPI({
            port: number
            authorization?: string | string[]
        })
    ]
})
```
And voi-la, you now have ForgeAPI installed and loaded to your bot.

Note: if you add authorization you will have to assign in the headers 
```json
{
    "authorization": "1 of the assigned keys you added"
}
```


## Endpoints
### Default
| Endpoint | Method | Has WS |
| --------  |-------| ------ |
| `/usage` | `GET` | yes |
| `/commands` | `GET` | yes |
| `/guilds` | `GET` | yes |
| `/{guild.id}/leave` | `POST` | no |

### Custom
Now, in your client initialization:
```ts
const { ForgeAPI } = require("forgeapi")

// I'll assume client, can be bot or anything else
const client = new ForgeClient({
    ...options // The options you currently have
    extensions: [
        new ForgeAPI({
            port: number
            load: string // Here add the path to load the custom endpoints
            authorization?: string | string[]
        })
    ]
})
```
On `/<path>/<fileName>` add this
```js
const data = {
    url: '/endpoint',
    method: "HTTP Method",
    auth?: boolean,
    handler: async function (ctx) {
        ctx.reply.end('Endpoint here!');
    },
    wsHandler?: async funtion (ctx){
        ctx.ws.send('WebSocket here!')
    }
}

module.exports = { data }
```
**Note:** your const must always be named data.

More about RouteOptions:
- [Interface](https://github.com/tryforge/ForgeAPI/blob/main/src/core/typings/interfaces.ts#L3)
- [HandlerContext](https://github.com/tryforge/ForgeAPI/blob/main/src/core/typings/types.ts#L9)
- [wsContext](https://github.com/tryforge/ForgeAPI/blob/main/src/core/typings/types.ts#L17)