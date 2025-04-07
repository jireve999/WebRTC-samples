/**
 * 本地视频组件
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import VideocamOffIcon from 'mdi-react/VideocamOffIcon';

const LocalVideoView = ({ stream, id, muted }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      // 当获取到 MetaData 数据后开始播放
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    }
  }, [stream]); 

  const small = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '192px',
    height: '108px',
    bottom: '60px',
    right: '10px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#ffffff',
    overflow: 'hidden',
    zIndex: 99,
    borderRadius: '4px',
  };

  const videoMuteIcon = {
    position: 'absolute',
    color: '#fff',
  };

  return (
    <div key={id} style={small}>
      <video
        ref={videoRef}
        id={id}
        autoPlay
        playsInline
        muted={true}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {muted && <VideocamOffIcon style={videoMuteIcon} />}
    </div>
  );
};

LocalVideoView.propTypes = {
  stream: PropTypes.any.isRequired,
  id: PropTypes.string.isRequired,
  muted: PropTypes.bool,
};

LocalVideoView.defaultProps = {
  muted: false,
};

export default LocalVideoView;
