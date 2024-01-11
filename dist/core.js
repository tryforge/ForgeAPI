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
exports.APICore = void 0;
const node_http_1 = require("node:http");
const url = __importStar(require("node:url"));
const fs = __importStar(require("fs"));
const node_path_1 = require("node:path");
const ws_1 = require("ws");
const isValidFile = (file) => file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts'));
class APICore {
    data = [];
    static server;
    static wss;
    constructor(port) {
        const httpReply = (request, reply) => {
            const path = url.parse(request.url ?? '/404', true);
            const method = request.method;
            const response = this.data.find(s => s.url == path.pathname && s.method.toString().toUpperCase().includes(method));
            if (!response)
                reply.end(JSON.stringify({ status: 404, message: 'Endpoint Not Found' }));
            else
                return response.handler(request, reply);
        };
        const wsReply = (ws, request) => {
            const path = url.parse(request.url ?? '/404', true);
            const response = this.data.find(s => s.url == path.pathname);
            if (!response || !response?.wsHandler)
                ws.send('Invalid Endpoint');
            else
                return response.wsHandler(ws, request);
        };
        const server = (0, node_http_1.createServer)(httpReply);
        const wss = new ws_1.WebSocketServer({ server: server });
        wss.on('connection', wsReply);
        APICore.server = server;
        APICore.wss = wss;
        server.listen(port);
    }
    async load(dir) {
        const root = __dirname, files = fs.readdirSync((0, node_path_1.join)(root, dir));
        for (const file of files) {
            const stat = fs.lstatSync((0, node_path_1.join)(root, dir, file));
            if (stat.isDirectory()) {
                await this.load((0, node_path_1.join)(dir, file));
            }
            else if (isValidFile(file)) {
                const route = require((0, node_path_1.join)(root, dir, file)).default;
                if (!route)
                    continue;
                console.log('Endpoint loaded: "' + route.url + '"', '>> Type: "' + route.method.toString().toUpperCase() + '"');
                this.data.push(route);
            }
        }
    }
}
exports.APICore = APICore;
//# sourceMappingURL=core.js.map