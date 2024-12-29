import React, { useEffect, useState } from 'react'
import { getFelt } from '../../api/reaction/reaction'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const GetFeft = ({isCloseModal , postId}) => {
    const user = useSelector((state) => state.auth.login?.currentUser)
    const myProfile = useSelector((state) => state?.auth?.profile)

    const [data, setData] = useState([])
    const [onClick, setOnClick] = useState('0')

    const navigation = useNavigate();

    const handleCloseModal = () => {
        isCloseModal()
    }

    const handleGetFeft = async() => {
        try {
            const result = await getFelt(user?.token, postId, navigation)
            setData(result)
        } catch (error) {
            console.log(error)
        }
    }

    const countLike = data?.filter((data) => data?.type === '1')
    const countLove = data?.filter((data) => data?.type === '2')
    const countHaha = data?.filter((data) => data?.type === '3')
    const countSad = data?.filter((data) => data?.type === '4')

    const handleGetUser = async(userId) => {
        navigation(`/get-profile/${userId}`)
    }

    /* eslint-disable */
    useEffect(()=> {
        handleGetFeft()
    },[])
    return (
        <div className="fixed inset-0 bg-opacity-75 bg-gray-800 flex items-center justify-center z-50">
            <div className='bg-white rounded-lg shadow-md w-full max-w-lg h-[70vh] flex flex-col'>
                <div className='flex justify-between items-center p-4 pb-2 bg-white rounded-lg'>
                    <div className='flex'>
                        <button className={`font-medium px-4 pb-2 ${onClick === '0' ? 'border-b-[3px] border-customBlue text-customBlue' : 'text-gray-600'}`}
                            onClick={() => setOnClick('0')}
                        >
                            All 
                        </button>
                        <button className={`px-4 flex text-gray-800 pb-2 ${onClick === '1' ? 'border-b-[3px] border-customBlue' : ''}`}
                            onClick={() => setOnClick('1')}
                        >
                            <img
                                src={require('../../assets/icons/like-blue1.png')}
                                alt=''
                                className='w-6 h-6 rounded-full mr-1'
                            />
                            {countLike?.length}
                        </button>
                        <button className={`px-4 flex text-gray-800 pb-2 ${onClick === '2' ? 'border-b-[3px] border-customBlue' : ''}`}
                            onClick={() => setOnClick('2')}
                        >
                            <img
                                src={require('../../assets/icons/love.png')}
                                alt=''
                                className='w-6 h-6 rounded-full mr-1'
                            />
                            {countLove?.length}
                        </button>
                        <button className={`px-4 flex text-gray-800 pb-2 ${onClick === '3' ? 'border-b-[3px] border-customBlue' : ''}`}
                            onClick={() => setOnClick('3')}
                        >
                            <img
                                src={require('../../assets/icons/haha.png')}
                                alt=''
                                className='w-6 h-6 rounded-full mr-1'
                            />
                            {countHaha?.length}
                        </button>
                        <button className={`px-4 flex text-gray-800 pb-2 ${onClick === '4' ? 'border-b-[3px] border-customBlue' : ''}`}
                            onClick={() => setOnClick('4')}
                        >
                            <img
                                src={require('../../assets/icons/sad.png')}
                                alt=''
                                className='w-6 h-6 rounded-full mr-1'
                            />
                            {countSad?.length}
                        </button>
                    </div>
                    <button onClick={handleCloseModal} 
                        className="w-8 h-8  bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center">
                        <img  
                            src={require('../../assets/icons/close.png')}
                            alt='Close'
                            className='w-5 h-5'
                        />
                    </button>                    
                </div>
                <div className='mb-2 overflow-y-auto'>
                    {onClick === '0' ? (
                        <>
                            {data?.map((user) => {
                                return (
                                    <div key={user?.feelId} className='bg-white my- p-0.5 border border-white flex-1 items-center'>
                                        <div className=' flex-1 flex items-center'>
                                            <div className='flex mx-3 my-2'>
                                                <div className='w-10 h-10 mt-1'>
                                                    <img className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                                                        src= {user?.author?.authorAvatar}
                                                        alt=''
                                                    />
                                                </div>
                                                <div className='relative mt-8 -ml-4'>
                                                    {user?.type === '1' ? (
                                                        <img
                                                            src={require('../../assets/icons/like-blue1.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        />                                                     
                                                    ) : user?.type === '2' ? (
                                                        <img
                                                            src={require('../../assets/icons/love.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : user?.type === '3' ? (
                                                        <img
                                                            src={require('../../assets/icons/haha.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : (
                                                        <img
                                                            src={require('../../assets/icons/sad.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    )}                                            
                                                </div>
                                                <div className='ml-3 flex flex-col justify-center'>
                                                    <h1 className='font-medium text-[15px]'>
                                                        {user?.author?.authorName}
                                                    </h1>
                                                    {myProfile?.friends?.includes(user?.author?.authorId) && (
                                                        <div className='text-sm text-gray-500'>
                                                            Friend.
                                                        </div>
                                                    )}
                                                    {myProfile?._id !== user?.author?.authorId ? (
                                                        <p className='text-sm text-gray-500'>
                                                            {user?.mutualFriendsCount} mutual friends
                                                        </p>                                                 
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div> 
                                            <div className='flex-1'></div>
                                            <div className='py-1.5 px-3 bg-blue-100 rounded-md cursor-pointer mr-2 hover:bg-blue-200'
                                                onClick={() => handleGetUser(user?.author?.authorId)}
                                            >
                                            <p className='text-customBlue font-medium text-[14px]'>
                                                View profile
                                            </p>
                                            </div>                   
                                        </div>
                                    </div>
                                )
                            })}                    
                        </>                        
                    ) : onClick === '1' ? (
                        <>
                            {countLike?.map((user) => {
                                return (
                                    <div key={user?.feelId} className='bg-white my- p-0.5 border border-white flex-1 items-center'>
                                        <div className=' flex-1 flex items-center'>
                                            <div className='flex mx-3 my-2'>
                                                <div className='w-10 h-10 mt-1'>
                                                    <img className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                                                        src= {user?.author?.authorAvatar}
                                                        alt=''
                                                    />
                                                </div>
                                                <div className='relative mt-8 -ml-4'>
                                                    {user?.type === '1' ? (
                                                        <img
                                                            src={require('../../assets/icons/like-blue1.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        />                                                     
                                                    ) : user?.type === '2' ? (
                                                        <img
                                                            src={require('../../assets/icons/love.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : user?.type === '3' ? (
                                                        <img
                                                            src={require('../../assets/icons/haha.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : (
                                                        <img
                                                            src={require('../../assets/icons/sad.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    )}                                            
                                                </div>
                                                <div className='ml-3 flex flex-col justify-center'>
                                                    <h1 className='font-medium text-[15px]'>
                                                        {user?.author?.authorName}
                                                    </h1>
                                                    {myProfile?.friends?.includes(user?.author?.authorId) && (
                                                        <div className='text-sm text-gray-500'>
                                                            Friend.
                                                        </div>
                                                    )}
                                                    {myProfile?._id !== user?.author?.authorId ? (
                                                        <p className='text-sm text-gray-500'>
                                                            {user?.mutualFriendsCount} mutual friends
                                                        </p>                                                 
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div> 
                                            <div className='flex-1'></div>
                                            <div className='py-1.5 px-3 bg-blue-100 rounded-md cursor-pointer mr-2 hover:bg-blue-200'
                                                onClick={() => handleGetUser(user?.author?.authorId)}
                                            >
                                            <p className='text-customBlue font-medium text-[14px]'>
                                                View profile
                                            </p>
                                            </div>                   
                                        </div>
                                    </div>
                                )
                            })}                    
                        </>
                    ) : onClick === '2' ? (
                        <>
                            {countLove?.map((user) => {
                                return (
                                    <div key={user?.feelId} className='bg-white my- p-0.5 border border-white flex-1 items-center'>
                                        <div className=' flex-1 flex items-center'>
                                            <div className='flex mx-3 my-2'>
                                                <div className='w-10 h-10 mt-1'>
                                                    <img className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                                                        src= {user?.author?.authorAvatar}
                                                        alt=''
                                                    />
                                                </div>
                                                <div className='relative mt-8 -ml-4'>
                                                    {user?.type === '1' ? (
                                                        <img
                                                            src={require('../../assets/icons/like-blue1.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        />                                                     
                                                    ) : user?.type === '2' ? (
                                                        <img
                                                            src={require('../../assets/icons/love.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : user?.type === '3' ? (
                                                        <img
                                                            src={require('../../assets/icons/haha.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : (
                                                        <img
                                                            src={require('../../assets/icons/sad.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    )}                                            
                                                </div>
                                                <div className='ml-3 flex flex-col justify-center'>
                                                    <h1 className='font-medium text-[15px]'>
                                                        {user?.author?.authorName}
                                                    </h1>
                                                    {myProfile?.friends?.includes(user?.author?.authorId) && (
                                                        <div className='text-sm text-gray-500'>
                                                            Friend.
                                                        </div>
                                                    )}
                                                    {myProfile?._id !== user?.author?.authorId ? (
                                                        <p className='text-sm text-gray-500'>
                                                            {user?.mutualFriendsCount} mutual friends
                                                        </p>                                                 
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div> 
                                            <div className='flex-1'></div>
                                            <div className='py-1.5 px-3 bg-blue-100 rounded-md cursor-pointer mr-2 hover:bg-blue-200'
                                                onClick={() => handleGetUser(user?.author?.authorId)}
                                            >
                                            <p className='text-customBlue font-medium text-[14px]'>
                                                View profile
                                            </p>
                                            </div>                   
                                        </div>
                                    </div>
                                )
                            })}                    
                        </>
                    ) : onClick === '3' ? (
                        <>
                            {countHaha?.map((user) => {
                                return (
                                    <div key={user?.feelId} className='bg-white my- p-0.5 border border-white flex-1 items-center'>
                                        <div className=' flex-1 flex items-center'>
                                            <div className='flex mx-3 my-2'>
                                                <div className='w-10 h-10 mt-1'>
                                                    <img className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                                                        src= {user?.author?.authorAvatar}
                                                        alt=''
                                                    />
                                                </div>
                                                <div className='relative mt-8 -ml-4'>
                                                    {user?.type === '1' ? (
                                                        <img
                                                            src={require('../../assets/icons/like-blue1.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        />                                                     
                                                    ) : user?.type === '2' ? (
                                                        <img
                                                            src={require('../../assets/icons/love.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : user?.type === '3' ? (
                                                        <img
                                                            src={require('../../assets/icons/haha.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : (
                                                        <img
                                                            src={require('../../assets/icons/sad.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    )}                                            
                                                </div>
                                                <div className='ml-3 flex flex-col justify-center'>
                                                    <h1 className='font-medium text-[15px]'>
                                                        {user?.author?.authorName}
                                                    </h1>
                                                    {myProfile?.friends?.includes(user?.author?.authorId) && (
                                                        <div className='text-sm text-gray-500'>
                                                            Friend.
                                                        </div>
                                                    )}
                                                    {myProfile?._id !== user?.author?.authorId ? (
                                                        <p className='text-sm text-gray-500'>
                                                            {user?.mutualFriendsCount} mutual friends
                                                        </p>                                                 
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div> 
                                            <div className='flex-1'></div>
                                            <div className='py-1.5 px-3 bg-blue-100 rounded-md cursor-pointer mr-2 hover:bg-blue-200'
                                                onClick={() => handleGetUser(user?.author?.authorId)}
                                            >
                                            <p className='text-customBlue font-medium text-[14px]'>
                                                View profile
                                            </p>
                                            </div>                   
                                        </div>
                                    </div>
                                )
                            })}                    
                        </>
                    ) : (
                        <>
                            {countSad?.map((user) => {
                                return (
                                    <div key={user?.feelId} className='bg-white my- p-0.5 border border-white flex-1 items-center'>
                                        <div className=' flex-1 flex items-center'>
                                            <div className='flex mx-3 my-2'>
                                                <div className='w-10 h-10 mt-1'>
                                                    <img className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                                                        src= {user?.author?.authorAvatar}
                                                        alt=''
                                                    />
                                                </div>
                                                <div className='relative mt-8 -ml-4'>
                                                    {user?.type === '1' ? (
                                                        <img
                                                            src={require('../../assets/icons/like-blue1.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        />                                                     
                                                    ) : user?.type === '2' ? (
                                                        <img
                                                            src={require('../../assets/icons/love.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : user?.type === '3' ? (
                                                        <img
                                                            src={require('../../assets/icons/haha.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    ) : (
                                                        <img
                                                            src={require('../../assets/icons/sad.png')}
                                                            alt=''
                                                            className='w-5 h-5 rounded-full'
                                                        /> 
                                                    )}                                            
                                                </div>
                                                <div className='ml-3 flex flex-col justify-center'>
                                                    <h1 className='font-medium text-[15px]'>
                                                        {user?.author?.authorName}
                                                    </h1>
                                                    {myProfile?.friends?.includes(user?.author?.authorId) && (
                                                        <div className='text-sm text-gray-500'>
                                                            Friend.
                                                        </div>
                                                    )}
                                                    {myProfile?._id !== user?.author?.authorId ? (
                                                        <p className='text-sm text-gray-500'>
                                                            {user?.mutualFriendsCount} mutual friends
                                                        </p>                                                 
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div> 
                                            <div className='flex-1'></div>
                                            <div className='py-1.5 px-3 bg-blue-100 rounded-md cursor-pointer mr-2 hover:bg-blue-200'
                                                onClick={() => handleGetUser(user?.author?.authorId)}
                                            >
                                            <p className='text-customBlue font-medium text-[14px]'>
                                                View profile
                                            </p>
                                            </div>                   
                                        </div>
                                    </div>
                                )
                            })}                    
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default GetFeft