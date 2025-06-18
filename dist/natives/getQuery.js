"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$getQuery",
    description: "Retrieves a query parameter from the request.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The query parameter name.",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        const req = ctx.getEnvironmentKey("req");
        return this.success(req?.query[name] ?? "");
    }
});
//# sourceMappingURL=getQuery.js.map