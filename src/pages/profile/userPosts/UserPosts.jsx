import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from "react-router-dom"
import { convertNewlinesToBreaks, timeAgo } from '../../../utils'
import { SixPictures } from '../../../components/CssPictures/SixPictures'
import { FivePictures } from '../../../components/CssPictures/FivePictures'
import FourPictures from '../../../components/CssPictures/FourPictures'
import ThreePictures from '../../../components/CssPictures/ThreePictures'
import TwoPictures from '../../../components/CssPictures/TwoPictures'
import { OnePicture } from '../../../components/CssPictures/OnePicture'
import { VideoPlayer5 } from '../../../components/CssPictures/VideoPlayer5'
import { VideoPlayer4 } from '../../../components/CssPictures/VideoPlayer4'
import { VideoPlayer3 } from '../../../components/CssPictures/VideoPlayer3'
import { VideoPlayer2 } from '../../../components/CssPictures/VideoPlayer2'
import VideoPlayer from '../../../components/CssPictures/VideoPlayer'
import { deletePost, getUserPost } from '../../../api/post/post'
import { useDispatch, useSelector } from 'react-redux'
import { setFelt, unFelt, updateFelt } from '../../../api/reaction/reaction'
import EditPost from '../../../components/post/EditPost'
import LoadingSpinner from '../../../components/spinner/LoadingSpinner'
import GetFeft from '../../../components/comment/GetFeft'
import socket from '../../../socket'

