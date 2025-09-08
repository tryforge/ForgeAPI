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
        },
        {
            name: "Max Age (ms)",
            description: "How long the cookie should last (milliseconds)",
            type: ArgType.Number,
            required: false,
            rest: false
        },
        {
            name: "Path",
            description: "The path the cookie is scoped to.",
            type: ArgType.String,
            required: false,
            rest: false
        }
    ],
    async execute(ctx, [name, value, maxAge, path]) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }

        const options: any = {}
        if (typeof maxAge === "number") options.maxAge = maxAge
        if (typeof path === "string") options.path = path

        setCookie(c, name, value, options)
        return this.success()
    }
})