"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPIEventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const ForgeAPI_1 = require("../structures/ForgeAPI");
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
class ForgeAPIEventHandler extends forgescript_1.BaseEventHandler {
    /**
     * Register the event into the ForgeAPI's backend server.
     * @param client - ForgeClient instance.
     * @returns {void}
     */
    register(client) {
        client.getExtension(ForgeAPI_1.ForgeAPI, true).server.on(this.name, this.listener.bind(client));
    }
}
exports.ForgeAPIEventHandler = ForgeAPIEventHandler;
//# sourceMappingURL=ForgeAPIEventHandler.js.map