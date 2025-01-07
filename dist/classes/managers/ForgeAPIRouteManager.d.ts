import type { ForgeAPIRouteOptions } from "../structures/ForgeAPIRoute";
/**
 * Class that handles every ForgeAPI route.
 */
export declare class ForgeAPIRouteManager {
    cache: Map<string, ForgeAPIRouteOptions>;
    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    addRoute(...routes: ForgeAPIRouteOptions[]): this;
    /**
     * Get a route by name.
     * @param name - The name of the route to get.
     * @returns {ForgeAPIRouteOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute('/hello')
     */
    getRoute(name: string): ForgeAPIRouteOptions | null;
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