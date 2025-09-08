import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { deleteCookie } from "hono/cookie"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$deleteCookie",
    version: "2.0.0",
    description: "Deletes a cookie.",
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
        deleteCookie(c, name)
        return this.success()
    }
})