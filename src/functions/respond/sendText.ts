import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$sendText",
    description: "Sends a text to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Content",
            description: "The text content to send.",
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
    async execute(ctx, [content, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras as { ctx: Context, resolve: (data: any) => void }
        resolve(c.text(content, (statusCode || undefined) as any))
        return this.success()
    }
})