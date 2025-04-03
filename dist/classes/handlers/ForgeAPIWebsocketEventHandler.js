"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPIWebsocketEventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const ForgeAPI_1 = require("../structures/ForgeAPI");
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
class ForgeAPIWebsocketEventHandler extends forgescript_1.BaseEventHandler {
    /**
     * Register the event into the ForgeAPI's backend server.
     * @param client - ForgeClient instance.
     * @returns {void}
     */
    register(client) {
        client.getExtension(ForgeAPI_1.ForgeAPI, true).ws.on(this.name, this.listener.bind(client));
    }
}
exports.ForgeAPIWebsocketEventHandler = ForgeAPIWebsocketEventHandler;
//# sourceMappingURL=ForgeAPIWebsocketEventHandler.js.map