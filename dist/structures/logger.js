"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.Logger = {
    dateColor: chalk_1.default.greenBright,
    colors: {
        INFO: chalk_1.default.cyan.bold,
        WARN: chalk_1.default.yellow.bold,
        ERROR: chalk_1.default.red.bold,
        DEBUG: chalk_1.default.whiteBright.bold
    },
    log(type, ...message) {
        console.log(this.dateColor(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`), this.colors[type](`[${type}]`), message.join(" "));
    }
};
//# sourceMappingURL=logger.js.map