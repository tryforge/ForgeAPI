import { createServer, IncomingMessage, Server, ServerResponse } from "node:http";
import * as url from 'node:url';
import * as fs from 'fs'
import { join } from "node:path";
import { WebSocketServer } from "ws";

/* types */
type _HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' |
'PROPFIND' | 'PROPPATCH' | 'MKCOL' | 'COPY' | 'MOVE' | 'LOCK' | 'UNLOCK' | 'TRACE' | 'SEARCH'

export type HTTPMethods = Uppercase<_HTTPMethods> | Lowercase<_HTTPMethods>;
export type HandlerMethods = (
  request: IncomingMessage,
  reply: ServerResponse<IncomingMessage>
) => void | Promise<void>;

export type wsHandler = (
  ws: WebSocket,
  request: IncomingMessage
) => void | Promise<void>;

/* interfaces */
export interface RouteOptions {
  method: HTTPMethods | HTTPMethods[];
  url: string;
  handler: HandlerMethods;
  wsHandler?: wsHandler;
}
const isValidFile = (file: string) => file.endsWith('.js')

export class APICore {
  private data: RouteOptions[] = []
  public static server: Server;
  public static wss: WebSocketServer;

  constructor(port: number){
    const httpReply = (request: IncomingMessage, reply: ServerResponse) => {
      const path = url.parse(request.url ?? '/404', true)
      const method = request.method as HTTPMethods
      const response = this.data.find(s => s.url == path.pathname && s.method.toString().toUpperCase().includes(method))
      if(!response) reply.end(JSON.stringify({status: 404, message: 'Endpoint Not Found'}));
      else return response.handler(request,reply)
    }

    const wsReply = (ws: WebSocket, request: IncomingMessage) => {
      const path = url.parse(request.url ?? '/404', true)
      const response = this.data.find(s => s.url == path.pathname)
      if(!response || !response?.wsHandler) ws.send('Invalid Endpoint');
      else return response.wsHandler(ws, request)
    }
    const server = createServer(httpReply)
    const wss = new WebSocketServer({ server: server });

    wss.on('connection', wsReply)

    APICore.server = server
    APICore.wss = wss
    server.listen(port)
  }

  public async load(dir: string){
    const root = __dirname, files = fs.readdirSync(join(root, dir))
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