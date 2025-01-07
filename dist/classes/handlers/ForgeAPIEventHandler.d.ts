import type { BackendServerEvents } from "../structures/BackendServer";
import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
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
export declare class ForgeAPIEventHandler<Events extends BackendServerEvents = BackendServerEvents, Names extends keyof Events = keyof Events> extends BaseEventHandler<Events, Names> {
    /**
     * Register the event into the ForgeAPI's backend server.
     * @param client - ForgeClient instance.
     * @returns {void}
     */
    register(client: ForgeClient): void;
}
//# sourceMappingURL=ForgeAPIEventHandler.d.ts.map