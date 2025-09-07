"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$loadBodyTo",
    version: "2.0.0",
    description: "Loads the request body to an environment variable.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The environment variable name to load the body to.",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        const { ctx: c } = ctx.runtime.extras;
        const body = await c.req.parseBody().catch(() => null);
        if (!body)
            return this.customError("No body found in the request.");
        ctx.setEnvironmentKey(name, body);
        return this.success();
    }
});
//# sourceMappingURL=loadBodyTo.js.map