"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$next",
    version: "2.0.0",
    description: "Calls the next middleware.",
    unwrap: false,
    output: forgescript_1.ArgType.String,
    async execute(ctx) {
        const { next, resolve } = ctx.runtime.extras;
        resolve(next());
        return this.success();
    }
});
//# sourceMappingURL=next.js.map