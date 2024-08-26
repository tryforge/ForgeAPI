# ForgeAPI

ForgeAPI, the best way to interact with your ForgeScript bot and it's server.

[![@tryforge/forge.api](https://img.shields.io/github/package-json/v/tryforge/ForgeAPI/main?label=@tryforge/forge.api&color=5c16d4)](https://github.com/tryforge/ForgeDB/)
[![@tryforge/forgescript](https://img.shields.io/github/package-json/v/tryforge/ForgeScript/main?label=@tryforge/forgescript&color=5c16d4)](https://github.com/tryforge/ForgeScript/)
[![Discord](https://img.shields.io/discord/739934735387721768?logo=discord)](https://discord.gg/hcJgjzPvqb)

## How to use

**Download from npm:**

```bash
npm install https://github.com/tryforge/ForgeAPI/
```

**in your client initialization:**

```js
const { ForgeAPI } = require("@tryforge/forge.api")

const api = new ForgeAPI({
  port: number,
  logLevel?: number,
  auth: {
    bearer?: boolean,
    type: number,
    code?: string,
    ip?: string | string[]
  }
})

const client = new ForgeClient({
  ...
  "extensions": [api]
})

api.router.load("path")
```

| name        | Input   | description | Required |
|-------------|---------|-------------|----------|
| port        | number  | The port to open for the api | true     |
| logLevel    | 0/1/2   | `0 = none` \| `1 = all` \| `2 = debug` | false    |
| auth.bearer | boolean | If true the client will make a bearer token. | false    |
| auth.type   | 0/1/2   | `0 = no auth` \| `1 = either token or ip` \| `2 = both token and ip` | true    |
| auth.code   | string[]  | SecretKey used for non bearer auth | false |
| auth.ip     | string[]  | The ips who are allowed to make requests. | false |

**Making Routes on `<path>/<filename>`**

```js
module.exports = {
  url: '/string',
  method: "type",
  auth: boolean,
  handler: async function (ctx) {
    <code>
  },
}
```

| name | Input   | description | Required |
|------|---------|-------------|----------|
| Url  | /string | The endpoint to appoint this to | true |
| methode | string | Get / Put / Post / Delete / patch / options / trace / connect | true |
| auth | Boolean | If false ForgeAPI wont check for authentication (ip/token) | true |
| handler | string | the code to run if connected successfully | true |

You can also check our endpoint templates at our [template brench].

[template brench]: https://github.com/tryForge/forgeAPI/tree/templates

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/aggelos-007/">
        <img src="https://avatars2.githubusercontent.com/u/104696548?v=41&s=100" width="100px;" alt=""/>
        <br/>
        <sub>
          <b>Agglos-007</b>
        </sub>
        <br/>
        <a href="https://github.com/tryForge/forgeAPI/commits?author=aggelos-007" title="Code">💻</a>
      </a>
    </td>
    <td align="center">
      <a href="https://lynnux.xyz">
        <img src="https://avatars.githubusercontent.com/u/176392365?v=1?s=100" width="100px;" alt=""/>
        <br/>
        <sub>
          <b>Lynnux</b>
        </sub>
        <br/>
        <a href="https://github.com/tryForge/forgeAPI/commits?author=lynnux-useless-codes" title="testing">⚠️</a>
      </a>
  </tr>
</table>
