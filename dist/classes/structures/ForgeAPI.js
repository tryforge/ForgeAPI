"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPI = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const BackendServer_1 = require("./BackendServer");
const ForgeAPICommandManager_1 = require("../managers/ForgeAPICommandManager");
const collectFiles_1 = require("../../utils/collectFiles");
const InternalLogger_1 = require("./InternalLogger");
const getVersion_1 = require("../../utils/getVersion");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = require("path");
/**
 * Type-guard function to check if the given object is
 * a ForgeAPI event.
 * @param data - The object to check.
 * @returns {data is BaseCommand<HTTPMethods>}
 */
function isEvent(data) {
    return typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "type")
        && typeof data.type === "string" && Object.prototype.hasOwnProperty.call(data, "code")
        && typeof data.code === "string";
}
/**
 * Type-guard function to check whether the given
 * object is a ForgeAPI route.
 * @param data - The object to check.
 * @returns {data is ForgeAPIRouteOptions}
 */
function isRoute(data) {
    return typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "url")
        && typeof data.url === "string" && Object.prototype.hasOwnProperty.call(data, "method")
        && typeof data.method === "string" && Object.prototype.hasOwnProperty.call(data, "handler")
        && (typeof data.handler === "string" || typeof data.handler === "function");
}
function isWebSocket(data) {
    return typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "name")
        && typeof data.name === "string" && ["open", "close", "message", "error"].includes(data.name)
        && Object.prototype.hasOwnProperty.call(data, "handler")
        && (typeof data.handler === "string" || typeof data.handler === "function");
}
/**
 * API integration for your ForgeScript client.
 */
