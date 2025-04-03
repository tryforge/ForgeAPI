import type { CloseEvent, Event, ErrorEvent, MessageEvent } from "ws"
import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript"
import { ForgeAPI } from "@structures/ForgeAPI"

export interface WebsocketEvents {
    open: [Event]
    close: [CloseEvent]
    error: [ErrorEvent]
    message: [MessageEvent]
}

/**
 * The ForgeAPI event handler.
 * @example
 * export default new ForgeAPIWebsocketEventHandler({
 *      name: "open",
 *      description: "When the websocket opens a connection.",
 *      listener() {
 
 *      }
 * })
 */
export class ForgeAPIWebsocketEventHandler<Events extends WebsocketEvents = WebsocketEvents, Names extends keyof Events = keyof Events> extends BaseEventHandler<Events, Names> {
    /**
     * Register the event into the ForgeAPI's backend server.
     * @param client - ForgeClient instance.
     * @returns {void}
     */
    public register(client: ForgeClient) {
        client.getExtension(ForgeAPI, true).ws.on(this.name as any, this.listener.bind(client) as any)
    }
}