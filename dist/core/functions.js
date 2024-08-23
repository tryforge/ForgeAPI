"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsReply = exports.httpReply = exports.isValidFile = void 0;
const _1 = require(".");
const url = __importStar(require("node:url"));
const logger_1 = require("./logger");
const uuid_1 = require("uuid");
const isValidFile = (file) => file.endsWith('.js');
exports.isValidFile = isValidFile;
function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(/, /)[0];
    }
    return req.socket.remoteAddress || null;
}
const isAuthorized = (req) => {
    const authType = _1.ForgeAPI.authType;
    const auth = _1.ForgeAPI.auth;
    logger_1.Logger.log('DEBUG', `Auth Type: ${authType}`);
    logger_1.Logger.log('DEBUG', `Authorization: ${auth}`);
    logger_1.Logger.log('DEBUG', `Client IP: ${getClientIP(req)}`);
    if (!authType || authType === 'authorization') {
        const authHeader = req.headers.authorization;
        if (authType === 'authorization') {
            if (!authHeader)
                return false;
            // Check for Bearer token format
            const [scheme, token] = authHeader.split(' ');
            if (scheme !== 'Bearer')
                return false;
            // Compare token
            if (typeof auth === 'string' && auth === token)
                return true;
            if (Array.isArray(auth)) {
                return auth.some((validAuth) => validAuth === token);
            }
            return false;
        }
    }
    if (authType === 'ip') {
        const clientIP = getClientIP(req);
        if (!auth)
            return true;
        if (!clientIP)
            return false;
        // Normalize IPv6-mapped IPv4 address
        const normalizedIP = clientIP.startsWith('::ffff:') ? clientIP.substring(7) : clientIP;
        const displayIP = normalizedIP === '::1' || normalizedIP === '127.0.0.1' ? 'localhost' : normalizedIP;
        logger_1.Logger.log('DEBUG', `Normalized IP: ${displayIP}`);
        if (typeof auth === 'string' && (auth === displayIP || auth === clientIP))
            return true;
        if (Array.isArray(auth)) {
            return auth.some((allowedIP) => allowedIP === displayIP || allowedIP === clientIP);
        }
        return false;
    }
    if (authType === 'custom') {
        const [headerName, expectedValue] = auth.split(':').map(s => s.trim());
        if (!headerName || !expectedValue)
            return false;
        const headerValue = req.headers[headerName.toLowerCase()];
        if (typeof headerValue === 'string' && headerValue === expectedValue)
            return true;
        return false;
    }
    logger_1.Logger.log('WARN', `Unsupported authType: ${authType}`);
    return false;
};
const httpReply = (request, reply, data) => {
    const requestId = (0, uuid_1.v4)(); // Generate a unique request ID for each request
    logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] Handling request`);
    const client = _1.ForgeAPI.client;
    const reqURL = request.url;
    if (!reqURL)
        return;
    const path = new URL(reqURL, `http://${request.headers.host}`).pathname;
    const endpoints = data.filter((s) => s.method.toString().toUpperCase().includes(request.method));
    const response = endpoints.find(s => s.url === path);
    const customId = endpoints.find(s => s.url.includes(':') && s.url.split('/').some(segment => path.split('/').includes(segment)));
    if ((response?.auth && !isAuthorized(request)) || (customId?.auth && !isAuthorized(request))) {
        logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] Authorization failed`);
        return reply.end(JSON.stringify({ status: 403, message: 'Access Denied' }));
    }
    const ctx = { client, reply, request };
    if (response) {
        logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] Handling response for ${path}`);
        return response.handler(ctx);
    }
    else if (customId) {
        logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] Handling response for custom ID`);
        return customId.handler(ctx);
    }
    else {
        logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] Endpoint Not Found`);
        return reply.end(JSON.stringify({ status: 404, message: 'Endpoint Not Found' }));
    }
};
exports.httpReply = httpReply;
const wsReply = (ws, request, data) => {
    const requestId = (0, uuid_1.v4)(); // Generate a unique request ID
    logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] Handling WebSocket request`);
    const client = _1.ForgeAPI.client;
    const reqURL = request.url;
    if (!reqURL)
        return;
    const path = url.parse((reqURL?.endsWith('/') ? reqURL.slice(0, -1) : reqURL), true);
    const response = path.pathname == null ? data.find(s => s.url === '/') : data.find(s => s.url === path.pathname);
    const customId = data.filter(s => s.url.includes(':') && s.url.split('/').find(s => path.pathname?.split('/').find(i => s === i))).find(s => path.pathname?.split('/').filter(i => s.url.split('/').indexOf(i)));
    if ((response?.auth && !isAuthorized(request)) || (customId?.auth && !isAuthorized(request))) {
        logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] WebSocket authorization failed`);
        return ws.close(1014, 'Access Forbidden');
    }
    const ctx = { client, ws, request };
    if (response && response.wsHandler) {
        logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] Handling WebSocket response for ${path.pathname}`);
        return response.wsHandler(ctx);
    }
    else if (customId && customId.wsHandler) {
        logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] Handling WebSocket response for custom ID`);
        return customId.wsHandler(ctx);
    }
    else {
        logger_1.Logger.log('DEBUG', `[Request ID: ${requestId}] WebSocket Endpoint Not Found`);
        return ws.send(JSON.stringify({ status: 404, message: 'Endpoint Not Found' }));
    }
};
exports.wsReply = wsReply;
//# sourceMappingURL=functions.js.map