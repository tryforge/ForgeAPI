"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const __1 = require("..");
exports.data = {
    url: '/commands',
    method: "get",
    handler: async function (ctx) {
        ctx.reply.end(JSON.stringify(__1.ForgeAPI.client.commands.toArray().map(s => { return s.data; })));
    },
    wsHandler: async function (ctx) {
        ctx.ws.send(JSON.stringify(__1.ForgeAPI.client.commands.toArray().map(s => { return s.data; })));
        ctx.client.commands.on('update', () => ctx.ws.send(JSON.stringify(__1.ForgeAPI.client.commands.toArray().map(s => { return s.data; }))));
    }
};
//# sourceMappingURL=commands.js.map