class ForgeAPI extends forgescript_1.ForgeExtension {
    options;
    name = "ForgeAPI";
    description = "The best way to interact with your ForgeScript client and it's server.";
    version = (0, getVersion_1.getVersion)();
    /**
     * The ForgeClient instance.
     */
    #client = null;
    /**
     * ForgeAPI's backend.
     */
    #server = null;
    constructor(options) {
        super();
        this.options = options;
        if (options.logLevel && typeof options.logLevel === "number") {
            InternalLogger_1.InternalLogger.Priority = options.logLevel;
        }
    }
    /**
     * Add event commands to ForgeAPI.
     * @param events - The events to be added.
     * @returns {ForgeAPI}
     */
    addEvents(...events) {
        this.server.commands.add(...events);
        return this;
    }
    /**
     * Add routes to ForgeAPI.
     * @param routes - The routes to be added.
     * @returns {ForgeAPI}
     */
    addRoutes(...routes) {
        this.server.routes.addRoute(...routes);
        for (const route of routes) {
            const { auth, handler, method, url } = route;
            this.server.app[method.toLowerCase()](route.url, (req, res) => {
                if (auth && !this.isAuthed(req)) {
                    InternalLogger_1.InternalLogger.debug(`Access forbidden for URL: ${url}`);
                    return res.status(403).json({ status: 403, message: "Access Forbidden" });
                }
                InternalLogger_1.InternalLogger.debug(`Handling request for URL: "${url}"`);
                try {
                    if (typeof handler === "string") {
                        const compiled = this.server.routes.getRoute((route) => route.url === url && route.method === method);
                        if (!compiled) {
                            InternalLogger_1.InternalLogger.warn(`Route with name "${url}" and method "${method.toUpperCase()}" not found!`);
                            return;
                        }
                        forgescript_1.Interpreter.run({
                            obj: {},
                            client: this.#client,
                            command: compiled,
                            data: compiled.compiled.code,
                            environment: { req, res }
                        });
                    }
                    else {
                        handler({ client: this.#client, req, res });
                    }
                }
                catch (err) {
                    this.server.emit("error", err);
                }
                this.server.emit("request", req, res);
            });
            InternalLogger_1.InternalLogger.debug(`Route with URL: "${url}" registered.`);
        }
        return this;
    }
    /**
     * Adds a listener for the websocket server.
     * @param listeners - The listeners to be added.
     * @returns {void}
     */
    addWebsocketListener(...listeners) {
        this.server.websocketRoutes.addRoute(...listeners);
        for (const route of listeners) {
            const { handler, name } = route;
            this.server.app.ws.on(name, (req) => {
                InternalLogger_1.InternalLogger.debug(`Handling request for websocket URL: "${name}"`);
                try {
                    if (typeof handler === "string") {
                        const compiled = this.server.websocketRoutes.getRoute(name);
                        forgescript_1.Interpreter.run({
                            obj: {},
                            client: this.#client,
                            command: compiled,
                            data: compiled.compiled.code,
                            environment: { req }
                        });
                    }
                    else {
                        handler({ client: this.#client, req, ws: this.server.app.ws });
                    }
                }
                catch (err) {
                    this.server.emit("error", err);
                }
            });
            InternalLogger_1.InternalLogger.debug(`Websocket route with URL: "${name}" registered.`);
        }
        return this;
    }
    /**
     * Load events and routes from the given directory.
     * @param dir - The directory to load files from.
     * @returns {void}
     */
    load(dir) {
        const collectedFiles = (0, collectFiles_1.collectFiles)(dir).map(file => {
            const content = require(file.dir);
            if (content.default)
                return content.default;
            else
                return content;
        });
        for (const data of collectedFiles) {
            const values = Array.isArray(data) ? data : [data];
            values.forEach((file) => {
                if (isRoute(file)) {
                    this.addRoutes(file);
                }
                else if (isEvent(file)) {
                    this.addEvents(file);
                }
                else if (isWebSocket(file)) {
                    this.addWebsocketListener(file);
                }
            });
        }
    }
    /**
     * Starts the ForgeAPI extension.
     * @param client - The ForgeClient instance to attach the extension to.
     * @returns {void}
     */
    init(client) {
        this.#client = client;
        this.#server = new BackendServer_1.BackendServer(this.options);
        this.#server.init(client);
        forgescript_1.FunctionManager.load((0, path_1.join)(__dirname, "../../natives"));
        if (Array.isArray(this.options.events)) {
            forgescript_1.EventManager.load(ForgeAPICommandManager_1.handlerName, (0, path_1.join)(__dirname, "../../events"));
            client.events.load(ForgeAPICommandManager_1.handlerName, this.options.events);
        }
        client.once("ready", (bot) => {
            InternalLogger_1.InternalLogger.info("Your Bearer Token:", this.generateBearer(bot.user.id, typeof this.options.auth?.code == "string"
                ? this.options.auth?.code
                : this.options.auth?.code?.[0] ?? "tryforge"));
            this.server.emit("ready");
        });
    }
    /**
     * Check whether the given request is authed.
     * @param req
     * @returns {boolean}
     */
    isAuthed(req) {
        const config = this.options.auth;
        if (!config)
            return true;
        if (config.type === BackendServer_1.AuthType.None)
            return true;
        if (config.type === BackendServer_1.AuthType.Min) {
            return this.validIP(req) || this.checkCode(req);
        }
        else if (config.type === BackendServer_1.AuthType.Full) {
            return this.validIP(req) && this.checkCode(req);
        }
        return false;
    }
    /**
     * Check the IP in the incoming request to match with any
     * of the provided ID's in the ForgeAPI constructor.
     * @param req - Express request object.
     * @returns {boolean}
     */
    validIP(req) {
        const allowedIPs = this.options.auth?.ip;
        if (!allowedIPs)
            return undefined;
        const ipArray = Array.isArray(allowedIPs) ? allowedIPs : [allowedIPs];
        const result = ipArray.some(ip => this.normalizeIp(ip) == req.ip || "");
        InternalLogger_1.InternalLogger.debug(`IP check result for ${req.ip}: ${result}`);
        return result;
    }
    /**
     * Normalizes the given IP address.
     * @param ip - The address to be normalized.
     * @returns {string}
     */
    normalizeIp(ip) {
        const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
        if (ipv4Regex.test(ip)) {
            InternalLogger_1.InternalLogger.debug(`IPv4 to IPv6: ${ip}`);
            return `::ffff:${ip}`;
        }
        if (ipv6Regex.test(ip)) {
            InternalLogger_1.InternalLogger.debug(`Using IPv6: ${ip}`);
            return ip;
        }
        throw InternalLogger_1.InternalLogger.error('Invalid IP address(es) provided in config!');
    }
    checkCode(req) {
        const authData = this.options.auth;
        if (!authData)
            return undefined;
        const token = req.headers.authorization || "";
        if (this.options.auth?.bearer) {
            const code = Array.isArray(this.options.auth?.code) ? this.options.auth?.code[0] : this.options.auth?.code ?? "";
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "", code);
            if (checker === "Error") {
                InternalLogger_1.InternalLogger.debug("Bearer token validation failed");
                return false;
            }
            const result = checker.id === this.#client.user.id;
            InternalLogger_1.InternalLogger.debug(`Bearer token validation result: ${result}`);
            return result;
        }
        else if (this.options.auth?.code) {
            const codes = Array.isArray(this.options.auth?.code) ? this.options.auth?.code : [this.options.auth?.code];
            const result = codes.includes(token);
            InternalLogger_1.InternalLogger.debug(`Code validation result: ${result}`);
            return result;
        }
        else {
            return true;
        }
    }
    /**
     * Generates a bearer token.
     */
    generateBearer(id, key) {
        const token = jsonwebtoken_1.default.sign({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".");
        InternalLogger_1.InternalLogger.debug(`Generated bearer token for ID: ${id}`);
        return token;
    }
    /**
     * Verifies the bearer token with "jwt".
     */
    checkBearer(token, key) {
        try {
            const result = jsonwebtoken_1.default.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + token, key);
            InternalLogger_1.InternalLogger.debug(`Bearer token verificaton success`);
            return result;
        }
        catch {
            InternalLogger_1.InternalLogger.debug(`Bearer token verification failed.`);
            return "Error";
        }
    }
    /**
     * Returns the ForgeAPICommandManager instance.
     */
    get commands() {
        return this.server.commands;
    }
    /**
     * Returns the backend of the ForgeAPI.
     */
    get server() {
        return this.#server;
    }
    /**
     * Returns the ForgeAPIRouteManager instance.
     */
    get routes() {
        return this.server.routes;
    }
    /**
     * Returns the websocket server of the ForgeAPI backend.
     */
    get ws() {
        return this.server.app.ws;
    }
}
exports.ForgeAPI = ForgeAPI;
//# sourceMappingURL=ForgeAPI.js.map