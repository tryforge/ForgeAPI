import { ForgeAPIEventHandler } from "@handlers/ForgeAPIEventHandler"
import { Interpreter } from "@tryforge/forgescript"
import { ForgeAPI } from "@structures/ForgeAPI"

export default new ForgeAPIEventHandler({
    name: "error",
    description: "Fired when something goes wrong with the API.",
    listener(error) {
        const commands = this.getExtension(ForgeAPI, true).commands.get("error") ?? []
        if (commands.length === 0) return;

        for (const command of commands) {
            Interpreter.run({
                obj: {},
                client: this,
                data: command.compiled.code,
                command,
                environment: { error }
            })
        }
    }
})