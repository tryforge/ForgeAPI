import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Request } from "express"

export default new NativeFunction({
    name: "$isRequestSecure",
    description: "Checks if the request is secure.",
    unwrap: false,
    output: ArgType.Boolean,
    async execute(ctx) {
        const req = ctx.getEnvironmentKey("req") as Request
        return this.success(req?.secure ?? false)
    }
})