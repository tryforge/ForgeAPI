import { RouteOptions, ForgeAPI } from "..";

export const data = {
    url: '/commands',
    method: "get",
    auth: true,
    handler: async function (ctx) {
        if (ctx.request.method !== 'GET') {
            ctx.reply.writeHead(405, { 'Content-Type': 'application/json' });
            ctx.reply.end(JSON.stringify({ status: 405, message: 'Method Not Allowed' }));
            return;
        }

        ctx.reply.end(JSON.stringify(ForgeAPI.client.commands.toArray().map(s => { return s.data; })));
    },
    wsHandler: async function(ctx) {
        ctx.ws.send(JSON.stringify(ForgeAPI.client.commands.toArray().map(s => { return s.data; })));
        ctx.client.commands.on('update', () => ctx.ws.send(JSON.stringify(ForgeAPI.client.commands.toArray().map(s => { return s.data; }))));
    }
} as RouteOptions