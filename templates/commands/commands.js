module.exports = {
  url: '/commands',
  method: "get",
  auth: true,
  handler: async function (ctx) {
    const commandsArray = ctx.client.commands.toArray().map(s => s.data);
    const messageCommands = commandsArray.filter(command => command.type === "messageCreate");
    const messageCommandsCount = messageCommands.length;
    const interactonCommand = commandsArray.filter(command => command.type === "interactionCreate");
    const interactonCommandCount = interactonCommand.length;
    const otherCommands = commandsArray.filter(command => command.type !== "messageCreate" && command.type !== "interactionCreate");
    const otherCommandsCount = otherCommands.length;

    ctx.res.send(`
{
  "messageCommands": {
    "list": ${JSON.stringify(messageCommands, null, 2)},
    "paths": "${ctx.client.commands.paths}",
    "amount": "${messageCommandsCount}"
  },
  "interactons": {
    "list": ${JSON.stringify(interactonCommand, null, 2)},
    "paths": "${ctx.client.applicationCommands.path}",
    "amount": "${interactonCommandCount}"
  },
  "other": {
    "list": ${JSON.stringify(otherCommands, null, 2)},
    "amount": "${otherCommandsCount}"
  }
}
    `);
  },
}