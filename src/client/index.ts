import { connectRTCPeer } from "./rtcConnection";
import managers from "./managers";

const socketIdSpan = document.getElementById("socketIdSpan") as HTMLSpanElement
const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
const answerSocketIdInput = document.getElementById("answerSocketId") as HTMLInputElement;

const { socketManager } = managers;
socketManager.init("http://127.0.0.1:8080/", {
  onUpdateSocketId: (socketId) => {
    socketIdSpan.innerHTML = socketId;
  }
})

connectBtn.addEventListener('click', () => {
  const answerSocketId = answerSocketIdInput.value;
  console.log("trying connect " + answerSocketId);
  connectRTCPeer(socketManager.socket, answerSocketId);
})