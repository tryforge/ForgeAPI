import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core";

export default new NativeFunction({
    name: "$sendJSON",
    version: "2.0.0",
    description: "Sends a JSON to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "JSON",
            description: "The JSON structure to send.",
            type: ArgType.Json,
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
    async execute(ctx, [data, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras as { ctx: Context, resolve: (data: any) => void }
        resolve(c.json(data, (statusCode || undefined) as any))
        return this.success()
    }
})