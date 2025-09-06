"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$sendJSON",
    description: "Sends a JSON to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "JSON",
            description: "The JSON structure to send.",
            type: forgescript_1.ArgType.Json,
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
    async execute(ctx, [data, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras;
        resolve(c.json(data, (statusCode || undefined)));
        return this.success();
    }
});
//# sourceMappingURL=sendJSON.js.map