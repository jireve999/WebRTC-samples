import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// import 'antd/dist/reset.css'; // Ant Design 5.x 必需
import '../styles/css/styles.scss';

if (process.env.NODE_ENV === 'development') {
  window.addEventListener('securitypolicyviolation', (e) => {
    if (e.blockedURI.includes('captive.apple.com')) {
      e.preventDefault();
      console.warn('Bypassing captive portal detection in development');
    }
  });
}

// 提前请求媒体设备权限（可选）
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
    if (!hasVideoDevice) {
      console.warn('未检测到摄像头设备');
    }
  });

// 兼容旧版浏览器
if (!navigator.mediaDevices) {
  navigator.mediaDevices = {};
}

if (!navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    const legacyGetUserMedia = 
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    
    if (!legacyGetUserMedia) {
      return Promise.reject(new Error('浏览器不支持音频设备访问'));
    }
    
    return new Promise((resolve, reject) => {
      legacyGetUserMedia.call(navigator, constraints, resolve, reject);
    });
  };
}

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);