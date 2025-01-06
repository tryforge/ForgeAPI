import { ForgeAPIEventHandler } from "../classes/handlers/ForgeAPIEventHandler"
import { ForgeAPI } from "../classes/structures/ForgeAPI"
import { Interpreter } from "@tryforge/forgescript"

export default new ForgeAPIEventHandler({
    name: "request",
    description: "Fired when a request is made to the API.",
    listener(req) {
        const commands = this.getExtension(ForgeAPI, true).commands.get("request") ?? []
        if (commands.length === 0) return;

        for (const command of commands) {
            Interpreter.run({
                obj: {},
                client: this,
                data: command.compiled.code,
                command,
                environment: { req }
            })
        }
    }
})