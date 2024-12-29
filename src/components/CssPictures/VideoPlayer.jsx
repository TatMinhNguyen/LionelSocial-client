import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url }) => {
    // eslint-disable-next-line
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [isWidthLarger, setIsWidthLarger] = useState(true);

  const handleReady = (player) => {
    const internalPlayer = player.getInternalPlayer();
    const videoWidth = internalPlayer.videoWidth;
    const videoHeight = internalPlayer.videoHeight;

    setVideoDimensions({ width: videoWidth, height: videoHeight });
    setIsWidthLarger(videoWidth > videoHeight);
  };

  return (
    <div className={`flex-1 flex items-center justify-center ${isWidthLarger ? 'bg-white' : 'bg-gray-700'}`}>
      <ReactPlayer
        url={url}
        controls={true}
        width={isWidthLarger ? '100%' : '50%'}
        height={isWidthLarger ? '100%' : '100%'}
        onReady={handleReady}
      />
    </div>
  );
};

export default VideoPlayer;

