import React, { useEffect, useState } from 'react'

import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';

export const ImageComment = ({selectedImages}) => {
    const [isWidthLarger, setIsWidthLarger] = useState(true);

    const onInit = () => {
        // console.log('lightGallery has been initialized');
    };

    /* eslint-disable */
    useEffect(() => {
      const img = new Image();
      img.src = selectedImages;
      img.onload = () => {
        if (img.width > img.height) {
          setIsWidthLarger(true);
        } else {
          setIsWidthLarger(false);
        }
      };
    }, []);
    return (
        <div className='ml-1 flex-1'>
            {isWidthLarger === true ? (
                <div className='w-1/3'>
                    <LightGallery
                        onInit={onInit}
                        speed={500}
                        plugins={[lgZoom]}
                        elementClassNames="flex h-full w-full"
                    >
                        <img
                            src={selectedImages}
                            alt=''
                            className='w-full rounded-md'
                        />                        
                    </LightGallery>
                </div>
            ) : (
                <div className='flex-1'>
                    <LightGallery
                        onInit={onInit}
                        speed={500}
                        plugins={[lgZoom]}
                        elementClassNames="flex h-full w-full"
                    >
                        <img
                            src={selectedImages}
                            alt=''
                            className='h-[30vh] rounded-md'
                        />                        
                    </LightGallery>
                </div>
            )}
        </div>
    )
}
