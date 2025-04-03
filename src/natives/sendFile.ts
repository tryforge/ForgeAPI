import { ArgType, NativeFunction } from "@tryforge/forgescript"
import type { Response } from "express"

export default new NativeFunction({
    name: "$sendFile",
    description: "Sends a file to the response.",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "File Path",
            description: "The file path to send.",
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
    async execute(_, [filePath, statusCode]) {
        const res = _.getEnvironmentKey("res") as Response | undefined
        if (statusCode) res?.status(statusCode);

        res?.sendFile(filePath)

        return this.success()
    }
})