import React, { useState } from 'react'
import GetMembers from './GetMembers'
import { useSelector } from 'react-redux'
import ChangePhoto from './ChangePhoto'
import ChangeName from './ChangeName'
import { useNavigate } from 'react-router-dom'

const GetDetailConversation = ({chat, isCloseModal}) => {

    const user = useSelector((state) => state.auth.login?.currentUser)

    const [showChange, setShowChange] = useState(false)
    const [showMembers, setShowMembers] = useState(false)
    const [showEditAvatar, setShowEditAvatar] = useState(false)
    const [showEditName, setShowEditName] = useState(false)

    const navigate = useNavigate()

    const handleGetUser = async(userId) => {
        navigate(`/get-profile/${userId}`)
    }
    return (
        <div 
            className='fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-50'
            onClick={() => isCloseModal()} 
        >
            <div 
                className='bg-white rounded-lg shadow-lg w-full max-w-sm h-[80vh] overflow-y-auto no-scrollbar'
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện onClick lan truyền lên
            >
                <div className="flex-1 flex flex-col justify-center items-center p-4 pb-2">
                    <div className='w-16 h-16'>
                        <img className='h-full w-full object-cover rounded-full'
                            src={chat?.avatar}
                            alt=''
                        />                                
                    </div> 
                    <div className='mt-1'>
                        <h3 className='font-medium text-[17px]'>
                            {chat?.name}    
                        </h3>    
                    </div>
                    <div className='flex my-5'>
                        {chat?.members.length <= 2 && (
                            <div className='flex flex-col justify-center mr-5'
                                onClick={() => handleGetUser(chat?.userId)}
                            >
                                <div className='w-9 h-9 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer'>
                                    <img className='h-5 w-5'
                                        src={require("../../assets/icons/profile-user.png")}
                                        alt=''
                                    />
                                </div> 
                                <p className='text-[12px]'>Profile</p>                         
                            </div>                             
                        )}
                        <div className='flex flex-col justify-center'>
                            <div className='w-9 h-9 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer'>
                                <img className='h-5 w-5'
                                    src={require("../../assets/icons/glass.png")}
                                    alt=''
                                />
                            </div> 
                            <p className='text-[12px]'>Search</p>                         
                        </div>                        
                    </div>           
                </div>
                {chat?.members.length > 2 && (
                    <div className='flex-1 flex items-center px-4 hover:bg-gray-100 rounded-md py-2 pb-3 mx-2 cursor-pointer mt-1'
                        onClick={() => setShowMembers(!showMembers)}
                    >
                        <p className='font-medium text-[16px]'>
                            Chat members
                        </p>
                        <div className='flex-1'></div>
                        {showMembers ? (
                            <img className='h-3.5 w-3.5'
                                src={require("../../assets/icons/bot-arrow.png")}
                                alt=''
                            />
                        ) : (
                            <img className='h-3.5 w-3.5'
                                src={require("../../assets/icons/right-arrow.png")}
                                alt=''
                            />
                        )}
                    </div>                    
                )}
                {showMembers && (
                    <GetMembers
                        chatId = {chat?._id}
                        createId = {chat?.createId}
                        isCloseModal = {() => isCloseModal()}
                    />
                )}
                {chat?.members.length > 2 && user?.userId === chat?.createId && (
                    <div className={`flex-1 flex items-center px-4 hover:bg-gray-100 rounded-md py-2 pb-3 mx-2 ${showChange ? '' : 'mb-2'}  cursor-pointer`}
                        onClick={() => setShowChange(!showChange)}
                    >
                        <p className='font-medium text-[16px]'>
                            Customize chat
                        </p>
                        <div className='flex-1'></div>
                        {showChange ? (
                            <img className='h-3.5 w-3.5'
                                src={require("../../assets/icons/bot-arrow.png")}
                                alt=''
                            />
                        ) : (
                            <img className='h-3.5 w-3.5'
                                src={require("../../assets/icons/right-arrow.png")}
                                alt=''
                            />
                        )}
                    </div>                    
                )}
                {showChange && (
                    <div>
                        <div className='mx-2 px-4 flex items-center hover:bg-gray-100 rounded-md py-1 cursor-pointer'
                            onClick={() => setShowEditName(true)}
                        >
                            <div className='w-7 h-7 flex justify-center items-center rounded-full bg-gray-200'>
                                <img className='h-5 w-5'
                                    src={require("../../assets/icons/edit.png")}
                                    alt=''
                                />
                            </div>
                            <p className='font-medium text-[14px] ml-2'>
                                Change chat name
                            </p>
                        </div>  
                        <div className='mx-2 px-4 flex items-center hover:bg-gray-100 rounded-md py-1 cursor-pointer mb-2'
                            onClick={() => setShowEditAvatar(true)}
                        >
                            <div className='w-7 h-7 flex justify-center items-center rounded-full bg-gray-200'>
                                <img className='h-4 w-4'
                                    src={require("../../assets/icons/image1.png")}
                                    alt=''
                                />
                            </div>
                            <p className='font-medium text-[14px] ml-2'>
                                Change photo
                            </p>
                        </div>                      
                    </div>
                )}
                {showEditAvatar && (
                    <ChangePhoto
                        avatar = {chat?.avatar}
                        user = {user}
                        isCloseModal = {() => setShowEditAvatar(false)}
                        chatId = {chat?._id}
                        isClose={()=> isCloseModal()}
                    />
                )}   
                {showEditName && (
                    <ChangeName
                        chat={chat}
                        user={user}
                        isClose={()=> isCloseModal()}
                        isCloseModal = {() => setShowEditName(false)}
                    />
                )}             
            </div>
        </div>
    )
} 

export default GetDetailConversation