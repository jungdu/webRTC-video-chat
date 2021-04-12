import DataChannelManager from "./DataChannelManager";
import RtcConnectionManager from "./RtcConnectionManager";

const managers = {
  dataChannelManager: new DataChannelManager(),
  rtcConnectionManager: new RtcConnectionManager(),
}

export default managers;