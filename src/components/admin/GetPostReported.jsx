import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost, getReportPosts, keepPost } from '../../api/admin/admin'
import { useNavigate } from 'react-router-dom'
import { convertNewlinesToBreaks, timeAgo } from '../../utils'
import { SixPictures } from '../CssPictures/SixPictures'
import { FivePictures } from '../CssPictures/FivePictures'
import FourPictures from '../CssPictures/FourPictures'
import ThreePictures from '../CssPictures/ThreePictures'
import TwoPictures from '../CssPictures/TwoPictures'
import { OnePicture } from '../CssPictures/OnePicture'
import { VideoPlayer5 } from '../CssPictures/VideoPlayer5'
import { VideoPlayer4 } from '../CssPictures/VideoPlayer4'
import { VideoPlayer3 } from '../CssPictures/VideoPlayer3'
import { VideoPlayer2 } from '../CssPictures/VideoPlayer2'
import VideoPlayer from '../CssPictures/VideoPlayer'
import LoadingSpinner from '../spinner/LoadingSpinner'
import GetDetailReportPosts from './GetDetailReportPosts'

const GetPostReported = () => {
    const user = useSelector((state) => state.auth.login?.currentUser)
    const posts = useSelector((state) => state.admin.posts)

    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [showDetailReport, setShowDetail] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleShowComfirmDelete = (post) => {
        setShowModal(true)
        setSelectedPost(post)
    }

    const handleCancel = () => {
        setShowModal(false)
        setSelectedPost(null) 
        setShowDetail(false)   
    }

    const handleShowDetail = (post) => {
        setShowDetail(true)
        setSelectedPost(post)
    }

    const handleGetPosts = async() => {
        try {
            await getReportPosts(user?.token, dispatch);
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetUser = async(userId) => {
        navigate(`/get-profile/${userId}`)
    }

    const handleKeepPost = async (postId) => {
        try {
            await keepPost(user?.token, postId)
            handleGetPosts();
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePost = async (postId) => {
        setLoading(true)
        try {
            await deletePost(user?.token, postId)
            handleGetPosts();
            handleCancel();
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

      /* eslint-disable */
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        if(user?.token) {
            handleGetPosts()
        }
    },[])
  return (
    <div className=''>
        <div className='flex w-full h-[8vh] bg-white shadow items-center fixed z-10'>
            <h1 className='text-2xl font-bold ml-[5vw]'>
                Number of reported articles  ·
            </h1> 
            <p className='text-2xl font-bold ml-2 text-gray-500'>
                {posts?.length}
            </p>       
        </div>
        <div className=' pt-[9vh]'>
            {posts?.map((post) => {
                return (
                    <div key={post.postId} 
                        className='flex items-center justify-center'
                    >
                        <div className='bg-white w-3/5 my-2.5 border border-white shadow rounded-md'>
                            <div className='border-b mx-3 py-2 text-gray-500'>
                                This post has been reported.
                                <span className='text-customBlue text-[13px] ml-2 border-b border-customBlue italic cursor-pointer hover:text-purple-700 hover:border-purple-700'
                                    onClick={()=> handleShowDetail(post)}
                                >
                                    detail
                                </span>
                            </div>
                            <div className=' flex-1 flex items-center my-1'>
                                <div onClick={() => handleGetUser(post?.author?.authorId)} 
                                    className='flex mx-3 my-2 cursor-pointer'>
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
                            </div>
                            <div  className='cursor-pointer'>
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
                            <div className='mx-3 py-4 border-t'>                          
                                <div className='flex items-center justify-center'>
                                    <button className='bg-customBlue hover:bg-blue-600 font-medium mr-2 w-1/2 py-1 pb-1.5 rounded-md text-white'
                                        onClick={() => handleKeepPost(post.postId)}
                                    >
                                        Keep
                                    </button>
                                    <button className='bg-gray-200 hover:bg-gray-300 font-medium ml-2 w-1/2 py-1 pb-1.5 rounded-md'
                                        onClick={() => handleShowComfirmDelete(post)}
                                    >
                                        Remove
                                    </button>
                                </div>                                 
                            </div>
                            {showModal && selectedPost?.postId === post?.postId && (
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
                                                    onClick={()=> handleCancel()}
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' 
                                                        onClick={() => handleDeletePost(selectedPost?.postId)}
                                                    >
                                                    Delete
                                                </button>
                                            </div>                                        
                                        )}
                                    </div>
                                </div>
                            )}                            
                        </div>
                        {showDetailReport && selectedPost?.postId === post?.postId && (
                            <GetDetailReportPosts
                                user={user}
                                post={post}
                                isClose={()=> handleCancel()}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default GetPostReported