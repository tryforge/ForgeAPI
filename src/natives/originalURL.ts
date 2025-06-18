import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Request } from "express"

export default new NativeFunction({
    name: "$originalURL",
    description: "Retrieves the original URL the request.",
    unwrap: false,
    output: ArgType.String,
    async execute(ctx) {
        const req = ctx.getEnvironmentKey("req") as Request
        return this.success(req?.originalUrl ?? "")
    }
})