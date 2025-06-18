"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$getHeader",
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
        const req = ctx.getEnvironmentKey("req");
        return this.success(req?.headers[name.toLowerCase()] ?? "");
    }
});
//# sourceMappingURL=getHeader.js.map