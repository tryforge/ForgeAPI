"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPIWebsocketManager = void 0;
const InternalLogger_1 = require("../structures/InternalLogger");
const forgescript_1 = require("@tryforge/forgescript");
/**
 * Class that handles every ForgeAPI websocket event.
 */
class ForgeAPIWebsocketManager {
    cache = new Map();
    /**
     * Build a unique cache key for method + websocket name.
     */
    makeKey(method, name) {
        return `${method.toUpperCase()}:${name}`;
    }
    /**
     * Add websocket routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIWebsocketManager}
     */
    addRoute(...routes) {
        for (const route of routes) {
            const method = (route.method ?? "GET");
            InternalLogger_1.InternalLogger.debug(`Adding websocket route: [${method}] "${route.name}" into the websocket manager.`);
            route.data = {}; // IBaseCommand compatibility issues.
            if (typeof route.handler === "string") {
                route.compiled = {
                    name: forgescript_1.Compiler.compile(route.name),
                    code: forgescript_1.Compiler.compile(route.handler)
                };
            }
            this.cache.set(this.makeKey(method, route.name), route);
        }
        return this;
    }
    getRoute(nameOrCallback, method = "GET") {
        if (typeof nameOrCallback === "string") {
            return this.cache.get(this.makeKey(method, nameOrCallback)) ?? null;
        }
        const routes = Array.from(this.cache.values());
        return routes.find(nameOrCallback) ?? null;
    }
}
exports.ForgeAPIWebsocketManager = ForgeAPIWebsocketManager;
//# sourceMappingURL=ForgeAPIWebsocketManager.js.map