const UserPosts = () => {
    const userId = useOutletContext()
    const user = useSelector((state) => state.auth.login?.currentUser)
    const posts = useSelector((state) => state.post.userPosts)
    const profile = useSelector((state) => state?.auth?.profile)
    // const [posts, setPosts] = useState([]);
    // console.log(userId)

    const [showFelter, setShowFelter] = useState(false)

    const [showModal, setShowModal] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isAbove, setIsAbove] = useState(false);

    const [loading, setLoading] = useState(false);

    const [showDelete, setShowDelete] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [editModal, setEditModal] = useState(false);
    
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [hoveredPostId, setHoveredPostId] = useState(null);

    const modalRef = useRef(null);
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const limit = {
        page: 1,
        limit: 20,   
    }

    useEffect(() => {
        // Lắng nghe sự kiện onlineUsers từ server
        socket.on("onlineUsers", (users) => {
        //   console.log("Online users:", users);
          setOnlineUsers(users);
        });
    
        // Cleanup
        return () => {
          socket.off("onlineUsers");
        };
    }, []);

    const handleShowGetFelt = (post) => {
        setShowFelter(true)
        setSelectedPost(post)
    }

    const handleMouseEnter = (postId) => {
        setHoveredPostId(postId);
    };

    const handleMouseLeave = () => {
        setHoveredPostId(null);
    };

    const handleLike = async(postId, type) => {
        try {
            const data = {
                postId: postId,
                type: type
            }
            await setFelt(user?.token, data, navigation)
            setHoveredPostId(null);
            handleGetUserPost();
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnLike = async (postId) => {
        try {
            await unFelt(user?.token, postId, navigation)
            setHoveredPostId(null);
            handleGetUserPost();
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateFelt = async(postId, type) => {
        try {
            const data = {
                type: type
            } 
            await updateFelt(user?.token, data, postId, navigation) 
            setHoveredPostId(null);
            handleGetUserPost();         
        } catch (error) {
            console.log(error)
        }
    }

    const handleThreeDotsClick = (event, post) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
    
        if (rect.bottom > viewportHeight - 50) {
            setIsAbove(true);
            setModalPosition({
                top: rect.top + window.scrollY - 90,
                left: rect.left + window.scrollX - 50,
            });
        } else {
            setIsAbove(false);
            setModalPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 120,
            });
        }
    
        setShowModal(post?.postId);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(null);
        }
    };
  
    useEffect(() => {
      if (showModal) {
          document.addEventListener('mousedown', handleClickOutside);
      } else {
          document.removeEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showModal]);

    const handleDeletepost = async(postId) => {
        setLoading(true)
        try {
            await deletePost(user?.token, postId, navigation)

            setShowDelete(false)
            setSelectedPost(null)

            handleGetUserPost();
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleShowComfirmDelete = (post) => {
        setShowModal(null)
        setShowDelete(true)
        setSelectedPost(post)
    }

    const handleCancelDelete = () => {
        setShowDelete(false)
        setSelectedPost(null)    
    }

    const handleEditModal = (post) =>{
        setShowModal(null)
        setEditModal(true)
        setSelectedPost(post)
    }

    const handleGetAPost = async(postId) => {
        navigation(`/get-post/${postId}`)
    }

    const handleGetUserPost = async () => {
        try {
            await getUserPost(user?.token, userId, dispatch, navigation)
            // setPosts(result);            
        } catch (error) {
            console.log(error)
        }
    }

    /* eslint-disable */
    useEffect(() => {
        handleGetUserPost();
    },[userId])


    useEffect(() => {
        if (editModal || showFelter) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
  
        // Cleanup khi component bị unmount
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [editModal, showFelter]);
    return (
        <div>
            {posts?.length === 0 ? (
                <div className='flex-1 flex items-center justify-center mt-10'>
                    <p className='text-gray-500 text-base'>
                        There are no posts
                    </p>
                </div>
            ) : (
                <>
                    {posts?.map((post) => {
                        return (
                            <div key={post?.postId} 
                                className='bg-white mt-0 mb-4 border border-white shadow rounded-md flex-1 items-center'
                            >
                                <div className=' flex-1 flex items-center'>
                                    <div className='flex mx-3 my-2 cursor-pointer'>
                                        {onlineUsers?.includes(post?.author?.authorId) && (
                                            <div className='w-3 h-3 border-2 border-white rounded-full bg-green-600 absolute mt-[29px] ml-[29px]'></div>
                                        )}
                                        <div className='w-10 h-10'>
                                            <img className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                                                src= {post?.author?.authorAvatar}
                                                alt=''
                                            />
                                        </div>
                                        <div className='ml-3'>
                                            <h1 className='font-medium text-base'>
                                                {post?.author?.authorName}
                                            </h1>
                                            <p className='text-xs text-gray-500'>
                                                {timeAgo(post?.createdAt)}
                                            </p>
                                        </div>
                                    </div>  
                                    <div className='flex-1'></div>
                                    {user?.userId === post?.author?.authorId ? (
                                        <div className='mr-3 cursor-pointer p-1.5 rounded-full hover:bg-gray-100'
                                                onClick={(e) => handleThreeDotsClick(e, post)}
                                        >
                                            <img className='w-6 h-6'
                                                src={require('../../../assets/icons/menu.png')}
                                                alt="" 
                                            />
                                        </div>                             
                                    ) : (
                                        ''
                                    )}
                                    {showModal === post?.postId && (
                                        <div
                                            ref={modalRef}
                                            className='absolute bg-white border border-gray-200 rounded shadow-2xl z-10'
                                            style={{
                                                top: modalPosition.top,
                                                left: modalPosition.left,
                                            }}                       
                                        >
                                            <div className='relative'>
                                                <div
                                                    className={`absolute transform rotate-45 w-3 h-3 bg-white border-gray-200 ${
                                                        isAbove ? 'bottom-[-6px] border-b border-r' : 'top-[-6px] border-l border-t'
                                                    } left-[132px]`}>
                                                </div>
                                                <div className='py-2 px-1.5'>
                                                    <div className='flex hover:bg-gray-100 px-2 rounded'
                                                        onClick={() => handleEditModal(post)}
                                                    >
                                                        <img className='w-6 h-6 mr-3 mt-1'
                                                            src={require('../../../assets/icons/edit1.png')}
                                                            alt=''
                                                        />
                                                        <p className='py-1 cursor-pointer text-black'>Edit post </p>
                                                    </div>
                                                    <div className='flex hover:bg-red-50 px-2 rounded'
                                                            onClick={() => handleShowComfirmDelete(post)}
                                                    >
                                                        <img className='w-6 h-6 mr-3 mt-1'
                                                            src={require('../../../assets/icons/delete.png')}
                                                            alt=''
                                                        />
                                                        <p className='py-1 cursor-pointer text-red-600'>Delete post </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {showDelete && selectedPost?.postId === post?.postId && (
                                        <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                                            <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                                                <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                                    Delete {selectedPost?.author?.authorName}'s Post
                                                </h2>
                                                <p className='text-sm text-gray-600 mb-5'>
                                                    Are you sure you want to delete this post?
                                                </p>
                                                {loading ? (
                                                    <div className='flex justify-center'>
                                                        <LoadingSpinner/>
                                                    </div>
                                                ):(
                                                    <div className='flex justify-end space-x-4'>
                                                        <button 
                                                            className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300' 
                                                            onClick={handleCancelDelete}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' 
                                                            onClick={() => handleDeletepost(selectedPost?.postId)}>
                                                            Delete
                                                        </button>
                                                    </div>                                        
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {editModal && selectedPost?.postId === post?.postId && (
                                        <EditPost
                                            params = {limit}
                                            user = {user}
                                            profile = {profile}
                                            postId = {selectedPost?.postId}
                                            text = {selectedPost?.description}
                                            oldImages = {selectedPost?.images}
                                            oldVideo = {selectedPost?.video}
                                            oldTypeText = {selectedPost?.typeText}
                                            isCloseModal = {() => setEditModal(false)}
                                        />
                                    )}
                                </div>
                                <div className='cursor-pointer'>
                                    {post?.typeText === false ?(
                                        <p className='ml-3.5 font-mono' style={{color: "#333333"}}>
                                            {post?.description ? (
                                                convertNewlinesToBreaks(post?.description)
                                            ) : (
                                                ''
                                            )}
                                        </p>
                                    ) : (
                                        <p className='ml-3.5 font-sans' style={{color: "#050505"}}>
                                            {post?.description ? (
                                                convertNewlinesToBreaks(post?.description)
                                            ) : (
                                                ''
                                            )}
                                        </p>
                                    )}
                                    <div className='mt-2'>
                                        {(post?.video == null || !post?.video) ? (
                                            <>
                                                {post?.images.length > 5 ? (
                                                    <SixPictures
                                                        selectedImages={post?.images.map(img => img.url)} 
                                                        extraImagesCount={post?.images.length - 4}
                                                    />
                                                ) : post?.images.length === 5 ? (
                                                    <FivePictures selectedImages={post?.images.map(img => img.url)}/>
                                                ) : post?.images.length === 4 ? (
                                                    <FourPictures selectedImages={post?.images.map(img => img.url)}/>
                                                ) : post?.images.length === 3 ? (
                                                    <ThreePictures selectedImages={post?.images.map(img => img.url)}/>
                                                ) : post?.images.length === 2 ? (
                                                    <TwoPictures selectedImages={post?.images.map(img => img.url)}/>
                                                ) : post?.images.length === 1 ? (
                                                    <OnePicture selectedImages={post?.images.map(img => img.url)}/>
                                                ) : ('')}
                                            </>
                                        ) : (
                                            <>  
                                                {post?.images.length > 3 ? (
                                                    <VideoPlayer5
                                                        url = {post.video.url}
                                                        selectedImages = {post?.images.map(img => img.url)}
                                                        extraImagesCount={post?.images.length - 2}
                                                    /> 
                                                ) : post?.images.length === 3 ? (
                                                    <VideoPlayer4
                                                        url = {post.video.url}
                                                        selectedImages = {post?.images.map(img => img.url)}
                                                    />                                        
                                                ) : post?.images.length === 2 ? (
                                                    <VideoPlayer3
                                                        url = {post.video.url}
                                                        selectedImages = {post?.images.map(img => img.url)}
                                                    />                                        
                                                ) : post?.images.length === 1 ? (
                                                    <VideoPlayer2
                                                        url = {post.video.url}
                                                        selectedImages = {post?.images.map(img => img.url)}
                                                    />                                        
                                                ) : (
                                                    <VideoPlayer url = {post?.video.url}/>
                                                )} 
                                            </>
                                        )} 
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='flex mt-2 mb-2'>
                                        <div className='w-1/2 flex-1 flex items-center '>
                                            <div className='cursor-pointer flex' onClick={()=> handleShowGetFelt(post)}>
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
                                                {post?.felt}
                                            </p>
                                        </div>
                                        <div className='w-1/2 flex '>
                                            <div className='flex-1'></div>
                                            <p className='text-gray-500 font-normal text-base'>
                                                {post?.comment}
                                            </p>
                                            <p className='text-gray-500 font-normal text-base ml-1 mr-3.5'>
                                                comments
                                            </p>
                                        </div> 
                                    </div>
                                    {showFelter && selectedPost?.postId === post?.postId && (
                                        <GetFeft
                                            postId={selectedPost?.postId}
                                            isCloseModal = {() => setShowFelter(false)}
                                        />
                                    )}
                                    <div className='relative'>
                                        {/* Các nút hành động */}
                                        <div className='flex-1 flex border-t border-gray-300 py-1 mx-3.5'>
                                            <div
                                                className={`w-1/2 flex-1 flex items-center justify-center cursor-pointer py-1 rounded-md hover:bg-gray-100`}
                                                onMouseEnter={() => handleMouseEnter(post?.postId)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {post?.is_feel === '1' ? (
                                                    <div className='w-full flex items-center justify-center py-1'
                                                        onClick={() => handleUnLike(post?.postId)}
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
                                                        onClick={() => handleUnLike(post?.postId)}
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
                                                        onClick={() => handleUnLike(post?.postId)}
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
                                                        onClick={() => handleUnLike(post?.postId)}
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
                                                        onClick={() => handleLike(post?.postId, '1')}
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
                                                onClick={() => handleGetAPost(post?.postId)}
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
                                        {hoveredPostId === post?.postId && (
                                            <div className='absolute bottom-full -mb-2 left-16 p-1 bg-white shadow-lg rounded-md z-10'
                                                onClick={()=> setHoveredPostId(null)}
                                                onMouseEnter={() => handleMouseEnter(post?.postId)}  
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <div className='flex justify-between'>
                                                    <div className='flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1.5 rounded-md'
                                                        onClick={() => post?.is_feel === -1 
                                                            ? handleLike(post?.postId, '1') 
                                                            : handleUpdateFelt(post?.postId, '1')}
                                                    >
                                                        <img className='h-6 w-6' src={require("../../../assets/icons/like-blue.png")} alt='Like' />
                                                        <p className='text-customBlue text-xs'>Like</p>
                                                    </div>
                                                    <div className='flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1.5 rounded-md'
                                                        onClick={() => post?.is_feel === -1 
                                                            ? handleLike(post?.postId, '2') 
                                                            : handleUpdateFelt(post?.postId, '2')}
                                                    >
                                                        <img className='h-6 w-6' src={require("../../../assets/icons/love.png")} alt='Love' />
                                                        <p className='text-red-500 text-xs'>Love</p>
                                                    </div>
                                                    <div className='flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1.5 rounded-md'
                                                        onClick={() => post?.is_feel === -1 
                                                            ? handleLike(post?.postId, '3') 
                                                            : handleUpdateFelt(post?.postId, '3')}
                                                    >
                                                        <img className='h-6 w-6' src={require("../../../assets/icons/haha.png")} alt='Haha' />
                                                        <p className='text-orange-400 text-xs'>Haha</p>
                                                    </div>
                                                    <div className='flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1.5 rounded-md'
                                                        onClick={() => post?.is_feel === -1 
                                                            ? handleLike(post?.postId, '4') 
                                                            : handleUpdateFelt(post?.postId, '4')}
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
                        )
                    })}                
                </>
            )}

        </div>
    )
}

export default UserPosts