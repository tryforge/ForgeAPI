import type { ForgeAPIRouteOptions  } from "../structures/ForgeAPIRoute"
import { InternalLogger } from "../structures/InternalLogger"
import { Compiler } from "@tryforge/forgescript"

/**
 * Class that handles every ForgeAPI route.
 */
export class ForgeAPIRouteManager {
    public cache = new Map<string, ForgeAPIRouteOptions>()

    /** 
     * Build a unique cache key based on method + url.
     */
    private makeKey(method: string, url: string): string {
        return `${method.toUpperCase()}:${url}`
    }

    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    public addRoute(...routes: ForgeAPIRouteOptions[]) {
        for (const route of routes) {
            const method = route.method.toUpperCase()

            InternalLogger.debug(`Adding route: [${method}] "${route.url}" into the route manager.`)
            
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
     * Get a route by url and method.
     * @param url - The url of the route to get.
     * @param method - The HTTP method (defaults to GET).
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute('/hello', 'POST')
     */
    public getRoute(url: string, method?: string): ForgeAPIRouteOptions | null
    /**
     * Get a route by matching the provided callback.
     * @param cb - The callback to match.
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute(r => r.url === '/hello')
     */
    public getRoute(cb: (route: ForgeAPIRouteOptions) => boolean): ForgeAPIRouteOptions | null
    public getRoute(
        urlOrCallback: string | ((route: ForgeAPIRouteOptions) => boolean),
        method: string = "GET"
    ) {
        if (typeof urlOrCallback === "string") {
            return this.cache.get(this.makeKey(method, urlOrCallback)) ?? null
        }

        const routes = Array.from(this.cache.values())
        return routes.find(urlOrCallback) ?? null
    }
}
