import React from 'react'
import { timeAgo } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { checkNotification } from '../../api/notification/notification';
import { useSelector } from 'react-redux';

const GetNotifications = ({notifications, setShowModalNotification, handleGetNotifications}) => {
    const user = useSelector((state) => state.auth.login?.currentUser)

    const navigation = useNavigate()

    const handleGetAPost = async(postId, notiId) => {
        await checkNotification(user?.token, notiId, navigation)
        navigation(`/get-post/${postId}`)
        setShowModalNotification();
        handleGetNotifications();
    }

    const handleGetUser = async(userId, notiId) => {
        await checkNotification(user?.token, notiId, navigation)
        navigation(`/get-profile/${userId}`)
        setShowModalNotification();
        handleGetNotifications();
    }

    const handleGetGroup = async(groupId, notiId) => {
        await checkNotification(user?.token, notiId, navigation)
        navigation(`/groups/${groupId}`)
        setShowModalNotification();
        handleGetNotifications();        
    }

    const handleGetRequestMembers = async(groupId, notiId) => {
        await checkNotification(user?.token, notiId, navigation)
        navigation(`/groups/${groupId}/member-requests`)
        setShowModalNotification();
        handleGetNotifications();        
    }

    const handleGetMembers = async(groupId, notiId) => {
        await checkNotification(user?.token, notiId, navigation)
        navigation(`/groups/${groupId}/members`)
        setShowModalNotification();
        handleGetNotifications();        
    }

    const handleGetReportPosts = async(groupId, notiId) => {
        await checkNotification(user?.token, notiId, navigation)
        navigation(`/groups/${groupId}/reported-posts`)
        setShowModalNotification();
        handleGetNotifications();        
    }
    return (
        <div>
            <div className='absolute top-[-8px] right-[79px] transform rotate-45 w-3 h-3 bg-white border-l border-t border-gray-200'>
            </div>
            <div>
                <h1 className='font-bold text-xl ml-2.5'>
                    Notifications
                </h1>
            </div>
            {notifications?.length <= 0 ? (
                <div className='flex-1 flex items-center justify-center mt-5'>
                    <div className='flex flex-col items-center justify-center'>
                        <img
                            src={require('../../assets/icons/notification.png')}
                            alt=''
                            className='w-20 h-20 mb-4'
                        />
                        <p className='text-gray-500 text-xl font-medium italic'>
                            You have no notifications
                        </p>                        
                    </div>
                </div>
            ) : (
                <div className='mt-3'>
                    {notifications?.map((notification) => {
                        return (
                            <div key={notification?._id} 
                                onClick={()=> 
                                    {notification?.type === 'friend_request' || notification?.type === 'friend_accept' ? 
                                        (handleGetUser(notification?.sender?._id, notification?._id)) : 
                                    ['invite-members', 'accept-group'].includes(notification.type) ?
                                        (handleGetGroup(notification.groupId, notification._id)) :
                                    notification.type === 'request-group' ?
                                        (handleGetRequestMembers(notification.groupId, notification._id)) : 
                                    notification.type === 'report-post' ?
                                        (handleGetReportPosts(notification.groupId, notification._id)) : 
                                    notification.type === 'join-group' ?
                                        (handleGetMembers(notification.groupId, notification._id)) :
                                        (handleGetAPost(notification?.postId, notification?._id)) 
                                    }}
                            >
                                <div className={`flex mx-1 my-1 cursor-pointer hover:bg-gray-200 rounded-md p-1.5 py-1 ${notification?.read === false ? '' : 'opacity-60'}`}>
                                    <div className='w-11 h-11 mr-3 mt-1'>
                                        <img className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                                            src= {notification?.sender?.profilePicture}
                                            alt=''
                                        />
                                    </div>
                                    <div className='absolute left-9 mt-9'>
                                        {notification?.type === 'set_comment' || notification?.type === 'update_comment' ? (
                                            <img
                                                src={require('../../assets/icons/comment1.png')}
                                                alt=''
                                                className='w-6 h-6 rounded-full'
                                            />                                            
                                        ) : notification?.type === 'create_post' ? (
                                            <div className='rounded-full bg-customBlue w-6 h-6'
                                                style={{ backgroundPosition: '-1.5px -1945.5px', backgroundImage: `url(${require('../../assets/icons/icons.png')})` }}
                                            >
                                            </div>
                                        ) : notification?.type === 'friend_request' || notification?.type === 'friend_accept' ? (
                                            <div className='rounded-full bg-customBlue w-6 h-6'
                                                style={{ backgroundPosition: '-1.5px -1191px', backgroundImage: `url(${require('../../assets/icons/icons.png')})` }}
                                            >
                                            </div>                                            
                                        ) : ['invite-members', 'request-group', 'join-group', 'accept-group', 'report-post'].includes(notification?.type) ? (
                                            <div className='rounded-full bg-customBlue w-6 h-6'
                                                style={{ backgroundPosition: '-2px 1245px', backgroundImage: `url(${require('../../assets/icons/icons.png')})` }}
                                            >
                                            </div>                                             
                                        ) : (
                                            <>  
                                                {notification?.type_felt === '1' ? (
                                                    <img
                                                        src={require('../../assets/icons/like-blue1.png')}
                                                        alt=''
                                                        className='w-6 h-6 rounded-full'
                                                    />                                                     
                                                ) : notification?.type_felt === '2' ? (
                                                    <img
                                                        src={require('../../assets/icons/love.png')}
                                                        alt=''
                                                        className='w-6 h-6 rounded-full'
                                                    /> 
                                                ) : notification?.type_felt === '3' ? (
                                                    <img
                                                        src={require('../../assets/icons/haha.png')}
                                                        alt=''
                                                        className='w-6 h-6 rounded-full'
                                                    /> 
                                                ) : (
                                                    <img
                                                        src={require('../../assets/icons/sad.png')}
                                                        alt=''
                                                        className='w-6 h-6 rounded-full'
                                                    /> 
                                                )}
                                           
                                            </>
                                        )}

                                    </div>
                                    <div className='w-5/6'>
                                        <p className='text-base'>
                                            <strong>{notification?.sender?.username}</strong>  {notification?.message}
                                        </p>
                                        <span className={`text-sm ${notification?.read === false ? 'text-customBlue font-medium' : 'text-gray-800' } `}>
                                            {timeAgo(notification?.createdAt)}
                                        </span>                                        
                                    </div>
                                </div> 
                            </div>
                        )
                    })}
                </div>                
            )}

        </div>
    )
}

export default GetNotifications