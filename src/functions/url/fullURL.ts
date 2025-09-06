import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$fullURL",
    version: "2.0.0",
    description: "Retrieves the full URL the request.",
    unwrap: false,
    output: ArgType.String,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        return this.success(c.req.url)
    }
})