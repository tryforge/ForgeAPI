"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPI = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const structures_1 = require("./structures");
class ForgeAPI extends forgescript_1.ForgeExtension {
    router;
    ws;
    name = "forge.api";
    description = "ForgeAPI, the best way to interact with your ForgeScript bot and it's server.";
    version = require("../package.json").version;
    constructor(options) {
        super();
        this.router = new structures_1.RouteManager({ ...options });
        this.ws = this.router.app.ws;
    }
    ;
    init(client) {
        ;
        client.once("ready", (cli) => {
            this.router.init(cli);
        });
    }
    ;
}
exports.ForgeAPI = ForgeAPI;
;
//# sourceMappingURL=index.js.map