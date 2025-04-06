/**
 * 设备枚举示例
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Select } from 'antd';

const { Option } = Select;

const DeviceSelect = () => {
  const videoRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedAudioOutputDevice, setSelectedAudioOutputDevice] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // 初始化设备列表
    const initializeDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const video = devices.filter(device => device.kind === 'videoinput');
        const audioInput = devices.filter(device => device.kind === 'audioinput');
        const audioOutput = devices.filter(device => device.kind === 'audiooutput');

        setVideoDevices(video);
        setAudioDevices(audioInput);
        setAudioOutputDevices(audioOutput);

        // 设置默认设备
        if (audioInput.length > 0) setSelectedAudioDevice(audioInput[0].deviceId);
        if (audioOutput.length > 0) setSelectedAudioOutputDevice(audioOutput[0].deviceId);
        if (video.length > 0) setSelectedVideoDevice(video[0].deviceId);
      } catch (error) {
        console.error('设备枚举失败:', error);
      }
    };

    initializeDevices();
  }, []);

  const startTest = async () => {
    const audioSource = selectedAudioDevice || undefined;
    const videoSource = selectedVideoDevice || undefined;

    const constraints = {
      audio: audioSource ? { deviceId: { exact: audioSource } } : false,
      video: videoSource ? { deviceId: { exact: videoSource } } : false,
    };

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      videoRef.current.srcObject = newStream;
    } catch (error) {
      console.error('获取媒体流失败:', error);
    }
  };

  const handleAudioDeviceChange = (deviceId) => {
    setSelectedAudioDevice(deviceId);
    startTest();
  };

  const handleVideoDeviceChange = (deviceId) => {
    setSelectedVideoDevice(deviceId);
    startTest();
  };

  const handleAudioOutputDeviceChange = async (deviceId) => {
    setSelectedAudioOutputDevice(deviceId);

    if (videoRef.current && videoRef.current.setSinkId) {
      try {
        await videoRef.current.setSinkId(deviceId);
        console.log('音频输出设备设置成功:', deviceId);
      } catch (error) {
        if (error.name === 'SecurityError') {
          console.error('需要 HTTPS 来选择输出设备:', error);
        } else {
          console.error('设置输出设备失败:', error);
        }
      }
    } else {
      console.warn('浏览器不支持输出设备选择');
    }
  };

  // 清理媒体流
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="container">
      <h1>设备枚举示例</h1>
      {/* 音频输入设备选择 */}
      <Select
        value={selectedAudioDevice}
        style={{ width: 150, marginRight: '10px' }}
        onChange={handleAudioDeviceChange}
      >
        {audioDevices.map(device => (
          <Option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </Option>
        ))}
      </Select>
      {/* 音频输出设备选择 */}
      <Select
        value={selectedAudioOutputDevice}
        style={{ width: 150, marginRight: '10px' }}
        onChange={handleAudioOutputDeviceChange}
      >
        {audioOutputDevices.map(device => (
          <Option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </Option>
        ))}
      </Select>
      {/* 视频输入设备选择 */}
      <Select
        value={selectedVideoDevice}
        style={{ width: 150 }}
        onChange={handleVideoDeviceChange}
      >
        {videoDevices.map(device => (
          <Option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </Option>
        ))}
      </Select>
      {/* 视频预览 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          objectFit: 'contain',
          marginTop: '10px',
          width: '100%',
          maxWidth: '600px',
          border: '1px solid #ccc',
        }}
      />
      <Button onClick={startTest} style={{ marginTop: '10px' }}>
        测试
      </Button>
    </div>
  );
};

export default DeviceSelect;



// import React from "react";
// import { Button, Select } from "antd";
// const { Option } = Select;

// //视频对象
// let videoElement;
//
// class DeviceSelect extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             //当前选择的音频输入设备
//             selectedAudioDevice: "",
//             //当前选择的音频输出设备
//             selectedAudioOutputDevice: "",
//             //当前选择的视频输入设备
//             selectedVideoDevice: "",
//             //视频输入设备列表
//             videoDevices: [],
//             //音频输入设备列表
//             audioDevices: [],
//             //音频输出设备列表
//             audioOutputDevices: [],
//         }
//     }

//     componentDidMount() {
//         //获取视频对象
//         videoElement = this.refs['previewVideo'];
//         //更新设备列表
//         this.updateDevices().then((data) => {
//             //判断当前选择的音频输入设备是否为空并且是否有设备
//             if (this.state.selectedAudioDevice === "" && data.audioDevices.length > 0) {
//                 this.setState({
//                     //默认选中第一个设备
//                     selectedAudioDevice: data.audioDevices[0].deviceId,
//                 });
//             }
//             //判断当前选择的音频输出设备是否为空并且是否有设备
//             if (this.state.selectedAudioOutputDevice === "" && data.audioOutputDevices.length > 0) {
//                 this.setState({
//                     //默认选中第一个设备
//                     selectedAudioOutputDevice: data.audioOutputDevices[0].deviceId,
//                 });
//             }
//             //判断当前选择的视频输入设备是否为空并且是否有设备
//             if (this.state.selectedVideoDevice === "" && data.videoDevices.length > 0) {
//                 this.setState({
//                     //默认选中第一个设备
//                     selectedVideoDevice: data.videoDevices[0].deviceId,
//                 });
//             }
//             //设置当前设备Id
//             this.setState({
//                 videoDevices: data.videoDevices,
//                 audioDevices: data.audioDevices,
//                 audioOutputDevices: data.audioOutputDevices,
//             });
//         });

//     }

//     //更新设备列表
//     updateDevices = () => {
//         return new Promise((pResolve, pReject) => {
//             //视频输入设备列表
//             let videoDevices = [];
//             //音频输入设备列表
//             let audioDevices = [];
//             //音频输出设备列表
//             let audioOutputDevices = [];
//             //枚举所有设备
//             navigator.mediaDevices.enumerateDevices()
//                 //返回设备列表
//                 .then((devices) => {
//                     //使用循环迭代设备列表
//                     for (let device of devices) {
//                         //过滤出视频输入设备
//                         if (device.kind === 'videoinput') {
//                             videoDevices.push(device);
//                         //过滤出音频输入设备
//                         } else if (device.kind === 'audioinput') {
//                             audioDevices.push(device);
//                         //过滤出音频输出设备
//                         } else if (device.kind === 'audiooutput') {
//                             audioOutputDevices.push(device);
//                         }
//                     }
//                 }).then(() => {
//                     //处理好后将三种设备数据返回
//                     let data = { videoDevices, audioDevices, audioOutputDevices };
//                     pResolve(data);
//                 });
//         });
//     }

//     //开始测试
//     startTest = () => {
//         //获取音频输入设备Id
//         let audioSource = this.state.selectedAudioDevice;
//         //获取视频频输入设备Id
//         let videoSource = this.state.selectedVideoDevice;
//         //定义约束条件
//         let constraints = {
//             //设置音频设备Id
//             audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
//             //设置视频设备Id
//             video: { deviceId: videoSource ? { exact: videoSource } : undefined }
//         };
//         //根据约束条件获取数据流
//         navigator.mediaDevices.getUserMedia(constraints)
//             .then((stream) => {
//                 //成功返回音视频流
//                 window.stream = stream;
//                 videoElement.srcObject = stream;
//             }).catch((err) => { 
//                 console.log(err);
//             });
//     }

//     //音频输入设备改变
//     handleAudioDeviceChange = (e) => {
//         console.log('选择的音频输入设备为: ' + JSON.stringify(e));
//         this.setState({ selectedAudioDevice: e });
//         setTimeout(this.startTest, 100);
//     }
//     //视频输入设备改变
//     handleVideoDeviceChange = (e) => {
//         console.log('选择的视频输入设备为: ' + JSON.stringify(e));
//         this.setState({ selectedVideoDevice: e });
//         setTimeout(this.startTest, 100);
//     }
//     //音频输出设备改变
//     handleAudioOutputDeviceChange = (e) => {
//         console.log('选择的音频输出设备为: ' + JSON.stringify(e));
//         this.setState({ selectedAudioOutputDevice: e });

//         if (typeof videoElement.sinkId !== 'undefined') {
//             //调用HTMLMediaElement的setSinkId方法改变输出源
//             videoElement.setSinkId(e)
//                 .then(() => {
//                     console.log(`音频输出设备设置成功: ${sinkId}`);
//                 })
//                 .catch(error => {
//                     if (error.name === 'SecurityError') {
//                         console.log(`你需要使用HTTPS来选择输出设备: ${error}`);
//                     }
//                 });
//         } else {
//             console.warn('你的浏览器不支持输出设备选择.');
//         }
//     }


//     render() {
//         return (
//             <div className="container">
//                 <h1>
//                     <span>设备枚举示例</span>
//                 </h1>
//                 {/* 音频输入设备列表 */}
//                 <Select value={this.state.selectedAudioDevice} style={{ width: 150,marginRight:'10px' }} onChange={this.handleAudioDeviceChange}>
//                     {
//                         this.state.audioDevices.map((device, index) => {
//                             return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>);
//                         })
//                     }
//                 </Select>
//                 {/* 音频输出设备列表 */}
//                 <Select value={this.state.selectedAudioOutputDevice} style={{ width: 150,marginRight:'10px' }} onChange={this.handleAudioOutputDeviceChange}>
//                     {
//                         this.state.audioOutputDevices.map((device, index) => {
//                             return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>);
//                         })
//                     }
//                 </Select>
//                 {/* 视频频输入设备列表 */}
//                 <Select value={this.state.selectedVideoDevice} style={{ width: 150 }} onChange={this.handleVideoDeviceChange}>
//                     {
//                         this.state.videoDevices.map((device, index) => {
//                             return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>);
//                         })
//                     }
//                 </Select>
//                 {/* 视频预览展示 */}
//                 <video className="video" ref='previewVideo' autoPlay playsInline style={{ objectFit: 'contain',marginTop:'10px' }}></video>

//                 <Button onClick={this.startTest}>测试</Button>

//             </div>
//         );
//     }
// }
// //导出组件
// export default DeviceSelect;