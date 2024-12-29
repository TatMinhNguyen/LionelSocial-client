import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';

export const VideoPlayer2 = ({url, selectedImages}) => {
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

    const onInit = () => {
        // console.log('lightGallery has been initialized');
      };
  
    return (
        <div className={`${isWidthLarger ? 'flex' : 'flex'} overflow-hidden`}>
            <div className={`${isWidthLarger ? 'flex-1 flex items-center justify-center bg-gray-700' : 'h-96 w-1/2 bg-gray-700'} `}>
                <ReactPlayer
                    url={url}
                    controls={true}
                    width={isWidthLarger ? '100%' : '100%'}
                    height={isWidthLarger ? '100%' : '100%'}
                    onReady={handleReady}
                />
            </div>   
            {!isWidthLarger ? (
                <div className='w-1/2 h-96 pl-0.5'>
                <LightGallery
                    onInit={onInit}
                    speed={500}
                    plugins={[lgZoom]}
                    elementClassNames="flex h-full w-full"
                >
                    <img className='w-full h-full object-cover'
                        src= {selectedImages[0]}
                        alt=''
                    />
                </LightGallery>    
                </div>
            ) : (
                <div className='w-2/5 h-80 pl-0.5'>
                <LightGallery
                    onInit={onInit}
                    speed={500}
                    plugins={[lgZoom]}
                    elementClassNames="flex h-full w-full"
                >
                    <img className='w-full h-full object-cover'
                        src= {selectedImages[0]}
                        alt=''
                    />
                </LightGallery>    
                </div>
            )}         
        </div>
    );
}
