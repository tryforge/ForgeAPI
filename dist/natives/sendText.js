"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$sendText",
    description: "Sends a text to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Content",
            description: "The text content to send.",
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
    async execute(_, [content, statusCode]) {
        const res = _.getEnvironmentKey("res");
        if (statusCode)
            res?.status(statusCode);
        res?.send(content);
        return this.success();
    }
});
//# sourceMappingURL=sendText.js.map