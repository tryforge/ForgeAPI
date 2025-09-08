"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const cookie_1 = require("hono/cookie");
exports.default = new forgescript_1.NativeFunction({
    name: "$deleteCookie",
    version: "2.0.0",
    description: "Deletes a cookie.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The name of the cookie.",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        const { ctx: c } = ctx.runtime.extras;
        (0, cookie_1.deleteCookie)(c, name);
        return this.success();
    }
});
//# sourceMappingURL=deleteCookie.js.map