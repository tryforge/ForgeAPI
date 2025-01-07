"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAPICommandManager = exports.handlerName = void 0;
const forgescript_1 = require("@tryforge/forgescript");
/**
 * Handler and provider name.
 */
exports.handlerName = "ForgeAPI";
/**
 * The ForgeAPI command manager.
 */
class ForgeAPICommandManager extends forgescript_1.BaseCommandManager {
    handlerName = exports.handlerName;
}
exports.ForgeAPICommandManager = ForgeAPICommandManager;
//# sourceMappingURL=ForgeAPICommandManager.js.map