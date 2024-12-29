import React, { useEffect, useRef, useState } from 'react';
import { 
    acceptRequest, cancelFriend, cancelRequest, getFriends, getRequested, refuseRequest, requestFriends 
} from '../../../api/friends/friends';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../../api/profile/profile';
import { useDispatch } from 'react-redux';
import { createChat1vs1 } from '../../../api/chat/chat';

const GetFriends = ({ userId, user }) => {
    const [data, setData] = useState([]);
    
    const [showModal, setShowModal] = useState(null); // Track the modal for a specific friend
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isAbove, setIsAbove] = useState(false);
    const modalRef = useRef(null);

    const [clickedUsers, setClickedUsers] = useState({});

    const [requestUser, setRequestUser] = useState([])
    
    const [requesting, setRequesting] = useState({})
    const [myFriend, setMyFriend] = useState({})

    const dispatch = useDispatch();
    const navigation = useNavigate();

    const handleCreateChat = async (userId) => {
        try {
            await createChat1vs1(user?.token, userId, navigation)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetCurrentUser = async () => {
        try {
            const res = await getProfile(user?.token, dispatch, user?.userId, navigation)
            setRequesting(res.friendRequesting)
            setMyFriend(res.friends)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetRequested = async() =>{
        try {
            const result = await getRequested(user?.token, navigation)
            setRequestUser(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAccept = async (userId) => {
        try {
            await acceptRequest(user?.token, userId, navigation);
            handleGetRequested();
            handleGetCurrentUser();
            handleGetFriends();
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefuse = async (userId) => {
        try {
            await refuseRequest(user?.token, userId, navigation);
            handleGetRequested()
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddFriend = async (userId) => {
        try {
            await requestFriends(user?.token, userId, navigation);
            setClickedUsers(prev => ({
                ...prev,
                [userId]: true
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelRequest = async (userId) => {
        try {
            await cancelRequest(user?.token, userId, navigation);
            setClickedUsers(prev => ({
                ...prev,
                [userId]: false
            }));
            handleGetCurrentUser();
        } catch (error) {
            console.log(error);
        }
    };

    const [confirmationModal, setConfirmationModal] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleThreeDotsClick = (event, friend) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (rect.bottom > viewportHeight - 50) {
            setIsAbove(true);
            setModalPosition({
                top: rect.top + window.scrollY - 80,
                left: rect.left + window.scrollX,
            });
        } else {
            setIsAbove(false);
            setModalPosition({
                top: rect.bottom + window.scrollY - 10,
                left: rect.left + window.scrollX,
            });
        }

        setShowModal(friend?._id); // Set the modal to open for the specific friend
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

    const handleGetFriends = async () => {
        try {
            const result = await getFriends(user?.token, userId, navigation);
            setData(result);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetUser = async (userId) => {
        navigation(`/get-profile/${userId}`);
    };

    const handleUnfriendClick = (friend) => {
        setSelectedFriend(friend);
        setConfirmationModal(true);
        setShowModal(null); // Close the options modal
    };

    const handleConfirmUnfriend = async (userId) => {
        try {
            await cancelFriend(user?.token, userId, navigation)
            setData(data.filter(f => f._id !== selectedFriend._id));
            setConfirmationModal(false);
            setSelectedFriend(null);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelUnfriend = () => {
        setConfirmationModal(false);
        setSelectedFriend(null);
    };

    /* eslint-disable */
    useEffect(() => {
        handleGetFriends();
        handleGetCurrentUser();
        handleGetRequested();
    }, [userId]);

    return (
        <div>
            {data?.map((friend) => {
                return (
                    <div key={friend?._id} className='flex-1 flex items-center justify-center'>
                        <div className='w-11/12 flex bg-white border border-gray-100 shadow-sm rounded-md mb-3'>
                            <div onClick={() => handleGetUser(friend?._id)} 
                                className='flex mx-3 my-2 cursor-pointer'>
                                <div className='w-10 h-10'>
                                    <img className='h-full w-full object-cover rounded-full shadow'
                                        src={friend?.profilePicture}
                                        alt=''
                                    />
                                </div>
                                <div className='ml-3'>
                                    <h1 className='font-medium text-base'>
                                        {friend?.username}
                                    </h1>
                                    <p className='text-xs text-gray-500'>
                                        {friend?.mutualFriends} mutual friends
                                    </p>
                                </div>
                            </div>
                            <div className='flex-1'></div>
                            {myFriend?.includes(friend?._id) ? (
                                <>
                                    {userId === user?.userId && (
                                        <div className='mr-3 cursor-pointer flex items-center' onClick={(e) => handleThreeDotsClick(e, friend)}>
                                            <img className='w-6 h-6'
                                                src={require('../../../assets/icons/menu.png')}
                                                alt=""
                                            />
                                        </div>                                        
                                    )}
                                </>
                                
                            ) : (
                                <div className='flex items-center'>
                                    {requestUser?.some((user) => user?._id === friend?._id) ? (
                                        <div className='flex items-center'>
                                            <div className='mr-3 cursor-pointer bg-customBlue py-1.5 px-6 rounded-md '
                                                    onClick={() => handleAccept(friend?._id)}
                                            >
                                                <p className='text-white font-medium text-sm'>
                                                    Confirm
                                                </p>
                                            </div> 
                                            <div className='mr-3 cursor-pointer bg-gray-300 py-1.5 px-6 rounded-md'
                                                    onClick={() => handleRefuse(friend?._id)}
                                            >
                                                <p className='text-black font-medium text-sm'>
                                                    Delete
                                                </p>
                                            </div>                                                               
                                        </div>
                                    ) : (
                                        <div>
                                            {clickedUsers[friend?._id] || requesting?.includes(friend?._id) ? (
                                                <div onClick={() => handleCancelRequest(friend?._id)}
                                                    className='mr-3 cursor-pointer bg-gray-300 py-1.5 px-6 rounded-md'>
                                                    <p className='text-black font-medium text-sm'>
                                                        Cancel request
                                                    </p>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => handleAddFriend(friend?._id)}
                                                    className='mr-3 cursor-pointer bg-customBlue py-1.5 px-6 rounded-md'>
                                                    <p className='text-white font-medium text-sm'>
                                                        Add friend
                                                    </p>
                                                </div>
                                            )}                                        
                                        </div>
                                    )}

                                </div>
                            )}

                            {showModal === friend?._id && (
                                <div
                                    ref={modalRef}
                                    className='absolute bg-white border border-gray-200 rounded shadow-md z-10'
                                    style={{
                                        top: modalPosition.top,
                                        left: modalPosition.left,
                                    }}>
                                    <div className='relative'>
                                        <div
                                            className={`absolute transform rotate-45 w-3 h-3 bg-white border-gray-200 ${
                                                isAbove ? 'bottom-[-6px] border-b border-r' : 'top-[-6px] border-l border-t'
                                            } left-0`}>
                                        </div>
                                        <div className='py-2 px-1.5'>
                                            <div className='flex hover:bg-gray-100 px-2 rounded'
                                                onClick={() => handleCreateChat(friend?._id)}
                                            >
                                                <img className='w-6 h-6 mr-3 mt-1'
                                                    src={require('../../../assets/icons/chat.png')}
                                                    alt=''
                                                />
                                                <p className='py-1 cursor-pointer '>Message </p>
                                            </div>
                                            <div className='flex hover:bg-gray-100 px-2 rounded'
                                                    onClick={() => handleUnfriendClick(friend)}
                                            >
                                                <img className='w-6 h-6 mr-3 mt-1'
                                                    src={require('../../../assets/icons/unfriend.png')}
                                                    alt=''
                                                />
                                                <p className='py-1 cursor-pointer '>Unfriend </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {confirmationModal && selectedFriend?._id === friend?._id && (
                                <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                                    <div className='w-2/5 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                                        <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                            Unfriend {selectedFriend?.username}
                                        </h2>
                                        <p className='text-sm text-gray-600 mb-5'>
                                            Are you sure you want to remove {selectedFriend?.username} as your friend ?
                                        </p>
                                        <div className='flex justify-end space-x-4'>
                                            <button 
                                                className='bg-gray-200 px-4 py-2 rounded' 
                                                onClick={handleCancelUnfriend}>
                                                Cancel
                                            </button>
                                            <button 
                                                className='bg-red-600 text-white px-4 py-2 rounded' 
                                                onClick={() => handleConfirmUnfriend(selectedFriend?._id)}>
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default GetFriends;
