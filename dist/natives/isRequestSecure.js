"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$isRequestSecure",
    description: "Checks if the request is secure.",
    unwrap: false,
    output: forgescript_1.ArgType.Boolean,
    async execute(_) {
        const req = _.getEnvironmentKey("req");
        return this.success(req?.secure ?? false);
    }
});
//# sourceMappingURL=isRequestSecure.js.map