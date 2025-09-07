"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$fullURL",
    version: "2.0.0",
    description: "Retrieves the full URL the request.",
    unwrap: false,
    output: forgescript_1.ArgType.String,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras;
        return this.success(c.req.url);
    }
});
//# sourceMappingURL=fullURL.js.map