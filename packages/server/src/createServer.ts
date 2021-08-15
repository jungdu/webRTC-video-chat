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

    // health check
    app.get('/ping', function(req, res) {
      res.status(200).send('pong')
    });
    
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
  const options = process.env.NODE_ENV === "development" ? {cors: {
    origin: "http://localhost:3000"
  }} : {};

  console.log("options :", options)
  const ioServer = new socketIo.Server(httpServer, options);
  return ioServer;
}