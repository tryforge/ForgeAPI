"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPI = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const manager_1 = require("./structures/manager");
;
class ForgeAPI extends forgescript_1.ForgeExtension {
    options;
    router;
    name = "ForgeAPI";
    description = "ForgeAPI, the best way to interact with your ForgeScript bot and it's server.";
    version = "1.0.0";
    constructor(options) {
        super();
        this.options = options;
    }
    init(client) {
        this.router = new manager_1.RouteManager({ client, port: this.options.port });
        console.log("hi");
    }
    routes = {
        load: (dir) => {
            if (this.router)
                this.router.load(dir);
            else
                this.routes.load(dir);
        }
    };
}
exports.ForgeAPI = ForgeAPI;
//# sourceMappingURL=index.js.map