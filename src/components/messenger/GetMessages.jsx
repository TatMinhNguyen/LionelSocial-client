import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { addMess, checkMessages, deleteMessage, getAChat, getMess, getUserChat } from '../../api/chat/chat';
import { useDispatch, useSelector } from 'react-redux';
import InputEmoji from "react-input-emoji";
import { timeAgoShort } from '../../utils';
import LoadingSpinner from '../spinner/LoadingSpinner';
import socket from '../../socket';
import GetDetailConversation from './GetDetailConversation';

const GetMessages = () => {
  const chat = useSelector((state) => state.chat.chat)
//   console.log(chat)
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const { chatId } = useParams();
  const imageInputRef = useRef(null);
  const loadMoreTopRef = useRef(null);
  const user = useSelector((state) => state.auth.login?.currentUser)
  const messages = useSelector((state) => state.chat.messages)
  const [newMessages, setMessages] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showConversation, setShowConversation] = useState(false)

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [confirmationModal, setConfirmModal] = useState(false);
    const [selectMessage, setSelectMessage] = useState(null)

    const modalRef = useRef(null);

    const toggleMenu = (event, message) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({
            top: rect.top + window.scrollY - 30,
            left: rect.left + window.scrollX - 624,
        });
        setIsMenuOpen(message._id)
    };

    const handleConfirmDelete = (message) => {
        setIsMenuOpen(null)
        setConfirmModal(true)
        setSelectMessage(message)
    }

    const handleCancelDelete = () => {
        setConfirmModal(false)
        setSelectMessage(null)    
    }

    const handleDeleteMessage = async(commentId) => {
        setLoading(true)
        try {
            await deleteMessage(user?.token, commentId, navigate)

            setConfirmModal(false)
            setSelectMessage(null)

            await getMess(user?.token, chatId, params, dispatch, navigate);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsMenuOpen(null);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const onlineUserSet = new Set(onlineUsers);

  const [params, setParams] = useState({
    page: 1,
    index: 20,
  })

  const filteredMembers = chat?.members?.filter((memberId) => memberId !== user?.userId);

  // Kiểm tra nếu có ít nhất 1 id trong filteredMembers trùng với onlineUser
  const isOnline = filteredMembers?.some((memberId) => onlineUserSet?.has(memberId));

  useEffect(() => {
    socket.emit('online')
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

  const handleGetMess = async () => {
    try {
        await getMess(user?.token, chatId, params, dispatch, navigate);
        await checkMessages(user?.token, chatId, navigate)
    } catch (error) {
        console.error('Errors:', error);
    }
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    imageInputRef.current.click();
};

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];       

    if(selectedImage){
        setImage(selectedImage);
        const ImageUrl = URL.createObjectURL(selectedImage);
        setImagePreview(ImageUrl);            
    }

    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }
  };

  const handleDeletePreView = () => {
    setImage(null);
    setImagePreview(null)
    URL.revokeObjectURL(imagePreview);
  }

  const handleAddMessage = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
        const formData = new FormData();

        formData.append('chatId', chatId)

        if(newMessages) {
            formData.append('text', newMessages)
        }

        if(image) {
            formData.append('image', image)
        }

        await addMess(user?.token, formData, navigate)

        setImage(null)
        setMessages('')
        setImagePreview(null)

        handleGetMess();
        await getUserChat(user?.token, dispatch, navigate)

    } catch (error) {
        console.log(error)
    } finally {
        // Giải phóng các URL sau khi không cần sử dụng nữa
        URL.revokeObjectURL(imagePreview);
        setLoading(false)
      }
  }

  const handleGetAChat = async () => {
    await getAChat(user?.token, chatId, dispatch, navigate)
  }

  const handleCall = () => {
    navigate(`/room/${chat?._id}`)
    socket.emit('create-room', chat?._id, filteredMembers);
  }

  /* eslint-disable */
  useEffect(() => {
    socket.on('send-message', () => {
      handleGetMess();
    });

    return () => {
        socket.off('send-message');
    };
  }, [messages]); 

  const handleScroll = (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      setParams((prevParams) => ({
        ...prevParams,
        index: prevParams.index + 20,
      }));
    }
  };
  
  /* eslint-disable */
  useEffect(() => {
    if (!loadMoreTopRef.current) return;
  
    const observer = new IntersectionObserver((entries) => {
      handleScroll(entries); // Truyền entries vào handleScroll
    });
  
    observer.observe(loadMoreTopRef.current);
  
    return () => observer.disconnect(); // Ngắt kết nối observer khi component bị unmount
  }, []); 



  /* eslint-disable */
  useEffect(() => {
    if(user?.token) {
        handleGetAChat();
        handleGetMess();
    }
  }, [chatId, params]);
  return (
    <div className="relative flex flex-col ">
        {/* Header cố định */}
        <div className='fixed w-[calc(65vw-12px)] flex items-center h-[7vh] min-h-14 bg-white rounded-t-lg border border-white shadow z-10'>
            {isOnline && (
                <div className='w-3 h-3 border-2 border-white rounded-full bg-green-600 absolute mt-[30px] ml-[40px]'></div>
            )}
            <div className='w-10 h-10 ml-3'>
                <img className='h-full w-full object-cover rounded-full'
                    src={chat?.avatar}
                    alt=''
                />                                
            </div>
            <div className='ml-3'>
                <h1 className='font-medium text-[16px]'>
                    {chat?.name}
                </h1>
            </div>
            <div className='flex-1'></div>
            <div className='p-1.5 hover:bg-gray-100 rounded-full mr-2 cursor-pointer'
                onClick={() => handleCall()}
            >
                <img className='h-5 w-5 object-cover rounded-full'
                    src={require('../../assets/icons/call.png')}
                    alt=''
                />  
            </div>          

            <div className='p-1.5 hover:bg-gray-100 rounded-full mr-3 cursor-pointer'
                onClick={() => setShowConversation(true)}
            >
                <img className='h-5 w-5 object-cover rounded-full'
                    src={require('../../assets/icons/option.png')}
                    alt=''
                />  
            </div>        
        </div>

        {showConversation && (
            <GetDetailConversation
                chat = {chat}
                isCloseModal = {() => setShowConversation(false)}
            />
        )}

        {/* Khoảng trống bù để nội dung không bị che bởi header */}
        <div className="h-[7.5vh]"></div>

        {/* Nội dung chat cuộn */}
        <div className={`overflow-y-auto ${imagePreview ? 'h-[calc(72vh-90px)]' : 'h-[73vh]'}  flex flex-col-reverse px-3 pt-2`}>
            {messages?.map((message) => (
                <div key={message._id}
                    className={`group flex ${message.senderId._id === user?.userId ? 'justify-end' : message.senderId._id === '66fbc2e6e600beb492a84969' ? "justify-center" : 'justify-start'} mb-2`}
                >
                    {message.senderId._id === user?.userId ? (
                        <div className=' '>
                            <div className='menu-container'>
                                {message.image !== null && (
                                    <div className='mb-1 flex items-center'>
                                        <div className="h-7 w-7 mr-1.5 flex items-center justify-center hover:bg-gray-200 rounded-full cursor-pointer"
                                            onClick={(e) => toggleMenu(e, message)}
                                        >
                                            <img
                                                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                src={require('../../assets/icons/dots.png')}
                                                alt=""
                                            />
                                        </div>
                                        <img className='max-w-xs max-h-[350px] rounded-lg'
                                            src={message.image.url}
                                            alt=''
                                        />                                        
                                    </div>
                                )}
                                {message.text !== '' && (
                                    <div className="flex items-center">
                                        <div className="h-7 w-7 mr-1.5 flex items-center justify-center hover:bg-gray-200 rounded-full cursor-pointer"
                                            onClick={(e) => toggleMenu(e, message)}
                                        >
                                            <img
                                                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                src={require('../../assets/icons/dots.png')}
                                                alt=""
                                            />
                                        </div>
                                        <div className="pb-1.5 pt-1.5 px-1.5 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl max-w-xs bg-purple-500 text-white w-fit ml-auto">
                                            <p className="text-[15px]">{message.text}</p>
                                        </div>
                                    </div>
                                )}
                                <p className='text-[10px] text-gray-800 mr-1 flex justify-end'>
                                    {timeAgoShort(message.createdAt)}
                                </p>                                
                            </div>
                            {isMenuOpen === message._id  && (
                                <div
                                    ref={modalRef}
                                    className='absolute bg-white border border-gray-200 rounded shadow z-30'
                                    style={{
                                        top: modalPosition.top,
                                        left: modalPosition.left,
                                    }}
                                >
                                    <div className='relative'>
                                        <div
                                            className={`absolute transform rotate-45 w-3 h-3 bg-white border-gray-200 top-[-6px] border-l border-t
                                              left-28`}>
                                        </div>
                                        <div className='py-2 px-1.5'>
                                            <div className='flex hover:bg-gray-100 px-2 rounded'
                                                    onClick={() => handleConfirmDelete(message)}
                                            >
                                                <p className='py-1 pr-10 cursor-pointer text-black font-medium'>Remove </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {confirmationModal && selectMessage._id === message._id && (
                                <div>
                                    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                                        <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                                            <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                                Unsend
                                            </h2>
                                            <p className='text-sm text-gray-600 mb-5'>
                                                Are you sure you want to unsend this message?
                                            </p>
                                            {loading ? (
                                            <div className='flex justify-center'>
                                                <LoadingSpinner/>
                                            </div>
                                            ):(
                                            <div className='flex justify-end space-x-4'>
                                                <button 
                                                    className='bg-gray-200 font-medium px-4 py-2 rounded hover:bg-gray-300' 
                                                    onClick={handleCancelDelete}
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    className='bg-red-500 font-medium text-white px-4 py-2 rounded hover:bg-red-600' 
                                                    onClick={() => handleDeleteMessage(selectMessage._id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            )}

                                        </div>
                                    </div>                                    
                                </div>
                            )}
                        </div>
                    ) : message.senderId._id === '66fbc2e6e600beb492a84969' ? (
                        <div className='max-w-xs'>
                            <p className='text-[12px] text-neutral-400 font-medium text-center'>
                                {message.text}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {chat?.members?.length > 2 && (
                                <div className='ml-11 mb-px'>
                                    <p className='text-[12px]'>
                                        {message.senderId.username}
                                    </p>
                                </div>
                            )}
                            <div className='flex'>
                                <div className='h-9 w-9'>
                                    <img className='h-full w-full object-cover rounded-full hover:opacity-90'
                                        src={message.senderId.profilePicture}
                                        alt=''
                                    />
                                </div>
                                <div className='ml-2'>
                                    {message.image !== null && (
                                        <div className='mb-1'>
                                            <img className='max-w-xs max-h-[350px] rounded-lg'
                                                src={message.image.url}
                                                alt=''
                                            />                                        
                                        </div>
                                    )}
                                    {message.text !== '' && (
                                        <>
                                            <div className='pb-1.5 pt-1.5 pr-3 pl-2 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl max-w-xs bg-gray-200 text-black inline-block'>
                                                <p className='text-[15px]'>
                                                    {message.text}
                                                </p>
                                            
                                            </div>                                          
                                        </>                               
                                    )}
                                    <p className='text-[10px] text-gray-800 ml-1'>
                                        {timeAgoShort(message.createdAt)}
                                    </p>                                
                                </div>
                                
                            </div>                        
                        </div>

                    )}
                </div>
            ))}
            <div ref={loadMoreTopRef} style={{ height: '0px' }} />
        </div>

        {/* Footer cố định */}
        <div className='fixed bottom-4 w-[calc(65vw-12px)] bg-white rounded-md'>
            {imagePreview && (
                <div className='flex'>
                    <img className='max-w-[100px] max-h-[100px] rounded ml-[5vw] mr-3'
                        src={imagePreview}
                        alt=''
                    /> 
                    <div className='w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 cursor-pointer'
                        onClick={handleDeletePreView}
                    >
                        <img className='w-3 h-3'
                            src={require('../../assets/icons/close.png')}
                            alt=''
                        />    
                    </div>                   
                </div>
            )}
            <form className=" flex items-center z-10 px-2 "
                onSubmit={handleAddMessage}
            >
                <button className='w-10 h-9 flex items-center justify-center'
                    onClick={handleImageClick}
                >
                    <img className='w-7 h-7'
                        src={require("../../assets/icons/image.png")}
                        alt=''
                    />
                </button>
                {/* Hidden inputs */}
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={imageInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleImageChange} 
                /> 
                <InputEmoji
                    value={newMessages}
                    onChange={setMessages}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Ngăn việc thêm dòng mới
                            handleAddMessage(e);
                        }
                    }}
                />
                {loading ? (
                    <div>
                        <LoadingSpinner/>
                    </div>
                ) : (
                    <>
                        {newMessages !== '' || image ? (
                            <button type='submit'>
                                <img className='w-6 h-6'
                                    src={require('../../assets/icons/send-blue.png')}
                                    alt=''
                                />
                            </button>
                        ) : (
                            <img className='w-6 h-6'
                                src={require('../../assets/icons/send-gray.png')}
                                alt=''
                            />
                        )}                
                    </>
                )}

            </form>            
        </div>

    </div>
  )
}

export default GetMessages