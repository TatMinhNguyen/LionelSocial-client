import React from 'react'
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';

const ThreePictures = ({selectedImages}) => {
    const onInit = () => {
        // console.log('lightGallery has been initialized');
    };

  return (
    <div className='flex'>
        <LightGallery
            onInit={onInit}
            speed={500}
            plugins={[lgZoom]}
            elementClassNames="flex h-full w-full"
        >
            <a href={selectedImages[0]} className='w-2/3 h-96 mr-0.5'>
                <img className='w-full h-full object-cover'
                    src={selectedImages[0]}
                    alt=''
                />
            </a>
            <a href={selectedImages[1]} className='w-1/3 block h-48'>
                <img className='w-full h-full object-cover'
                    src={selectedImages[1]}
                    alt=''
                />
                <img className='w-full h-full object-cover pt-0.5'
                    src={selectedImages[2]}
                    alt=''
                />                
            </a>
            <a href={selectedImages[2]}>
            
            </a>
        </LightGallery>
    </div>
  )
}

export default ThreePictures