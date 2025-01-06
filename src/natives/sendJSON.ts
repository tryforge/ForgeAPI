import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Response } from "express"

export default new NativeFunction({
    name: "$sendJSON",
    description: "Sends a JSON to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "JSON",
            description: "The JSON structure to send.",
            type: ArgType.Json,
            required: true,
            rest: false
        }
    ],
    async execute(_, [data]) {
        const res = _.getEnvironmentKey("res") as Response | undefined
        res?.send(data)

        return this.success()
    }
})