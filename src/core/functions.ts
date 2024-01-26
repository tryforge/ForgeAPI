import { ForgeAPI, HTTPMethods, RouteOptions } from ".";
import { IncomingMessage, ServerResponse } from "http";
import * as url from 'node:url';

export const isValidFile = (file: string) => file.endsWith('.js')

const isAuthorized = (req: IncomingMessage) => {
    const auth = ForgeAPI.auth
    if(!auth) return true;
    if(!req.headers.authorization) return false;
    if(typeof auth == 'string' && auth == req.headers.authorization) return true;
    if(Array.isArray(auth)) return auth.some(s=> s == req.headers.authorization)
}

export const httpReply = (request: IncomingMessage, reply: ServerResponse, data: RouteOptions[]) => {
    const client = ForgeAPI.client
    const reqURL = request.url 
    if(!reqURL) return;
    const path = url.parse((reqURL?.endsWith('/') ? reqURL?.slice(0, -1) : reqURL), true)
    const endpoints = data.filter((s:RouteOptions) => s.method.toString().toUpperCase().includes(request.method as HTTPMethods)) as RouteOptions[]
    const response = endpoints.find(s => s.url == path.pathname)
    const customId = endpoints.filter(s => s.url.includes(':') && s.url.split('/').find(s => path.pathname?.split('/').find(i => s == i))).find(s => path.pathname?.split('/').filter(i => s.url.split('/').indexOf(i)))
    if(response?.auth && !isAuthorized(request) || customId?.auth && !isAuthorized(request)) return reply.end(JSON.stringify({ status: 403, message: 'Access Forbitten'}));
    const ctx = {client, reply, request}
    if(response) return response.handler(ctx)
    else if(customId) return customId.handler(ctx)
    else reply.end(JSON.stringify({status: 404, message: 'Endpoint Not Found'}));
}

export const wsReply = (ws: WebSocket, request: IncomingMessage, data: RouteOptions[]) => {
    const client = ForgeAPI.client
    const reqURL = request.url 
    if(!reqURL) return;
    const path = url.parse((reqURL?.endsWith('/') ? reqURL.slice(0, -1) : reqURL), true)
    const response = data.find(s => s.url == path.pathname)
    const customId = data.filter(s => s.url.includes(':') && s.url.split('/').find(s => path.pathname?.split('/').find(i => s == i))).find(s => path.pathname?.split('/').filter(i => s.url.split('/').indexOf(i)))
    if(response?.auth && !isAuthorized(request) || customId?.auth && !isAuthorized(request)) return ws.close(1014, 'Access Forbitten');
    const ctx = {client, ws ,request}
    if(response && response.wsHandler) return response.wsHandler(ctx)
    else if(customId && customId.wsHandler) return customId.wsHandler(ctx)
    else return ws.send(JSON.stringify({status: 404, message: 'Endpoint Not Found'}));
}