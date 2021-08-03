import { connectRTCPeer } from "./connection/rtcConnection";
import RtcConnectionManager from "./connection/RtcConnectionManager";
import SocketManager from "./connection/SocketManager";
import DataChannelManager from "./connection/DataChannelManager";

const socketIdSpan = document.getElementById("socketIdSpan") as HTMLSpanElement
const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
const answerSocketIdInput = document.getElementById("answerSocketId") as HTMLInputElement;
const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;

const socketManager = new SocketManager();
const dataChannelManager = new DataChannelManager();
const rtcConnectionManager = new RtcConnectionManager();

const socket = socketManager.init("http://127.0.0.1:8080/", {
  onUpdateSocketId: (socketId) => {
    socketIdSpan.innerHTML = socketId || "disconnected";
  }
})

rtcConnectionManager.addSocketHandler(socket, dataChannelManager);
rtcConnectionManager.setHandlers({
  onAddConnection: () => {
    updateConnectionList(rtcConnectionManager)
  },
  onCloseConnection: () => {
    updateConnectionList(rtcConnectionManager)
  }
})

dataChannelManager.setHandlers({
  onMessage: (event, socketId) => {
    if(event.data){
      const messageUl = document.getElementById("messageUl") as HTMLUListElement;
      const li = document.createElement('li');
      li.innerHTML = `<b>${socketId}</b> ${event.data}`;
      messageUl.appendChild(li);
    }
  }
})

connectBtn.addEventListener('click', () => {
  const answerSocketId = answerSocketIdInput.value;
  console.log("trying connect " + answerSocketId);
  connectRTCPeer(socketManager.socket, answerSocketId, rtcConnectionManager, dataChannelManager);
})

sendBtn.addEventListener('click', () => {
    const messageInput = document.getElementById("messageInput") as HTMLInputElement;
    if(messageInput.value){
    if(dataChannelManager.dataChannels.length < 1){
      alert("연결된 dataChannel이 없습니다.")
    }else{
      dataChannelManager.broadcast(messageInput.value);
      messageInput.value = "";
    }
  }
})

function updateConnectionList(rtcConnectionManager:RtcConnectionManager){
  const connectionUl = document.getElementById("connectionUl") as HTMLUListElement;
  connectionUl.innerHTML = "";
  const ids = rtcConnectionManager.getConnectionIds();
  ids.forEach((id) => {
    const li = document.createElement('li');
    li.innerHTML = id;
    connectionUl.appendChild(li);
  })
}