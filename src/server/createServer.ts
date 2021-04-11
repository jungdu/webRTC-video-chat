import socketIo, {Socket} from "socket.io"
import express, {Express} from "express";
import http from "http";

const publicFolderPath = "public";

export function startExpressServer(port: number|string){
  return new Promise<{
    expressServer: Express,
    httpServer: http.Server
  }>((resolve) => {
    const app = express();
    const server = app.listen(port, () => {
      console.log("Listening on ", port);
      resolve({
        httpServer: server,
        expressServer: app
      })
    })
  })
}

export function useStaticServer(expressServer:Express){
  expressServer.use(express.static(publicFolderPath))
}

export function createSocketServer(httpServer: http.Server){
  const ioServer = new socketIo.Server(httpServer);
  return ioServer;
}