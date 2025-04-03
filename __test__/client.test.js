const { ForgeClient, LogPriority } = require('@tryforge/forgescript')
const { AuthType, ForgeAPI } = require('../dist')

process.loadEnvFile()

const api = new ForgeAPI({
    auth: {
        type: AuthType.None,
        code: process.env.API_CODE,
        bearer: true
    },
    logLevel: LogPriority.High,
    port: parseInt(process.env.API_PORT)
})

const client = new ForgeClient({
    extensions: [api],
    events: [
        'messageCreate'
    ],
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent'
    ],
    prefixes: ['.']
})

api.load(process.cwd() + '/__test__/routes')

client.commands.add({
    name: 'ping',
    type: 'messageCreate',
    code: '$pingms'
})

api.addWebsocketListener({
    name: 'message',
    code: '$log[Websocket message received!]'
})

api.ws.on('connection', function(d) {
    d.send('Hello!')
})

client.login(process.env.TOKEN)