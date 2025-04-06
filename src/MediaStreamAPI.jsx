/**
 * 摄像头使用示例
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from 'antd';

const MediaStreamAPI = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);

  // 初始化获取媒体设备
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('媒体设备获取失败:', err);
        setError(err);
      }
    };

    initMedia();

    return () => {
      // 清理函数：组件卸载时停止所有轨道
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 获取轨道相关操作
  const handleGetAudioTracks = useCallback(() => {
    if (!streamRef.current) return;
    console.log('音频轨道:', streamRef.current.getAudioTracks());
  }, []);

  const handleGetTrackById = useCallback(() => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    console.log('根据ID获取轨道:', audioTrack?.id);
  }, []);

  const handleRemoveAudioTrack = useCallback(() => {
    if (!streamRef.current) return;
    const track = streamRef.current.getAudioTracks()[0];
    if (track) {
      streamRef.current.removeTrack(track);
      track.stop();
      console.log('已移除音频轨道');
    }
  }, []);

  const handleGetTracks = useCallback(() => {
    if (!streamRef.current) return;
    console.log('所有轨道:', streamRef.current.getTracks());
  }, []);

  const handleGetVideoTracks = useCallback(() => {
    if (!streamRef.current) return;
    console.log('视频轨道:', streamRef.current.getVideoTracks());
  }, []);

  const handleRemoveVideoTrack = useCallback(() => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      streamRef.current.removeTrack(track);
      track.stop();
      console.log('已移除视频轨道');
    }
  }, []);

  if (error) {
    return (
      <div className="error">
        需要授予摄像头和麦克风权限才能使用该功能
        <div>{error.toString()}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>MediaStream API 测试</h1>
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          maxWidth: '640px',
          border: '2px solid #1890ff',
          borderRadius: '8px',
          backgroundColor: '#000'
        }}
      />

      <div style={{
        marginTop: 20,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center'
      }}>
        <Button onClick={handleGetTracks}>获取所有轨道</Button>
        <Button onClick={handleGetAudioTracks}>获取音频轨道</Button>
        <Button onClick={handleGetTrackById}>根据ID获取轨道</Button>
        <Button danger onClick={handleRemoveAudioTrack}>删除音频轨道</Button>
        <Button onClick={handleGetVideoTracks}>获取视频轨道</Button>
        <Button danger onClick={handleRemoveVideoTrack}>删除视频轨道</Button>
      </div>
    </div>
  );
};

export default MediaStreamAPI;


// import React from "react";
// import { Button } from "antd";

// //MediaStream对象
// let stream;

// class MediaStreamAPI extends React.Component {
//     constructor() {
//         super();
//     }

//     componentDidMount() {
//         this.openDevice();
//     }

//     //打开音视频设备
//     openDevice = async () => {
//         try {
//             //根据约束条件获取媒体
//             stream = await navigator.mediaDevices.getUserMedia({
//                 //启用音频
//                 audio: true,
//                 //启用视频
//                 video: true
//             });
//             let video = this.refs['myVideo'];
//             video.srcObject = stream;
//         } catch (e) {
//             console.log(`getUserMedia错误:` + error);
//         }
//     }

//     //获取音频轨道列表
//     btnGetAudioTracks = () => {
//         console.log("getAudioTracks");
//         //返回一个数据
//         console.log(stream.getAudioTracks());
//     }

//     //根据Id获取音频轨道
//     btnGetTrackById = () => {
//         console.log("getTrackById");
//         console.log(stream.getTrackById(stream.getAudioTracks()[0].id));
//     }

//     //删除音频轨道
//     btnRemoveAudioTrack = () => {
//         console.log("removeAudioTrack()");
//         stream.removeTrack(stream.getAudioTracks()[0]);
//     }

//     //获取所有轨道,包括音频及视频
//     btnGetTracks = () => {
//         console.log("getTracks()");
//         console.log(stream.getTracks());
//     }

//     //获取视频轨道列表
//     btnGetVideoTracks = () => {
//         console.log("getVideoTracks()");
//         console.log(stream.getVideoTracks());
//     }

//     //删除视频轨道
//     btnRemoveVideoTrack = () => {
//         console.log("removeVideoTrack()");
//         stream.removeTrack(stream.getVideoTracks()[0]);
//     }

//     render() {
//         return (
//             <div className="container">
//                 <h1>
//                     <span>MediaStreamAPI测试</span>
//                 </h1>
//                 <video className="video" ref="myVideo" autoPlay playsInline></video>
//                 <Button onClick={this.btnGetTracks} style={{width:'120px'}}>获取所有轨道</Button>
//                 <Button onClick={this.btnGetAudioTracks} style={{width:'120px'}}>获取音频轨道</Button>
//                 <Button onClick={this.btnGetTrackById} style={{width:'200px'}}>根据Id获取音频轨道</Button>
//                 <Button onClick={this.btnRemoveAudioTrack} style={{width:'120px'}}>删除音频轨道</Button>
//                 <Button onClick={this.btnGetVideoTracks} style={{width:'120px'}}>获取视频轨道</Button>
//                 <Button onClick={this.btnRemoveVideoTrack} style={{width:'120px'}}>删除视频轨道</Button>
//             </div>
//         );
//     }
// }
// //导出组件
// export default MediaStreamAPI;