/**
 * 画布截取视频示例
 */
import React, { createRef } from 'react';
import { Button, message, Spin, Alert } from 'antd';
import '../styles/css/canvas.scss';

const VIDEO_CONSTRAINTS = {
  audio: false,
  video: { width: 1280, height: 720 }
};

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCameraActive: false,
      isLoading: true,
      error: null,
      captureCount: 0
    };
    this.videoRef = createRef();
    this.canvasRef = createRef();
  }

  componentDidMount() {
    this.initializeCamera();
  }

  componentWillUnmount() {
    this.stopCamera();
  }

  initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS);
      this.handleSuccess(stream);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSuccess = (stream) => {
    window.stream = stream;
    const video = this.videoRef.current;
    
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      this.setState({ isCameraActive: true });
      video.play().catch(error => {
        this.setState({ 
          error: {
            name: 'AutoPlayError',
            message: '请点击视频手动播放'
          }
        });
      });
    };
  };

  stopCamera = () => {
    if (window.stream) {
      window.stream.getTracks().forEach(track => track.stop());
      this.videoRef.current.srcObject = null;
      this.setState({ isCameraActive: false });
    }
  };

  takeSnapshot = () => {
    const video = this.videoRef.current;
    const canvas = this.canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    this.setState(prev => ({ captureCount: prev.captureCount + 1 }));
  };

  downloadSnapshot = () => {
    const canvas = this.canvasRef.current;
    const link = document.createElement('a');
    link.download = `snapshot-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  handleError = (error) => {
    console.error('摄像头错误:', error);
    let errorMessage;
    
    switch(error.name) {
      case 'NotAllowedError':
        errorMessage = '请允许摄像头访问权限';
        break;
      case 'NotFoundError':
        errorMessage = '未找到视频输入设备';
        break;
      default:
        errorMessage = `摄像头错误: ${error.message || '未知错误'}`;
    }
    
    this.setState({ 
      error: { name: error.name, message: errorMessage },
      isLoading: false 
    });
  };

  render() {
    const { isCameraActive, isLoading, error, captureCount } = this.state;

    return (
      <div className="container">
        <h1>视频截图示例</h1>

        {error && (
          <Alert
            message="设备错误"
            description={`${error.name}: ${error.message}`}
            type="error"
            showIcon
            closable
            onClose={() => this.setState({ error: null })}
          />
        )}

        <Spin spinning={isLoading} tip="初始化摄像头...">
          <div className="media-container">
            <video 
              ref={this.videoRef}
              className="small-video"
              playsInline
              muted
              onClick={() => this.videoRef.current?.play()}
              style={{ cursor: 'pointer' }}
            />
            <canvas 
              ref={this.canvasRef}
              className="small-canvas"
              style={{ display: captureCount > 0 ? 'block' : 'none' }}
            />
          </div>
        </Spin>

        <div className="control-panel">
          <Button 
            type="primary" 
            onClick={this.takeSnapshot}
            disabled={!isCameraActive}
          >
            截图 ({captureCount})
          </Button>
          
          <Button 
            danger 
            onClick={this.stopCamera}
            style={{ marginLeft: 8 }}
            disabled={!isCameraActive}
          >
            关闭摄像头
          </Button>
          
          {captureCount > 0 && (
            <Button 
              type="link"
              onClick={this.downloadSnapshot}
              style={{ marginLeft: 8 }}
            >
              下载截图
            </Button>
          )}
        </div>

        <div className="tip-area">
          <p>操作提示：</p>
          <ul>
            <li>点击视频画面可手动播放</li>
            <li>截图会自动适应视频分辨率</li>
            <li>下载的图片为PNG格式</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Canvas;



// import React from "react";
// import {Button} from "antd";
// import '../styles/css/canvas.scss';

// //视频
// let video;

// class Canvas extends React.Component {
//   constructor() {
//     super();
//   }

//   componentDidMount(){
//     //获取video对象
//     video = this.refs['video'];

//     //约束条件
//     const constraints = {
//         //禁用音频
//         audio: false,
//         //启用视频
//         video: true
//       };
//       //根据约束获取视频流
//       navigator.mediaDevices.getUserMedia(constraints).then(this.handleSuccess).catch(this.handleError);
//   }

//   //获取视频成功
//   handleSuccess = (stream) => {
//     window.stream = stream;
//     //将视频源指定为视频流
//     video.srcObject = stream;
//   }

//   stopCamera = () => {
//     if (window.stream) {
//       window.stream.getTracks().forEach(track => track.stop());
//       this.videoRef.current.srcObject = null;
//       this.setState({ isCameraActive: false });
//     }
//   };
  
//   //截屏处理
//   takeSnap = async (e) => {
//     //获取画布对象
//     let canvas = this.refs['canvas'];
//     //设置画面宽度
//     canvas.width = video.videoWidth;
//     //设置画面高度
//     canvas.height = video.videoHeight;
//     //根据视频对象,xy坐标,画布宽,画布高绘制位图
//     canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//   }

//   //错误处理
//   handleError(error) {
//     console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
//   }

//   render() {
    
//     return (
//       <div className="container">
//         <h1>
//           <span>截取视频示例</span>
//         </h1>
//         <div>
//           <video className="small-video" ref='video' playsInline autoPlay></video>
//           {/* 画布Canvas */}
//           <canvas className="small-canvas" ref='canvas'></canvas>
//         </div>
//         <Button className="button" onClick={this.takeSnap}>截屏</Button>
//         <Button danger onClick={this.stopCamera}>关闭摄像头</Button>
//       </div>
//     );
//   }
// }
// //导出组件
// export default Canvas;