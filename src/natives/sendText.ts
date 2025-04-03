import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Response } from "express"

export default new NativeFunction({
    name: "$sendText",
    description: "Sends a text to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "Content",
            description: "The text content to send.",
            type: ArgType.String,
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
    async execute(_, [content, statusCode]) {
        const res = _.getEnvironmentKey("res") as Response | undefined
        if (statusCode) res?.status(statusCode);

        res?.send(content)

        return this.success()
    }
})