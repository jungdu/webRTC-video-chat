import { createServer } from "http";
import { Server, Socket } from "socket.io";
import Client, {Socket as ClientSocket} from "socket.io-client";

const testServerPort = 8080;
const testServerUrl = `http://localhost:${testServerPort}`;

export function createTestSocketServer(){
  return new Promise<Server>(resolve => {
    const httpServer = createServer();
    const socketServer = new Server(httpServer);

    httpServer.listen(testServerPort, () => {
      resolve(socketServer);
    });
  })
  
}

export function createSocketClient(){
  return new Promise<ClientSocket>(resolve => {
    // @ts-expect-error
    const clientSocket = new Client(testServerUrl);
    clientSocket.on("connect", () => {
      resolve(clientSocket);
    })
  })
}