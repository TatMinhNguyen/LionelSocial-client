import React, { useRef, useState } from 'react'

import { FivePictures } from '../CssPictures/FivePictures'
import FourPictures from '../CssPictures/FourPictures'
import ThreePictures from '../CssPictures/ThreePictures'
import TwoPictures from '../CssPictures/TwoPictures'
import { SixPictures } from '../CssPictures/SixPictures'
import { OnePicture } from '../CssPictures/OnePicture'
import VideoPlayer from '../CssPictures/VideoPlayer'
import { VideoPlayer2 } from '../CssPictures/VideoPlayer2'
import { VideoPlayer3 } from '../CssPictures/VideoPlayer3'
import { VideoPlayer4 } from '../CssPictures/VideoPlayer4'
import { VideoPlayer5 } from '../CssPictures/VideoPlayer5'
import { useDispatch } from 'react-redux'
import { getAllPosts, getUserPost, updatePost } from '../../api/post/post'
import { search } from '../../api/search/search'
import LoadingSpinner from '../spinner/LoadingSpinner'
import { getGroupPosts, updatePostGroup } from '../../api/group/group'
import { useNavigate } from 'react-router-dom'

const EditPost = ({user, params, isCloseModal, profile, text, oldImages, oldVideo, oldTypeText, postId, searchQuery, groupId}) => {
    const textareaRef = useRef(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);

    const [description, setDescription] = useState(text);
    const [images, setImages] = useState(oldImages)
    const [video, setVideo] = useState(oldVideo)
    const [typeText, setTypeText] = useState(oldTypeText)

    const [showFont, setShowFont] = useState(false)

    const [imageIds, setImagesId] = useState([])
    const [videoId, setVideoId] = useState('')

    const [imagePreviews, setImagePreviews] = useState(oldImages);
    const [videoPreview, setVideoPreview] = useState(oldVideo)
    // console.log(imagePreviews)

    const handleInput = (e) => {
        setDescription(e.target.value);
        const textarea = textareaRef.current;
        textarea.style.height = 'auto'; // Reset the height to auto
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the scroll height
    };

    const handleImageClick = () => {
        imageInputRef.current.click();
    };

    const handleVideoClick = () => {
        videoInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const selectedImages = Array.from(e.target.files);     
    
        // Tạo URL xem trước và format lại thành mảng các object { url: "http:....." }
        if(selectedImages){
            setImages((prevImages) => [...prevImages, ...selectedImages]);
            const imageUrls = selectedImages.map((image) => ({ url: URL.createObjectURL(image) }));
            setImagePreviews((prevPreviews) => [...prevPreviews, ...imageUrls]);            
        }
  
        // Giải phóng các URL cũ
        // imagePreviews?.forEach((preview) => URL.revokeObjectURL(preview.url));
    };    

    const handleVideoChange = (e) => {
        const selectedVideo = e.target.files[0];       

        if(selectedVideo){
            setVideo(selectedVideo);
            const videoUrl = {url: URL.createObjectURL(selectedVideo)};
            setVideoPreview(videoUrl);            
        }

        URL.revokeObjectURL(videoPreview?.url);
    };

    const handleDeletePreView = (videoId, imagesId) => {
        setImages([]);
        setVideo(null);
        setImagePreviews([])
        setVideoPreview(null)
        setVideoId(videoId)
        setImagesId(imagesId)
        imagePreviews?.forEach((url) => URL.revokeObjectURL(url.url));
        URL.revokeObjectURL(videoPreview?.url);
    }

    const imgsId = images?.map((imageId) => imageId.fileId);

    const handleUpdatePost = async(e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();
      
            if (description) {
              formData.append('description', description);
            }
            if (images.length > 0) {
              images.forEach((image) => {
                formData.append(`images`, image);
              });
            }
            if (video) {
              formData.append('video', video);
            }
            if(videoId) {
                formData.append('videoId', videoId)
            }
            if(imageIds.length > 0) {
                imageIds.forEach((id) => {
                    formData.append('imageIds', id)
                });
            }
            formData.append('typeText', typeText);

            await updatePost(user?.token, formData, postId, navigate)
            await updatePostGroup(user?.token, formData, postId, navigate)

            isCloseModal();
            setImagesId([]);
            setVideoId('');

            await getAllPosts(user?.token, dispatch, params, navigate)
            fetchSearchResults();
            await getUserPost(user?.token, user?.userId, dispatch, navigate)
            await getGroupPosts(user?.token, groupId, dispatch, params, navigate)

        } catch (error) {
            console.log(error)
        }
        finally{
            imagePreviews?.forEach((url) => URL.revokeObjectURL(url.url));
            URL.revokeObjectURL(videoPreview?.url);   
            setLoading(false)         
        }
    }

    const fetchSearchResults = async () => {
        const params = {
            q: searchQuery
        }
        try {
            await search(user?.token, params, dispatch, navigate);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }; 

    const handleCloseModal = () => {
        isCloseModal()
        setImagesId([]);
        setVideoId();
        imagePreviews?.forEach((url) => URL.revokeObjectURL(url.url));
        URL.revokeObjectURL(videoPreview?.url);
    }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh]">
            <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-xl font-bold flex-1 flex items-center justify-center italic">Edit {profile?.username}'s Post</h3>
                <button className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                    onClick={handleCloseModal}
                >
                <img  
                    src={require('../../assets/icons/close.png')}
                    alt='Earth'
                    className='w-5 h-5 '
                />
                </button>
            </div>
            <div className="p-4">
                <div className="flex items-center mb-4">
                <div className='w-10 h-10'>
                    <img 
                        src={profile?.profilePicture} 
                        alt="Profile" 
                        className="h-full w-full object-cover rounded-full" 
                    />
                </div>
                <div className="ml-2">
                    <h4 className="font-semibold text-base">
                        {profile?.username}
                    </h4>
                    <div className="text-sm text-gray-500">
                    <button className="flex items-center text-black font-medium">
                        <img
                        src={require('../../assets/icons/earth.png')}
                        alt='Earth'
                        className='w-3.5 h-3.5 mr-1 mt-px'
                        />
                        Public
                    </button>
                    </div>
                </div>
                </div>
                <div className='relative max-h-[50vh] overflow-y-auto overflow-hidden'>
                <div>
                    <textarea
                        id="text"
                        name="text"
                        value={description}
                        onChange={handleInput}
                        ref={textareaRef}
                        className="w-full border-none text-lg focus:outline-none"
                        rows="2"
                        placeholder="What's on your mind?"
                        style={{resize: 'none'}}
                    />
                </div>
                <div className='absolute z-20 w-full'>
                    {imagePreviews?.length > 0 || videoPreview !== null ? (
                    <div className='flex'>
                        {/* <div className='flex bg-white px-2 py-1.5 mx-5 my-2 rounded-md hover:bg-gray-200 cursor-pointer'>
                        <img
                            src={require('../../assets/icons/edit.png')}
                            alt=''
                            className='w-6 h-6'
                        />
                        <p className='font-medium ml-1 mr-1'>
                            Edit 
                        </p>
                        </div>  */}
                        <div className='flex-1'></div>
                        <div className='w-8 h-8 mx-3 my-2 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 cursor-pointer'
                            onClick={()=>handleDeletePreView(video?.fileId, imgsId)}
                        >
                        <img
                            src={require('../../assets/icons/close.png')}
                            alt=''
                            className='w-4 h-4'
                        />                              
                        </div>                       
                    </div>
                    ) : (
                    ''
                    )}
                </div>
                <div className='opacity-75'>
                    {videoPreview == null || !videoPreview ? (
                    <>
                        {imagePreviews?.length > 5 ? (
                            <SixPictures
                                selectedImages={imagePreviews?.map(img => img.url)} 
                                extraImagesCount={imagePreviews?.length - 4}
                            />
                        ) : imagePreviews?.length === 5 ? (
                            <FivePictures selectedImages={imagePreviews?.map(img => img.url)}/>
                        ) : imagePreviews?.length === 4 ? (
                            <FourPictures selectedImages={imagePreviews?.map(img => img.url)}/>
                        ) : imagePreviews?.length === 3 ? (
                            <ThreePictures selectedImages={imagePreviews?.map(img => img.url)}/>
                        ) : imagePreviews?.length === 2 ? (
                            <TwoPictures selectedImages={imagePreviews?.map(img => img.url)}/>
                        ) : imagePreviews?.length === 1 ? (
                            <OnePicture selectedImages={imagePreviews?.map(img => img.url)}/>
                        ) : ('')}                        
                    </>
                    ) : (
                    <>
                        {imagePreviews?.length > 3 ? (
                            <VideoPlayer5
                                url = {videoPreview?.url}
                                selectedImages = {imagePreviews?.map(img => img.url)}
                                extraImagesCount={imagePreviews?.length - 2}
                            /> 
                        ) : imagePreviews?.length === 3 ? (
                            <VideoPlayer4
                                url = {videoPreview?.url}
                                selectedImages = {imagePreviews?.map(img => img.url)}
                            />                                        
                        ) : imagePreviews?.length === 2 ? (
                            <VideoPlayer3
                                url = {videoPreview?.url}
                                selectedImages = {imagePreviews?.map(img => img.url)}
                            />                                        
                        ) : imagePreviews?.length === 1 ? (
                            <VideoPlayer2
                                url = {videoPreview?.url}
                                selectedImages = {imagePreviews?.map(img => img.url)}
                            />                                        
                        ) : (
                            <VideoPlayer url = {videoPreview?.url}/>
                        )}                        
                    </>
                    )}

                </div>                    
                </div>

                <div className="flex items-center mt-4">
                <button className="flex items-center "
                        onClick={()=>setShowFont(!showFont)}
                >
                    <img src={require('../../assets/icons/text.png')} alt="Aa" className="w-9 h-9 hover:opacity-70"/>
                </button>
                {showFont && (
                    <div className='flex'>
                        {typeText === true ? (
                            <div onClick={()=>setTypeText(true)} className='bg-gray-300 rounded-md cursor-pointer hover:bg-gray-300 border border-customBlue'>
                                <p className='font-sans px-2 py-0.5 text-sm font-medium'>
                                    normal
                                </p>
                            </div>
                        ) : (
                            <div onClick={()=>setTypeText(true)} className='bg-gray-300 rounded-md cursor-pointer hover:bg-gray-300'>
                                <p className='font-sans px-2 py-0.5 text-sm font-medium'>
                                    normal
                                </p>
                            </div>
                        )}
                        {typeText === false ? (
                            <div onClick={()=>setTypeText(false)} 
                                className='ml-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-300 border border-customBlue'
                            >
                                <p className='font-mono px-2 py-0.5 italic text-sm font-semibold'>
                                    special
                                </p>
                            </div>                                
                        ) : (
                            <div onClick={()=>setTypeText(false)} 
                                className='ml-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-300 '
                            >
                                <p className='font-mono px-2 py-0.5 italic text-sm font-semibold'>
                                    special
                                </p>
                            </div>
                        )}

                    </div>                      
                )}
                <div className="flex-1 flex justify-end space-x-2">
                    <button onClick={handleImageClick} className="flex items-center">
                        <img src={require('../../assets/icons/photo.png')} alt="Location" className="w-9 h-9 hover:opacity-70" />
                    </button>
                    <button onClick={handleVideoClick} className="flex items-center">
                        <img src={require('../../assets/icons/clapperboard.png')} alt="GIF" className="w-8 h-8 hover:opacity-70" />
                    </button>
                    {/* Hidden inputs */}
                    <input 
                    type="file" 
                    accept="image/*" 
                    ref={imageInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleImageChange} 
                    multiple 
                    />
                    <input 
                    type="file" 
                    accept="video/*" 
                    ref={videoInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleVideoChange} 
                    />
                </div>
                </div>
            </div>
            <div className="border-t p-4">
                {loading ? (
                    <div className="flex justify-center">
                        <LoadingSpinner/>
                    </div>
                ) : (
                    <button
                        onClick={handleUpdatePost}
                        className={`w-full text-white py-2 px-4 rounded-lg ${description || images.length > 0 || video ? 'bg-customBlue' : 'bg-blue-300'}`}
                        disabled={!(description || images.length > 0 || video)}
                    >
                        Post
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}

export default EditPost