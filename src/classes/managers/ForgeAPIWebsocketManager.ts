import type { WebsocketEvents } from "@handlers/ForgeAPIWebsocketEventHandler"
import { ForgeAPIWebSocketOptions } from "@structures/ForgeAPIRoute"
import { InternalLogger } from "../structures/InternalLogger"
import { Compiler } from "@tryforge/forgescript"

/**
 * Class that handles every ForgeAPI websocket event.
 */
export class ForgeAPIWebsocketManager {
    public cache = new Map<keyof WebsocketEvents | string, ForgeAPIWebSocketOptions>()

    /**
     * Add routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIRouteManager}
     */
    public addRoute(...routes: ForgeAPIWebSocketOptions[]) {
        for (const route of routes) {
            InternalLogger.debug(`Adding websocket route: "${route.name}" into the route manager.`)
            
            route.data = {} // IBaseCommand compatibility issues.

            if (typeof route.handler === "string") {
                route.compiled = {
                    name: Compiler.compile(route.name),
                    code: Compiler.compile(route.handler)
                }
            }

            this.cache.set(route.name, route)
        }
        return this
    }

    /**
     * Get a route by name.
     * @param name - The name of the route to get.
     * @returns {ForgeAPIWebSocketOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute('/hello')
     */
    public getRoute(name: string): ForgeAPIWebSocketOptions | null
    /**
     * Get a route by matching the provided callback.
     * @param cb - The callback to match.
     * @returns {ForgeAPIWebSocketOptions | null}
     * @example
     * <ForgeAPIRouteManager>.getRoute(r => r.url === '/hello')
     */
    public getRoute(cb: (route: ForgeAPIWebSocketOptions) => boolean): ForgeAPIWebSocketOptions | null
    public getRoute(nameOrCallback: string | ((route: ForgeAPIWebSocketOptions) => boolean)) {
        if (typeof nameOrCallback === "string") {
            return this.cache.get(nameOrCallback) ?? null
        }

        const routes = Array.from(this.cache.values())
        return routes.find(nameOrCallback) ?? null
    }
}