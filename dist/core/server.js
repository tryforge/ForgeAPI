"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APICore = void 0;
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const ws_1 = require("ws");
const fs_1 = require("fs");
const node_http_1 = require("node:http");
const _1 = require(".");
const logger_1 = require("./logger");
class APICore {
    data = [];
    static server;
    static wss;
    constructor(port) {
        const server = (0, node_http_1.createServer)((req, res) => { (0, _1.httpReply)(req, res, this.data); });
        const wss = new ws_1.WebSocketServer({ server: server });
        wss.on('connection', (ws, req) => { return (0, _1.wsReply)(ws, req, this.data); });
        APICore.server = server;
        APICore.wss = wss;
        server.listen(port);
    }
    async load(dir, custom) {
        const root = custom ? (0, node_process_1.cwd)() : (0, node_path_1.join)(__dirname, '..'), files = (0, fs_1.readdirSync)((0, node_path_1.join)(root, dir));
        for (const file of files) {
            const stat = (0, fs_1.lstatSync)((0, node_path_1.join)(root, dir, file));
            if (stat.isDirectory()) {
                await this.load((0, node_path_1.join)(dir, file));
            }
            else if ((0, _1.isValidFile)(file)) {
                const route = require((0, node_path_1.join)(root, dir, file)).data;
                if (!route)
                    continue;
                logger_1.Logger.log('INFO', `ForgeAPI | ${route.method.toString().toUpperCase()} Endpoint loaded: "${route.url}"`);
                this.data.push(route);
            }
        }
    }
}
exports.APICore = APICore;
//# sourceMappingURL=server.js.map