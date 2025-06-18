import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Request } from "express"

export default new NativeFunction({
    name: "$url",
    description: "Retrieves the URL the request.",
    unwrap: false,
    output: ArgType.String,
    async execute(ctx) {
        const req = ctx.getEnvironmentKey("req") as Request
        return this.success(req?.url ?? "")
    }
})