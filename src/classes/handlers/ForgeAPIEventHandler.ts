import type { BackendServerEvents } from "@structures/BackendServer"
import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript"
import { ForgeAPI } from "@structures/ForgeAPI"

/**
 * The ForgeAPI event handler.
 * @example
 * export default new ForgeAPIEventHandler({
 *      name: "request",
 *      description: "Fired when a request is made.",
 *      listener(req) {
 *          req.send("uwu")
 *      }
 * })
 */
export class ForgeAPIEventHandler<Events extends BackendServerEvents = BackendServerEvents, Names extends keyof Events = keyof Events> extends BaseEventHandler<Events, Names> {
    /**
     * Register the event into the ForgeAPI's backend server.
     * @param client - ForgeClient instance.
     * @returns {void}
     */
    public register(client: ForgeClient) {
        client.getExtension(ForgeAPI, true).server.on(this.name, this.listener.bind(client) as any)
    }
}