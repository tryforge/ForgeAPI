"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$getQuery",
    description: "Retrieves a query parameter from the request.",
    brackets: false,
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
        const { ctx: c } = ctx.runtime.extras;
        if (name)
            return this.success(c.query[name]);
        return this.successJSON(c.query);
    }
});
//# sourceMappingURL=getQuery.js.map