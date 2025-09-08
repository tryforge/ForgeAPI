import { NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$getQueries",
    version: "2.0.0",
    description: "Retrieves all queries.",
    unwrap: false,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        return this.successJSON(c.query)
    }
})