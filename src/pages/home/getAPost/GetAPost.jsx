import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getAPost } from '../../../api/post/post';
import { useDispatch, useSelector } from 'react-redux';
import { convertNewlinesToBreaks, timeAgo } from '../../../utils';
import { SixPictures } from '../../../components/CssPictures/SixPictures';
import { FivePictures } from '../../../components/CssPictures/FivePictures';
import FourPictures from '../../../components/CssPictures/FourPictures';
import ThreePictures from '../../../components/CssPictures/ThreePictures';
import TwoPictures from '../../../components/CssPictures/TwoPictures';
import { OnePicture } from '../../../components/CssPictures/OnePicture';
import { VideoPlayer5 } from '../../../components/CssPictures/VideoPlayer5';
import { VideoPlayer4 } from '../../../components/CssPictures/VideoPlayer4';
import { VideoPlayer3 } from '../../../components/CssPictures/VideoPlayer3';
import { VideoPlayer2 } from '../../../components/CssPictures/VideoPlayer2';
import VideoPlayer from '../../../components/CssPictures/VideoPlayer';
import { Comment } from '../../../components/comment/Comment';
import { createComment, getComments } from '../../../api/comment/comment';
import { ImageComment } from '../../../components/CssPictures/ImageComment';
import { setFelt, unFelt, updateFelt } from '../../../api/reaction/reaction';
import LoadingSpinner from '../../../components/spinner/LoadingSpinner';
import GetFeft from '../../../components/comment/GetFeft';
import NavBar from '../../../components/navbar/NavBar';
import { getAPostGroup } from '../../../api/group/group';
import socket from '../../../socket';
import { getAChat } from '../../../api/chat/chat';
import callSound from "../../../assets/sounds/call.mp4";

