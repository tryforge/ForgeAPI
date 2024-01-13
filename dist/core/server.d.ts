/// <reference types="node" />
import { Server } from "node:http";
import { WebSocketServer } from "ws";
export declare class APICore {
    private data;
    static server: Server;
    static wss: WebSocketServer;
    constructor(port: number);
    load(dir: string): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map