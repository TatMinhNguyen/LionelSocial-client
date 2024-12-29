import React, { useCallback, useEffect, useRef } from 'react'
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';

export const SixPictures = ({selectedImages, extraImagesCount}) => {
    const lightGallery = useRef(null);
    const onInit = useCallback((detail) => {
        if (detail) {
            lightGallery.current = detail.instance;
        }
    }, []);
    const getItems = useCallback(() => {
        return selectedImages.slice(1).map((item) => {
            return (
                <div
                    key={item}
                    className="gallery-item"
                    data-src={item}
                >
                     {/* eslint-disable-next-line */}
                    <a href={item}></a>
                </div>
            );
        });
    }, [selectedImages]);

    useEffect(() => {
        lightGallery.current.refresh();
    }, [selectedImages]);
  return (
    <div>
        <LightGallery
            onInit={onInit}
            speed={500}
            plugins={[lgZoom]}
            elementClassNames="h-full w-full"
        >
            <a href={selectedImages[0]}>
                <div  className='flex h-[50vh]'>
                    <img className='w-1/2 h-full object-cover mr-px mb-0.5'
                        src={selectedImages[0]}
                        alt=''
                    />
                    <img className='w-1/2 h-full object-cover pl-px mb-0.5'
                        src={selectedImages[1]}
                        alt=''
                    />
                </div>
                <div href={selectedImages[1]} className='flex h-[35vh] mt-0.5'>
                    <img className='w-1/3 h-full object-cover'
                        src={selectedImages[2]}
                        alt=''
                    />
                    <img className='w-1/3 h-full object-cover mx-0.5'
                        src={selectedImages[3]}
                        alt=''
                    />
                    <div className='relative w-1/3 h-full object-cover'>
                        <img className='opacity-50 h-[35vh] w-full'
                            src={selectedImages[4]}
                            alt=''
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-black text-3xl font-bold">
                                +{extraImagesCount}
                            </span>
                        </div>                
                    </div>
                </div>
            </a>

            {getItems()}
        </LightGallery>
    </div>
  )
}
