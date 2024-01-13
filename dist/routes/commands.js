"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
exports.default = {
    url: '/commands',
    method: "get",
    handler: async function (ctx) {
        ctx.reply.end(JSON.stringify(__1.ForgeAPI.client.commands.toArray().map(s => { return s.data; })));
    },
    wsHandler: async function (ctx) {
        ctx.ws.send;
    }
};
//# sourceMappingURL=commands.js.map