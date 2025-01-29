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
    async execute(_, [name]) {
        const req = _.getEnvironmentKey("req") as Request | undefined
        if (!req?.body) return this.customError("No body found in the request.");

        _.setEnvironmentKey(name, req.body)

        return this.success()
    }
})