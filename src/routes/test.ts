import { RouteOptions } from "../core"

export default {
    url: '/test',
    method: "get",
    handler: function(request, reply) {
            reply.end('hi')
    }
} as RouteOptions