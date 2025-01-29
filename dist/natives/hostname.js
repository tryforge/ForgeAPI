"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$hostname",
    description: "Retrieves the hostname.",
    unwrap: false,
    output: forgescript_1.ArgType.String,
    async execute(_) {
        const req = _.getEnvironmentKey("req");
        return this.success(req?.hostname ?? "");
    }
});
//# sourceMappingURL=hostname.js.map