import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createChat1vs1, deleteMember, getMembers, getMess, getUserChat, leaveGroup } from '../../api/chat/chat'
import AddMembers from './AddMembers'
import LoadingSpinner from '../spinner/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

const GetMembers = ({chatId, createId, isCloseModal}) => {
    const user = useSelector((state) => state.auth.login?.currentUser)

    const [loading, setLoading] = useState(false);

    const [members, setMembers] = useState([])
    const [showAddMembers, setShowAddMembers] = useState(false)
    const [activeMenu, setActiveMenu] = useState(null)
    const [showDelete, setShowDelete] = useState(false)
    const [showLeave, setShowLeave] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleShowAddMembers = ()  => {
        setShowAddMembers(true);
    }

    const handleToggleMenu = (memberId) => {
        if (activeMenu === memberId) {
            setActiveMenu(null)
        } else {
            setActiveMenu(memberId)
        }
    }

    const handleShowComfirmDelete = (user) => {
        setActiveMenu(null)
        setShowDelete(true)
        setSelectedUser(user)
    }

    const handleShowComfirmLeave = (user) => {
        setActiveMenu(null)
        setShowLeave(true)
        setSelectedUser(user)
    }

    const handleCancel = () => {
        setShowDelete(false)
        setShowLeave(false)
        setSelectedUser(null)    
    }

    const handleDeleteMembers = async (memberId) => {
        setLoading(true)
        const params = {
            page: 1,
            index: 20,
        }
        try {
            const member = {
                memberId: memberId
            }
            await deleteMember(user?.token, member, chatId, navigate)
            
            await getMess(user?.token, chatId, params, dispatch, navigate);
            await getUserChat(user?.token, dispatch, navigate)
            isCloseModal()
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

    const handleLeaveGroup = async () => {
        setLoading(true)
        try {
            await leaveGroup(user?.token, chatId, navigate)
            
            await getUserChat(user?.token, dispatch, navigate)
            navigate(`/messenger`)
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

    const handleCreateChat = async (userId) => {
        try {
            await createChat1vs1(user?.token, userId, navigate)
            isCloseModal();
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleGetMembers = async () => {
        try {
            const res = await getMembers(user?.token, chatId, navigate)
            setMembers(res)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetUser = async(userId) => {
        navigate(`/get-profile/${userId}`)
    }

      /* eslint-disable */
    useEffect(() => {
        if(user?.token) {
            handleGetMembers();
        }
    }, [chatId]);
    return (
        <div className=''>
            {members?.map((member) => (
                <div key={member._id}
                    className='mx-6 mb-3 flex-1 flex items-center relative'
                >
                    <div className='w-9 h-9'>
                        <img className='h-full w-full object-cover rounded-full'
                            src={member.profilePicture}
                            alt=''
                        />                                
                    </div>
                    <div className='ml-2'>
                        <h3 className='font-medium text-[15px]'>
                            {member.username}
                        </h3>
                        {createId === member._id && (
                            <p className='text-[12px]'>
                                Admin
                            </p>
                        )}
                    </div>
                    <div className='flex-1'></div>
                    <div className='p-1.5 hover:bg-gray-200 rounded-full cursor-pointer'
                        onClick={() => handleToggleMenu(member._id)}
                    >
                        <img className='w-5 h-5'
                            src={require("../../assets/icons/menu.png")}
                            alt=''
                        />
                    </div>
                    {activeMenu === member._id && (
                        <div className='absolute top-full right-1.5 mt-2 bg-white rounded p-2.5 px-1 z-10'
                            style={{ boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1), 0 -1px 4px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div
                                className={`absolute transform rotate-45 w-4 h-4 bg-white border-gray-200 
                                     top-[-8px] border-t border-l right-[2px]`}
                            >
                            </div>
                            {user?.userId === createId ? (
                                <div>
                                    {user?.userId !== member._id ? (
                                        <div>
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer' 
                                                onClick={()=> handleCreateChat(member._id)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/message.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                Message 
                                            </div>
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer' 
                                                onClick={()=> handleGetUser(member._id)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/profile-user.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                View profile
                                            </div>
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer'
                                                onClick={()=>handleShowComfirmDelete(member)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/delete-user.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                Delete people
                                            </div>  
                                        </div>
                                    ) : (
                                        <div>
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer' 
                                                onClick={()=> handleGetUser(member._id)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/profile-user.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                View profile
                                            </div>
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer'
                                                onClick={() => handleShowComfirmLeave(member)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/leave.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                Leave group
                                            </div>
                                        </div>
                                    )}
                               
                                </div>
                            ):(
                                <div>
                                    {user?.userId === member._id ? (
                                        <div>
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer' 
                                                onClick={()=> handleGetUser(member._id)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/profile-user.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                View profile
                                            </div> 
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer'
                                                onClick={() => handleShowComfirmLeave(member)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/leave.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                Leave group
                                            </div>                               
                                        </div>                                        
                                    ):(
                                        <div>
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer'
                                                onClick={()=> handleCreateChat(member._id)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/message.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                Message
                                            </div>
                                            <div className='p-1 px-2.5 flex items-center rounded-md hover:bg-gray-100 text-[14px] font-medium cursor-pointer' 
                                                onClick={()=> handleGetUser(member._id)}
                                            >
                                                <div className='mr-2'>
                                                    <img className='w-4 h-4'
                                                        src={require("../../assets/icons/profile-user.png")}
                                                        alt=''
                                                    />
                                                </div>
                                                View profile
                                            </div>                             
                                        </div>
                                    )}
                                </div>
                            )}


                        </div>
                    )}
                    {showDelete && selectedUser?._id === member._id && (
                        <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                            <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                                <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                    Remove From Chat?
                                </h2>
                                <p className='text-sm text-gray-600 mb-5'>
                                    Are you sure you want to remove this person from the conversation? They will no longer be able to send or receive new messages.
                                </p>
                                {loading ? (
                                    <div className='flex justify-center'>
                                        <LoadingSpinner/>
                                    </div>
                                ):(
                                    <div className='flex justify-end space-x-4'>
                                        <button 
                                            className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300' 
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' 
                                            onClick={() => handleDeleteMembers(selectedUser?._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>                                        
                                )}
                            </div>
                        </div>
                    )}
                    {showLeave && selectedUser?._id === member._id && (
                        <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                            <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                                <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                    Leave group chat?
                                </h2>
                                <p className='text-sm text-gray-600 mb-5'>
                                    You will stop receiving messages from this conversation and people will see that you left.
                                </p>
                                {loading ? (
                                    <div className='flex justify-center'>
                                        <LoadingSpinner/>
                                    </div>
                                ):(
                                    <div className='flex justify-end space-x-4'>
                                        <button 
                                            className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300' 
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' 
                                            onClick={() => handleLeaveGroup()}
                                        >
                                            Leave group
                                        </button>
                                    </div>                                        
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <div className='m-3 py-1 px-3 flex items-center hover:bg-gray-100 rounded-md cursor-pointer'
                onClick={handleShowAddMembers}
            >
                <div className='w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer'>
                    <img className='w-5 h-5'
                        src={require("../../assets/icons/invite.png")}
                        alt=''
                    />
                </div> 
                <p className='ml-2 font-medium text-[15px]'>
                    Add people
                </p>
            </div>
            {showAddMembers && (
                <AddMembers
                    chatId={chatId}
                    onCloseModal={() => setShowAddMembers(false)}
                    isCloseModal={() => isCloseModal()}
                />
            )}
        </div>
    )
}

export default GetMembers