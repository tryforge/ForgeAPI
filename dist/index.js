"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const server = new core_1.httpServer(3000);
server.load('./routes');
//# sourceMappingURL=index.js.map