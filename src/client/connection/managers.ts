import DataChannelManager from "./DataChannelManager";
import RtcConnectionManager from "./RtcConnectionManager";
import SocketManager from "./SocketManager";

const managers = {
  dataChannelManager: new DataChannelManager(),
  rtcConnectionManager: new RtcConnectionManager(),
  socketManager: new SocketManager(),
}

export default managers;