import RTCConnectionManager from "./RTCConnectionManager";
import SocketManager from "./SocketManager"
import DataChannelManager from "./DataChannelManager";
import MediaStreamManager from "./MediaStreamManager";
import ChatRoomManager from "./ChatRoomManager";

const socketManager = new SocketManager();
const dataChannelManager = new DataChannelManager();
const mediaStreamManager = new MediaStreamManager();
const rtcConnectionManager = new RTCConnectionManager({
  dataChannelManager,
  mediaStreamManager,
});
const chatRoomManager = new ChatRoomManager();

export {
  socketManager,
  rtcConnectionManager,
  dataChannelManager,
  mediaStreamManager,
  chatRoomManager,
}