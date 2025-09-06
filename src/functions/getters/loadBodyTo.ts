import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"

export default new NativeFunction({
    name: "$loadBodyTo",
    description: "Loads the request body to an environment variable.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The environment variable name to load the body to.",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        const body = await c.req.parseBody().catch(() => null)
        if (!body) return this.customError("No body found in the request.");

        ctx.setEnvironmentKey(name, body)

        return this.success()
    }
})