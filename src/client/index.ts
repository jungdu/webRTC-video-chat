import { connectRTCPeer } from "./rtcConnection";
import managers from "./managers";

const socketIdSpan = document.getElementById("socketIdSpan") as HTMLSpanElement
const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
const answerSocketIdInput = document.getElementById("answerSocketId") as HTMLInputElement;
const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;

const { socketManager, dataChannelManager } = managers;
socketManager.init("http://127.0.0.1:8080/", {
  onUpdateSocketId: (socketId) => {
    socketIdSpan.innerHTML = socketId || "disconnected";
  }
})

dataChannelManager.setHandlers({
  onMessage: (event) => {
    if(event.data){
      const messageUl = document.getElementById("messageUl") as HTMLUListElement;
      const li = document.createElement('li');
      li.innerHTML = event.data;
      messageUl.appendChild(li);
    }
  }
})

connectBtn.addEventListener('click', () => {
  const answerSocketId = answerSocketIdInput.value;
  console.log("trying connect " + answerSocketId);
  connectRTCPeer(socketManager.socket, answerSocketId, );
})

sendBtn.addEventListener('click', () => {
    const messageInput = document.getElementById("messageInput") as HTMLInputElement;
    if(messageInput.value){
    if(dataChannelManager.dataChannels.length < 1){
      alert("연결된 dataChannel이 없습니다.")
    }else{
      dataChannelManager.broadcast(`<b>${socketManager.socketId}</b>: ${messageInput.value}`);
      messageInput.innerHTML = "";
    }
  }
})