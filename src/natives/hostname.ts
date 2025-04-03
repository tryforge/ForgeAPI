import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Request } from "express"

export default new NativeFunction({
    name: "$hostname",
    description: "Retrieves the hostname.",
    unwrap: false,
    output: ArgType.String,
    async execute(_) {
        const req = _.getEnvironmentKey("req") as Request | undefined
        return this.success(req?.hostname ?? "")
    }
})