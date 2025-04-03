import type { CloseEvent, Event, ErrorEvent, MessageEvent } from "ws";
import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
export interface WebsocketEvents {
    open: [Event];
    close: [CloseEvent];
    error: [ErrorEvent];
    message: [MessageEvent];
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
export declare class ForgeAPIWebsocketEventHandler<Events extends WebsocketEvents = WebsocketEvents, Names extends keyof Events = keyof Events> extends BaseEventHandler<Events, Names> {
    /**
     * Register the event into the ForgeAPI's backend server.
     * @param client - ForgeClient instance.
     * @returns {void}
     */
    register(client: ForgeClient): void;
}
//# sourceMappingURL=ForgeAPIWebsocketEventHandler.d.ts.map