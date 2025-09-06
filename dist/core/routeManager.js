"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const hono_1 = require("hono");
const types_1 = require("./types");
const forgescript_1 = require("@tryforge/forgescript");
const fs_1 = require("fs");
const node_server_1 = require("@hono/node-server");
const path_1 = require("path");
const authManager_1 = require("./authManager");
const process_1 = require("process");
const isValidFile = (file) => file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts'));
class RouteManager {
    auth;
    app;
    authManager;
    client;
    notAuthedHandler = (c) => c.text("Unauthorized", 401);
    invalidQueryHandler = (c) => c.text("Invalid query parameters", 400);
    constructor(auth) {
        this.auth = auth;
        this.app = new hono_1.Hono();
    }
    onError(handler) {
        this.app.onError(handler);
    }
    notFound(handler) {
        this.app.notFound(handler);
    }
    registerClient(client) {
        this.client = client;
        this.authManager = new authManager_1.AuthManager(this.client, this.auth);
    }
    load(...dir) {
        const root = (0, path_1.join)((0, process_1.cwd)(), ...dir);
        const files = (0, fs_1.readdirSync)(root);
        for (const file of files) {
            const path = (0, path_1.join)(root, file);
            const stat = (0, fs_1.lstatSync)(path);
            if (stat.isDirectory())
                this.load(path);
            else if (stat.isFile() && isValidFile(file)) {
                const req = require(path);
                const data = (req.default || req);
                this.addRoute(data);
            }
        }
    }
    addRoute(options) {
        const handler = async (ctx, next) => {
            if (typeof options.handler == "string") {
                const command = new forgescript_1.BaseCommand({
                    type: "route",
                    code: options.handler,
                });
                const promise = await new Promise(async (resolve) => {
                    await forgescript_1.Interpreter.run({
                        obj: {},
                        client: this.client,
                        data: command.compiled.code,
                        command,
                        extras: { ctx, next, resolve }
                    });
                    resolve(next());
                });
                return promise;
            }
            return options.handler(ctx, next);
        };
        if (!Array.isArray(options.method))
            options.method = [options.method];
        for (const method of options.method) {
            const { required, optional } = options.query ?? {};
            this.app[method.toLowerCase()](options.url, async (c, next) => {
                if (options.auth && !this.authManager.isAuthed(c)) {
                    forgescript_1.Logger.debug("Unauthorized access to " + options.url);
                    return this.notAuthedHandler(c);
                }
                forgescript_1.Logger.debug("Access given to " + options.url);
                const query = c.req.query();
                const promise = await Promise.all([
                    this.isValidRequiredQuery(query, required ?? {}),
                    this.isOptionalQuery(query, optional ?? {})
                ]);
                if (!promise[0] || !promise[1])
                    return this.invalidQueryHandler(c);
                const ctx = Object.assign(c, { query, client: this.client });
                return handler(ctx, next);
            });
            forgescript_1.Logger.info("Loaded", method.toUpperCase(), options.url);
        }
    }
    async isValidRequiredQuery(query, required) {
        const arr = Object.keys(query);
        const filter = Object.keys(required).filter((key) => !arr.includes(key));
        if (filter.length > 0)
            return false;
        for (const key of arr) {
            switch (required[key]) {
                case types_1.QueryType.String:
                    query[key] = query[key];
                    break;
                case types_1.QueryType.Number:
                    query[key] = Number(query[key]);
                    if (isNaN(query[key]))
                        return false;
                    break;
                case types_1.QueryType.Boolean:
                    if (query[key] !== "true" && query[key] !== "false")
                        return false;
                    query[key] = query[key] === "true";
                    break;
                case types_1.QueryType.Image:
                    const image = await this.isValidImageUrl(query[key]);
                    if (!image)
                        return false;
                    query[key] = image;
                    break;
            }
        }
        return true;
    }
    async isOptionalQuery(query, optional) {
        const arr = Object.keys(query);
        for (const key of arr) {
            if (!query[key])
                continue;
            switch (optional[key]) {
                case types_1.QueryType.String:
                    query[key] = query[key];
                    break;
                case types_1.QueryType.Number:
                    query[key] = Number(query[key]);
                    if (isNaN(query[key]))
                        return false;
                    break;
                case types_1.QueryType.Boolean:
                    if (query[key] !== "true" && query[key] !== "false")
                        return false;
                    query[key] = query[key] === "true";
                    break;
                case types_1.QueryType.Image:
                    const image = await this.isValidImageUrl(query[key]);
                    if (!image)
                        return false;
                    query[key] = image;
                    break;
            }
        }
        return true;
    }
    async isValidImageUrl(url) {
        try {
            const res = await fetch(url);
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && contentType.startsWith('image/'))
                return Buffer.from(await res.arrayBuffer());
            return false;
        }
        catch (err) {
            return false;
        }
    }
    listen(port) {
        (0, node_server_1.serve)({ fetch: this.app.fetch, port });
    }
}
exports.RouteManager = RouteManager;
//# sourceMappingURL=routeManager.js.map