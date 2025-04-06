/**
 * 录制视频示例
 */
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import '../styles/css/record-video.scss';

const RecordVideo = () => {
  const [status, setStatus] = useState('start');
  const videoPreviewRef = useRef();
  const videoPlayerRef = useRef();
  const streamRef = useRef();
  const mediaRecorderRef = useRef();
  const recordedBlobsRef = useRef([]);

  // 资源清理
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current?.stop();
    };
  }, []);

  // 打开摄像头并预览视频
  const startClickHandler = async () => {
    const constraints = {
      audio: true,
      video: {
        width: 1280,
        height: 720,
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoPreviewRef.current.srcObject = stream;
      setStatus('startRecord');
    } catch (e) {
      console.error('获取媒体流失败:', e);
    }
  };

  // 开始录制
  const startRecordButtonClickHandler = () => {
    recordedBlobsRef.current = [];
    let options = { mimeType: 'video/webm;codecs=vp9' };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm;codecs=vp8' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: '' };
        }
      }
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(
        streamRef.current,
        options
      );
    } catch (e) {
      console.error('创建 MediaRecorder 失败:', e);
      return;
    }

    mediaRecorderRef.current.onstop = () => {
      console.log('录制停止', recordedBlobsRef.current);
    };

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedBlobsRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.start(10);
    setStatus('stopRecord');
  };

  // 停止录制
  const stopRecordButtonClickHandler = () => {
    mediaRecorderRef.current?.stop();
    setStatus('play');
  };

  // 回放视频
  const playButtonClickHandler = () => {
    const blob = new Blob(recordedBlobsRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    videoPlayerRef.current.src = url;
    videoPlayerRef.current.controls = true;
    videoPlayerRef.current.play();

    setStatus('download');
  };

  // 下载视频
  const downloadButtonClickHandler = () => {
    const blob = new Blob(recordedBlobsRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recorded_video.webm';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus('start');
  };

  return (
    <div className="container">
      <h1>视频录制示例</h1>
      {/* 预览视频 */}
      <video
        className="small-video"
        ref={videoPreviewRef}
        playsInline
        autoPlay
        muted
      />
      {/* 播放视频 */}
      <video
        className="small-video"
        ref={videoPlayerRef}
        playsInline
        loop
      />

      <div>
        <Button
          className="button"
          onClick={startClickHandler}
          disabled={status !== 'start'}
        >
          打开摄像头
        </Button>
        <Button
          className="button"
          onClick={startRecordButtonClickHandler}
          disabled={status !== 'startRecord'}
        >
          开始录制
        </Button>
        <Button
          className="button"
          onClick={stopRecordButtonClickHandler}
          disabled={status !== 'stopRecord'}
        >
          停止录制
        </Button>
        <Button
          className="button"
          onClick={playButtonClickHandler}
          disabled={status !== 'play'}
        >
          播放
        </Button>
        <Button
          className="button"
          onClick={downloadButtonClickHandler}
          disabled={status !== 'download'}
        >
          下载
        </Button>
      </div>
    </div>
  );
};

export default RecordVideo;

// import React from "react";
// import { Button, } from "antd";
// import "../styles/css/record-video.scss";

// //录制对象
// let mediaRecorder;
// //录制数据
// let recordedBlobs;
// //视频预览,用于录制过程中预览视频
// let videoPreview;
// //视频播放,用于录制完成后回放视频
// let videoPlayer;

// class RecordVideo extends React.Component {
//   constructor() {
//     super();
//     //录制状态
//     this.state = {
//       status: 'start',
//     }
//   }

//   componentDidMount() {
//     //视频预览对象
//     videoPreview = this.refs['videoPreview'];
//     //视频回放对象
//     videoPlayer = this.refs['videoPlayer'];
//   }

//   //打开摄像头并预览视频
//   startClickHandler = async (e) => {
//     //约束条件
//     let constraints = {
//       //开启音频
//       audio: true,
//       //设置视频分辨率为1280*720
//       video: {
//         width: 1280, height: 720
//       }
//     };
//     console.log('约束条件为:', constraints);
//     try {
//       //获取音视频流
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       window.stream = stream;
//       //将视频预览对象源指定为stream
//       videoPreview.srcObject = stream;
//       this.setState({
//         status: 'startRecord',
//       });
//     } catch (e) {
//       console.error('navigator.getUserMedia error:', e);
//     }
//   }

//   //开始录制
//   startRecordButtonClickHandler = (e) => {
//     //录制数据
//     recordedBlobs = [];
//     //指定mimeType类型,依次判断是否支持vp9 vp8编码格式
//     let options = { mimeType: 'video/webm;codecs=vp9' };
//     if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//       console.error("video/webm;codecs=vp9不支持");
//       options = { mimeType: 'video/webm;codecs=vp8' };
//       if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//         console.error("video/webm;codecs=vp8不支持");
//         options = { mimeType: 'video/webm' };
//         if (!MediaRecorder.isTypeSupported(options.mimeType)) {
//           console.error(`video/webm不支持`);
//           options = { mimeType: '' };
//         }
//       }
//     }

//     try {
//       //创建MediaRecorder对象,准备录制
//       mediaRecorder = new MediaRecorder(window.stream, options);
//     } catch (e) {
//       console.error('创建MediaRecorder错误:', e);
//       return;
//     }

//     //录制停止事件监听
//     mediaRecorder.onstop = (event) => {
//       console.log('录制停止: ', event);
//       console.log('录制的Blobs数据为: ', recordedBlobs);
//     };
//     mediaRecorder.ondataavailable = this.handleDataAvailable;
//     //开始录制并指定录制时间为10秒
//     mediaRecorder.start(10);
//     console.log('MediaRecorder started', mediaRecorder);
//     //设置录制状态
//     this.setState({
//       status: 'stopRecord',
//     });
//   }

//   stopRecordButtonClickHandler = (e) => {
//     //停止录制
//     mediaRecorder.stop();
//     //设置录制状态
//     this.setState({
//       status: 'play',
//     });
//   }

//   //回放录制视频
//   playButtonClickHandler = (e) => {
//      //生成blob文件,类型为video/webm
//     const blob = new Blob(recordedBlobs, { type: 'video/webm' });
//     videoPlayer.src = null;
//     videoPlayer.srcObject = null;
//     //URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL
//     videoPlayer.src = window.URL.createObjectURL(blob);
//     //显示播放器控件
//     videoPlayer.controls = true;
//     //开始播放
//     videoPlayer.play();
//     //设置录制状态
//     this.setState({
//       status: 'download',
//     });
//   }

//   //点击下载录制文件
//   downloadButtonClickHandler = (e) => {
//     //生成blob文件,类型为video/webm
//     const blob = new Blob(recordedBlobs, { type: 'video/webm' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     //指定下载文件及类型
//     a.download = 'test.webm';
//     //将a标签添加至网页上去
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(() => {
//       document.body.removeChild(a);
//       //URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建的对象URL.
//       window.URL.revokeObjectURL(url);
//     }, 100);
//     //设置录制状态
//     this.setState({
//       status: 'start',
//     });
//   }

//   //录制数据回调事件
//   handleDataAvailable = (event) => {
//     console.log('handleDataAvailable', event);
//     //判断是否有数据
//     if (event.data && event.data.size > 0) {
//       //将数据记录起来
//       recordedBlobs.push(event.data);
//     }
//   }

//   render() {

//     return (
//       <div className="container">

//         <h1>
//           <span>录制视频示例</span>
//         </h1>
//         {/* 视频预览 muted表示默认静音 */}
//         <video className="small-video" ref="videoPreview" playsInline autoPlay muted></video>
//          {/* 视频回放 loop表示循环播放 */}
//         <video className="small-video" ref="videoPlayer" playsInline loop></video>

//         <div>
//           <Button
//             className="button"
//             onClick={this.startClickHandler}
//             disabled={this.state.status != 'start'}>
//             打开摄像头
//             </Button>
//           <Button
//             className="button"
//             disabled={this.state.status != 'startRecord'}
//             onClick={this.startRecordButtonClickHandler}>
//             开始录制
//           </Button>
//           <Button
//             className="button"
//             disabled={this.state.status != 'stopRecord'}
//             onClick={this.stopRecordButtonClickHandler}>
//             停止录制
//           </Button>
//           <Button
//             className="button"
//             disabled={this.state.status != 'play'}
//             onClick={this.playButtonClickHandler}>
//             播放
//           </Button>
//           <Button
//             className="button"
//             disabled={this.state.status != 'download'}
//             onClick={this.downloadButtonClickHandler}>
//             下载
//             </Button>
//         </div>
//       </div>
//     );
//   }
// }
// //导出组件
// export default RecordVideo;
