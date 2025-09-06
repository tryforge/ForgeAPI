import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$url",
    description: "Retrieves the URL the request.",
    unwrap: false,
    output: ArgType.String,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        return this.success(c.req.path)
    }
})