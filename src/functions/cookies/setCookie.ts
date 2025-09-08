import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { getCookie, setCookie } from "hono/cookie"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$setCookie",
    version: "2.0.0",
    description: "Sets a cookie.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The name of the cookie.",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "Value",
            description: "The value of the cookie.",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name, value]) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        setCookie(c, name, value)
        return this.success()
    }
})