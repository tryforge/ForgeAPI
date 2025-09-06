import { ArgType, NativeFunction } from "@tryforge/forgescript"
import { Context } from "../../core"
import { getConnInfo } from "@hono/node-server/conninfo"

export default new NativeFunction({
    name: "$ip",
    version: "2.0.0",
    description: "Retrieves the remote address of the request.",
    unwrap: false,
    output: ArgType.String,
    async execute(ctx) {
        const { ctx: c } = ctx.runtime.extras as { ctx: Context }
        const info = getConnInfo(c)
        return this.success(info.remote.address)
    }
})