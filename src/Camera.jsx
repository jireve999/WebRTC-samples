/**
 * 打开视频
 */
import React from 'react';
import { Button, message, Alert, Spin } from 'antd';

// 视频约束配置
const VIDEO_CONSTRAINTS = {
  audio: false,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  }
};

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCameraActive: false,
      isLoading: false,
      error: null,
      currentCamera: 'user'
    };
    this.videoRef = React.createRef();
  }

  componentWillUnmount() {
    this.stopCamera();
  }

  startCamera = async () => {
    this.setState({ isLoading: true, error: null });
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS);
      this.handleSuccess(stream);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  stopCamera = () => {
    if (window.stream) {
      window.stream.getTracks().forEach(track => track.stop());
      this.videoRef.current.srcObject = null;
      this.setState({ isCameraActive: false });
    }
  };

  switchCamera = async () => {
    const newMode = this.state.currentCamera === 'user' ? 'environment' : 'user';
    this.setState({ currentCamera: newMode }, async () => {
      this.stopCamera();
      await this.startCamera();
    });
  };

  handleSuccess = (stream) => {
    window.stream = stream;
    const video = this.videoRef.current;
    
    if (video) {
      video.srcObject = stream;
      this.setState({ isCameraActive: true });
      
      // 自动播放处理
      video.play().catch(error => {
        this.setState({ 
          error: {
            name: 'AutoPlayError',
            message: '浏览器自动播放策略限制，请点击视频手动播放'
          }
        });
      });
    }

    // 设备信息日志
    const videoTrack = stream.getVideoTracks()[0];
    console.log('Active video constraints:', videoTrack.getSettings());
  };

  handleError = (error) => {
    console.error('摄像头访问错误:', error);
    
    let errorMessage;
    switch(error.name) {
      case 'NotAllowedError':
        errorMessage = '请允许摄像头访问权限';
        break;
      case 'NotFoundError':
        errorMessage = '未找到视频输入设备';
        break;
      case 'OverconstrainedError':
        errorMessage = '当前设备不支持请求的分辨率';
        break;
      default:
        errorMessage = `摄像头错误: ${error.message || '未知错误'}`;
    }

    this.setState({ 
      error: {
        name: error.name,
        message: errorMessage
      }
    });
  };

  render() {
    const { isCameraActive, isLoading, error, currentCamera } = this.state;

    return (
      <div className="container">
        <h1>摄像头示例</h1>
        
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

        <Spin spinning={isLoading} tip="正在连接摄像头...">
          <video 
            ref={this.videoRef}
            className="video" 
            autoPlay 
            playsInline
            controls={false}
            muted // 解决自动播放限制
            style={{ 
              transform: currentCamera === 'user' ? 'scaleX(-1)' : 'none',
              maxWidth: '100%'
            }}
          />
        </Spin>

        <div className="control-panel" style={{ marginTop: 16 }}>
          {!isCameraActive ? (
            <Button 
              type="primary" 
              onClick={this.startCamera}
              disabled={isLoading}
            >
              {isLoading ? '连接中...' : '开启摄像头'}
            </Button>
          ) : (
            <>
              <Button danger onClick={this.stopCamera}>
                关闭摄像头
              </Button>
              <Button 
                style={{ marginLeft: 8 }}
                onClick={this.switchCamera}
              >
                切换摄像头 ({currentCamera === 'user' ? '前置' : '后置'})
              </Button>
            </>
          )}
        </div>

        <div className="device-info" style={{ marginTop: 20 }}>
          <p>当前分辨率: {VIDEO_CONSTRAINTS.video.width.ideal}×{VIDEO_CONSTRAINTS.video.height.ideal}</p>
          <p>摄像头模式: {currentCamera === 'user' ? '前置摄像头' : '后置摄像头'}</p>
        </div>
      </div>
    );
  }
}

export default Camera;



// import React from "react";
// import { Button, message } from "antd";

// //约束条件
// const constraints = window.constraints = {
//   //禁用音频
//   audio: false,
//   //启用视频
//   video: {
//     width: { ideal: 1280 },  // 改为 ideal 代替 exact
//     height: { ideal: 720 },
//     facingMode: "user"       // 明确指定使用前置摄像头
//   }
// };

// /**
//  * 摄像头使用示例
//  */
// class Camera extends React.Component {
//   constructor() {
//     super();
//   }

//   //打开摄像头
//   openCamera = async (e) => {
//     try {
//       //根据约束条件获取媒体
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       console.log('handleSuccess:');
//       this.handleSuccess(stream);
//     } catch (e) {
//       this.handleError(e);
//     }
//   }

//   //关闭摄像头
//   closeCamera = () => {
//     const tracks = window.stream.getTracks();
//     for (let i = 0; i < tracks.length; i++) {
//       const track = tracks[i];
//       track.stop();
//     }
//   }

//   handleSuccess = (stream) => {
//     const video = this.refs['myVideo'];
//     const videoTracks = stream.getVideoTracks();
//     console.log('通过设置限制条件获取到流:', constraints);
//     console.log(`使用的视频设备: ${videoTracks[0].label}`);
//     //使得浏览器能访问到stream
//     window.stream = stream; 
//     video.srcObject = stream;
//   }

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
//           <span>摄像头示例</span>
//         </h1>
//         <video className="video" ref="myVideo" autoPlay playsInline></video>
//         <Button onClick={this.openCamera}>打开摄像头</Button>
//         <Button onClick={this.closeCamera}>关闭摄像头</Button>
//         <br />
//         <br />
//         <div className="footer">
//           <p>摄像头使用示例</p>
//           <p>本示例使用了摄像头的约束条件</p>
//           <p>宽高尺寸: {constraints.video.width.ideal} * {constraints.video.height.ideal}</p>
//           <p>设备: {constraints.video.facingMode}</p>
//         </div>
//       </div>
//     );
//   }
// }
// //导出组件
// export default Camera;