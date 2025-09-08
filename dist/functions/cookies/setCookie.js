"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const cookie_1 = require("hono/cookie");
exports.default = new forgescript_1.NativeFunction({
    name: "$setCookie",
    version: "2.0.0",
    description: "Sets a cookie.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The name of the cookie.",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "Value",
            description: "The value of the cookie.",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name, value]) {
        const { ctx: c } = ctx.runtime.extras;
        (0, cookie_1.setCookie)(c, name, value);
        return this.success();
    }
});
//# sourceMappingURL=setCookie.js.map