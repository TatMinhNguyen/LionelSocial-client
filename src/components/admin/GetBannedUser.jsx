import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReportedUser, setBan } from '../../api/admin/admin'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../spinner/LoadingSpinner'
import GetDetailReportedUser from './GetDetailReportedUser'

const GetBannedUser = () => {
    const user = useSelector((state) => state.auth.login?.currentUser)
    const users = useSelector((state) => state.admin.users)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showDetailReport, setShowDetail] = useState(false)
    const [showComfirm, setShowComfirm] = useState(false)

    const [showModal, setShowModal] = useState(null); 
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isAbove, setIsAbove] = useState(false);
  
    const modalRef = useRef(null);

    const handleThreeDotsClick = (event, user) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
    
        if (rect.bottom > viewportHeight - 50) {
            setIsAbove(true);
            setModalPosition({
                top: rect.top + window.scrollY - 80,
                left: rect.left + window.scrollX - 30,
            });
        } else {
            setIsAbove(false);
            setModalPosition({
                top: rect.bottom + window.scrollY + 12,
                left: rect.left + window.scrollX - 30,
            });
        }
    
        setShowModal(user?._id); // Set the modal to open for the specific comment
    };

    const handleBan = async(userId) => {
        setLoading(true)
        try {
            await setBan(user?.token, userId)
        
            setShowComfirm(false)
            setSelectedUser(null)
        
            handleGetUsers()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmDelete = (userId) => {
        setShowModal(null)
        setShowComfirm(true)
        setSelectedUser(userId)
    }

    const handleCancelDelete = () => {
        setShowComfirm(false)
        setSelectedUser(null)   
        setShowDetail(false) 
    }

    const handleShowDetail = (user) => {
        setShowDetail(true)
        setSelectedUser(user)
    }

    const handleGetUsers = async() => {
        try {
            await getReportedUser(user?.token, dispatch);
        } catch (error) {
            console.log(error)
        }
    }

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

    const handleGetUser = async(userId) => {
        navigate(`/get-profile/${userId}`)
    }

    /* eslint-disable */
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        if(user?.token) {
            handleGetUsers()
        }
    },[])
  return (
    <div>
        <div className='flex w-full h-[8vh] bg-white shadow items-center fixed z-10'>
            <h1 className='text-2xl font-bold ml-[5vw]'>
                Number of reported users  ·
            </h1> 
            <p className='text-2xl font-bold ml-2 text-gray-500'>
                {users?.length}
            </p>       
        </div>
        <div className='py-[9vh]'>
            {users?.map((user) => (
                <div key={user._id} className=' flex items-center justify-center'>
                    <div className='w-2/3 bg-white border border-gray-100 shadow-sm rounded-md mb-3'>
                        <div className='border-b mx-3 py-2 text-gray-500'>
                            This user has been reported.
                            <span className='text-customBlue text-[13px] ml-2 border-b border-customBlue italic cursor-pointer hover:text-purple-700 hover:border-purple-700'
                                onClick={()=> handleShowDetail(user)}
                            >
                                detail
                            </span>
                        </div>                    
                        <div className='flex-1 flex items-center mx-3 my-2.5 '>
                            <div className='w-10 h-10 cursor-pointer'
                                onClick={()=> handleGetUser(user._id)}
                            >
                                <img className='h-full w-full object-cover rounded-full shadow'
                                    src={user?.profilePicture}
                                    alt=''
                                />
                            </div>
                            <div className='ml-3 cursor-pointer'
                                onClick={()=> handleGetUser(user._id)}
                            >
                                <h1 className='font-medium text-base'>
                                    {user?.username}
                                </h1>
                            </div>
                            <div className='flex-1'></div>
                            <div className='flex items-center'>
                                <button className='hover:bg-gray-100 font-medium mx-2 px-1.5 py-1.5 rounded-full'
                                    onClick={(e) => handleThreeDotsClick(e, user)}
                                >
                                    <img className='w-5 h-5'
                                        src={require("../../assets/icons/menu.png")}
                                        alt=''
                                    />
                                </button>
                            </div> 
                            {showModal === user?._id && (
                                <div
                                    ref={modalRef}
                                    className='absolute bg-white border border-gray-200 rounded-lg shadow-xl z-10'
                                    style={{
                                        top: modalPosition.top,
                                        left: modalPosition.left,
                                    }}
                                >
                                    <div className='relative py-3 px-2'>
                                        <div
                                            className={`absolute transform rotate-45 w-4 h-4 bg-white border-gray-200 ${
                                                isAbove ? 'bottom-[-8px] border-b border-r' : 'top-[-8px] border-l border-t'
                                            } left-9`}>
                                        </div>
                                        <div className='flex items-center hover:bg-red-50 px-3 py-1 pr-16 rounded-md'
                                            onClick={() => handleConfirmDelete(user)}
                                        >
                                            <div
                                            className="mr-2"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: '#EE0000',
                                                maskImage: `url(${require('../../assets/icons/ban.png')})`,
                                                maskSize: '20px 20px',
                                                maskPosition: '0px 0px',
                                            }}
                                            ></div>
                                            <p className='py-1 cursor-pointer text-[16px] text-red-500 font-medium'>Ban profile </p>
                                        </div>

                                    </div>
                                </div>
                            )}
                            {showComfirm && selectedUser?._id === user._id && (
                                <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                                    <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                                        <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                            Ban profile
                                        </h2>
                                        <p className='text-sm text-gray-600 mb-5'>
                                            Are you sure you want to ban this profile?
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
                                                className='bg-red-500 text-white font-medium px-6 py-2 rounded hover:bg-red-600' 
                                                onClick={() => handleBan(user?._id)}
                                            >
                                                Ban
                                            </button>
                                        </div>
                                        )}

                                    </div>
                                </div>
                            )}
                            {showDetailReport && selectedUser?._id === user?._id && (
                                <GetDetailReportedUser
                                    user={user}
                                    // post={post}
                                    isClose={()=> handleCancelDelete()}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default GetBannedUser