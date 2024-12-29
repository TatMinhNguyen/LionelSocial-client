import React from 'react'
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';

const TwoPictures = ({selectedImages}) => {
  const onInit = () => {
    // console.log('lightGallery has been initialized');
  };
  return (
    <div className='flex h-[60vh]'>
      <LightGallery
        onInit={onInit}
        speed={500}
        plugins={[lgZoom]}
        elementClassNames="flex h-full w-full"
      >
        <a href={selectedImages[0]} className='w-1/2'>
          <img className='w-full pr-px h-full object-cover'
              src={selectedImages[0]}
              alt=''
          />          
        </a>
        <a href={selectedImages[1]} className='w-1/2'>
          <img className='w-full pl-px h-full object-cover'
              src={selectedImages[1]}
              alt=''
          />          
        </a>
      </LightGallery>         
    </div>
  )
}

export default TwoPictures