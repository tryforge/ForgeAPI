import { createServer, Server } from "node:http";
import * as fs from 'fs'
import { join } from "node:path";
import { WebSocketServer } from "ws";
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

  public async load(dir: string){
    const root = join(__dirname, '..'), files = fs.readdirSync(join(root, dir))
    for (const file of files){
      const stat = fs.lstatSync(join(root, dir, file))
      if (stat.isDirectory()) {
        await this.load(join(dir, file))
      } else if (isValidFile(file)) {
        const route = require(join(root, dir, file)).default as RouteOptions
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