import React, { useEffect, useState } from 'react'
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';

export const OnePicture = ({selectedImages}) => {
    const [isWidthLarger, setIsWidthLarger] = useState(true);

    const onInit = () => {
      // console.log('lightGallery has been initialized');
    };

    /* eslint-disable */
    useEffect(() => {
      const img = new Image();
      img.src = selectedImages[0];
      img.onload = () => {
        if (img.width > img.height) {
          setIsWidthLarger(true);
        } else {
          setIsWidthLarger(false);
        }
      };
    }, []);
  return (
    <div className='flex-1 flex items-center justify-center bg-gray-700'>
        {isWidthLarger === true ? (
            <div>
              <LightGallery
                onInit={onInit}
                speed={500}
                plugins={[lgZoom]}
                elementClassNames="flex h-full w-full"
              >
                <img className='w-full h-auto'
                    src= {selectedImages[0]}
                    alt=''
                />
              </LightGallery>  
            </div>
        ) : (
            <div className='bg-gray-700 h-[80vh] overflow-hidden flex-1 flex items-center justify-center'>
              <LightGallery
                onInit={onInit}
                speed={500}
                plugins={[lgZoom]}
                elementClassNames="flex-1 flex items-center justify-center h-full w-full"
              >
                <img className='w-3/4 h-full object-cover'
                    src={selectedImages[0]}
                    alt=''
                />
              </LightGallery>  
            </div>            
        )}


    </div>
  )
}
