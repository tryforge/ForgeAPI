import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"
import { readFile } from "fs/promises"
import { extname } from "path"
import { Readable } from "stream"
import { createReadStream } from "fs"

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
    async execute(ctx, [filePath, statusCode]) {
        const { ctx: c, resolve } = ctx.runtime.extras as { ctx: Context, resolve: (data: any) => void }
        const file = createReadStream(filePath)
        const stream = Readable.toWeb(file) as ReadableStream
        resolve(c.body(stream, (statusCode || undefined) as any))

        return this.success()
    }
})