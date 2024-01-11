"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    url: '/test',
    method: "get",
    handler: function (request, reply) {
        reply.end('hi');
    },
    //wsHandler: function(ws, request){
    //    ws.send('hello')
    //}
};
//# sourceMappingURL=test.js.map