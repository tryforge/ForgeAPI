import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { getCookie } from "hono/cookie"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$getCookie",
    version: "2.0.0",
    description: "Retrieves a cookie.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The name of the cookie.",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        return this.success(getCookie(c, name))
    }
})