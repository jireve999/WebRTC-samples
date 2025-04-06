/**
 * 录制屏幕示例
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';

const RecordScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedBlobsRef = useRef([]);
  const streamRef = useRef(null);

  // 资源清理
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // 开始捕获屏幕
  const startCaptureScreen = async () => {
    try {
      // 调用 getDisplayMedia 方法，约束设置为 { video: true }
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 2880,
          height: 1800,
        },
      });

      streamRef.current = stream;

      // 获取视频轨道并打印资源名称
      const videoTracks = stream.getVideoTracks();
      console.log(`视频资源名称: ${videoTracks[0].label}`);

      // 将视频对象的源指定为 stream
      videoRef.current.srcObject = stream;

      // 开始录制
      startRecord(stream);
      setIsRecording(true);
    } catch (error) {
      console.error('获取屏幕捕获流失败:', error);
    }
  };

  // 开始录制
  const startRecord = (stream) => {
    // 监听流是否处于不活动状态，用于判断用户是否停止捕获屏幕
    stream.addEventListener('inactive', () => {
      console.log('监听到屏幕捕获停止后停止录制!');
      stopRecord();
    });

    recordedBlobsRef.current = [];

    try {
      // 创建 MediaRecorder 对象，准备录制
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
    } catch (error) {
      console.error('创建 MediaRecorder 错误:', error);
      return;
    }

    // 录制停止事件监听
    mediaRecorderRef.current.onstop = () => {
      console.log('录制停止');
      console.log('录制的 Blobs 数据为:', recordedBlobsRef.current);
    };

    // 录制数据回调事件
    mediaRecorderRef.current.ondataavailable = (event) => {
      console.log('录制数据可用:', event);
      if (event.data && event.data.size > 0) {
        recordedBlobsRef.current.push(event.data);
      }
    };

    // 开始录制并指定录制时间为 10 毫秒
    mediaRecorderRef.current.start(10);
    console.log('MediaRecorder started', mediaRecorderRef.current);
  };

  // 停止录制
  const stopRecord = () => {
    if (!mediaRecorderRef.current || !streamRef.current) return;

    // 停止录制
    mediaRecorderRef.current.stop();

    // 停掉所有的轨道
    streamRef.current.getTracks().forEach((track) => track.stop());

    // 清空 stream
    streamRef.current = null;

    // 生成 blob 文件，类型为 video/webm
    const blob = new Blob(recordedBlobsRef.current, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);

    // 创建下载链接
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'screen.webm';

    // 添加到 DOM 并触发点击
    document.body.appendChild(a);
    a.click();

    // 清理 DOM 和 URL
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    setIsRecording(false);
  };

  return (
    <div className="container">
      <h1>
        <span>录制屏幕示例</span>
      </h1>
      {/* 捕获屏幕数据渲染 */}
      <video className="video" ref={videoRef} autoPlay playsInline></video>
      <Button onClick={startCaptureScreen} style={{ marginRight: '10px' }} disabled={isRecording}>
        开始
      </Button>
      <Button onClick={stopRecord} disabled={!isRecording}>
        停止
      </Button>
    </div>
  );
};

export default RecordScreen;

// import React from "react";
// import { Button } from "antd";

// //录制对象
// let mediaRecorder;
// //录制数据
// let recordedBlobs;
// //捕获数据流
// let stream;

// class RecordScreen extends React.Component {

//   //开始捕获桌面
//   startCaptureScreen = async (e) => {
//     try {
//       //调用getDisplayMedia方法,约束设置成{video:true}即可
//       stream = await navigator.mediaDevices.getDisplayMedia({
//         //设置屏幕分辨率
//         video: {
//           width: 2880, height: 1800
//         }
//       });

//       const video = this.refs['myVideo'];
//       //获取视频轨道
//       const videoTracks = stream.getVideoTracks();
//       //读取视频资源名称
//       console.log(`视频资源名称: ${videoTracks[0].label}`);
//       window.stream = stream;
//       //将视频对象的源指定为stream
//       video.srcObject = stream;

//       this.startRecord();

//     } catch (e) {
//       console.log('getUserMedia错误:' + error);
//     }
//   }

//   //开始录制
//   startRecord = (e) => {
//     //监听流是否处于不活动状态,用于判断用户是否停止捕获屏幕
//     stream.addEventListener('inactive', e => {
//       console.log('监听到屏幕捕获停止后停止录制!');
//       this.stopRecord(e);
//     });

//     //录制数据
//     recordedBlobs = [];
//     try {
//       //创建MediaRecorder对象,准备录制
//       mediaRecorder = new MediaRecorder(window.stream, { mimeType: 'video/webm' });
//     } catch (e) {
//       console.error('创建MediaRecorder错误:', e);
//       return;
//     }

//     //录制停止事件监听
//     mediaRecorder.onstop = (event) => {
//       console.log('录制停止: ', event);
//       console.log('录制的Blobs数据为: ', recordedBlobs);
//     };

//     //录制数据回调事件
//     mediaRecorder.ondataavailable = (event) => {
//       console.log('handleDataAvailable', event);
//       //判断是否有数据
//       if (event.data && event.data.size > 0) {
//         //将数据记录起来
//         recordedBlobs.push(event.data);
//       }
//     };
//     //开始录制并指定录制时间为10秒
//     mediaRecorder.start(10);
//     console.log('MediaRecorder started', mediaRecorder);
//   }

//   stopRecord = (e) => {
//     //停止录制
//     mediaRecorder.stop();
//     //停掉所有的规道
//     stream.getTracks().forEach(track => track.stop());
//     //stream置为空
//     stream = null;

//     //生成blob文件,类型为video/webm
//     const blob = new Blob(recordedBlobs, { type: 'video/webm' });
//     //创建一个下载链接
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     //指定下载文件及类型
//     a.download = 'screen.webm';
//     //将a标签添加至网页上去
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(() => {
//       document.body.removeChild(a);
//       //释放url对象.
//       window.URL.revokeObjectURL(url);
//     }, 100);
//   }

//   render() {
//     return (
//       <div className="container">
//         <h1>
//           <span>录制屏幕示例</span>
//         </h1>
//         {/* 捕获屏幕数据渲染 */}
//         <video className="video" ref="myVideo" autoPlay playsInline></video>
//         <Button onClick={this.startCaptureScreen} style={{ marginRight: "10px" }}>开始</Button>
//         <Button onClick={this.stopRecord}>停止</Button>
//       </div>
//     );
//   }
// }
// //导出组件
// export default RecordScreen;
