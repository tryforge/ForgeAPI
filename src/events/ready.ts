import { ForgeAPIEventHandler } from "../classes/handlers/ForgeAPIEventHandler"
import { ForgeAPI } from "../classes/structures/ForgeAPI"
import { Interpreter } from "@tryforge/forgescript"

export default new ForgeAPIEventHandler({
    name: "ready",
    description: "Fired when ForgeAPI is ready.",
    listener() {
        const commands = this.getExtension(ForgeAPI, true).commands.get("ready") ?? []
        if (commands.length === 0) return;

        for (const command of commands) {
            Interpreter.run({
                obj: {},
                client: this,
                data: command.compiled.code,
                command
            })
        }
    }
})