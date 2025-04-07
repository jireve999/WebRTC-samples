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
import PeerConnection from './PeerConnection';
import PeerConnectionVideo from "./PeerConnectionVideo";
import PeerConnectionCanvas from "./PeerConnectionCanvas";
import DataChannel from './DataChannel';
import DataChannelFile from "./DataChannelFile";
import P2PClient from "./p2p-old/P2PClient";

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
        <Route path="/recordAudio" element={<RecordAudio/>} />
        <Route path="/recordScreen" element={<RecordScreen/>} />
        <Route path="/recordCanvas" element={<RecordCanvas/>} />
        <Route path="/recordVideo" element={<RecordVideo/>} />
        <Route path="/peerConnection" element={<PeerConnection/>} />
        <Route path="/peerConnectionVideo" element={<PeerConnectionVideo/>} />
        <Route path="/peerConnectionCanvas" element={<PeerConnectionCanvas/>} />
        <Route path="/dataChannel" element={<DataChannel/>} />
        <Route path="/dataChannelFile" element={<DataChannelFile/>} />
        <Route path="/p2pClient" element={<P2PClient/>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}