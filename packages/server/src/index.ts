import { createSocketServer, startExpressServer, useReactPath, useStaticServer } from "./createServer";
import { addSocketHandler } from "./socketHandlers";

main();

async function main(){
  const {expressServer, httpServer} = await startExpressServer(process.env.PORT || 8080);
  useStaticServer(expressServer);
  useReactPath(expressServer);
  
  const socketServer = createSocketServer(httpServer);
  addSocketHandler(socketServer);
}