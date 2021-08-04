import RtcConnectionManager from "./connection/RtcConnectionManager";
import SocketManager from "./connection/SocketManager";
import DataChannelManager from "./connection/DataChannelManager";
import MediaStreamManager from "./connection/MediaStreamManager";

main();

function main(){
  const socketIdSpan = document.getElementById("socketIdSpan") as HTMLSpanElement
  const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
  const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
  
  const socketManager = new SocketManager();
  const dataChannelManager = new DataChannelManager();
  
  if(!process.env.SOCKET_URL){
    throw new Error("SOCKET_URL isn't declared");
  }

  const socket = socketManager.init(process.env.SOCKET_URL, {
    onUpdateSocketId: (socketId) => {
      socketIdSpan.innerHTML = socketId || "disconnected";
    }
  })
  
  const mediaStreamManager = new MediaStreamManager({
    handlers: {
      onGetCameraStream: handleGetCameraStream,
      onTrack: handleTrack,
    }
  })
  
  const rtcConnectionManager = new RtcConnectionManager(socket, {
      dataChannelManager,
      mediaStreamManager,
    }
  );
  
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
    const answerSocketIdInput = document.getElementById("answerSocketId") as HTMLInputElement;
    const answerSocketId = answerSocketIdInput.value;
    console.log("trying connect " + answerSocketId);
    rtcConnectionManager.connectPeer(answerSocketId);
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
}

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

function handleGetCameraStream(stream:MediaStream){
  const myCamera = document.getElementById("myCamera") as HTMLVideoElement;
  myCamera.srcObject = stream;
  myCamera.onloadedmetadata = function(){
    myCamera.play();
  }
}

function handleTrack(rtcTrackEvent: RTCTrackEvent){
  console.log("onTrack rtcTrackEvent :", rtcTrackEvent)
  const videoUl = document.getElementById("videoUl") as HTMLUListElement;
  const newVideo = document.createElement("video") as HTMLVideoElement;
  
  newVideo.srcObject = rtcTrackEvent.streams[0];
  newVideo.onloadedmetadata = function(e){
    newVideo.play();
  }

  videoUl.append(newVideo);
}