const { ForgeClient, LogPriority } = require('@tryforge/forgescript')
const { AuthType, ForgeAPI } = require('../dist')

process.loadEnvFile()

const api = new ForgeAPI({
    auth: {
        type: AuthType.Min,
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

client.login(process.env.TOKEN)