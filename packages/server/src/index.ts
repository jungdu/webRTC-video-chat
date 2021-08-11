import { createSocketServer, startExpressServer, useStaticServer } from "./createServer";
import { addSocketHandler } from "./socketServerHandler";

main();

async function main(){
  const {expressServer, httpServer} = await startExpressServer(process.env.PORT || 8080);
  useStaticServer(expressServer);
  const socketServer = createSocketServer(httpServer);
  addSocketHandler(socketServer);
}