import RTCConnectionManager from "./RTCConnectionManager";
import SocketManager from "./SocketManager"
import DataChannelManager from "./DataChannelManager";
import MediaStreamManager from "./MediaStreamManager";

const socketManager = new SocketManager();
const dataChannelManager = new DataChannelManager();
const mediaStreamManager = new MediaStreamManager();
const rtcConnectionManager = new RTCConnectionManager({
  dataChannelManager,
  mediaStreamManager,
});

export {
  socketManager,
  rtcConnectionManager,
  dataChannelManager,
  mediaStreamManager,
}