"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$getQueries",
    version: "2.0.0",
    description: "Retrieves all queries.",
    unwrap: false,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras;
        return this.successJSON(c.query);
    }
});
//# sourceMappingURL=getQueries.js.map