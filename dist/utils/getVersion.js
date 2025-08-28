"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = void 0;
const fs_1 = require("fs");
/**
 * Returns the current version of the project.
 * @returns {string}
 */
function getVersion() {
    const content = (0, fs_1.readFileSync)(process.cwd() + "/package.json", "utf-8");
    return JSON.parse(content).version;
}
exports.getVersion = getVersion;
//# sourceMappingURL=getVersion.js.map