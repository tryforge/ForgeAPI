import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$sendHTML",
    version: "2.0.0",
    description: "Sends an HTML to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "html",
            description: "The HTML content to send.",
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
    async execute(ctx, [html, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras as { ctx: Context, resolve: (data: any) => void }
        resolve(c.html(html, (statusCode || undefined) as any))
        return this.success()
    }
})