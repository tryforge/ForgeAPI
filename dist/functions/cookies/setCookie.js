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
        },
        {
            name: "Max Age (ms)",
            description: "How long the cookie should last (milliseconds)",
            type: forgescript_1.ArgType.Number,
            required: false,
            rest: false
        },
        {
            name: "Path",
            description: "The path the cookie is scoped to.",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false
        }
    ],
    async execute(ctx, [name, value, maxAge, path]) {
        const { ctx: c } = ctx.runtime.extras;
        const options = {};
        if (typeof maxAge === "number")
            options.maxAge = maxAge;
        if (typeof path === "string")
            options.path = path;
        (0, cookie_1.setCookie)(c, name, value, options);
        return this.success();
    }
});
//# sourceMappingURL=setCookie.js.map