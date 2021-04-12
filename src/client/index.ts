import { connectRTCPeer } from "./rtcConnection";
import { connectSocket } from "./socketConnection"
import { addSocketHandler } from "./socketHandler"

const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
const answerSocketIdInput = document.getElementById("answerSocketId") as HTMLInputElement;

const socket = connectSocket("http://127.0.0.1:8080/");
addSocketHandler(socket);

connectBtn.addEventListener('click', () => {
  const answerSocketId = answerSocketIdInput.value;
  console.log("trying connect " + answerSocketId);
  connectRTCPeer(socket, answerSocketId);
})