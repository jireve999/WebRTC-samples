/**
 * 捕获Canvas作为媒体流示例
 */

// import React, { useRef, useEffect } from 'react';

// const CaptureCanvas = () => {
//   const canvasRef = useRef(null);
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const contextRef = useRef(null);

//   const handleMouseDown = (event) => {
//     const context = contextRef.current;
//     if (!context) return;

//     context.beginPath();
//     context.moveTo(event.offsetX, event.offsetY);
//     context.stroke();

//     // 添加鼠标移动事件监听器
//     canvasRef.current.addEventListener('mousemove', handleMouseMove);
//   };

//   const handleMouseMove = (event) => {
//     const context = contextRef.current;
//     if (!context) return;

//     context.lineTo(event.offsetX, event.offsetY);
//     context.stroke();
//   };

//   const handleMouseUp = () => {
//     canvasRef.current.removeEventListener('mousemove', handleMouseMove);
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     if (!canvas || !video) return;

//     // 获取 Canvas 2D 上下文
//     const context = canvas.getContext('2d');
//     contextRef.current = context;

//     // 绘制初始背景
//     context.fillStyle = '#CCC';
//     context.fillRect(0, 0, 320, 240);
//     context.lineWidth = 1;
//     context.strokeStyle = '#FF0000';

//     // 捕获 Canvas 流（兼容不同浏览器）
//     if (canvas.captureStream) {
//       streamRef.current = canvas.captureStream(10); // 10fps
//     } else if (canvas.mozCaptureStream) {
//       streamRef.current = canvas.mozCaptureStream(10);
//     } else {
//       console.error('Canvas 流捕获不支持');
//       return;
//     }

//     // 设置视频源
//     video.srcObject = streamRef.current;

//     // 绑定鼠标事件
//     canvas.addEventListener('mousedown', handleMouseDown);
//     canvas.addEventListener('mouseup', handleMouseUp);

//     // 清理函数
//     return () => {
//       if (streamRef.current) {
//         const tracks = streamRef.current.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//       canvas.removeEventListener('mousedown', handleMouseDown);
//       canvas.removeEventListener('mouseup', handleMouseUp);
//       canvas.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   return (
//     <div className="container">
//       <h1>捕获 Canvas 作为媒体流示例</h1>
//       <div>
//         <div className="small-canvas">
//           <canvas
//             ref={canvasRef}
//             width="320"
//             height="240"
//             style={{ border: '1px solid #ccc' }}
//           />
//         </div>
//         <video
//           ref={videoRef}
//           className="small-video"
//           playsInline
//           autoPlay
//           style={{ width: '320px', height: '240px', margin: '10px 0' }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CaptureCanvas;

import React from "react";
import '../styles/css/capture-canvas.scss';

//MediaStream对象
let stream;
//画布对象
let canvas;
//画布2D内容
let context;

class CaptureCanvas extends React.Component {

    componentDidMount() {
        canvas = this.refs['canvas'];
        this.startCaptureCanvas();
    }

    //开始捕获Canvas
    startCaptureCanvas = async (e) => {
        stream = canvas.captureStream(10);
        const video = this.refs['video'];
        //将视频对象的源指定为stream
        video.srcObject = stream;

        this.drawLine();
    }

    //画线
    drawLine = () => {
        //获取Canvas的2d内容
        context = canvas.getContext("2d");

        //填充颜色
        context.fillStyle = '#CCC';
        //绘制Canvas背景
        context.fillRect(0,0,320,240);

        context.lineWidth = 1;
        //画笔颜色
        context.strokeStyle = "#FF0000";

        //监听画板鼠标按下事件 开始绘画
        canvas.addEventListener("mousedown", this.startAction);
        //监听画板鼠标抬起事件 结束绘画
        canvas.addEventListener("mouseup", this.endAction);
    }

    //鼠标按下事件
    startAction = (event) => {
        //开始新的路径
        context.beginPath();
        //将画笔移动到指定坐标，类似起点
        context.moveTo(event.offsetX, event.offsetY);
        //开始绘制
        context.stroke();
        //监听鼠标移动事件  
        canvas.addEventListener("mousemove", this.moveAction);
    }

    //鼠标移动事件  
    moveAction = (event) => {
        //将画笔移动到结束坐标，类似终点
        context.lineTo(event.offsetX, event.offsetY);
        //开始绘制
        context.stroke();
    }

    //鼠标抬起事件 
    endAction = () => {
        //移除鼠标移动事件
        canvas.removeEventListener("mousemove", this.moveAction);
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>捕获Canvas作为媒体流示例</span>
                </h1>
                <div>
                    {/* 画布Canvas容器 */}
                    <div className="small-canvas">
                        {/* Canvas不设置样式 */}
                        <canvas ref='canvas'></canvas>
                    </div>
                    <video className="small-video" ref='video' playsInline autoPlay></video>
                </div>
            </div>
        );
    }
}
//导出组件
export default CaptureCanvas;
