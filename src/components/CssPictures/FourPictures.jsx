import React from 'react'
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';

const FourPictures = ({selectedImages}) => {
    const onInit = () => {
        // console.log('lightGallery has been initialized');
    };
  return (
    <div>
        <LightGallery
            onInit={onInit}
            speed={500}
            plugins={[lgZoom]}
            elementClassNames="h-full w-full"
        >
            <a href={selectedImages[0]} className='flex h-[40vh] mb-0.5'>
                <img className='w-1/2 h-full object-cover mr-px mb-0.5'
                    src={selectedImages[0]}
                    alt=''
                />
                <img className='w-1/2 h-full object-cover ml-px mb-0.5'
                    src={selectedImages[1]}
                    alt=''
                />
            </a>
            <a href={selectedImages[1]}>
                
            </a>
            <a href={selectedImages[2]} className='flex h-[40vh]'>
                <img className='w-1/2 h-full object-cover mr-px'
                    src={selectedImages[2]}
                    alt=''
                />
                <img className='w-1/2 h-full object-cover ml-px'
                    src={selectedImages[3]}
                    alt=''
                />
            </a>
            <a href={selectedImages[3]}>

            </a>
        </LightGallery>
    </div>
  )
}

export default FourPictures