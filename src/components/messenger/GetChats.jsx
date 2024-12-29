import React, { useEffect, useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { checkMessages, createChat1vs1, getUserChat, searchMembers } from '../../api/chat/chat'
import { useNavigate, useParams } from 'react-router-dom'
import socket from '../../socket'
import CreateGroupChat from './CreateGroupChat'

const GetChats = () => {
    const chats = useSelector((state) => state.chat.chats)
    const user = useSelector((state) => state.auth.login?.currentUser)
    const { chatId } = useParams();

    const [showCreateGroupChat, setShowCreateGroupChat] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [searchInput, setSearchInput] = useState('')
    const [resultSearch, setResultSearch] = useState([])

    const [isSearched, setIsSearched] = useState(false)

    const onlineUserSet = new Set(onlineUsers);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSearched = () => {
        setSearchInput('')
        setIsSearched(false)
        setResultSearch([])
    }
  
    const handleGetUserChats = async() => {
      try {
          await getUserChat(user?.token, dispatch, navigate)
      } catch (error) {
          console.log(error)
      }
    }

    const handleCheckMessage = async(chatId) => {
        await checkMessages(user?.token, chatId, navigate)
        navigate(`/messenger/${chatId}`)
        
        await getUserChat(user?.token, dispatch, navigate)
    }

    const handleCreateChat = async(userId) => {
        await createChat1vs1(user?.token, userId, navigate)
        setIsSearched(false)
        setSearchInput('')
        setResultSearch([])
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        const data = {
            searchInput: searchInput
        }
        const result = await searchMembers(user?.token, data, navigate)

        setResultSearch(result);
    }

    useEffect(() => {
        // Lắng nghe sự kiện onlineUsers từ server
        socket.on("onlineUsers", (users) => {
        //   console.log("Online users:", users);
          setOnlineUsers(users);
        });
    
        // Cleanup
        return () => {
          socket.off("onlineUsers");
        };
    }, []);
  
    /* eslint-disable */
    useEffect(() => {
      socket.on('send-chat', () => {
        handleGetUserChats(); 
      });
  
      // //Hủy sự kiện khi component unmount
      return () => {
        socket.off('send-chat');
      };
    }, []); 
  
    /* eslint-disable */
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        if(user?.token) {
            handleGetUserChats();
        }
    }, []);

    return (
        <div className='p-2'>
            <div className='flex mt-1'>
                <h1 className='text-2xl font-bold ml-2'>
                    Chats
                </h1>
                <div className='flex-1'></div>
                <div className='bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 mr-2'
                    onClick={() => setShowCreateGroupChat(true)}
                >
                    <img className='w-4 h-4'
                        src={require('../../assets/icons/plus.png')}
                        alt=''
                    />                
                </div>
            </div>
            {showCreateGroupChat && (
                <CreateGroupChat
                    isClose = {() => setShowCreateGroupChat(false)}
                />
            )}
            <div className='w-full px-2 flex items-center'>
                {isSearched && (
                    <div className='w-9 h-9 flex items-center justify-center mr-1 mt-2 hover:bg-gray-100 rounded-full cursor-pointer'
                        onClick={handleSearched}
                    >
                        <img className='w-4 h-4'
                            src={require('../../assets/icons/arrow.png')}
                            alt=''
                        />                    
                    </div>                    
                )}
                <form className='flex-1 flex items-center mt-2 bg-gray-100 mx-auto rounded-3xl'
                        onSubmit={handleSearch}
                >
                    <div>
                        <img className='w-5 h-5 ml-3 mt-0.5'
                            src = {require('../../assets/icons/search.png')}
                            alt=''
                        />                    
                    </div>
                    <input
                        type='text'
                        id='search'
                        name='search'
                        placeholder='Search messenger'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onClick={() => setIsSearched(true)}
                        className='flex-grow w-full pl-3 pr-1 py-1.5 mb-0.5 rounded-3xl bg-gray-100 overflow-hidden
                                    focus:outline-none'
                    />
                </form>
            </div>
            {isSearched ? (
                <div className='mt-3 overflow-y-auto h-[73.1vh]'>
                    {resultSearch?.length === 0 && (
                        <div className='flex items-center justify-center h-[20vh] text-gray-600'>
                            No search results found for "{searchInput}"
                        </div>
                    )}
                    {resultSearch?.map((user) => (
                        <div key={user.userId}
                            className='px-2 flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200'
                            onClick={() => handleCreateChat(user.userId)}
                        >
                            <div className='w-9 h-9'>
                                <img className='h-full w-full object-cover rounded-full'
                                    src={user.profilePicture}
                                    alt=''
                                />                                
                            </div>
                            <h1 className={`text-[15px] font-base ml-3`}>
                                {user.username}
                            </h1>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='mt-3 overflow-y-auto h-[73.1vh]'>
                    {chats?.map((chat) => {
                        // Loại bỏ currentId ra khỏi mảng members
                        const filteredMembers = chat.members.filter((memberId) => memberId !== user?.userId);

                        // Kiểm tra nếu có ít nhất 1 id trong filteredMembers trùng với onlineUser
                        const isOnline = filteredMembers.some((memberId) => onlineUserSet.has(memberId));
                        return (
                            <div key={chat._id}
                                className={`relative flex items-center p-2 py-2.5 ${chat._id === chatId ? "bg-neutral-200" : "hover:bg-gray-200"}  rounded-lg cursor-pointer`}
                                onClick={() => handleCheckMessage(chat._id)}
                            >
                                {isOnline && (
                                    <div className='w-3 h-3 border-2 border-white rounded-full bg-green-600 absolute mt-[29px] ml-[29px]'></div>
                                )}
                                <div className='w-10 h-10'>
                                    <img className='h-full w-full object-cover rounded-full'
                                        src={chat.avatar}
                                        alt=''
                                    />                                
                                </div>
                                <div className='ml-3'>
                                    <h1 className={`text-[15px] font-medium`}>
                                        {chat.name}
                                    </h1>
                                    {chat.firstMessage === null ? (
                                        <div className={`${chat.readBy?.includes(user?.userId) ? "text-[13px] text-gray-500" : "text-[13px] font-medium"}`}>
                                            Please send a message to {chat.name}.
                                        </div>
                                    ) : (
                                        <div>
                                            {chat.firstMessage?.image !== null ? (
                                                <div className={`${chat.readBy?.includes(user?.userId) ? "text-[13px] text-gray-500" : "text-[13px] font-medium"}`}>
                                                    {chat.firstMessage?.senderId._id === user?.userId ? (
                                                        <p>
                                                            You have sent 1 photo to {chat.name}.
                                                        </p>
                                                    ) : (
                                                        <p>
                                                            {chat.firstMessage?.senderId.username} have sent 1 photo to you.
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className={`${chat.readBy?.includes(user?.userId) ? "text-[13px] text-gray-500" : "text-[13px] font-medium"}`}
                                                    style={{ 
                                                        maxWidth: '20vw', 
                                                        overflow: 'hidden', 
                                                        whiteSpace: 'nowrap', 
                                                        textOverflow: 'ellipsis',
                                                        display: 'block' // Đảm bảo rằng nó là block hoặc inline-block để xử lý ellipsis
                                                    }}
                                                >
                                                    {chat.firstMessage?.senderId._id === user?.userId ? (
                                                        <p style={{ display: 'inline', margin: 0 }}>
                                                            You: {chat.firstMessage?.text}
                                                        </p>
                                                    ) : (
                                                        <>
                                                            {chat.firstMessage?.senderId.username !== "Admin" ? (
                                                                <p style={{ display: 'inline', margin: 0 }}>
                                                                    {chat.firstMessage?.senderId.username}: {chat.firstMessage?.text}
                                                                </p>                                                                
                                                            ):(
                                                                <p style={{ display: 'inline', margin: 0 }}>
                                                                    {chat.firstMessage?.text}
                                                                </p>
                                                            )}
                                                        </>

                                                    )}
                                                </div>

                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className='flex-1'></div>
                                {!chat.readBy?.includes(user?.userId) && (
                                    <div className='w-2.5 h-2.5 bg-blue-500 rounded-full mr-3'>
                                    </div>                                    
                                )}
                            </div>                      
                        )
                    })}
                </div>
            )}

        </div>
    )
}

export default GetChats