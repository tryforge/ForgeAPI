import { WebSocketServer } from "ws";
import { Server } from "node:http";
export declare class APICore {
    private data;
    static server: Server;
    static wss: WebSocketServer;
    constructor(port: number);
    load(dir: string, custom?: boolean): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map