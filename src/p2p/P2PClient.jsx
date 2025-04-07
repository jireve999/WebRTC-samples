/**
 * 一对一客户端
 */
import React, { useState, useEffect, useCallback } from 'react';
import { List, Button } from 'antd';
import HangupIcon from 'mdi-react/PhoneHangupIcon';
import VideoIcon from 'mdi-react/VideoIcon';
import VideocamOffIcon from 'mdi-react/VideocamOffIcon';
import MicrophoneIcon from 'mdi-react/MicrophoneIcon';
import MicrophoneOffIcon from 'mdi-react/MicrophoneOffIcon';
import LocalVideoView from './LocalVideoView';
import RemoteVideoView from './RemoteVideoView';
import P2PVideoCall from './P2PVideoCall';
import P2PLogin from './P2PLogin';
import './../../styles/css/p2p.scss';

const P2PClient = () => {
  // 状态管理
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('111111');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  // 信令对象
  const p2pVideoCallRef = React.useRef(null);

  // 连接服务器
  const connectServer = useCallback(() => {
    const p2pUrl = 'wss://' + window.location.hostname + ':8000/ws';
    const turnUrl = 'https://' + window.location.hostname + ':9000/api/turn?service=turn&username=sample';
    console.log('信令服务器地址:', p2pUrl);
    console.log('中转服务器地址:', turnUrl);

    // 初始化信令
    p2pVideoCallRef.current = new P2PVideoCall(p2pUrl, turnUrl, userName, roomId);

    // 监听事件
    p2pVideoCallRef.current.on('updateUserList', (users, self) => {
      setUsers(users);
      setUserId(self);
    });

    p2pVideoCallRef.current.on('newCall', () => {
      setIsVideoCall(true);
    });

    p2pVideoCallRef.current.on('localstream', (stream) => {
      setLocalStream(stream);
    });

    p2pVideoCallRef.current.on('addstream', (stream) => {
      setRemoteStream(stream);
    });

    p2pVideoCallRef.current.on('removestream', () => {
      setRemoteStream(null);
    });

    p2pVideoCallRef.current.on('hangUp', () => {
      setIsVideoCall(false);
      setLocalStream(null);
      setRemoteStream(null);
    });

    p2pVideoCallRef.current.on('leave', () => {
      setIsVideoCall(false);
      setLocalStream(null);
      setRemoteStream(null);
    });
  }, [userName, roomId]);

  // 登录处理
  const loginHandler = useCallback((userName, roomId) => {
    setUserName(userName);
    setRoomId(roomId);
    setIsLogin(true);
    connectServer();
  }, [connectServer]);

  // 呼叫对方参与会话
  const handleStartCall = useCallback((remoteUserId, type) => {
    if (p2pVideoCallRef.current) {
      p2pVideoCallRef.current.startCall(remoteUserId, type);
    }
  }, []);

  // 挂断处理
  const handleUp = useCallback(() => {
    if (p2pVideoCallRef.current) {
      p2pVideoCallRef.current.hangUp();
    }
  }, []);

  // 打开/关闭本地视频
  const onVideoOnClickHandler = useCallback(() => {
    const newVideoMuted = !videoMuted;
    setVideoMuted(newVideoMuted);
    onToggleLocalVideoTrack(newVideoMuted);
  }, [videoMuted]);

  const onToggleLocalVideoTrack = useCallback((muted) => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length === 0) {
        console.log('没有本地视频.');
        return;
      }
      console.log('打开/关闭本地视频.');
      videoTracks.forEach((track) => {
        track.enabled = !muted;
      });
    }
  }, [localStream]);

  // 打开/关闭本地音频
  const onAudioClickHandler = useCallback(() => {
    const newAudioMuted = !audioMuted;
    setAudioMuted(newAudioMuted);
    onToggleLocalAudioTrack(newAudioMuted);
  }, [audioMuted]);

  const onToggleLocalAudioTrack = useCallback((muted) => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length === 0) {
        console.log('没有本地音频.');
        return;
      }
      console.log('打开/关闭本地音频.');
      audioTracks.forEach((track) => {
        track.enabled = !muted;
      });
    }
  }, [localStream]);

  return (
    <div className="main-layout">
      {!isLogin ? (
        <div className="login-container">
          <h2>一对一视频通话案例</h2>
          <P2PLogin loginHandler={loginHandler} />
        </div>
      ) : !isVideoCall ? (
        <List
          bordered
          header={'一对一视频通话案例'}
          footer={'终端列表(Web/Android/iOS)'}
        >
          {users.map((user) => (
            <List.Item key={user.id}>
              <div className="list-item">
                {user.name + user.id}
                {user.id !== userId && (
                  <div styles={{ display: 'flex', paddingTop: '4px' }}>
                    <Button
                      type="link"
                      onClick={() => handleStartCall(user.id, 'video')}
                    >
                      视频
                    </Button>
                    <Button
                      type="link"
                      onClick={() => handleStartCall(user.id, 'screen')}
                    >
                      共享桌面
                    </Button>
                  </div>
                )}
              </div>
            </List.Item>
          ))}
        </List>
      ) : (
        <div>
          <div>
            {/* 渲染远端视频 */}
            {remoteStream && (
              <RemoteVideoView stream={remoteStream} id="remoteview" />
            )}
            {/* 渲染本地视频 */}
            {localStream && (
              <LocalVideoView
                stream={localStream}
                muted={videoMuted}
                id="localview"
              />
            )}
          </div>
          <div className="btn-tools">
            <Button
              className="button"
              ghost
              size="large"
              shape="circle"
              icon={videoMuted ? <VideocamOffIcon /> : <VideoIcon />}
              onClick={onVideoOnClickHandler}
            />
            <Button
              className="button"
              ghost
              size="large"
              shape="circle"
              icon={<HangupIcon />}
              onClick={handleUp}
            />
            <Button
              ghost
              size="large"
              shape="circle"
              icon={audioMuted ? <MicrophoneOffIcon /> : <MicrophoneIcon />}
              onClick={onAudioClickHandler}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default P2PClient;
