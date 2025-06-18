"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$sendFile",
    description: "Sends a file to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "File Path",
            description: "The file path to send.",
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
    async execute(ctx, [filePath, statusCode]) {
        const res = ctx.getEnvironmentKey("res");
        if (statusCode)
            res?.status(statusCode);
        res?.sendFile(filePath);
        return this.success();
    }
});
//# sourceMappingURL=sendFile.js.map