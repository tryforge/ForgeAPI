"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPI = void 0;
const forgescript_1 = require("forgescript");
const core_1 = require("./core");
class ForgeAPI extends forgescript_1.ForgeExtension {
    options;
    static client;
    static server;
    name = 'ForgeAPI';
    description = 'Powerful API to interact with your discord bot';
    version = '0.0.1';
    constructor(options) {
        super();
        this.options = options;
    }
    init(client) {
        const api = new core_1.APICore(this.options.port);
        api.load('./routes');
        ForgeAPI.server = api;
        ForgeAPI.client = client;
    }
}
exports.ForgeAPI = ForgeAPI;
//# sourceMappingURL=index.js.map