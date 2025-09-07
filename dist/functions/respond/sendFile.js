"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const stream_1 = require("stream");
const fs_1 = require("fs");
exports.default = new forgescript_1.NativeFunction({
    name: "$sendFile",
    version: "2.0.0",
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
        const { ctx: c, resolve } = ctx.runtime.extras;
        const file = (0, fs_1.createReadStream)(filePath);
        const stream = stream_1.Readable.toWeb(file);
        resolve(c.body(stream, (statusCode || undefined)));
        return this.success();
    }
});
//# sourceMappingURL=sendFile.js.map