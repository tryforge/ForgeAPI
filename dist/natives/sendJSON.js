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
        }
    ],
    async execute(_, [data]) {
        const res = _.getEnvironmentKey("res");
        res?.send(data);
        return this.success();
    }
});
//# sourceMappingURL=sendJSON.js.map