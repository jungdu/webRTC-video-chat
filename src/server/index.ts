import { startExpressServer, useStaticServer } from "./createServer";

main();

async function main(){
  const {expressServer} = await startExpressServer(8080);
  useStaticServer(expressServer);  
}