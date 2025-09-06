import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$isRequestSecure",
    description: "Checks if the request is secure.",
    unwrap: false,
    output: ArgType.Boolean,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        return this.success(c.req.url.startsWith("https://"))
    }
})