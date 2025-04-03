import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Request } from "express"

export default new NativeFunction({
    name: "$getHeader",
    description: "Retrieves a header from the request.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Name",
            description: "The header name.",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(_, [name]) {
        const req = _.getEnvironmentKey("req") as Request | undefined
        return this.success(req?.headers[name.toLowerCase()] ?? "")
    }
})