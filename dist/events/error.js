"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ForgeAPIEventHandler_1 = require("../classes/handlers/ForgeAPIEventHandler");
const forgescript_1 = require("@tryforge/forgescript");
const ForgeAPI_1 = require("../classes/structures/ForgeAPI");
exports.default = new ForgeAPIEventHandler_1.ForgeAPIEventHandler({
    name: "error",
    description: "Fired when something goes wrong with the API.",
    listener(error) {
        const commands = this.getExtension(ForgeAPI_1.ForgeAPI, true).commands.get("error") ?? [];
        if (commands.length === 0)
            return;
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                obj: {},
                client: this,
                data: command.compiled.code,
                command,
                environment: { error }
            });
        }
    }
});
//# sourceMappingURL=error.js.map