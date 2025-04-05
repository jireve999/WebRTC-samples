// /**
//  * 打开麦克风
//  */
import React, { useRef, useState, useEffect } from 'react';
import { Button, Alert } from 'antd';

const Microphone = () => {
  const audioRef = useRef(null);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // 清理音轨资源
  const stopTracks = (stream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      if (window.stream) {
        stopTracks(window.stream);
      }
    };
  }, []);

  // 开始录音
  const startRecording = async () => {
    try {
      const constraints = { 
        audio: { 
          noiseSuppression: true,  // 启用噪声抑制
          echoCancellation: true   // 启用回声消除
        }, 
        video: false 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      window.stream = stream;
      
      const audioTracks = stream.getAudioTracks();
      console.log(`使用的音频设备: ${audioTracks[0].label}`);
      
      audioRef.current.srcObject = stream;
      setIsRecording(true);
      
      stream.oninactive = () => {
        console.log('录音已停止');
        setIsRecording(false);
      };

    } catch (err) {
      handleError(err);
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (window.stream) {
      stopTracks(window.stream);
      setIsRecording(false);
    }
  };

  // 错误处理
  const handleError = (error) => {
    console.error('麦克风访问错误:', error);
    setError({
      name: error.name,
      message: error.message || '无法访问麦克风设备'
    });
  };

  return (
    <div className="container">
      <h1>麦克风示例</h1>
      
      {error && (
        <Alert
          message="错误提示"
          description={`${error.name}: ${error.message}`}
          type="error"
          showIcon
          closable
        />
      )}

      <audio 
        ref={audioRef} 
        controls 
        muted={!isRecording}  // 防止反馈循环
        style={{ margin: '20px 0' }}
      />
      
      <div style={{ marginTop: 16 }}>
        {!isRecording ? (
          <Button type="primary" onClick={startRecording}>
            开始录音
          </Button>
        ) : (
          <Button danger onClick={stopRecording}>
            停止录音
          </Button>
        )}
      </div>

      <Alert
        message="使用提示"
        description="请使用耳机以避免声音反馈问题"
        type="info"
        showIcon
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default Microphone;




// import React from "react";

// class Microphone extends React.Component {

//   componentDidMount(){
//     const constraints = window.constraints = {
//       //启用音频
//       audio: true,
//       //禁用视频
//       video: false
//     };
//     //根据约束条件获取媒体
//     navigator.mediaDevices.getUserMedia(constraints).then(this.handleSuccess).catch(this.handleError);
//   }

//   //获取媒体成功
//   handleSuccess = (stream) => {
//     //获取audio对象
//     let audio = this.refs['audio'];
//     //获取音频规道
//     const audioTracks = stream.getAudioTracks();
//     //获取音频设备名称
//     console.log('获取的音频设备为: ' + audioTracks[0].label);
//     //不活动状态
//     stream.oninactive = () => {
//       console.log('Stream停止');
//     };
//     window.stream = stream;
//     //将audio播放源指定为stream
//     audio.srcObject = stream;
//   }

//   //错误处理
//   handleError(error) {
//     console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
//   }

//   render() {
    
//     return (

//       <div className="container">
//         <h1>
//           <span>麦克风示例</span>
//         </h1>
//         {/* 音频对象,可播放声音 */}
//         <audio ref="audio" controls autoPlay></audio>
//         <p className="warning">警告: 如何没有使用头戴式耳机, 声音会反馈到扬声器.</p>
//       </div>

//     );
//   }
// }
// //导出组件
// export default Microphone;