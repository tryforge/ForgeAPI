import { createServer, IncomingMessage, ServerResponse } from "node:http";
import * as url from 'node:url';
import * as fs from 'fs'
import { join } from "node:path";

/* types */
type _HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' |
'PROPFIND' | 'PROPPATCH' | 'MKCOL' | 'COPY' | 'MOVE' | 'LOCK' | 'UNLOCK' | 'TRACE' | 'SEARCH'

export type HTTPMethods = Uppercase<_HTTPMethods> | Lowercase<_HTTPMethods>;
export type HandlerMethods = (request: IncomingMessage, reply: ServerResponse<IncomingMessage>) => ServerResponse;

/* interfaces */
export interface RouteOptions {
  method: HTTPMethods | HTTPMethods[];
  url: string;
  handler: HandlerMethods;
}
const isValidFile = (file: string) => file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts'))

export class httpServer {
  private data: RouteOptions[] = []

  constructor(port: number){

    const reply = (request: IncomingMessage, reply: ServerResponse) =>{
      const path = url.parse(request.url ?? '/404', true)
      const method = request.method as HTTPMethods
      const response = this.data.filter(s => s.url == path.pathname && s.method.toString().toUpperCase().includes(method))
      if(!response[0]) reply.end(JSON.stringify({status: 404, message: 'Endpoint Not Found'}));
      else return response[0].handler(request,reply)
    }
    const server = createServer(reply)
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