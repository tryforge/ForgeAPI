import { ForgeAPIWebSocketOptions, HTTPMethods } from "../structures/ForgeAPIRoute";
/**
 * Class that handles every ForgeAPI websocket event.
 */
export declare class ForgeAPIWebsocketManager {
    cache: Map<string, ForgeAPIWebSocketOptions>;
    /**
     * Build a unique cache key for method + websocket name.
     */
    private makeKey;
    /**
     * Add websocket routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIWebsocketManager}
     */
    addRoute(...routes: ForgeAPIWebSocketOptions[]): this;
    /**
     * Get a websocket route by name + method.
     * @param name - The name of the route to get.
     * @param method - The method (defaults to GET).
     * @returns {ForgeAPIWebSocketOptions | null}
     * @example
     * <ForgeAPIWebsocketManager>.getRoute('messageCreate', 'POST')
     */
    getRoute(name: string, method?: HTTPMethods): ForgeAPIWebSocketOptions | null;
    /**
     * Get a websocket route by matching the provided callback.
     * @param cb - The callback to match.
     * @returns {ForgeAPIWebSocketOptions | null}
     * @example
     * <ForgeAPIWebsocketManager>.getRoute(r => r.name === 'ready')
     */
    getRoute(cb: (route: ForgeAPIWebSocketOptions) => boolean): ForgeAPIWebSocketOptions | null;
}
//# sourceMappingURL=ForgeAPIWebsocketManager.d.ts.map