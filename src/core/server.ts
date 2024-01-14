import { join } from "node:path";
import { cwd } from "node:process";
import { WebSocketServer } from "ws";
import { readdirSync, lstatSync } from 'fs'
import { createServer, Server } from "node:http";
import { httpReply, isValidFile, RouteOptions, wsReply } from ".";

export class APICore {
  private data: RouteOptions[] = []
  public static server: Server;
  public static wss: WebSocketServer;

  constructor(port: number){
    const server = createServer((req,res)=> {httpReply(req, res, this.data)})
    const wss = new WebSocketServer({ server: server });
    wss.on('connection', (ws, req) => {return wsReply(ws as unknown as WebSocket, req, this.data)})
    
    APICore.server = server
    APICore.wss = wss
    server.listen(port)
  }

  public async load(dir: string, custom?: boolean){
    const root = custom ? cwd() : join(__dirname, '..'), files = readdirSync(join(root, dir))
    for (const file of files){
      const stat = lstatSync(join(root, dir, file))
      if (stat.isDirectory()) {
        await this.load(join(dir, file))
      } else if (isValidFile(file)) {
        const route = require(join(root, dir, file)).data as RouteOptions
        if (!route) continue
        console.log(
          'Endpoint loaded: "' + route.url + '"',
          '>> Type: "' + route.method.toString().toUpperCase() + '"'
        )
        this.data.push(route)
      }
    }
  }
}