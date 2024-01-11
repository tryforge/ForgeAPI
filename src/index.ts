import { httpServer } from "./core";

const server = new httpServer(3000)
server.load('./routes')
