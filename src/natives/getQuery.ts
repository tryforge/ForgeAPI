import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Request } from "express"

export default new NativeFunction({
    name: "$getQuery",
    description: "Retrieves a query parameter from the request.",
    brackets: true,
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
        const req = ctx.getEnvironmentKey("req") as Request
        return this.success(req?.query[name] ?? "")
    }
})