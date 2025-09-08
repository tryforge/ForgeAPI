"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$redirect",
    version: "2.0.0",
    description: "Redirects the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "URL",
            description: "The URL to redirect to.",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "Status Code",
            description: "The status code of the response.",
            type: forgescript_1.ArgType.Number,
            required: false,
            rest: false
        }
    ],
    async execute(ctx, [url, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras;
        resolve(c.redirect(url, (statusCode || undefined)));
        return this.success();
    }
});
//# sourceMappingURL=redirect.js.map