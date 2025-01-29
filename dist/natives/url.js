"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$url",
    description: "Retrieves the URL the request.",
    unwrap: false,
    output: forgescript_1.ArgType.String,
    async execute(_) {
        const req = _.getEnvironmentKey("req");
        return this.success(req?.url ?? "");
    }
});
//# sourceMappingURL=url.js.map