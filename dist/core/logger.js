"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Logger = {
    DateColor: chalk_1.default.green.bold,
    Colors: {
        DEBUG: chalk_1.default.whiteBright.bold,
        INFO: chalk_1.default.cyan.bold,
        WARN: chalk_1.default.yellow.bold,
        ERROR: chalk_1.default.red.bold,
        API: chalk_1.default.whiteBright.bold,
        MESSAGE: chalk_1.default.cyan.bold,
    },
    debug: false,
    log(type, message) {
        if (type === 'DEBUG' && !this.debug) {
            return;
        }
        console.log(this.DateColor(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`), this.Colors[type](`[${type}]`), this.Colors.MESSAGE(message));
    },
};
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map