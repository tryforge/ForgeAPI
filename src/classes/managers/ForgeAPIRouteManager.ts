import { Compiler } from "@tryforge/forgescript"
import type { ForgeAPIRouteOptions  } from "../structures/ForgeAPIRoute"

/**
 * Class that handles every ForgeAPI route.
 */
export class ForgeAPIRouteManager {
    public cache = new Map<string, ForgeAPIRouteOptions>()

    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    public addRoute(...routes: ForgeAPIRouteOptions[]) {
        for (const route of routes) {
            if (typeof route.handler === "string") {
                route.compiled = {
                    name: Compiler.compile(route.url),
                    code: Compiler.compile(route.handler)
                }
            }

            this.cache.set(route.url, route)
        }
        return this
    }

    /**
     * Get a route by name.
     * @param name - The name of the route to get.
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute('/hello')
     */
    public getRoute(name: string): ForgeAPIRouteOptions | null
    /**
     * Get a route by matching the provided callback.
     * @param cb - The callback to match.
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute(r => r.url === '/hello')
     */
    public getRoute(cb: (route: ForgeAPIRouteOptions) => boolean): ForgeAPIRouteOptions | null
    public getRoute(nameOrCallback: string | ((route: ForgeAPIRouteOptions) => boolean)) {
        if (typeof nameOrCallback === "string") {
            return this.cache.get(nameOrCallback) ?? null
        }

        const routes = Array.from(this.cache.values())
        return routes.find(nameOrCallback) ?? null
    }
}