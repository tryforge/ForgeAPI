"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const url = __importStar(require("node:url"));
exports.default = {
    url: '/:guildID/leave',
    method: "post",
    handler: async function (ctx) {
        if (!ctx.request.url)
            return ctx.reply.end(JSON.stringify({ message: "An error occured" }));
        ;
        const guildId = url.parse(ctx.request.url).pathname?.split('/')[1];
        const server = ctx.client.guilds.cache.get(guildId ?? '');
        if (!server)
            return ctx.reply.end(JSON.stringify({ message: "Invalid Server" }));
        ctx.reply.end(JSON.stringify({ message: `Successfully left ${server.name}` }));
        server.leave();
    }
};
//# sourceMappingURL=leaveGuild.js.map