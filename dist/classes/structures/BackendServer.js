"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendServer = exports.AuthType = void 0;
const ForgeAPICommandManager_1 = require("../managers/ForgeAPICommandManager");
const ForgeAPIRouteManager_1 = require("../managers/ForgeAPIRouteManager");
const InternalLogger_1 = require("./InternalLogger");
const webserver_1 = require("@tryforge/webserver");
const events_1 = require("events");
/**
 * The available auth types.
 */
var AuthType;
(function (AuthType) {
    AuthType[AuthType["None"] = 0] = "None";
    AuthType[AuthType["Min"] = 1] = "Min";
    AuthType[AuthType["Full"] = 2] = "Full";
})(AuthType || (exports.AuthType = AuthType = {}));
/**
 * Your API server.
 */
class BackendServer extends events_1.EventEmitter {
    options;
    #app;
    #commands = null;
    #client = null;
    #routes = new ForgeAPIRouteManager_1.ForgeAPIRouteManager();
    constructor(options) {
        super();
        this.options = options;
        this.#app = (0, webserver_1.app)(options.port);
    }
    /**
     * Starts the ForgeAPI backend server.
     * @param client - The ForgeClient instance.
     * @returns {void}
     */
    init(client) {
        this.#client = client;
        this.#commands = new ForgeAPICommandManager_1.ForgeAPICommandManager(client);
        if (this.options.auth?.bearer) {
            InternalLogger_1.InternalLogger.info(`Your Bearer Token: ${this}`);
        }
        InternalLogger_1.InternalLogger.debug(`${this.constructor.name} initialized.`);
    }
    /**
     * Returns the express instance of the server.
     */
    get app() {
        return this.#app;
    }
    /**
     * Returns the event command manager.
     */
    get commands() {
        return this.#commands;
    }
    /**
     * Returns the route manager.
     */
    get routes() {
        return this.#routes;
    }
}
exports.BackendServer = BackendServer;
//# sourceMappingURL=BackendServer.js.map