import { createSocketServer, startExpressServer, useStaticServer } from "./createServer";

main();

async function main(){
  const {expressServer, httpServer} = await startExpressServer(8080);
  useStaticServer(expressServer);
  createSocketServer(httpServer);
}