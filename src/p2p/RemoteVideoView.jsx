/**
 * 远端视频组件
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const RemoteVideoView = ({ stream, id }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      // 指定视频的源为 stream
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    }
  }, [stream]);

  const style = {
    position: 'absolute',
    left: '0px',
    right: '0px',
    top: '0px',
    bottom: '0px',
    backgroundColor: '#323232',
    zIndex: 0,
  };

  return (
    <div key={id} style={style}>
      <video
        ref={videoRef}
        id={id}
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

RemoteVideoView.propTypes = {
  stream: PropTypes.any.isRequired,
  id: PropTypes.string.isRequired,
};

export default RemoteVideoView;