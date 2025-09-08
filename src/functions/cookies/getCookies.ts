import { NativeFunction } from "@tryforge/forgescript"
import { getCookie } from "hono/cookie"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$getCookies",
    version: "2.0.0",
    description: "Retrieves all cookies.",
    unwrap: false,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        return this.successJSON(getCookie(c))
    }
})