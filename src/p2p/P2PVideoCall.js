/**
 * 信令类
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import Axios from 'axios';
import { EventEmitter } from 'events';

export const useP2PVideoCall = (p2pUrl, turnUrl, userName, roomId) => {
  // Refs 用于保存需要持久化的数据
  const peerConnections = useRef({});
  const socket = useRef(null);
  const localStream = useRef(null);
  const eventEmitter = useRef(new EventEmitter());
  const configuration = useRef({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

  // State 管理组件状态
  const [sessionId, setSessionId] = useState('000-111');
  const [userId] = useState(() => Math.random().toString().slice(2, 8)); // 初始化时生成固定ID
  const [users, setUsers] = useState([]);

  // 获取本地媒体流
  const getLocalStream = useCallback(async (type) => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video' ? { width: 1280, height: 720 } : false
      };

      const stream = type === 'screen'
        ? await navigator.mediaDevices.getDisplayMedia({ video: true })
        : await navigator.mediaDevices.getUserMedia(constraints);

      localStream.current = stream;
      eventEmitter.current.emit('localstream', stream);
      return stream;
    } catch (error) {
      console.error('获取媒体流失败:', error);
      throw error;
    }
  }, []);

  // 创建 PeerConnection
  const createPeerConnection = useCallback(async (remoteUserId, isOffer) => {
    try {
      const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection;
      const pc = new RTCPeerConnection(configuration.current);

      // 添加本地轨道
      localStream.current?.getTracks().forEach(track => {
        pc.addTrack(track, localStream.current);
      });

      // ICE Candidate 处理
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          sendMessage({
            type: 'candidate',
            data: {
              to: remoteUserId,
              from: userId,
              candidate,
              sessionId,
              roomId
            }
          });
        }
      };

      // 远程轨道处理
      pc.ontrack = (event) => {
        eventEmitter.current.emit('addstream', {
          userId: remoteUserId,
          stream: event.streams[0]
        });
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'disconnected') {
          handleDisconnect(remoteUserId);
        }
      };

      peerConnections.current[remoteUserId] = pc;

      if (isOffer) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        sendMessage({
          type: 'offer',
          data: {
            to: remoteUserId,
            from: userId,
            description: pc.localDescription,
            sessionId,
            roomId
          }
        });
      }

      return pc;
    } catch (error) {
      console.error('创建 PeerConnection 失败:', error);
      throw error;
    }
  }, [userId, sessionId, roomId]);

  // 发送信令消息
  const sendMessage = useCallback((message) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    }
  }, []);

  // 处理收到的信令消息
  const handleSignalingMessage = useCallback((message) => {
    switch (message.type) {
      case 'offer':
        handleOffer(message.data);
        break;
      case 'answer':
        handleAnswer(message.data);
        break;
      case 'candidate':
        handleCandidate(message.data);
        break;
      case 'updateUserList':
        setUsers(message.data.users.filter(u => u.id !== userId));
        break;
      case 'leaveRoom':
        handleDisconnect(message.data.userId);
        break;
      case 'hangUp':
        handleHangUp(message.data);
        break;
      default:
        console.warn('未知消息类型:', message.type);
    }
  }, [userId]);

  // 处理 Offer
  const handleOffer = useCallback(async (data) => {
    try {
      const pc = await createPeerConnection(data.from, false);
      await pc.setRemoteDescription(new RTCSessionDescription(data.description));
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      sendMessage({
        type: 'answer',
        data: {
          to: data.from,
          from: userId,
          description: pc.localDescription,
          sessionId: data.sessionId,
          roomId
        }
      });
      
      setSessionId(data.sessionId);
      eventEmitter.current.emit('newCall', data.from);
    } catch (error) {
      console.error('处理 Offer 失败:', error);
    }
  }, [createPeerConnection, userId, roomId, sendMessage]);

  // 处理 Answer
  const handleAnswer = useCallback(async (data) => {
    const pc = peerConnections.current[data.from];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.description));
    }
  }, []);

  // 处理 Candidate
  const handleCandidate = useCallback(async (data) => {
    const pc = peerConnections.current[data.from];
    if (pc && data.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error('添加 ICE Candidate 失败:', error);
      }
    }
  }, []);

  // 处理断开连接
  const handleDisconnect = useCallback((remoteUserId) => {
    const pc = peerConnections.current[remoteUserId];
    if (pc) {
      pc.close();
      delete peerConnections.current[remoteUserId];
      eventEmitter.current.emit('removestream', remoteUserId);
    }
  }, []);

  // 挂断处理
  const hangUp = useCallback(() => {
    sendMessage({
      type: 'hangUp',
      data: {
        sessionId,
        from: userId,
        roomId
      }
    });

    Object.values(peerConnections.current).forEach(pc => pc.close());
    peerConnections.current = {};

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }

    eventEmitter.current.emit('hangUp');
    setSessionId('000-111');
  }, [sessionId, userId, roomId, sendMessage]);

  // 初始化 WebSocket 和 TURN 配置
  useEffect(() => {
    const initTurnConfig = async () => {
      try {
        const response = await Axios.get(turnUrl);
        configuration.current = {
          iceServers: [{
            urls: response.data.uris,
            username: response.data.username,
            credential: response.data.password
          }]
        };
      } catch (error) {
        console.warn('使用备用 STUN 服务器');
      }
    };

    const initWebSocket = () => {
      socket.current = new WebSocket(p2pUrl);
      
      socket.current.onopen = () => {
        sendMessage({
          type: 'joinRoom',
          data: {
            name: userName,
            id: userId,
            roomId
          }
        });
      };

      socket.current.onmessage = (event) => {
        handleSignalingMessage(JSON.parse(event.data));
      };

      socket.current.onclose = () => {
        console.log('WebSocket 连接关闭');
      };
    };

    initTurnConfig().then(initWebSocket);

    return () => {
      socket.current?.close();
      hangUp();
    };
  }, [p2pUrl, turnUrl, userName, roomId, userId, sendMessage, handleSignalingMessage, hangUp]);

  return {
    startCall: async (remoteUserId, mediaType) => {
      try {
        await getLocalStream(mediaType);
        setSessionId(`${userId}_${remoteUserId}`);
        await createPeerConnection(remoteUserId, true);
      } catch (error) {
        console.error('发起呼叫失败:', error);
      }
    },
    hangUp,
    users,
    on: (event, listener) => eventEmitter.current.on(event, listener),
    off: (event, listener) => eventEmitter.current.off(event, listener)
  };
};