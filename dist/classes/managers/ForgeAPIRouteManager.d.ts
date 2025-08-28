import type { ForgeAPIRouteOptions, HTTPMethods } from "../structures/ForgeAPIRoute";
/**
 * Class that handles every ForgeAPI route.
 */
export declare class ForgeAPIRouteManager {
    cache: Map<string, ForgeAPIRouteOptions>;
    /**
     * Build a unique key for method+url.
     */
    private makeKey;
    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    addRoute(...routes: ForgeAPIRouteOptions[]): this;
    /**
     * Get a route by name+method.
     * @param name - The name of the route to get.
     * @param method - The HTTP method (defaults to GET).
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute('/hello', 'GET')
     */
    getRoute(name: string, method?: HTTPMethods): ForgeAPIRouteOptions | null;
    /**
     * Get a route by matching the provided callback.
     * @param cb - The callback to match.
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute(r => r.url === '/hello')
     */
    getRoute(cb: (route: ForgeAPIRouteOptions) => boolean): ForgeAPIRouteOptions | null;
}
//# sourceMappingURL=ForgeAPIRouteManager.d.ts.map