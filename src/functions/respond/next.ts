import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Next } from "hono/types"

export default new NativeFunction({
    name: "$next",
    version: "2.0.0",
    description: "Calls the next middleware.",
    unwrap: false,
    output: ArgType.String,
    async execute(ctx) {
        const { next, resolve } = ctx.runtime.extras as { next: Next, resolve: (data: any) => void }
        resolve(next())
        return this.success()
    }
})