const GetAPost = () => {
    const { postId } = useParams();
    const user = useSelector((state) => state.auth.login?.currentUser)
    const comments = useSelector((state) => state.post.comments)
    const chat = useSelector((state) => state.chat.chat)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = useSelector((state) => state?.auth?.profile)

    const [incomingCall, setIncomingCall] = useState(null); // Lưu thông tin cuộc gọi
    const [audio, setAudio] = useState(null); // Lưu âm thanh gọi    

    const [postPromise, setPost] = useState({})
    const [postGroup, setPostGroup] = useState({})
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const textareaRef = useRef(null); 
    const imageInputRef = useRef(null);
    // console.log(post) 
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [showFelter, setShowFelter] = useState(false)

    const [loading, setLoading] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState([]);

    const post = postPromise || postGroup;

    useEffect(() => {
        socket.emit('online')
        // Lắng nghe sự kiện onlineUsers từ server
        socket.on("onlineUsers", (users) => {
          // console.log("Online users:", users);
          setOnlineUsers(users);
        });
    
        // Cleanup
        return () => {
          socket.off("onlineUsers");
        };
    }, []);

     /* eslint-disable */
     useEffect(() => {
        // Lắng nghe sự kiện 'room-invitation'
        socket.on("room-invitation", (roomId) => {
          setIncomingCall({ roomId });
          const callAudio = new Audio(callSound); // Đường dẫn âm thanh
          callAudio.loop = true; // Lặp âm thanh
          callAudio.play();
          setAudio(callAudio);

          handleGetAChat(roomId);
        });
    
        // Cleanup khi component unmount
        return () => {
          socket.off("room-invitation");
          if (audio) audio.pause();
        };
    }, [socket, audio]);

    const handleAccept = () => {
        if (incomingCall?.roomId) {
          navigate(`/room/${incomingCall?.roomId}`); // Chuyển đến phòng
          if (audio) audio.pause(); // Dừng âm thanh
          setIncomingCall(null); // Xóa thông tin cuộc gọi
        }
    };
    
    const handleDecline = () => {
        if (audio) audio.pause(); // Dừng âm thanh
        setIncomingCall(null); // Ẩn thông báo
    };

    const handleGetAChat = async (chatId) => {
        await getAChat(user?.token, chatId, dispatch)
    }

    const handleMouseEnter = (postId) => {
        setHoveredPostId(postId);
    };

    const handleMouseLeave = () => {
        setHoveredPostId(null);
    };

    const handleUnLike = async (postId) => {
        try {
            await unFelt(user?.token, postId)
            setHoveredPostId(null)
            handleGetPost();
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateFelt = async(postId, type) => {
        try {
            const data = {
                type: type
            } 
            await updateFelt(user?.token, data, postId) 
            setHoveredPostId(null)
            handleGetPost()         
        } catch (error) {
            console.log(error)
        }
    }

    const handleLike = async(postId, type) => {
        try {
            const data = {
                postId: postId,
                type: type
            }
            await setFelt(user?.token, data)
            setHoveredPostId(null)
            handleGetPost()
        } catch (error) {
            console.log(error)
        }
    }  

    const handleGoBack = () => {
        navigate(-1);  // Quay lại trang trước đó
        URL.revokeObjectURL(imagePreview);
    };

    const handleGetComments = async() => {
      try {
        await getComments(user?.token, dispatch, postId)
      } catch (error) {
        console.log(error)
      }
    }

    const handleInput = (e) => {
      setDescription(e.target.value);
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset the height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the scroll height
    };

    const handleImageClick = () => {
        imageInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];       

        if(selectedImage){
            setImage(selectedImage);
            const ImageUrl = URL.createObjectURL(selectedImage);
            setImagePreview(ImageUrl);            
        }

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
    };

    const handleDeletePreView = () => {
        setImage(null);
        setImagePreview(null)
        URL.revokeObjectURL(imagePreview);
    }

    const handleCreateComment = async(e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();
      
            if (description) {
              formData.append('content', description);
            }
            if (image) {
                formData.append('image', image);
            }
            formData.append('postId', postId);

            await createComment(user?.token, formData)

            setDescription('')
            setImage(null) 
            setImagePreview(null)
            
            // Reset chiều cao của textarea
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }            

            handleGetComments();
            handleGetPost();
        } catch (error) {
            console.log(error)
        } finally {
            // Giải phóng các URL sau khi không cần sử dụng nữa
            URL.revokeObjectURL(imagePreview);
            setLoading(false)
          }
    }

    const handleGetPost = async() => {
        try {
            const result = await getAPost(user?.token, postId);
            const res = await getAPostGroup(user?.token, postId)

            setPost(result)
            setPostGroup(res)
        } catch (error) {
            console.log(error);
        }
    }

    /* eslint-disable */
    useEffect(() => {
        handleGetPost();
        handleGetComments();
    },[postId])

    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được render
    }, []);

    // console.log(post)

  return (
    <div >
        {postId === 'undefined' ? (
            <div>
                <div className='fixed top-0 w-full z-50'>
                    <NavBar 
                        user={user}
                    />
                </div> 
                <div className='h-screen pt-20 bg-gray-100 flex-1 flex flex-col justify-center items-center'>
                    <img className='w-32 h-32'
                        src={require('../../../assets/icons/file.png')}
                        alt=''
                    />
                    <p className='text-xl font-bold text-gray-500 my-2'>
                        The post has been deleted.
                    </p>
                    <button className='text-white font-medium bg-customBlue px-5 py-2 rounded-md hover:bg-blue-600'
                        onClick={() => navigate('/')}
                    >
                        Go to News Feed   
                    </button>  
                    <button className='text-blue-600 font-medium text-[17px] mt-2 px-1 hover:border-b hover:border-customBlue'
                        onClick={() => navigate(-1)}
                    >
                        Go back    
                    </button>                      
                </div> 
            </div>
        ) : (
            <div className="flex-1 flex justify-center bg-black">
                <div className='fixed left-0 top-0 p-3 bg-gray-500 m-3 rounded-full cursor-pointer hover:bg-gray-400'
                        onClick={handleGoBack}
                >
                    <img
                        src={require('../../../assets/icons/cancel.png')}
                        alt=''
                        className='w-5 h-5'
                    />
                </div>
                <div className="h-full w-1/2 bg-white shadow z-50 min-h-screen">
                    <div className='py-2 h-[calc(100%)] p-0 '>
                        <div>
                            <div className='flex-1 flex items-center mx-3 mb-2'>
                                {onlineUsers?.includes(post?.author?.authorId) && (
                                    <div className='w-3 h-3 border-2 border-white rounded-full bg-green-600 absolute mt-[29px] ml-[29px]'></div>
                                )}
                                <div className='w-10 h-10'>
                                    <img className='h-full w-full object-cover rounded-full  hover:opacity-90'
                                        src= {post?.author?.authorAvatar}
                                        alt='Avatar'
                                    />
                                </div>
                                <div className='ml-3'>
                                    <h1 className='font-medium text-base'>
                                        {post?.author?.authorName}
                                    </h1>
                                    <p className='text-xs text-gray-500'>
                                        {timeAgo(post?.post?.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {post?.post?.typeText === false ?(
                                    <p className='ml-3.5 font-mono' style={{color: "#333333"}}>
                                        {post?.post?.description ? (
                                            convertNewlinesToBreaks(post?.post?.description)
                                        ) : (
                                            ''
                                        )}
                                    </p>
                                ) : (
                                    <p className='ml-3.5 font-sans' style={{color: "#050505"}}>
                                        {post?.post?.description ? (
                                            convertNewlinesToBreaks(post?.post?.description)
                                        ) : (
                                            ''
                                        )}
                                    </p>
                                )} 
                                <div className='mt-2 cursor-pointer'>
                                    {(post?.post?.video == null || !post?.post?.video) ? (
                                        <>
                                            {post?.post?.images.length > 5 ? (
                                                <SixPictures
                                                    selectedImages={post?.post?.images.map(img => img.url)} 
                                                    extraImagesCount={post?.post?.images.length - 4}
                                                />
                                            ) : post?.post?.images.length === 5 ? (
                                                <FivePictures selectedImages={post?.post?.images.map(img => img.url)}/>
                                            ) : post?.post?.images.length === 4 ? (
                                                <FourPictures selectedImages={post?.post?.images.map(img => img.url)}/>
                                            ) : post?.post?.images.length === 3 ? (
                                                <ThreePictures selectedImages={post?.post?.images.map(img => img.url)}/>
                                            ) : post?.post?.images.length === 2 ? (
                                                <TwoPictures selectedImages={post?.post?.images.map(img => img.url)}/>
                                            ) : post?.post?.images.length === 1 ? (
                                                <OnePicture selectedImages={post?.post?.images.map(img => img.url)}/>
                                            ) : ('')}
                                        </>
                                    ) : (
                                        <>  
                                            {post?.post?.images.length > 3 ? (
                                                <VideoPlayer5
                                                    url = {post?.post?.video.url}
                                                    selectedImages = {post?.post?.images.map(img => img.url)}
                                                    extraImagesCount={post?.post?.images.length - 2}
                                                /> 
                                            ) : post?.post?.images.length === 3 ? (
                                                <VideoPlayer4
                                                    url = {post?.post?.video.url}
                                                    selectedImages = {post?.post?.images.map(img => img.url)}
                                                />                                        
                                            ) : post?.post?.images.length === 2 ? (
                                                <VideoPlayer3
                                                    url = {post?.post?.video.url}
                                                    selectedImages = {post?.post?.images.map(img => img.url)}
                                                />                                        
                                            ) : post?.post?.images.length === 1 ? (
                                                <VideoPlayer2 
                                                    url = {post?.post?.video.url}
                                                    selectedImages = {post?.post?.images.map(img => img.url)}
                                                />                                        
                                            ) : (
                                                <VideoPlayer url = {post?.post?.video.url}/>
                                            )} 
                                        </>
                                    )} 
                                </div>                                                   
                            </div>
                            <div className=''>
                                <div className='flex mt-2 mb-2'>
                                    <div className='w-1/2 flex-1 flex items-center '>
                                        <div className='cursor-pointer flex' onClick={()=> setShowFelter(true)}>
                                            <img className='h-6 w-6 ml-3.5 rounded-full border-2 border-white shadow-xl'
                                                src={require("../../../assets/icons/like-blue1.png")}
                                                alt=''
                                            />
                                            <img className='h-6 w-6 -ml-1 rounded-full border-2 border-white shadow-xl'
                                                src={require("../../../assets/icons/love.png")}
                                                alt=''
                                            />
                                            <img className='h-6 w-6 -ml-1 rounded-full border-2 border-white shadow-xl'
                                                src={require("../../../assets/icons/haha.png")}
                                                alt=''
                                            />
                                        </div>
                                        <p className='text-gray-500 font-normal text-base ml-1'>
                                            {post?.post?.felt}
                                        </p>
                                    </div>
                                    <div className='w-1/2 flex '>
                                        <div className='flex-1'></div>
                                        <p className='text-gray-500 font-normal text-base'>
                                            {post?.post?.comment}
                                        </p>
                                        <p className='text-gray-500 font-normal text-base ml-1 mr-3.5'>
                                            comments
                                        </p>
                                    </div> 
                                </div>
                                {showFelter && (
                                    <GetFeft
                                        postId={post?.post?._id}
                                        isCloseModal = {() => setShowFelter(false)}
                                    />
                                )}
                                {incomingCall && (
                                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg p-4 w-1/4 shadow-lg text-center">
                                        <h2 className="text-lg font-bold mb-5">Incoming call</h2>
                                        <div className='flex flex-col items-center justify-center h-full'>
                                            <img
                                                src={chat?.avatar}
                                                alt='Avatar'
                                                className='w-24 h-24 object-cover rounded-full'
                                            />
                                            <h1 className='text-black font-bold text-xl mt-1'>
                                                {chat?.name} is calling you
                                            </h1>
                                            </div>
                                        <div className="mt-4 flex justify-around">
                                            <button
                                            className="my-2 flex flex-col justify-center"
                                            onClick={handleAccept}
                                            >
                                                <img className='w-10 h-10'
                                                    src={require("../../../assets/icons/phone-call.png")}
                                                    alt=''
                                                />
                                                <p className='text-sm mt-1 font-medium'>
                                                    Accept
                                                </p>
                                            </button>
                                            <button
                                            className="my-2 flex flex-col justify-center"
                                            onClick={handleDecline}
                                            >
                                                <img className='w-10 h-10'
                                                    src={require("../../../assets/icons/cancel-red.png")}
                                                    alt=''
                                                />
                                                <p className='text-sm mt-1 font-medium'>
                                                    Decline
                                                </p>
                                            </button>
                                        </div>
                                        </div>
                                    </div>
                                )}
                                <div className='relative'>
                                    {/* Các nút hành động */}
                                    <div className='flex-1 flex border-t border-gray-300 py-1 mx-3.5 border-b'>
                                        <div
                                            className={`w-1/2 flex-1 flex items-center justify-center cursor-pointer py-1 rounded-md hover:bg-gray-100`}
                                            onMouseEnter={() => handleMouseEnter(post?.post?._id)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            {post?.is_feel === '1' ? (
                                                <div className='w-full flex items-center justify-center py-1'
                                                    onClick={() => handleUnLike(post?.post?._id)}
                                                >
                                                    <img className='h-6 w-6 ml-2'
                                                        src={require("../../../assets/icons/like-blue.png")}
                                                        alt=''
                                                    />
                                                    <p className='text-customBlue font-normal text-base ml-2 mr-12'>
                                                        Like
                                                    </p>
                                                </div>
                                            ) : post?.is_feel === '2' ? (
                                                <div className='w-full flex items-center justify-center py-1'
                                                    onClick={() => handleUnLike(post?.post?._id)}
                                                >
                                                    <img className='h-6 w-6 ml-2'
                                                        src={require("../../../assets/icons/love.png")}
                                                        alt=''
                                                    />
                                                    <p className='text-red-500 font-normal text-base ml-2 mr-12'>
                                                        Love
                                                    </p>
                                                </div>
                                            ) : post?.is_feel === '3' ? (
                                                <div className='w-full flex items-center justify-center py-1'
                                                    onClick={() => handleUnLike(post?.post?._id)}
                                                >
                                                    <img className='h-6 w-6 ml-2'
                                                        src={require("../../../assets/icons/haha.png")}
                                                        alt=''
                                                    />
                                                    <p className='text-orange-400 font-normal text-base ml-2 mr-12'>
                                                        Haha
                                                    </p>
                                                </div>
                                            ) : post?.is_feel === '4' ? (
                                                <div className='w-full flex items-center justify-center py-1'
                                                    onClick={() => handleUnLike(post?.post?._id)}
                                                >
                                                    <img className='h-6 w-6 ml-2'
                                                        src={require("../../../assets/icons/sad.png")}
                                                        alt=''
                                                    />
                                                    <p className='text-orange-400 font-normal text-base ml-2 mr-12'>
                                                        Sad
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className='w-full flex items-center justify-center py-1'
                                                    onClick={() => handleLike(post?.post?._id, '1')}
                                                >
                                                    <img className='h-6 w-6 ml-2'
                                                        src={require("../../../assets/icons/like.png")}
                                                        alt=''
                                                    />
                                                    <p className='text-gray-500 font-normal text-base ml-2 mr-12'>
                                                        Like
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Nút comment */}
                                        <div className='w-1/2 flex-1 flex items-center justify-center cursor-pointer py-1 rounded-md hover:bg-gray-100'
                                            // onClick={() => handleGetAPost(post?.postId)}
                                        >
                                            <img className='h-5 w-5 ml-2'
                                                src={require("../../../assets/icons/comment.png")}
                                                alt=''
                                            />
                                            <p className='text-gray-500 font-normal text-base ml-3 mb-1'>
                                                Comment
                                            </p>
                                        </div>
                                    </div>

                                    {/* Modal hiển thị cảm xúc khi hover */}
                                    {hoveredPostId === post?.post?._id && (
                                        <div className='absolute bottom-full -mb-2 left-24 p-1 bg-white shadow-lg rounded-md z-10'
                                            onClick={()=> setHoveredPostId(null)}
                                            onMouseEnter={() => handleMouseEnter(post?.post?._id)}  
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className='flex justify-between'>
                                                <div className='flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1.5 rounded-md'
                                                    onClick={() => post?.is_feel === -1 
                                                        ? handleLike(post?.post?._id, '1') 
                                                        : handleUpdateFelt(post?.post?._id, '1')}
                                                >
                                                    <img className='h-6 w-6' src={require("../../../assets/icons/like-blue.png")} alt='Like' />
                                                    <p className='text-customBlue text-xs'>Like</p>
                                                </div>
                                                <div className='flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1.5 rounded-md'
                                                    onClick={() => post?.is_feel === -1 
                                                        ? handleLike(post?.post?._id, '2') 
                                                        : handleUpdateFelt(post?.post?._id, '2')}
                                                >
                                                    <img className='h-6 w-6' src={require("../../../assets/icons/love.png")} alt='Love' />
                                                    <p className='text-red-500 text-xs'>Love</p>
                                                </div>
                                                <div className='flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1.5 rounded-md'
                                                    onClick={() => post?.is_feel === -1 
                                                        ? handleLike(post?.post?._id, '3') 
                                                        : handleUpdateFelt(post?.post?._id, '3')}
                                                >
                                                    <img className='h-6 w-6' src={require("../../../assets/icons/haha.png")} alt='Haha' />
                                                    <p className='text-orange-400 text-xs'>Haha</p>
                                                </div>
                                                <div className='flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1.5 rounded-md'
                                                    onClick={() => post?.is_feel === -1 
                                                        ? handleLike(post?.post?._id, '4') 
                                                        : handleUpdateFelt(post?.post?._id, '4')}
                                                >
                                                    <img className='h-6 w-6' src={require("../../../assets/icons/sad.png")} alt='Sad' />
                                                    <p className='text-orange-400 text-xs'>Sad</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>                    
                        </div>
                        <div className='flex-1 flex items-center justify-center w-full px-3 py-2 bg-white'>
                            <div className='h-10 w-10 mr-3'>
                                <img className='h-full w-full object-cover rounded-full shadow'
                                    src={profile?.profilePicture}
                                    alt='Avatar'
                                />
                            </div>
                            <form onSubmit={handleCreateComment} className="w-11/12 mx-auto rounded-2xl bg-gray-100 items-center">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="1"
                                    value={description}
                                    onChange={handleInput}
                                    ref={textareaRef}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleCreateComment(e);  // Gọi hàm submit form
                                        }
                                    }}
                                    className="flex-grow w-full px-4 py-2 rounded-2xl mt-1 bg-gray-100 overflow-hidden
                                        focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-100"
                                    placeholder="Write your comment here..."
                                    style={{resize: 'none'}} // Optional: Prevent manual resizing
                                />
                                {imagePreview && (
                                    <div className='m-4 flex-1 flex'>
                                        <ImageComment
                                            selectedImages = {imagePreview}
                                        />
                                        <div className='w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300'
                                                onClick={handleDeletePreView}
                                        >
                                            <img
                                                src={require('../../../assets/icons/close.png')}
                                                alt=''
                                                className='w-4 h-4'
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-2 pb-2 px-3">
                                    <div className='text-gray-500 cursor-pointer'>
                                        <img className='h-6 w-6 object-cover'
                                            src={require("../../../assets/icons/smile.png")}
                                            alt=''
                                        />                                 
                                    </div>
                                    <div onClick={handleImageClick} className='text-gray-500 cursor-pointer'>
                                        <img className='h-6 w-6 object-cover'
                                            src={require("../../../assets/icons/camera.png")}
                                            alt=''
                                        />                                 
                                    </div>  
                                    {/* Hidden inputs */}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        ref={imageInputRef} 
                                        style={{ display: 'none' }} 
                                        onChange={handleImageChange} 
                                    />                                             
                                    <div className='flex-1'></div>
                                    {loading ? (
                                        <div>
                                            <LoadingSpinner/>
                                        </div>
                                    ):(
                                        <>
                                            {description || image ? (
                                                <button type="submit" className="text-white">
                                                    <img className='h-6 w-6 object-cover'
                                                        src={require("../../../assets/icons/send-blue.png")}
                                                        alt=''
                                                    />                            
                                                </button>                                 
                                            ) :(
                                                <div className="text-white">
                                                    <img className='h-6 w-6 object-cover'
                                                        src={require("../../../assets/icons/send-gray.png")}
                                                        alt=''
                                                    />                            
                                                </div>   
                                            )}                                    
                                        </>
                                    )}                          
                                </div>
                            </form>            
                        </div>
                        <div>
                            <Comment 
                                comments = {comments}
                                user = {user}
                                authorPost = {post?.author?.authorId}
                                postId = {postId}
                                profile = {profile?.profilePicture}
                            />
                        </div> 
                        <div className='ml-3 mb-2'>
                            <p className='text-xs text-gray-500'>
                            There are no more comments.
                            </p>
                        </div>                                 
                    </div>
                </div>            
            </div>            
        )}
    </div>
  )
    
}

export default GetAPost