import { ForgeAPI, HTTPMethods, RouteOptions } from ".";
import { IncomingMessage, ServerResponse } from "http";
import * as url from 'node:url';
import { Logger } from './logger';
import { v4 as uuidv4 } from 'uuid';

export const isValidFile = (file: string) => file.endsWith('.js')

function getClientIP(req: IncomingMessage): string | null {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(/, /)[0];
    }
    return req.socket.remoteAddress || null;
}

const isAuthorized = (req: IncomingMessage): boolean => {
    const authType = ForgeAPI.authType;
    const auth = ForgeAPI.auth;

    Logger.log(
        'DEBUG',
        `Auth Type: ${authType}`
    );
    Logger.log(
        'DEBUG',
        `Authorization: ${auth}`
    );
    Logger.log(
        'DEBUG',
        `Client IP: ${getClientIP(req)}`
    );

    if (!authType || authType === 'authorization') {
        const authHeader = req.headers.authorization;
        if (authType === 'authorization') {
            if (!authHeader) return false;

            // Check for Bearer token format
            const [scheme, token] = (authHeader as string).split(' ');
            if (scheme !== 'Bearer') return false;

            // Compare token
            if (typeof auth === 'string' && auth === token) return true;
            if (Array.isArray(auth)) {
                return auth.some((validAuth) => validAuth === token);
            }
            return false;
        }
    }

    if (authType === 'ip') {
        const clientIP = getClientIP(req);
        if (!auth) return true;
        if (!clientIP) return false;

        // Normalize IPv6-mapped IPv4 address
        const normalizedIP = clientIP.startsWith('::ffff:') ? clientIP.substring(7) : clientIP;
        const displayIP = normalizedIP === '::1' || normalizedIP === '127.0.0.1' ? 'localhost' : normalizedIP;

        Logger.log(
            'DEBUG',
            `Normalized IP: ${displayIP}`
        );

        if (typeof auth === 'string' && (auth === displayIP || auth === clientIP)) return true;
        if (Array.isArray(auth)) {
            return auth.some((allowedIP) => allowedIP === displayIP || allowedIP === clientIP);
        }
        return false;
    }

    if (authType === 'custom') {
        const [headerName, expectedValue] = (auth as string).split(':').map(s => s.trim());
        if (!headerName || !expectedValue) return false;

        const headerValue = req.headers[headerName.toLowerCase()];
        if (typeof headerValue === 'string' && headerValue === expectedValue) return true;

        return false;
    }

    Logger.log(
        'WARN',
        `Unsupported authType: ${authType}`
    );
    return false;
};


export const httpReply = (request: IncomingMessage, reply: ServerResponse, data: RouteOptions[]) => {
    const requestId = uuidv4(); // Generate a unique request ID for each request
    Logger.log(
        'DEBUG',
        `[Request ID: ${requestId}] Handling request`
    );

    const client = ForgeAPI.client;
    const reqURL = request.url;
    if (!reqURL) return;

    const path = new URL(reqURL, `http://${request.headers.host}`).pathname;

    const endpoints = data.filter((s: RouteOptions) => s.method.toString().toUpperCase().includes(request.method as HTTPMethods)) as RouteOptions[];

    const response = endpoints.find(s => s.url === path);
    const customId = endpoints.find(s => s.url.includes(':') && s.url.split('/').some(segment => path.split('/').includes(segment)));

    if ((response?.auth && !isAuthorized(request)) || (customId?.auth && !isAuthorized(request))) {
        Logger.log(
            'DEBUG',
            `[Request ID: ${requestId}] Authorization failed`
        );
        return reply.end(JSON.stringify({ status: 403, message: 'Access Denied' }));
    }

    const ctx = { client, reply, request };
    if (response) {
        Logger.log(
            'DEBUG',
            `[Request ID: ${requestId}] Handling response for ${path}`
        );
        return response.handler(ctx);
    } else if (customId) {
        Logger.log(
            'DEBUG',
            `[Request ID: ${requestId}] Handling response for custom ID`
        );
        return customId.handler(ctx);
    } else {
        Logger.log(
            'DEBUG',
            `[Request ID: ${requestId}] Endpoint Not Found`
        );
        return reply.end(JSON.stringify({ status: 404, message: 'Endpoint Not Found' }));
    }
};


export const wsReply = (ws: WebSocket, request: IncomingMessage, data: RouteOptions[]) => {
    const requestId = uuidv4(); // Generate a unique request ID
    Logger.log(
        'DEBUG',
        `[Request ID: ${requestId}] Handling WebSocket request`
    );

    const client = ForgeAPI.client;
    const reqURL = request.url;
    if (!reqURL) return;

    const path = url.parse((reqURL?.endsWith('/') ? reqURL.slice(0, -1) : reqURL), true);
    const response = path.pathname == null ? data.find(s => s.url === '/') : data.find(s => s.url === path.pathname);
    const customId = data.filter(s => s.url.includes(':') && s.url.split('/').find(s => path.pathname?.split('/').find(i => s === i))).find(s => path.pathname?.split('/').filter(i => s.url.split('/').indexOf(i)));

    if ((response?.auth && !isAuthorized(request)) || (customId?.auth && !isAuthorized(request))) {
        Logger.log(
            'DEBUG',
            `[Request ID: ${requestId}] WebSocket authorization failed`
        );
        return ws.close(1014, 'Access Forbidden');
    }

    const ctx = { client, ws, request };
    if (response && response.wsHandler) {
        Logger.log(
            'DEBUG',
            `[Request ID: ${requestId}] Handling WebSocket response for ${path.pathname}`
        );
        return response.wsHandler(ctx);
    } else if (customId && customId.wsHandler) {
        Logger.log(
            'DEBUG',
            `[Request ID: ${requestId}] Handling WebSocket response for custom ID`
        );
        return customId.wsHandler(ctx);
    } else {
        Logger.log(
            'DEBUG',
            `[Request ID: ${requestId}] WebSocket Endpoint Not Found`
        );
        return ws.send(JSON.stringify({ status: 404, message: 'Endpoint Not Found' }));
    }
};
