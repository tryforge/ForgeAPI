import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$getQuery",
    version: "2.0.0",
    description: "Retrieves a query parameter from the request.",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The query parameter name.",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        if(name) return this.success((c.query as any)[name])
        return this.successJSON(c.query)
    }
})