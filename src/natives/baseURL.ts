import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Request } from "express"

export default new NativeFunction({
    name: "$baseURL",
    description: "Retrieves the base URL the request.",
    unwrap: false,
    output: ArgType.String,
    async execute(_) {
        const req = _.getEnvironmentKey("req") as Request | undefined
        return this.success(req?.baseUrl ?? "")
    }
})