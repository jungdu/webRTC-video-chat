import RTCConnectionManager from "./RTCConnectionManager";
import SocketManager from "./SocketManager"
import DataChannelManager from "./DataChannelManager";
import MediaStreamManager from "./MediaStreamManager";
import ChatRoomManager from "./ChatRoomManager";
import RTCConnectionStore from "./RTCConnectionStore";

const connectionStore = new RTCConnectionStore();
const socketManager = new SocketManager();
const dataChannelManager = new DataChannelManager(connectionStore);
const mediaStreamManager = new MediaStreamManager();
const rtcConnectionManager = new RTCConnectionManager({
  dataChannelManager,
  mediaStreamManager,
}, connectionStore);
const chatRoomManager = new ChatRoomManager();

export {
  socketManager,
  rtcConnectionManager,
  dataChannelManager,
  mediaStreamManager,
  chatRoomManager,
}