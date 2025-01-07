"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalLogger = void 0;
const forgescript_1 = require("@tryforge/forgescript");
/**
 * Extended logger for the ForgeAPI instance.
 */
class InternalLogger extends forgescript_1.Logger {
    static Priority = forgescript_1.LogPriority.Low;
}
exports.InternalLogger = InternalLogger;
//# sourceMappingURL=InternalLogger.js.map