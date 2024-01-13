"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pidusage_1 = __importDefault(require("pidusage"));
async function getUsage(client) {
    const stats = await (0, pidusage_1.default)(process.pid);
    return {
        cpu: stats.cpu,
        ram: stats.memory,
        ping: client.ws.ping,
        uptime: client.uptime
    };
}
exports.default = {
    url: '/usage',
    method: "get",
    handler: async function (ctx) {
        ctx.reply.end(JSON.stringify(await getUsage(ctx.client)));
    },
    wsHandler: async function (ctx) {
        setInterval(async () => {
            ctx.ws.send(JSON.stringify(await getUsage(ctx.client)));
        }, 1000);
    }
};
//# sourceMappingURL=usage.js.map