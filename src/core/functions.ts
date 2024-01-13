import { IncomingMessage, ServerResponse } from "http";
import * as url from 'node:url';
import { ForgeAPI, HTTPMethods } from ".";
import { RouteOptions } from ".";

export const isValidFile = (file: string) => file.endsWith('.js')

export const httpReply = (request: IncomingMessage, reply: ServerResponse, data: RouteOptions[]) => {
    const client = ForgeAPI.client
    const reqURL = request.url 
    if(!reqURL) return;
    const path = url.parse((reqURL?.endsWith('/') ? reqURL?.slice(0, -1) : reqURL), true)
    const endpoints = data.filter((s:RouteOptions) => s.method.toString().toUpperCase().includes(request.method as HTTPMethods)) as RouteOptions[]
    const response = endpoints.find(s => s.url == path.pathname)
    const customId = endpoints.filter(s => s.url.includes(':') && s.url.split('/').find(s => path.pathname?.split('/').find(i => s == i))).find(s => path.pathname?.split('/').filter(i => s.url.split('/').indexOf(i)))
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
    const ctx = {client, ws ,request}
    if(response && response.wsHandler) return response.wsHandler(ctx)
    else if(customId && customId.wsHandler) return customId.wsHandler(ctx)
    else return ws.send(JSON.stringify({status: 404, message: 'Endpoint Not Found'}));
}