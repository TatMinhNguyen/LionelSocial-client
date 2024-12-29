import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMyProfile } from '../../api/profile/profile';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../api/auth/auth';
import ChangePassword from '../changeProfile/ChangePassword';
import socket from '../../socket';
import { getNotification } from '../../api/notification/notification';
import GetNotifications from '../notification/GetNotifications';
import callSound from "../../assets/sounds/call.mp4";
import { getAChat } from '../../api/chat/chat';

const NavBar = ({user}) => {
    const profile = useSelector((state) => state?.auth?.profile)
    const chat = useSelector((state) => state.chat.chat)

    const location = useLocation();

    const [incomingCall, setIncomingCall] = useState(null); // Lưu thông tin cuộc gọi
    const [audio, setAudio] = useState(null); // Lưu âm thanh gọi

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModalNotification, setShowModalNotification] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false)

    const [searchInput, setSearchInput] = useState("");
    const [notifications, setNotifications] = useState([])

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const avatarRef = useRef(null);
    const notificationRef = useRef(null)

    const scountNotifications = notifications?.filter((noti) => noti?.read === false)

     /* eslint-disable */
    useEffect(() => {
        // Kiểm tra xem có kết nối thành công hay không
        socket.on("connect", () => {
          console.log("Connected to server via WebSocket");
        });

        socket.emit('online')

        socket.on("notification", (newNotification) => {
        //   console.log("New notification:", newNotification);
          // Cập nhật state thông báo
          setNotifications((prev) => [newNotification, ...prev]);
        }); 

        return () => {
          socket.off("connect");
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
          navigation(`/room/${incomingCall?.roomId}`); // Chuyển đến phòng
          if (audio) audio.pause(); // Dừng âm thanh
          setIncomingCall(null); // Xóa thông tin cuộc gọi
        }
    };
    
    const handleDecline = () => {
        if (audio) audio.pause(); // Dừng âm thanh
        setIncomingCall(null); // Ẩn thông báo
    };
    
    // if (!incomingCall) return null; // Không hiển thị nếu không có cuộc gọi

    const handleGetAChat = async (chatId) => {
        await getAChat(user?.token, chatId, dispatch, navigation)
    }

    const handleGetNotifications = async () => {
        try {
            const result = await getNotification(user?.token, navigation)
            setNotifications(result)
        } catch (error) {
            console.log(error)
        }
    }     

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim() !== "") {
            if(location.pathname === `/search/users`) {
                navigation(`/search/users?q=${searchInput}`);
            }
            else {
                navigation(`/search/posts?q=${searchInput}`);
            }
        }
    }

    const handleShowChangePassword = () => {
        setShowChangePassword(true)
        setIsModalOpen(false)
    }

    const handleGetProfile = async () => {
        try {
            await getMyProfile(user?.token, dispatch, navigation)
        } catch (error) {
          console.error('Errors:', error);
        }
    }

    const handleLogOut = async () => {
        try {
            // Gửi sự kiện 'logout' lên server
            if (socket) {
                socket.emit('logout');
                // socket.disconnect(); // Ngắt kết nối socket
            }
            
            // Gọi API logout (nếu cần thực hiện logout trên server)
            await logOut(user?.token, dispatch, navigation);
            
            console.log('User logged out successfully');
        } catch (error) {
            console.log('Logout error:', error);
        }
    };    

    /* eslint-disable */
    useEffect(() => {
        if(!user){
            navigation('/login')
        }
        handleGetProfile()
        handleGetNotifications();
    },[user, dispatch])

    const handleClickOutside = (event) => {
        if (avatarRef.current && !avatarRef.current.contains(event.target)) {
            setIsModalOpen(false);
        }
    };

    const handleClickOutsideNoti = (e) => {
        if (notificationRef.current && ! notificationRef.current.contains(e.target)) {
            setShowModalNotification(false);
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    useEffect(() => {
        if (showModalNotification) {
            document.addEventListener('mousedown', handleClickOutsideNoti);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideNoti);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideNoti);
        };
    }, [showModalNotification]);

    useEffect(() => {
        if (showChangePassword) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
  
        // Cleanup khi component bị unmount
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [showChangePassword]);

  return (
    <div className='flex h-[7vh] min-h-14 bg-white border border-white shadow'>
        <div className='flex-1 flex items-center ml-[2vh]' style={{ flex: '30%' }}>
            <img className='h-5/6 cursor-pointer'
                src= {require("../../assets/images/logo.png")}
                alt="Logo"
                onClick={()=> navigation(`/`)}
            />
            <h1 className='text-2xl font-medium ml-2 text-blue-600'>
                Lionelsocial
            </h1>
        </div>
        <div className='w-2/5 mr-4'>
            <form className='flex-1 flex items-center p-1 pb-0.5 pl-2 mt-1.5 bg-gray-100 mx-auto rounded-3xl'
                    onSubmit={handleSearch}
            >
                <button>
                    <img className='w-6 h-6 ml-1'
                        src = {require('../../assets/icons/search.png')}
                        alt=''
                    />                    
                </button>
                <input
                    type='text'
                    id='search'
                    name='search'
                    placeholder='Search to Lionelsocial . . .'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className='flex-grow w-full pl-4 pr-1 py-1.5 rounded-3xl bg-gray-100 overflow-hidden
                                focus:outline-none'
                />
            </form>
        </div>
        <div className='flex items-center' style={{ flex: '30%' }}>
            <div className='flex-1'></div>  {/* Đây là phần tử đệm để đẩy các phần tử khác sang phải */}
            <div className='mr-5 flex items-center'>
                <div className={`h-10 w-10 ${(location.pathname === `/` || location.pathname === `/friends's-posts`) ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-200 hover:bg-gray-300'}  flex items-center justify-center rounded-3xl ml-3 cursor-pointer`}
                        onClick={() => navigation('/')}
                >
                    {(location.pathname === `/` || location.pathname === `/friends's-posts`) ? 
                    (
                        <img className='h-6'
                            src={require("../../assets/icons/home-blue.png")}
                            alt="" 
                        />
                    ) : (
                        <img className='h-6'
                            src={require("../../assets/icons/home-black.png")}
                            alt="" 
                        />
                    )}

                </div>
                <div className={`h-10 w-10 ${location.pathname.includes('/messenger') ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-200 hover:bg-gray-300'} flex items-center justify-center rounded-3xl ml-3 cursor-pointer`}
                    onClick={() => navigation('/messenger')}
                >
                    {location.pathname.includes('/messenger') ? (
                        <img className='h-6'
                            src={require("../../assets/icons/messenger-blue.png")}
                            alt="" 
                        />
                    ) : (
                        <img className='h-6'
                            src={require("../../assets/icons/messenger-black.png")}
                            alt="" 
                        />
                    )}
                </div>
                <div className=''>
                    {scountNotifications?.length > 0 && (
                        <div className='absolute bg-red-600 w-5 h-5 rounded-full right-16 top-1'>
                            {scountNotifications?.length <= 99 ? (
                                <p className={`text-white text-[12px] ${scountNotifications?.length < 10 ? 'ml-[6.5px]' : 'ml-[3px]'}  mt-[1.5px] text-medium`}>
                                    {scountNotifications?.length}
                            </p>
                            ) : (
                                <p className='text-white text-[10px] ml-[3px] mt-[1.5px] text-medium'>
                                    99+
                                </p>
                            )}
                        </div>                        
                    )}
                    {showModalNotification ? (
                        <div className='h-10 w-10 bg-blue-100 hover:bg-blue-200 flex items-center justify-center rounded-3xl ml-3 cursor-pointer'
                            // onClick={() => setShowModalNotification(false)}
                        >
                            <img className='h-6'
                                src={require("../../assets/icons/notification-blue.png")}
                                alt="" 
                            />
                        </div>
                    ) : (
                        <div className='h-10 w-10 bg-gray-200 hover:bg-gray-300 flex items-center justify-center rounded-3xl ml-3 cursor-pointer'
                            onClick={() => setShowModalNotification(true)}
                        >
                            <img className='h-6'
                                src={require("../../assets/icons/notification-black.png")}
                                alt="" 
                            />
                        </div>
                    )}                    
                </div>
                {showModalNotification && (
                    <div ref={notificationRef} 
                        className='absolute w-[24vw] top-full mt-1 right-2 bg-white border border-white rounded-md shadow-xl z-50 p-3 px-0.5 max-h-[90vh] overflow-y-auto'
                    >
                        <GetNotifications
                            notifications = {notifications}
                            setShowModalNotification={()=>setShowModalNotification(false)}
                            handleGetNotifications={() => handleGetNotifications()}
                        />
                    </div>
                )}
                <div className='flex items-center justify-center cursor-pointer ml-3 h-10 w-10'
                    onClick={() => setIsModalOpen(true)}
                >
                    <img className='h-full w-full object-cover rounded-full hover:opacity-90'
                        src={profile?.profilePicture}
                        alt="User Avatar" 
                    />
                </div>
                {isModalOpen && (
                    <div ref={avatarRef} className='absolute w-1/5 top-full mt-1 right-2 bg-white border border-white rounded-md shadow-xl z-50 p-3'>
                        <div 
                            className="absolute top-[-8px] right-[25px] transform rotate-45 w-3 h-3 bg-white border-l border-t border-gray-200"
                        >
                        </div>
                        <div className='w-full bg-white shadow-md border border-gray-100 rounded-md mb-3'>
                            <div className='flex items-center border-b border-gray-200 p-3 cursor-pointer hover:bg-gray-100'
                                onClick={() => navigation(`/get-profile/${user?.userId}`)}
                            >
                                <div className='h-9 w-9'>
                                    <img className='h-full w-full object-cover rounded-full hover:opacity-90'
                                        src={profile?.profilePicture}
                                        alt="User Avatar" 
                                    />                                
                                </div>
                                <h3 className='font-medium text-base ml-3'>
                                    {profile?.username}
                                </h3>                                
                            </div>
                            <div className='my-2 flex-1 flex items-center justify-center'
                                onClick={() => navigation(`/get-profile/${user?.userId}`)}
                            >
                                <p className='text-customBlue hover:text-blue-700 cursor-pointer'>
                                    See profile
                                </p>
                            </div>
                        </div>
                        {user?.isAdmin && (
                            <button
                                className='flex w-full px-2 py-1.5 text-left text-black hover:bg-gray-100 flex-1 flex items-center rounded-md mb-1'
                                onClick={()=> navigation('/admin/reported-posts')}
                            >
                                <div className='p-1.5 bg-gray-200 rounded-full mr-2'>
                                    <img
                                        src={require('../../assets/icons/admin-panel.png')}
                                        alt=''
                                        className='w-5 h-5 '
                                    />                                
                                </div>
                                Admin
                            </button>                            
                        )}
                        <button
                            className='flex w-full px-2 py-1.5 text-left text-black hover:bg-gray-100 flex-1 flex items-center rounded-md mb-1'
                            onClick={handleShowChangePassword}
                        >
                            <div className='p-1.5 bg-gray-200 rounded-full mr-2'>
                                <img
                                    src={require('../../assets/icons/reset-password.png')}
                                    alt=''
                                    className='w-5 h-5 '
                                />                                
                            </div>
                            Change password
                        </button>
                        <button
                            className='flex w-full px-2 py-1.5 text-left text-black hover:bg-gray-100 flex-1 flex items-center rounded-md'
                            onClick={handleLogOut}>
                            <div className=' mr-2 p-2 bg-gray-200 rounded-full'>
                                <img
                                    src={require('../../assets/icons/logout.png')}
                                    alt=''
                                    className='w-4 h-4 '
                                />
                            </div>                      
                            Logout
                        </button>
                    </div>
                )}
                {showChangePassword && (
                    <ChangePassword
                        user={user}
                        isCloseModal = {() => setShowChangePassword(false)}
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
                                    src={require("../../assets/icons/phone-call.png")}
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
                                    src={require("../../assets/icons/cancel-red.png")}
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
          </div>

        </div>

    </div>
  )
}

export default NavBar