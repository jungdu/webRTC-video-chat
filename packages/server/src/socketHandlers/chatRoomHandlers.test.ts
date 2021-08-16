import { Socket, Server} from "socket.io";
import Client, {Socket as ClientSocket} from "socket.io-client";
import { cli } from "webpack";
import ChatRoomManager, { Room } from "../managers/ChatRoomManager";
import { createSocketClient, createTestSocketServer } from "../utils/testUtils";
import { addChatRoomHandlers } from "./chatRoomHandlers";

type joinLobbyParams = Room[];

const testServerPort = 8080;
const testServerUrl = `http://localhost:${testServerPort}`;

describe("Chat Room Handlers", () => {
  let socketServer:Server, clientSocket:ClientSocket, chatRoomManager:ChatRoomManager;

  beforeEach(async () => {
    socketServer = await createTestSocketServer();
    chatRoomManager = new ChatRoomManager();
    socketServer.on('connection', function(socket: Socket){
      addChatRoomHandlers(socket, socketServer, chatRoomManager);
    })
    clientSocket = await createSocketClient();
  });

  afterEach(() => {
    socketServer.close();
    clientSocket.close();
  });

  test("Join lobby", (done) => {
    clientSocket.emit("joinLobby", (rooms:Room[]) => {
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms.length).toBe(0);
      done();      
    });
  })

  test("Notify creating room to lobby", (done) => {
    clientSocket.emit("joinLobby", () => {
      clientSocket.on('newRoom', (room:Room) => {
        expect(room.roomName).toBe("First Room");
        expect(room.createdBy).toBe(clientSocket.id);
        expect(room.userSocketIds).toEqual([clientSocket.id])
        done();
      })
  
      clientSocket.emit("createRoom", {
        roomName: "First Room"
      });
    })
  });

  test("Get rooms", (done) => {
    clientSocket.emit("createRoom", {
      roomName: "First Room"
    });
    clientSocket.emit("createRoom", {
      roomName: "Second Room"
    });
    clientSocket.emit("getRooms", (rooms: Room[]) => {
      expect(rooms.length).toBe(2);
      done();
    })
  });

  test('Join room', (done) => {
    createSocketClient().then((client2) => {
      clientSocket.emit("createRoom", {
        roomName: "First Room"
      }, (newRoom:Room) => {
        client2.emit('joinRoom', {roomId: newRoom.roomId}, (joinedRoom: Room) => {
          expect(newRoom.roomId).toEqual(joinedRoom.roomId)
          expect(joinedRoom.userSocketIds.length).toBe(2);
          expect(joinedRoom.userSocketIds).toContain(client2.id);
          expect(joinedRoom.userSocketIds).toContain(clientSocket.id);
          done();
        })
      });
    });
  })

  test('Exit room', (done) => {
    createSocketClient().then((client2) => {
      clientSocket.emit("createRoom", {
        roomName: "First Room"
      }, (newRoom:Room) =>{
        client2.emit('joinRoom', {roomId: newRoom.roomId}, (joinedRoom: Room) => {
          client2.emit('exitRoom', {roomId: newRoom.roomId});
          clientSocket.emit("getRooms", (rooms: Room[]) => {
            expect(rooms.length).toBe(1);
            expect(rooms[0].userSocketIds.length).toBe(1);
            done();
          })
        }) 
      })
    })
  })

  test('Exit room and delete room', (done) => {
    clientSocket.emit("createRoom", {
      roomName: "First Room"
    }, (newRoom: Room) => {
      clientSocket.emit("exitRoom", {roomId: newRoom.roomId});
      clientSocket.emit("getRooms", (rooms: Room[]) => {
        expect(rooms.length).toBe(0);
        done();
      })
    })
  })
});