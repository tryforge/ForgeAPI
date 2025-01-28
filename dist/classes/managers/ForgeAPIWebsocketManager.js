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
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    addRoute(...routes) {
        for (const route of routes) {
            InternalLogger_1.InternalLogger.debug(`Adding websocket route: "${route.name}" into the route manager.`);
            route.data = {}; // IBaseCommand compatibility issues.
            if (typeof route.handler === "string") {
                route.compiled = {
                    name: forgescript_1.Compiler.compile(route.name),
                    code: forgescript_1.Compiler.compile(route.handler)
                };
            }
            this.cache.set(route.name, route);
        }
        return this;
    }
    getRoute(nameOrCallback) {
        if (typeof nameOrCallback === "string") {
            return this.cache.get(nameOrCallback) ?? null;
        }
        const routes = Array.from(this.cache.values());
        return routes.find(nameOrCallback) ?? null;
    }
}
exports.ForgeAPIWebsocketManager = ForgeAPIWebsocketManager;
//# sourceMappingURL=ForgeAPIWebsocketManager.js.map