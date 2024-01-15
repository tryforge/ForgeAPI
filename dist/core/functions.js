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
const isValidFile = (file) => file.endsWith('.js');
exports.isValidFile = isValidFile;
const isAuthorized = (req) => {
    const auth = _1.ForgeAPI.auth;
    if (!auth)
        return true;
    if (!req.headers.authorization)
        return false;
    if (typeof auth == 'string' && auth == req.headers.authorization)
        return true;
    if (Array.isArray(auth))
        return auth.some(s => s == req.headers.authorization);
};
const httpReply = (request, reply, data) => {
    console.log(isAuthorized(request));
    const client = _1.ForgeAPI.client;
    const reqURL = request.url;
    if (!reqURL)
        return;
    const path = url.parse((reqURL?.endsWith('/') ? reqURL?.slice(0, -1) : reqURL), true);
    const endpoints = data.filter((s) => s.method.toString().toUpperCase().includes(request.method));
    const response = endpoints.find(s => s.url == path.pathname);
    const customId = endpoints.filter(s => s.url.includes(':') && s.url.split('/').find(s => path.pathname?.split('/').find(i => s == i))).find(s => path.pathname?.split('/').filter(i => s.url.split('/').indexOf(i)));
    if (response?.auth && !isAuthorized(request) || customId?.auth && !isAuthorized(request))
        return reply.end(JSON.stringify({ status: 403, message: 'Access Forbitten' }));
    const ctx = { client, reply, request };
    if (response)
        return response.handler(ctx);
    else if (customId)
        return customId.handler(ctx);
    else
        reply.end(JSON.stringify({ status: 404, message: 'Endpoint Not Found' }));
};
exports.httpReply = httpReply;
const wsReply = (ws, request, data) => {
    const client = _1.ForgeAPI.client;
    const reqURL = request.url;
    if (!reqURL)
        return;
    const path = url.parse((reqURL?.endsWith('/') ? reqURL.slice(0, -1) : reqURL), true);
    const response = data.find(s => s.url == path.pathname);
    const customId = data.filter(s => s.url.includes(':') && s.url.split('/').find(s => path.pathname?.split('/').find(i => s == i))).find(s => path.pathname?.split('/').filter(i => s.url.split('/').indexOf(i)));
    if (response?.auth && !isAuthorized(request) || customId?.auth && !isAuthorized(request))
        return ws.close(1014, 'Access Forbitten');
    const ctx = { client, ws, request };
    if (response && response.wsHandler)
        return response.wsHandler(ctx);
    else if (customId && customId.wsHandler)
        return customId.wsHandler(ctx);
    else
        return ws.send(JSON.stringify({ status: 404, message: 'Endpoint Not Found' }));
};
exports.wsReply = wsReply;
//# sourceMappingURL=functions.js.map