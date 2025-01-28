import { ForgeAPIWebSocketOptions } from "../structures/ForgeAPIRoute";
/**
 * Class that handles every ForgeAPI websocket event.
 */
export declare class ForgeAPIWebsocketManager {
    cache: Map<string, ForgeAPIWebSocketOptions>;
    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    addRoute(...routes: ForgeAPIWebSocketOptions[]): this;
    /**
     * Get a route by name.
     * @param name - The name of the route to get.
     * @returns {ForgeAPIWebSocketOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute('/hello')
     */
    getRoute(name: string): ForgeAPIWebSocketOptions | null;
    /**
     * Get a route by matching the provided callback.
     * @param cb - The callback to match.
     * @returns {ForgeAPIWebSocketOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute(r => r.url === '/hello')
     */
    getRoute(cb: (route: ForgeAPIWebSocketOptions) => boolean): ForgeAPIWebSocketOptions | null;
}
//# sourceMappingURL=ForgeAPIWebsocketManager.d.ts.map