"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const cookie_1 = require("hono/cookie");
exports.default = new forgescript_1.NativeFunction({
    name: "$getCookies",
    version: "2.0.0",
    description: "Retrieves all cookies.",
    unwrap: false,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras;
        return this.successJSON((0, cookie_1.getCookie)(c));
    }
});
//# sourceMappingURL=getCookies.js.map