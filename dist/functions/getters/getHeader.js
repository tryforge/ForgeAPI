"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$getHeader",
    version: "2.0.0",
    description: "Retrieves a header from the request.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The header name.",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        const { ctx: c } = ctx.runtime.extras;
        return this.success(c.req.header(name));
    }
});
//# sourceMappingURL=getHeader.js.map