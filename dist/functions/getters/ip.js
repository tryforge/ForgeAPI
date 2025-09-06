"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const conninfo_1 = require("@hono/node-server/conninfo");
exports.default = new forgescript_1.NativeFunction({
    name: "$ip",
    description: "Retrieves the remote address of the request.",
    unwrap: false,
    output: forgescript_1.ArgType.String,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras;
        const info = (0, conninfo_1.getConnInfo)(c);
        return this.success(info.remote.address);
    }
});
//# sourceMappingURL=ip.js.map