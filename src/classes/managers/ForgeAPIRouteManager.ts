import type { ForgeAPIRouteOptions, HTTPMethods } from "../structures/ForgeAPIRoute"
import { InternalLogger } from "../structures/InternalLogger"
import { Compiler } from "@tryforge/forgescript"

/**
 * Class that handles every ForgeAPI route.
 */
export class ForgeAPIRouteManager {
    public cache = new Map<string, ForgeAPIRouteOptions>()

    /**
     * Build a unique key for method+url.
     */
    private makeKey(method: HTTPMethods, url: string): string {
        return `${method.toUpperCase()}:${url}`
    }

    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    public addRoute(...routes: ForgeAPIRouteOptions[]) {
        for (const route of routes) {
            const method = route.method?.toUpperCase() as HTTPMethods

            InternalLogger.debug(
                `Adding route: [${method}] "${route.url}" into the route manager.`
            )

            route.data = {} // IBaseCommand compatibility issues.

            if (typeof route.handler === "string") {
                route.compiled = {
                    name: Compiler.compile(route.url),
                    code: Compiler.compile(route.handler)
                }
            }

            this.cache.set(this.makeKey(method, route.url), route)
        }
        return this
    }

    /**
     * Get a route by name+method.
     * @param name - The name of the route to get.
     * @param method - The HTTP method (defaults to GET).
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute('/hello', 'GET')
     */
    public getRoute(name: string, method?: HTTPMethods): ForgeAPIRouteOptions | null
    /**
     * Get a route by matching the provided callback.
     * @param cb - The callback to match.
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute(r => r.url === '/hello')
     */
    public getRoute(cb: (route: ForgeAPIRouteOptions) => boolean): ForgeAPIRouteOptions | null
    public getRoute(
        nameOrCallback: string | ((route: ForgeAPIRouteOptions) => boolean),
        method: HTTPMethods = "GET"
    ) {
        if (typeof nameOrCallback === "string") {
            return this.cache.get(this.makeKey(method, nameOrCallback)) ?? null
        }

        const routes = Array.from(this.cache.values())
        return routes.find(nameOrCallback) ?? null
    }
}
