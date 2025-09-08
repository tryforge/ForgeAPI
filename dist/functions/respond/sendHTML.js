"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$sendHTML",
    version: "2.0.0",
    description: "Sends an HTML to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "html",
            description: "The HTML content to send.",
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
    async execute(ctx, [html, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras;
        resolve(c.html(html, (statusCode || undefined)));
        return this.success();
    }
});
//# sourceMappingURL=sendHTML.js.map