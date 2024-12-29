import React, { useEffect, useRef, useState } from 'react'
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';
import { useNavigate, useParams, Outlet, useLocation  } from 'react-router-dom';
import { getMyProfile, getProfile } from '../../api/profile/profile';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../../components/navbar/NavBar';
import { formatToMonthYear } from '../../utils';
import ChangeAvatar from '../../components/changeProfile/ChangeAvatar';
import ChangeBackground from '../../components/changeProfile/ChangeBackground';
import ChangeProfile from '../../components/changeProfile/ChangeProfile';
import { acceptRequest, cancelFriend, cancelRequest, refuseRequest, requestFriends } from '../../api/friends/friends';
import { createChat1vs1 } from '../../api/chat/chat';
import socket from '../../socket';
import ReportUser from '../../components/changeProfile/ReportUser';
import ComfirmReport from '../../components/post/ComfirmReport';

const Profile = () => {
    const { userId } = useParams();
    const user = useSelector((state) => state.auth.login?.currentUser)
    const myProfile = useSelector((state) => state?.auth?.profile)
    // const profile = useSelector((state) => state?.auth?.profileDiff)
    const [profile, setProfile] = useState({})
    
    const location = useLocation(); 
    const [showEditAvatar, setShowEditAvatar] = useState(false)
    const [showEditCover, setShowEditCover] = useState(false)
    const [showEditProfile, setShowEditProfile] = useState(false)

    const [friendStatus, setFriendStatus] = useState('');

    const [modalUnfriend, setModalUnfriend] = useState(false)
    const [modalReport, setModalReport] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isAbove, setIsAbove] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);

    const [reportUser, setReportUser] = useState(false)
    const [notiSuccess, setNotiSuccess] = useState(false)
    
    const [reportUserSuccess, setReportUserSuccess] = useState(false)

    const [onlineUsers, setOnlineUsers] = useState([]);

    const navigation = useNavigate();
    const dispatch = useDispatch();
    const modalRef = useRef(null);

    useEffect(() => {
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

    const handleClick = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
    
        if (rect.bottom < viewportHeight - 50) {
            setIsAbove(true);
            setModalPosition({
                top: rect.top + window.scrollY - 60,
                left: rect.left + window.scrollX + 20,
            });
        } else {
            setIsAbove(false);
            setModalPosition({
                top: rect.bottom + window.scrollY + 12,
                left: rect.left + window.scrollX + 20,
            });
        }
    
        setModalUnfriend(true);
    };

    const handleThreeDotsClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setModalPosition({
            top: rect.bottom + window.scrollY + 15,
            left: rect.left + window.scrollX - 80,
        });

        setModalReport(true);
    }

    const handleUnfriendClick = () => {
        setConfirmationModal(true);
        setModalUnfriend(false); // Close the options modal
    };

    const handleReportUser = () => {
        setModalReport(false)
        setReportUser(true)
        setReportUserSuccess(true)
    }

    const handleCancelUnfriend = () => {
        setConfirmationModal(false);
    };


    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setModalUnfriend(false);
            setModalReport(false)
        }
    };

    useEffect(() => {
        if (modalUnfriend || modalReport) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [modalUnfriend, modalReport]);


    const handleShowEditAvatar = () => {
        setShowEditAvatar(true)
    }

    const handleGetUser = async () => {
        try {
            const result = await getProfile(user?.token, dispatch, userId, navigation)
            setProfile(result)

            // Xác định trạng thái quan hệ bạn bè
            if (result.friends.includes(user?.userId)) {
                setFriendStatus('friends');
            } else if (result.friendRequesting.includes(user?.userId)) {
                setFriendStatus('requested');
            } else if (result.friendRequested.includes(user?.userId)) {
                setFriendStatus('requesting');
            } else {
                setFriendStatus('none');
            }
            
            await getMyProfile(user?.token, dispatch, navigation)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAccept = async () => {
        try {
            await acceptRequest(user?.token, userId, navigation);
            setFriendStatus('friends');
        } catch (error) {
            console.log(error);
        }
    }

    const handleRefuse = async () => {
        try {
            await refuseRequest(user?.token, userId, navigation);
            setFriendStatus('none');
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancelRequest = async () => {
        try {
            await cancelRequest(user?.token, userId, navigation);
            setFriendStatus('none');
        } catch (error) {
            console.log(error);
        }
    }

    const handleRequestFriend = async () => {
        try {
            await requestFriends(user?.token, userId, navigation);
            setFriendStatus('requesting');
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancelFriend= async () => {
        try {
            await cancelFriend(user?.token, userId, navigation);
            setFriendStatus('none');
            setConfirmationModal(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateChat = async () => {
        try {
            await createChat1vs1(user?.token, userId, navigation)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetPost = () => {
        navigation(`/get-profile/${userId}`)
    }

    const handleGetFriends = () => {
        navigation(`/get-profile/${userId}/friends`)
    }

    /* eslint-disable */
    useEffect(() => {
        handleGetUser();
    },[userId, dispatch])


    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được render
    }, []);

    const onInit = () => {
        // console.log('lightGallery has been initialized');
    };

    let information = {}
    if(user?.userId === userId) {
        information = myProfile
    }
    else {
        information = profile
    }

    return (
        <div className='bg-gray-100 flex-1 flex items-center justify-center'>
            <div className='fixed top-0 w-full z-50'>
                <NavBar 
                    user={user}
                />
            </div>
            <div className=' w-3/4  pt-11'>
                <div className='w-full bg-white shadow rounded-xl'>
                    <div className='relative'>                          
                        <LightGallery
                            onInit={onInit}
                            speed={500}
                            plugins={[lgZoom]}
                            elementClassNames="flex h-full w-full"
                        >
                            <img
                                className='w-full h-[55vh] object-cover rounded-xl cursor-pointer shadow'
                                src={information?.coverPicture}
                                alt=''
                            />                        
                        </LightGallery> 
                        {userId === user?.userId && (
                            <div 
                                onClick={() => setShowEditCover(true)}
                                className='absolute flex bottom-3 right-5 px-3 py-1.5 bg-white rounded-md shadow cursor-pointer hover:bg-gray-100'>
                                <img
                                    src={require('../../assets/icons/camera-black.png')}
                                    alt=''
                                    className='w-5 h-5 mt-0.5 opacity-90 hover:opacity-100'
                                />   
                                <p className='font-medium ml-2'>
                                    Edit cover photo    
                                </p> 
                            </div>                            
                        )} 
                        {showEditCover && (
                            <ChangeBackground
                                avatar = {information?.coverPicture}
                                user = {user}
                                isCloseModal = {() => setShowEditCover(false)}
                            />
                        )}                      
                    </div>
                    <div className='flex-1 flex items-center pb-3 relative z-10'>
                        <LightGallery
                            onInit={onInit}
                            speed={500}
                            plugins={[lgZoom]}
                            elementClassNames=""
                        >
                        <img
                            className='w-44 h-44 object-cover rounded-full border-4 border-white ml-12 -mt-20 cursor-pointer'
                            src={information?.profilePicture}
                            alt=''
                        />                        
                        </LightGallery>
                        {userId === user?.userId && (
                            <div className='-ml-12 mt-12 mr-2 p-1.5 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200 border-2 border-white'
                                    onClick={handleShowEditAvatar}
                            >
                                <img
                                    src={require('../../assets/icons/camera-black.png')}
                                    alt=''
                                    className='w-6 h-6 '
                                />
                            </div>                            
                        )}
                        {userId !== user?.userId && onlineUsers?.includes(userId) && (
                            <div className='w-7 h-7 border-4 border-white rounded-full bg-green-600 absolute ml-44 mt-12'></div>
                        )}
                        {showEditAvatar && (
                            <ChangeAvatar
                                avatar = {information?.profilePicture}
                                user = {user}
                                isCloseModal = {() => setShowEditAvatar(false)}
                            />
                        )}
                        <div className='ml-4'>
                            <h1 className='text-2xl font-bold'>
                                {information?.username}
                            </h1> 
                            <div className=''>
                                <p className='text-gray-500 justify-self-start font-normal cursor-pointer hover:text-gray-400 p-0'>
                                    {information?.friendsCount} friends
                                </p>                                 
                            </div>                          
                        </div>
                        <div className='flex-1'></div>
                        <div>
                            {userId == user?.userId ? (
                                <div className='flex-1 flex items-center cursor-pointer justify-center bg-gray-200 pl-2 pr-3 py-2 rounded-md mr-5'
                                        onClick={() => setShowEditProfile(true)}
                                >
                                    <img className='h-6 w-6 mr-1'
                                        src={require("../../assets/icons/edit.png")}
                                        alt=''
                                    />
                                    <p className='font-medium text-md'>
                                        Edit profile
                                    </p>
                                </div>
                            ) : (
                                <div className='flex'>
                                    {friendStatus === 'requesting' ? (                                       
                                        <div className='flex-1 flex items-center cursor-pointer bg-gray-200 pl-3 pr-3 py-2 rounded-md mr-3'
                                            onClick={handleCancelRequest}
                                        >
                                            <img className='h-5 w-5 mr-1 mt-px'
                                                src={require("../../assets/icons/delete-friend.png")}
                                                alt=''
                                            /> 
                                            <p className='font-medium text-md'>
                                                Cancel request   
                                            </p>                                           
                                        </div>                                                                                     
                                    ) : friendStatus === 'requested' ? (
                                        <div className='flex'>
                                            <div className='flex items-center cursor-pointer bg-customBlue pl-3 pr-3 py-2 rounded-md mr-3'
                                                onClick={handleAccept}
                                            >
                                                <img className='h-5 w-5 mr-1 mt-px'
                                                    src={require("../../assets/icons/add-friend-white.png")}
                                                    alt=''
                                                /> 
                                                <p className='font-medium text-md text-white'>
                                                    Confirm   
                                                </p>                                           
                                            </div>
                                            <div className='flex items-center cursor-pointer bg-gray-200 pl-3 pr-3 py-2 rounded-md mr-3'
                                                onClick={handleRefuse}
                                            >
                                                <img className='h-5 w-5 mr-1 mt-px'
                                                    src={require("../../assets/icons/delete-friend.png")}
                                                    alt=''
                                                /> 
                                                <p className='font-medium text-md'>
                                                    Refuse   
                                                </p>                                           
                                            </div>                                          
                                        </div> 
                                    ) : friendStatus === 'friends' ? (
                                        <div className='flex-1 flex items-center cursor-pointer bg-gray-200 pl-3 pr-3 py-2 rounded-md mr-3'
                                            onClick={handleClick}
                                        >
                                            <img className='h-5 w-5 mr-1 mt-px'
                                                src={require("../../assets/icons/check.png")}
                                                alt=''
                                            /> 
                                            <p className='font-medium text-md'>
                                                Friends   
                                            </p>                                           
                                        </div>                                            
                                    ) : (
                                        <div className='flex-1 flex items-center cursor-pointer bg-customBlue pl-3 pr-3 py-2 rounded-md mr-3'
                                            onClick={handleRequestFriend}
                                        >
                                            <img className='h-5 w-5 mr-1 mt-px'
                                                src={require("../../assets/icons/add-friend-white.png")}
                                                alt=''
                                            /> 
                                            <p className='font-medium text-md text-white'>
                                                Add friend   
                                            </p>                                           
                                        </div>                                       
                                    )}
                                    <div className='flex items-center bg-gray-200 cursor-pointer pl-2 pr-3 py-2 rounded-md mr-3'
                                        onClick={handleCreateChat}
                                    >
                                        <img className='h-5 w-5 mr-1 mt-px'
                                            src={require("../../assets/icons/messenger-black.png")}
                                            alt=''
                                        />
                                        <p className='font-medium text-md'>
                                            Message
                                        </p>                                            
                                    </div>
                                    <div className='flex items-center bg-gray-300 bg-gray-200 cursor-pointer px-2 py-2 rounded-md mr-5'
                                        onClick={handleThreeDotsClick}
                                    >
                                        <img className='h-6 w-6 mt-px'
                                            src={require("../../assets/icons/menu.png")}
                                            alt=''
                                        />                                                
                                    </div> 
                                </div>
                            )}
                        </div>
                    </div>
                    {showEditProfile && (
                        <ChangeProfile
                            user = {user}
                            myProfile = {myProfile}
                            isCloseModal = {() => setShowEditProfile(false)}
                        />
                    )}
                    {modalUnfriend && (
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
                                    className={`absolute transform rotate-45 w-3 h-3 bg-white border-gray-300 ${
                                        isAbove ? 'bottom-[-6px] border-b border-r' : 'top-[-6px] border-l border-t'
                                    } left-[20px]`}>
                                </div> 
                                <div className=' py-2 px-1.5'>
                                    <div className='flex hover:bg-gray-100 px-2 rounded pr-20'
                                            onClick={() => handleUnfriendClick()}
                                    >
                                        <img className='w-6 h-6 mr-3 mt-1'
                                            src={require('../../assets/icons/unfriend.png')}
                                            alt=''
                                        />
                                        <p className='py-1 cursor-pointer font-base'>Unfriend </p>
                                    </div>                                     
                                </div>                                                             
                            </div>
                        </div>
                    )}
                    {modalReport && (
                        <div
                            ref={modalRef}
                            className='absolute w-[300px] bg-white border border-gray-200 rounded shadow-2xl z-10'
                            style={{
                                top: modalPosition.top,
                                left: modalPosition.left,
                            }}                        
                        >
                            <div className='relative'>
                                <div
                                    className={`absolute transform rotate-45 w-4 h-4 bg-white border-gray-300
                                         top-[-8px] border-l border-t
                                    } left-[92px]`}>
                                </div> 
                                <div className=' py-2.5 px-2'>
                                    <div className='flex hover:bg-gray-100 px-2 py-1 rounded'
                                        onClick={() => handleReportUser()}
                                    >
                                        <img className='w-5 h-5 mr-3 mt-2'
                                            src={require('../../assets/icons/user-report.png')}
                                            alt=''
                                        />
                                        <p className='py-1 font-medium cursor-pointer text-black'>Report profile </p>
                                    </div>                                    
                                </div>                                                             
                            </div>
                        </div>
                    )}
                    {reportUser && (
                        <ReportUser
                            user={user}
                            userId={userId}
                            isCloseModal = {() => setReportUser(false)}
                            setNotiSuccess={() => setNotiSuccess(true)}                              
                        />
                    )}
                    {notiSuccess && (
                        <ComfirmReport
                            setNotiSuccess={() => setNotiSuccess(false)}
                            reportUserSuccess={reportUserSuccess}
                            setReportUserSuccess={() => setReportUserSuccess(false)}
                            setReportPostSuccess={() => setReportUserSuccess(false)}
                            setReportGroupSuccess={()=> setReportUserSuccess(false)}
                        />
                    )}
                    {confirmationModal && (
                        <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                            <div className='w-2/5 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                                <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                    Unfriend {information?.username}
                                </h2>
                                <p className='text-sm text-gray-600 mb-5'>
                                    Are you sure you want to remove {information?.username} as your friend ?
                                </p>
                                <div className='flex justify-end space-x-4'>
                                    <button 
                                        className='bg-gray-200 px-4 py-2 rounded' 
                                        onClick={handleCancelUnfriend}>
                                        Cancel
                                    </button>
                                    <button 
                                        className='bg-red-600 text-white px-4 py-2 rounded' 
                                        onClick={() => handleCancelFriend()}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>                       
                    )}
                </div>
                <div className='mt-4 flex '>
                    <div className='w-1/3 bg-white mr-2 border border-white shadow rounded-md self-start mb-2'>
                        <p className='text-xl font-bold font-sans m-2 ml-4 mb-5'>
                            Introduction  
                        </p>
                        <div className='flex ml-4'>
                            <img
                                src={require('../../assets/icons/work.png')}
                                alt=''
                                className='w-5 h-5 mt-0.5'
                            />
                            {information?.work === '' ? (
                                <p className='ml-3 text-gray-500'>
                                    No information about the job
                                </p>
                            ) : (
                                <p className='ml-3 text-gray-900'>
                                    Works at {information?.work}
                                </p>                                
                            )}
                        </div>
                        <div className='flex ml-4 my-3'>
                            <img
                                src={require('../../assets/icons/location.png')}
                                alt=''
                                className='w-5 h-5 mt-0.5'
                            />
                            {information?.address === '' ? (
                                <p className='ml-3 text-gray-500'>
                                    No information about the address
                                </p>
                            ) : (
                                <p className='ml-3 text-gray-900 flex'>
                                    Lives in <p className='font-medium ml-1.5'>{information?.address}</p>
                                </p>                                
                            )}
                        </div>
                        <div className='flex ml-4 my-3'>
                            <img
                                src={require('../../assets/icons/clock.png')}
                                alt=''
                                className='w-5 h-5 mt-0.5'
                            />
                            <p className='ml-3 text-gray-900'>
                                Joined {formatToMonthYear(information?.createdAt)} 
                            </p>
                        </div>
                    </div>
                    <div className='w-2/3 ml-2'>
                        <div className='flex bg-white border border-white shadow rounded-md mb-3'>
                            <div className='w-1/2  flex-1 flex items-center justify-center '
                                    onClick={handleGetPost}
                            >
                                <p className={`text-lg font-bold font-mono mt-2 cursor-pointer ${location.pathname === `/get-profile/${userId}` ? 'border-b-4 border-b-customBlue pb-1' : 'pb-2'}`}>
                                    Posts
                                </p>                                
                            </div>
                            <div className='w-1/2 flex-1 flex items-center justify-center r'
                                    onClick={handleGetFriends}
                            >
                                <p className={`text-lg font-bold font-mono mt-2 cursor-pointer ${location.pathname === `/get-profile/${userId}/friends` ? 'border-b-4 border-b-customBlue pb-1' : 'pb-2'}`}>
                                    Friends
                                </p>                                
                            </div>
                        </div>
                        <Outlet context={userId}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile