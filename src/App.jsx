import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Samples from './Samples';
import Camera from './Camera';
import Microphone from './Microphone';
import Canvas from "./Canvas";
import ScreenSharing from './ScreenSharing';
import VideoFilter from './VideoFilter';
import Resolution from './Resolution';
import AudioVolume from './volume/AudioVolume';
import DeviceSelect from './DeviceSelect';
import MediaSettings from './media-settings/MediaSettings';
import MediaStreamAPI from "./MediaStreamAPI";
import CaptureVideo from "./CaptureVideo";
import CaptureCanvas from "./CaptureCanvas";
import RecordAudio from "./RecordAudio";
import RecordVideo from "./RecordVideo";
import RecordScreen from "./RecordScreen";
import RecordCanvas from "./RecordCanvas";
// import PeerConnection from './PeerConnection';
// import DataChannel from './DataChannel';
// import P2PClient from "./p2p/P2PClient";
// import PeerConnectionVideo from "./PeerConnectionVideo";
// import PeerConnectionCanvas from "./PeerConnectionCanvas";
// import DataChannelFile from "./DataChannelFile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Samples />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/microphone" element={<Microphone />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/screenSharing" element={<ScreenSharing />} />
        <Route path="/videoFilter" element={<VideoFilter />} />
        <Route path="/resolution" element={<Resolution/>} />
        <Route path="/audioVolume" element={<AudioVolume/>} />
        <Route path="/deviceSelect" element={<DeviceSelect/>} />
        <Route path="/mediaSettings" element={<MediaSettings/>} />
        <Route path="/mediaStreamAPI" element={<MediaStreamAPI/>} />
        <Route path="/captureVideo" element={<CaptureVideo/>} />
        <Route path="/captureCanvas" element={<CaptureCanvas/>} />
        <Route exact path="/recordAudio" element={<RecordAudio/>} />
        <Route exact path="/recordScreen" element={<RecordScreen/>} />
        <Route exact path="/recordCanvas" element={<RecordCanvas/>} />
        <Route exact path="/recordVideo" element={<RecordVideo/>} />
        {/*<Route exact path="/peerConnection" element={<PeerConnection/>} />
        <Route exact path="/peerConnectionVideo" element={<PeerConnectionVideo/>} />
        <Route exact path="/peerConnectionCanvas" element={<PeerConnectionCanvas/>} />
        <Route exact path="/dataChannel" element={<DataChannel/>} />
        <Route exact path="/dataChannelFile" element={<DataChannelFile/>} />
        <Route exact path="/p2pClient" element={<P2PClient/>} /> */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}