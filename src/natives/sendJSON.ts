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
        },
        {
            name: "Status Code",
            description: "The status code of the response.",
            type: ArgType.Number,
            required: false,
            rest: false
        }
    ],
    async execute(ctx, [data, statusCode]) {
        const res = ctx.getEnvironmentKey("res") as Response
        if (statusCode) res?.status(statusCode);

        res?.send(data)

        return this.success()
    }
})