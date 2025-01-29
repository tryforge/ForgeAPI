import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Request } from "express"

export default new NativeFunction({
    name: "$isRequestSecure",
    description: "Checks if the request is secure.",
    unwrap: false,
    output: ArgType.Boolean,
    async execute(_) {
        const req = _.getEnvironmentKey("req") as Request | undefined
        return this.success(req?.secure ?? false)
    }
})