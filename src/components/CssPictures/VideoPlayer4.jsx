import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';

export const VideoPlayer4 = ({url, selectedImages}) => {
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
        <div className={`${isWidthLarger ? '' : 'flex'} overflow-hidden`}>
            <div className={`${isWidthLarger ? 'w-full mb-0.5 flex-1 flex items-center justify-center bg-gray-700' 
                                             : 'w-3/5 object-cover h-[70vh] bg-gray-700'} `}>
                <ReactPlayer
                    url={url}
                    controls={true}
                    width={isWidthLarger ? '70%' : '100%'}
                    height={isWidthLarger ? '100%' : '100%'}
                    onReady={handleReady}
                />
            </div>   
            {!isWidthLarger ? (
                <div className= {`h-[70vh] w-2/5 pl-[2.5px] `}>
                    <LightGallery
                        onInit={onInit}
                        speed={500}
                        plugins={[lgZoom]}
                        elementClassNames="h-full w-full"
                    >
                    <a href={selectedImages[0]} className=''>
                        <img className='w-full h-[23.3vh] object-cover mb-0.5'
                            src= {selectedImages[0]}
                            alt=''
                        />
                    </a>  
                    <a href={selectedImages[1]} className=''>
                        <img className='w-full h-[23.3vh] object-cover my-0.5'
                            src= {selectedImages[1]}
                            alt=''
                        />
                    </a> 
                    <a href={selectedImages[2]} className=''>
                        <img className='w-full h-[23vh] object-cover '
                            src= {selectedImages[2]}
                            alt=''
                        />
                    </a> 
                    </LightGallery>                                     
                </div>
            ) : (
                <div className='flex h-56'>
                    <LightGallery
                        onInit={onInit}
                        speed={500}
                        plugins={[lgZoom]}
                        elementClassNames="flex h-full w-full"
                    >
                    <a href={selectedImages[0]} className='w-1/3 pr-px'>
                        <img className='w-full h-full object-cover'
                            src= {selectedImages[0]}
                            alt=''
                        />
                    </a>  
                    <a href={selectedImages[1]} className='w-1/3 px-px'>
                        <img className='w-full h-full object-cover'
                            src= {selectedImages[1]}
                            alt=''
                        />
                    </a> 
                    <a href={selectedImages[2]} className='w-1/3 pl-px'>
                        <img className='w-full h-full object-cover'
                            src= {selectedImages[2]}
                            alt=''
                        />
                    </a>
                    </LightGallery>              
                </div>  
            )}         
        </div>
    );
}
