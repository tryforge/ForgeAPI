import { RouteOptions } from "../core"

export default {
    url: '/test',
    method: "get",
    handler: function(request, reply) {
            reply.end('hi')
    },
    //wsHandler: function(ws, request){
    //    ws.send('hello')
    //}
} as RouteOptions