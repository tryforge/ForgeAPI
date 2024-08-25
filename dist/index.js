"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPI = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const structures_1 = require("./structures");
;
class ForgeAPI extends forgescript_1.ForgeExtension {
    router;
    ws;
    routes;
    name = "ForgeAPI";
    description = "ForgeAPI, the best way to interact with your ForgeScript bot and it's server.";
    version = "1.0.0";
    constructor(options) {
        super();
        this.router = new structures_1.RouteManager({ ...options });
        this.routes = {
            load: this.router.load,
            add: this.router.route
        };
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