/**
 * 共享屏幕示例
 */
import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';

const ScreenSharing = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startScreenShare = async () => {
    const constraints = { video: true }; // 可以设置更详细的约束，如 { video: { width: 1280, height: 720 } }
    try {
      const newStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      handleSuccess(newStream);
      setStream(newStream);
    } catch (error) {
      handleError(error, constraints);
    }
  };

  const handleSuccess = (newStream) => {
    const video = videoRef.current;
    const videoTracks = newStream.getVideoTracks();
    console.log(`视频资源名称: ${videoTracks[0]?.label}`);
    video.srcObject = newStream;
  };

  const handleError = (error, constraints) => {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video;
      message.error(
        `设备不支持指定的分辨率：宽${v?.width?.exact} 高${v?.height?.exact}`
      );
    } else if (error.name === 'PermissionDeniedError') {
      message.error('没有屏幕共享权限，请点击允许按钮');
    } else if (error.name === 'NotFoundError') {
      message.error('未找到可用的媒体设备');
    } else {
      message.error(`未知错误: ${error.name}`);
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
    }
  };

  // 组件卸载时自动停止流
  React.useEffect(() => {
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="container">
      <h1>共享屏幕示例</h1>
      <video className="video" ref={videoRef} autoPlay playsInline />
      <Button onClick={startScreenShare} type="primary">
        开始共享
      </Button>
      {stream && (
        <Button onClick={stopScreenShare} type="danger" style={{ marginLeft: 10 }}>
          停止共享
        </Button>
      )}
    </div>
  );
};

export default ScreenSharing;




// import React from "react";
// import { Button, message } from "antd";

// class ScreenSharing extends React.Component {

//   //开始捕获桌面
//   startScreenShare = async (e) => {
//     try {
//       //调用getDisplayMedia方法,约束设置成{video:true}即可
//       const stream = await navigator.mediaDevices.getDisplayMedia({video: true});
//       console.log('handleSuccess:');
//       this.handleSuccess(stream);
//     } catch (e) {
//       this.handleError(e);
//     }
//   }

//   //成功捕获,返回视频流
//   handleSuccess = (stream) => {
//     const video = this.refs['myVideo'];
//     //获取视频轨道
//     const videoTracks = stream.getVideoTracks();
//     //读取视频资源名称
//     console.log(`视频资源名称: ${videoTracks[0].label}`);
//     window.stream = stream; 
//     //将视频对象的源指定为stream
//     video.srcObject = stream;
//   }

//   //错误处理
//   handleError(error) {
//     if (error.name === 'ConstraintNotSatisfiedError') {
//       const v = constraints.video;
//       //宽高尺寸错误
//       message.error(`宽:${v.width.exact} 高:${v.height.exact} 设备不支持`);
//     } else if (error.name === 'PermissionDeniedError') {
//       message.error('没有摄像头和麦克风使用权限,请点击允许按钮');
//     }
//     message.error(`getUserMedia错误: ${error.name}`, error);
//   }

//   render() {
//     return (
//       <div className="container">
//         <h1>
//           <span>共享屏幕示例</span>
//         </h1>
//         {/* 捕获屏幕数据渲染 */}
//         <video className="video" ref="myVideo" autoPlay playsInline></video>
//         <Button onClick={this.startScreenShare}>开始共享</Button>
//       </div>
//     );
//   }
// }
// //导出组件
// export default ScreenSharing;