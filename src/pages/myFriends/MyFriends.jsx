import React from 'react'
import NavBar from '../../components/navbar/NavBar'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const MyFriends = () => {
    const user = useSelector((state) => state.auth.login?.currentUser)

    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className='bg-gray-100 min-h-screen'>
            <div className='fixed top-0 w-full z-50'>
                <NavBar
                    user={user}
                />
            </div> 
            <div className='flex h-full pt-16'>
                <div className='w-1/4 bg-white fixed h-full -mt-3 shadow-2xl px-2 py-4'>
                    <h1 className='font-bold text-2xl ml-1 pb-3'>
                        Friends
                    </h1>
                    <div>
                        <div className={`flex-1 flex items-center p-2 ${location.pathname === `/friends` ? 'bg-blue-100' : 'hover:bg-gray-100'}  rounded-md mt-0.5 cursor-pointer`}
                            onClick={() => navigate('/friends')}
                        >
                            {location.pathname === `/friends` ? (
                                <div className='p-2 rounded-full bg-customBlue'>  
                                    <img
                                        src={require('../../assets/icons/friends-white.png')}
                                        alt=''
                                        className='w-5 h-5'
                                    />
                                </div>
                            ) : (
                                <div className='p-2 rounded-full bg-gray-300'>  
                                    <img
                                        src={require('../../assets/icons/friends.png')}
                                        alt=''
                                        className='w-5 h-5'
                                    />
                                </div>
                            )}
                            <p className='font-medium ml-3'>Friends</p>
                        </div>
                        <div className={`flex-1 flex items-center p-2 ${location.pathname === `/friends/requests` ? 'bg-blue-100' : 'hover:bg-gray-100'}  rounded-md mt-0.5 cursor-pointer`}
                            onClick={() => navigate('/friends/requests')}
                        >
                            {location.pathname === `/friends/requests` ? (
                                <div className='p-2 rounded-full bg-customBlue'>  
                                    <img
                                        src={require('../../assets/icons/people-white.png')}
                                        alt=''
                                        className='w-5 h-5'
                                    />
                                </div>
                            ) : (
                                <div className='p-2 rounded-full bg-gray-300'>  
                                    <img
                                        src={require('../../assets/icons/people.png')}
                                        alt=''
                                        className='w-5 h-5'
                                    />
                                </div>
                            )}
                            <p className='font-medium ml-3'>Requests</p>
                        </div>
                        <div className={`flex-1 flex items-center p-2 ${location.pathname === `/friends/suggestions` ? 'bg-blue-100' : 'hover:bg-gray-100'}  rounded-md mt-0.5 cursor-pointer`}
                            onClick={() => navigate('/friends/suggestions')}
                        >
                            {location.pathname === `/friends/suggestions` ? (
                                <div className='p-2 rounded-full bg-customBlue'>  
                                    <img
                                        src={require('../../assets/icons/invite-white.png')}
                                        alt=''
                                        className='w-5 h-5'
                                    />
                                </div>
                            ) : (
                                <div className='p-2 rounded-full bg-gray-300'>  
                                    <img
                                        src={require('../../assets/icons/invite.png')}
                                        alt=''
                                        className='w-5 h-5'
                                    />
                                </div>
                            )}
                            <p className='font-medium ml-3'>Suggestions</p>
                        </div>
                    </div>
                </div>
                <div className='flex-1'></div>
                <div className='w-3/4'>
                    <Outlet/>
                </div>
            </div>       
        </div>
    )
}

export default MyFriends