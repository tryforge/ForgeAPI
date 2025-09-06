import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$getHeader",
    version: "2.0.0",
    description: "Retrieves a header from the request.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The header name.",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        return this.success(c.req.header(name))
    }
})