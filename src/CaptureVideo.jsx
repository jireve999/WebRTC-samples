/**
 * 捕获Video作为媒体流示例
 */

import React, { useRef, useEffect } from 'react';

const CaptureVideo = () => {
  const sourceVideoRef = useRef(null);
  const playerVideoRef = useRef(null);
  let stream; // 声明媒体流变量

  // 处理视频可播放事件
  const handleCanPlay = () => {
    const sourceVideo = sourceVideoRef.current;
    const playerVideo = playerVideoRef.current;

    // 捕获媒体流（兼容不同浏览器）
    if (sourceVideo.captureStream) {
      stream = sourceVideo.captureStream(0); // 0 表示使用默认帧率
    } else if (sourceVideo.mozCaptureStream) {
      stream = sourceVideo.mozCaptureStream(0);
    } else {
      console.error('captureStream 不支持');
      return;
    }

    // 设置播放器视频源
    playerVideo.srcObject = stream;
  };

  // 清理媒体流（组件卸载时）
  useEffect(() => {
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="container">
      <h1>捕获Video作为媒体流示例</h1>
      {/* 源视频（带控制按钮、循环播放、静音） */}
      <video
        ref={sourceVideoRef}
        playsInline
        controls
        loop
        muted
        onCanPlay={handleCanPlay}
      >
        <source src="./assets/webrtc.mp4" type="video/mp4" />
      </video>
      {/* 播放器视频（自动播放） */}
      <video ref={playerVideoRef} playsInline autoPlay></video>
    </div>
  );
};

export default CaptureVideo;

// import React from "react";

// class CaptureVideo extends React.Component {
//     constructor() {
//         super();
//     }

//     //开始播放
//     canPlay = () => {

//         //源视频对象
//         let sourceVideo = this.refs['sourceVideo'];
//         //播放视频对象
//         let playerVideo = this.refs['playerVideo'];

//         //MediaStream对象
//         let stream;
//         //捕获侦率
//         const fps = 0;
//         //浏览器兼容判断,捕获媒体流
//         if (sourceVideo.captureStream) {
//             stream = sourceVideo.captureStream(fps);
//         } else if (sourceVideo.mozCaptureStream) {
//             stream = sourceVideo.mozCaptureStream(fps);
//         } else {
//             console.error('captureStream不支持');
//             stream = null;
//         }
//         //将播放器源指定为stream
//         playerVideo.srcObject = stream;
//     }

//     render() {
//         return (
//             <div className="container">
//                 <h1>
//                     <span>捕获Video作为媒体流示例</span>
//                 </h1>
//                 {/* 源视频 显示控制按钮 循环播放 */}
//                 <video ref="sourceVideo" playsInline controls loop muted onCanPlay={this.canPlay}>
//                     {/* mp4视频路径 */}
//                     <source src="./assets/webrtc.mp4" type="video/mp4" />
//                 </video>
//                 <video ref="playerVideo" playsInline autoPlay></video>
//             </div>
//         );
//     }
// }
// //导出组件
// export default CaptureVideo;
