"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPI = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const structures_1 = require("./structures");
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
    ;
    init(client) {
        this.router = new structures_1.RouteManager({ ...this.options });
        client.once("ready", (cli) => {
            this.router.init(cli);
        });
    }
    ;
    routes = {
        load: (dir) => {
            if (this.router)
                this.router.load(dir);
            else
                this.routes.load(dir);
        },
        add: (data) => {
            if (this.router)
                this.router.route(data);
            else
                this.routes.add(data);
        }
    };
    ws = {
        load: (dir) => {
            if (this.router)
                this.router.load(dir);
            else
                this.routes.load(dir);
        },
        add: (data) => {
            if (this.router)
                this.router.route(data);
            else
                this.routes.add(data);
        }
    };
}
exports.ForgeAPI = ForgeAPI;
;
//# sourceMappingURL=index.js.map