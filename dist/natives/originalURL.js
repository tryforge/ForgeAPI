"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$originalURL",
    description: "Retrieves the original URL the request.",
    unwrap: false,
    output: forgescript_1.ArgType.String,
    async execute(ctx) {
        const req = ctx.getEnvironmentKey("req");
        return this.success(req?.originalUrl ?? "");
    }
});
//# sourceMappingURL=originalURL.js.map