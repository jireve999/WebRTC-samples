/**
 * 音频音量检测示例
 */
import React, { useState, useEffect, useRef } from 'react';
import SoundMeter from './soundmeter';

const AudioVolume = () => {
  const [audioLevel, setAudioLevel] = useState(0);
  const soundMeterRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // 初始化 AudioContext
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    } catch (e) {
      console.error('网页音频 API 不支持:', e);
      return;
    }

    // 初始化 SoundMeter
    soundMeterRef.current = new SoundMeter(audioContextRef.current);

    // 获取媒体流
    const constraints = {
      audio: true,
      video: false
    };

    const handleSuccess = (stream) => {
      streamRef.current = stream;
      soundMeterRef.current.connectToSource(stream);
      startMonitoring();
    };

    const handleError = (error) => {
      console.error('获取媒体流失败:', error);
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);

    // 清理函数：停止流和监控
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startMonitoring = () => {
    const updateLevel = () => {
      const val = (soundMeterRef.current.instant.toFixed(2) * 348) + 1;
      setAudioLevel(val);
      timerRef.current = setTimeout(updateLevel, 100);
    };
    timerRef.current = setTimeout(updateLevel, 100);
  };

  return (
    <div className="container">
      <h1>音量检测示例</h1>
      <div
        style={{
          width: `${audioLevel}px`,
          height: '10px',
          backgroundColor: '#8dc63f',
          marginTop: '20px',
          transition: 'width 0.1s ease-out', // 平滑过渡效果
        }}
      />
    </div>
  );
};

export default AudioVolume;


// import React from "react";
// import SoundMeter from './soundmeter';

// //定义音量测算对象
// let soundMeter;

// class AudioVolume extends React.Component {

//   constructor(props) {
//     super(props)
//     this.state = {
//       //音量值
//       audioLevel: 0,
//     }
//   }

//   componentDidMount() {

//     try {
//       //AudioContext是用于管理和播放所有的声音
//       window.AudioContext = window.AudioContext || window.webkitAudioContext;
//       //实例化AudioContext
//       window.audioContext = new AudioContext();
//     } catch (e) {
//       console.log('网页音频API不支持.');
//     }
    
//     //SoundMeter声音测量,用于做声音音量测算使用的
//     soundMeter = window.soundMeter = new SoundMeter(window.audioContext);

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
//     window.stream = stream;
//     //将声音测量对象与流连接起来
//     soundMeter.connectToSource(stream);
//     //开始实时读取音量值
//     setTimeout(this.soundMeterProcess, 100);
//   }

//   //音频音量处理
//   soundMeterProcess = () => {
//     //读取音量值,再乘以一个系数,可以得到音量条的宽度
//     var val = (window.soundMeter.instant.toFixed(2) * 348) + 1;
//     //设置音量值状态
//     this.setState({ audioLevel: val });
//     //每隔100毫秒调用一次soundMeterProcess函数,模拟实时检测音频音量
//     setTimeout(this.soundMeterProcess, 100);
//   }

//   //错误处理
//   handleError(error) {
//     console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
//   }

//   render() {
//     return (
//       <div className="container">
//         <h1>
//           <span>音量检测示例</span>
//         </h1>
//         {/* 这是使用了一个div来作为音量条的展示,高度固定,宽度根据音量值来动态变化 */}
//         <div style={{
//           width: this.state.audioLevel + 'px',
//           height: '10px',
//           backgroundColor: '#8dc63f',
//           marginTop: '20px',
//         }}>
//         </div>
//       </div>
//     );
//   }
// }
// //导出组件
// export default AudioVolume;