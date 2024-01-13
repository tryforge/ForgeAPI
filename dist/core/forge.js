"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPI = void 0;
const forgescript_1 = require("forgescript");
const _1 = require(".");
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
        const api = new _1.APICore(this.options.port);
        api.load('./routes');
        ForgeAPI.server = api;
        ForgeAPI.client = client;
        if (this.options.load)
            api.load(this.options.load);
    }
}
exports.ForgeAPI = ForgeAPI;
//# sourceMappingURL=forge.js.map