"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPIRouteManager = void 0;
const InternalLogger_1 = require("../structures/InternalLogger");
const forgescript_1 = require("@tryforge/forgescript");
/**
 * Class that handles every ForgeAPI route.
 */
class ForgeAPIRouteManager {
    cache = new Map();
    /**
     * Build a unique cache key based on method + url.
     */
    makeKey(method, url) {
        return `${method.toUpperCase()}:${url}`;
    }
    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    addRoute(...routes) {
        for (const route of routes) {
            const method = route.method.toUpperCase();
            InternalLogger_1.InternalLogger.debug(`Adding route: [${method}] "${route.url}" into the route manager.`);
            route.data = {}; // IBaseCommand compatibility issues.
            if (typeof route.handler === "string") {
                route.compiled = {
                    name: forgescript_1.Compiler.compile(route.url),
                    code: forgescript_1.Compiler.compile(route.handler)
                };
            }
            this.cache.set(this.makeKey(method, route.url), route);
        }
        return this;
    }
    getRoute(urlOrCallback, method = "GET") {
        if (typeof urlOrCallback === "string") {
            return this.cache.get(this.makeKey(method, urlOrCallback)) ?? null;
        }
        const routes = Array.from(this.cache.values());
        return routes.find(urlOrCallback) ?? null;
    }
}
exports.ForgeAPIRouteManager = ForgeAPIRouteManager;
//# sourceMappingURL=ForgeAPIRouteManager.js.map