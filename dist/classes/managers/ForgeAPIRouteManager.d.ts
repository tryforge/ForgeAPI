import type { ForgeAPIRouteOptions } from "../structures/ForgeAPIRoute";
/**
 * Class that handles every ForgeAPI route.
 */
export declare class ForgeAPIRouteManager {
    cache: Map<string, ForgeAPIRouteOptions>;
    /**
     * Build a unique cache key based on method + url.
     */
    private makeKey;
    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    addRoute(...routes: ForgeAPIRouteOptions[]): this;
    /**
     * Get a route by url and method.
     * @param url - The url of the route to get.
     * @param method - The HTTP method (defaults to GET).
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute('/hello', 'POST')
     */
    getRoute(url: string, method?: string): ForgeAPIRouteOptions | null;
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