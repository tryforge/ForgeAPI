import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Request } from "express"

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
        const req = ctx.getEnvironmentKey("req") as Request
        if (!req?.body) return this.customError("No body found in the request.");

        ctx.setEnvironmentKey(name, req.body)

        return this.success()
    }
})