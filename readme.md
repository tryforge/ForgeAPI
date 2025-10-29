<h1 align="center">ForgeAPI</h1><p align="center">An advanced extension for interacting with ForgeScript powered apps and servers.</p><p align="center"><a href="https://github.com/tryforge/ForgeAPI/"><img src="https://img.shields.io/github/package-json/v/tryforge/ForgeAPI/main?label=@tryforge/forge.api&color=5c16d4" alt="@tryforge/forge.api"></a> <a href="https://github.com/tryforge/ForgeScript/"><img src="https://img.shields.io/github/package-json/v/tryforge/ForgeScript/main?label=@tryforge/forgescript&color=5c16d4" alt="@tryforge/forgescript"></a> <a href="https://discord.gg/hcJgjzPvqb"><img src="https://img.shields.io/discord/739934735387721768?logo=discord" alt="Discord"></a></p><h2 align="center">Contents</h2>

1. [Installation](#installation)
2. [Making routes](#making-routes)
3. [Documentation](https://docs.botforge.org/p/ForgeAPI/)
4. [Credits](#credits)
<h2 align='center'>Installation</h2>

1. Install the `package`:
    ```bash
    npm i @tryforge/forge.api
    ```
2. Now, in your client intialization:
    ```js
    const { ForgeAPI } = require('@tryforge/forge.api'):

    const api = new ForgeAPI({
      port: number, // The port to use for serving the api (REQUIRED)
      auth: {
        bearer?: boolean, // If true the client will make a bearer token (OPTIONAL)
        type: number, /* CHOICES: 0/1/2
                         0 = no auth
                         1 = either token or ip
                         2 = both token and ip
                         (REQUIRED)
                      */ 
        code?: string | string[], // SecretKey used for non bearer auth (OPTIONAL)
        ip?: string | string[] // The ips who are allowed to make requests. (OPTIONAL)
      }
    })

    /* I'm assuming that the client can be an app or anything else */
    const client = new ForgeClient({
      ...
      "extensions": [api]
    })

    api.load("path/to/your/application_to_serve")
    ```
<h2 align='center'>Making routes</h2>

Well, remember the last line in the previous example (`api.load("path/to/your/application_to_serve")`)?

So just delve here to understand how the routes of your first API should be like:
   ```js
   module.exports = {
     url: '/string', // The endpoint to appoint for serving (REQUIRED)
     method: "type", /* The method to use for the endpoint
                        Options: Get || Put || Post || Delete || patch || options || trace || connect
                        (REQUIRED)
                     */
     auth: boolean,  // If false ForgeAPI wont check for authentication (ip/token) (REQUIRED)
     query: {                               // The query parameters you want the api to check before running the handler (OPTIONAL)
       optional: Record<string, QueryType>,    
       required: Record<string, QueryType>
     },
     handler: string | ((ctx: Context, next: Next) => any), // The code to run if connected successfully (REQUIRED)
   }
   ```
<h2 align='center'>Credits</h2>

*Thanks for being able to hold your hoses and able to make it down here.*

This package has been developed with a deep heart by the contributors
Contributor | Contribution | Conatct
-|-|-
Aggelos|Main developer|[Discord](https://discord.com/users/637648484979441706) [GitHub](https://github.com/aggelos-007)
Lynnux|Testing|[Discord](http://discord.com/users/705306248538488947) [GitHub](https://github.com/Lynnux-useless-codes)
Aurea|Readme editor|[Discord](https://discord.com/users/976413539076026388) [GitHub](https://github.com/aurea6)
