"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
exports.default = {
    url: '/commands',
    method: "get",
    handler: async function (_, reply) {
        reply.end(JSON.stringify(__1.ForgeAPI.client.commands.toArray().map(s => { return s.data; })));
    }
};
//# sourceMappingURL=commands.js.map