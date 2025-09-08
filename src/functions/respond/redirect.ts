import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$redirect",
    version: "2.0.0",
    description: "Redirects the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "URL",
            description: "The URL to redirect to.",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "Status Code",
            description: "The status code of the response.",
            type: ArgType.Number,
            required: false,
            rest: false
        }
    ],
    async execute(ctx, [url, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras as { ctx: Context, resolve: (data: any) => void }
        resolve(c.redirect(url, (statusCode || undefined) as any))
        return this.success()
    }
})