import type { WebsocketEvents } from "@handlers/ForgeAPIWebsocketEventHandler"
import { ForgeAPIWebSocketOptions, HTTPMethods } from "@structures/ForgeAPIRoute"
import { InternalLogger } from "../structures/InternalLogger"
import { Compiler } from "@tryforge/forgescript"

/**
 * Class that handles every ForgeAPI websocket event.
 */
export class ForgeAPIWebsocketManager {
    public cache = new Map<string, ForgeAPIWebSocketOptions>()

    /** 
     * Build a unique cache key for method + websocket name.
     */
    private makeKey(method: HTTPMethods, name: string): string {
        return `${method.toUpperCase()}:${name}`
    }

    /**
     * Add websocket routes into the manager.
     * @param routes - Routes to add.
     * @returns {ForgeAPIWebsocketManager}
     */
    public addRoute(...routes: ForgeAPIWebSocketOptions[]) {
        for (const route of routes) {
            const method = (route.method ?? "GET") as HTTPMethods

            InternalLogger.debug(
                `Adding websocket route: [${method}] "${route.name}" into the websocket manager.`
            )

            route.data = {} // IBaseCommand compatibility issues.

            if (typeof route.handler === "string") {
                route.compiled = {
                    name: Compiler.compile(route.name as string),
                    code: Compiler.compile(route.handler)
                }
            }

            this.cache.set(this.makeKey(method, route.name as string), route)
        }
        return this
    }

    /**
     * Get a websocket route by name + method.
     * @param name - The name of the route to get.
     * @param method - The method (defaults to GET).
     * @returns {ForgeAPIWebSocketOptions | null}
     * @example
     * <ForgeAPIWebsocketManager>.getRoute('messageCreate', 'POST')
     */
    public getRoute(name: string, method?: HTTPMethods): ForgeAPIWebSocketOptions | null
    /**
     * Get a websocket route by matching the provided callback.
     * @param cb - The callback to match.
     * @returns {ForgeAPIWebSocketOptions | null}
     * @example
     * <ForgeAPIWebsocketManager>.getRoute(r => r.name === 'ready')
     */
    public getRoute(cb: (route: ForgeAPIWebSocketOptions) => boolean): ForgeAPIWebSocketOptions | null
    public getRoute(
        nameOrCallback: string | ((route: ForgeAPIWebSocketOptions) => boolean),
        method: HTTPMethods = "GET"
    ) {
        if (typeof nameOrCallback === "string") {
            return this.cache.get(this.makeKey(method, nameOrCallback)) ?? null
        }

        const routes = Array.from(this.cache.values())
        return routes.find(nameOrCallback) ?? null
    }
}
