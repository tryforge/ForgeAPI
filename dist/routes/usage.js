"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const pidusage_1 = __importDefault(require("pidusage"));
async function getUsage() {
    const stats = await (0, pidusage_1.default)(process.pid);
    return {
        cpu: stats.cpu,
        ram: stats.memory,
        ping: __1.ForgeAPI.client.ws.ping
    };
}
exports.default = {
    url: '/usage',
    method: "get",
    handler: async function (request, reply) {
        reply.end(JSON.stringify(await getUsage()));
    },
    wsHandler: async function (ws, request) {
        setInterval(async () => {
            ws.send(JSON.stringify(await getUsage()));
        }, 1000);
    }
};
//# sourceMappingURL=usage.js.map