"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPIRouteManager = void 0;
const forgescript_1 = require("@tryforge/forgescript");
/**
 * Class that handles every ForgeAPI route.
 */
class ForgeAPIRouteManager {
    cache = new Map();
    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    addRoute(...routes) {
        for (const route of routes) {
            route.data = {}; // IBaseCommand compatibility issues.
            if (typeof route.handler === "string") {
                route.compiled = {
                    name: forgescript_1.Compiler.compile(route.url),
                    code: forgescript_1.Compiler.compile(route.handler)
                };
            }
            this.cache.set(route.url, route);
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
exports.ForgeAPIRouteManager = ForgeAPIRouteManager;
//# sourceMappingURL=ForgeAPIRouteManager.js.map