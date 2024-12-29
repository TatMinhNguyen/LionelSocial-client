import React, { useEffect, useRef, useState } from 'react'
import { convertNewlinesToBreaks, timeAgo} from '../../utils'

import { deleteComment, editcomment, getComments } from '../../api/comment/comment';
import { useDispatch } from 'react-redux';
import { ImageComment } from '../CssPictures/ImageComment';
import LoadingSpinner from '../spinner/LoadingSpinner';
import socket from '../../socket';
import { useNavigate } from 'react-router-dom';

export const Comment = ({comments, user, authorPost, postId, profile}) => {

  const [showModal, setShowModal] = useState(null); 
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isAbove, setIsAbove] = useState(false);

  const modalRef = useRef(null);
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null); 

  const [confirmationModal, setConfirmModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageId, setImageId] = useState('')
  // console.log(imagePreview)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const [onlineUsers, setOnlineUsers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleInput = (e) => {
    setDescription(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset the height to auto
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the scroll height
  };

  const handleDeletePreView = (id) => {
    setImage(null);
    setImagePreview(null)
    setImageId(id)
    setImageUrl('')
    URL.revokeObjectURL(imagePreview);
  }

  const handleImageClick = () => {
    imageInputRef.current.click();
  };

  const handleImageChange = (e) => {
      const selectedImage = e.target.files[0];     

      if(selectedImage) {
        setImage(selectedImage);
        const ImageUrl = URL.createObjectURL(selectedImage);
        setImagePreview(ImageUrl);
      }
      
      if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
      }
  };

  const handleThreeDotsClick = (event, comment) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.bottom > viewportHeight - 50) {
        setIsAbove(true);
        setModalPosition({
            top: rect.top + window.scrollY - 90,
            left: rect.left + window.scrollX - 30,
        });
    } else {
        setIsAbove(false);
        setModalPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX - 30,
        });
    }

    setShowModal(comment?.commentId); // Set the modal to open for the specific comment
  };

  const handleDeleteComment = async(commentId) => {
    setLoading(true)
    try {
      await deleteComment(user?.token, commentId, navigate)

      setConfirmModal(false)
      setSelectedComment(null)

      await getComments(user?.token, dispatch, postId, navigate)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = (commented) => {
    setShowModal(null)
    setConfirmModal(true)
    setSelectedComment(commented)
  }

  const handleCancelDelete = () => {
    setConfirmModal(false)
    setSelectedComment(null)    
  }

  const handleEditModal = (commented, content) =>{
    setShowModal(null)
    setEditModal(true)
    setSelectedComment(commented)
    setDescription(content)
    setImageUrl(commented?.image?.url)
  }

  const handleCloseEdit = () => {
    setEditModal(false)
    setSelectedComment(null)
    setImage(null)
    setImagePreview(null)
    URL.revokeObjectURL(imagePreview);
  }

  const handleEditComment = async(e, commentId) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      
      if (description) {
        formData.append('content', description);
      }
      if (image) {
          formData.append('image', image);
      }
      if(imageId) {
        formData.append('imageId', imageId)
      }

      await editcomment(user?.token, formData, commentId, navigate)

      // setDescription('')
      setImage(null) 
      setImagePreview(null)
      setEditModal(false)
      setImageId('')
      
      // Reset chiều cao của textarea
      if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
      }

      await getComments(user?.token, dispatch, postId, navigate)
    } catch (error) {
      console.log(error)
    }finally {
      // Giải phóng các URL sau khi không cần sử dụng nữa
      URL.revokeObjectURL(imagePreview);
      setLoading(false)
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
  return (
    <div className=''>
      {comments?.map((comment) => {
        return(
          <div key={comment.commentId} className='px-4 py-2 flex w-full '>
            {onlineUsers?.includes(comment?.author?.authorId) && (
                <div className='w-3 h-3 border-2 border-white rounded-full bg-green-600 absolute mt-[33px] ml-[26px]'></div>
            )}
            <div className='h-9 w-9 mr-3 mt-2'>
                <img className='h-full w-full object-cover rounded-full shadow'
                    src={comment?.author?.authorAvatar}
                    alt=''
                />
            </div>
            {comment?.image === null || !comment?.image ? (
              <div className='max-w-[calc(100%-5rem)]'>
                <div className='bg-gray-100 px-2 py-1 rounded-xl'>
                  <div className='flex px-1'>
                    <h2 className=' font-semibold'>
                      {comment?.author?.authorName}
                    </h2> 
                  </div>
                  <p className='pb-0 px-1'>
                    {convertNewlinesToBreaks(comment?.content)}
                  </p>               
                </div>
                <div>
                  <p className='text-xs text-gray-500 px-3 mt-0.5'>
                      {timeAgo(comment?.createdAt)}
                  </p>                   
                </div>           
              </div>
            ) : (
              <div className='max-w-[calc(100%-5rem)]'>
                <div className=''>
                  <div className='flex px-1'>
                    <h2 className=' font-semibold'>
                      {comment?.author?.authorName}
                    </h2> 
                  </div>
                  {comment?.content && (
                    <p className='pb-0 px-1'>
                      {convertNewlinesToBreaks(comment?.content)}
                    </p>                    
                  )}
                  <ImageComment
                    selectedImages = {comment?.image?.url}
                  />
                </div>
                <div>
                    <p className='text-xs text-gray-500 px-3 mt-0.5'>
                      {timeAgo(comment?.createdAt)}
                    </p>                   
                </div>           

              </div>
            )}
            <div className='flex-1'></div>
            {user?.userId === comment?.author?.authorId || user?.userId === authorPost ? (
              <div className='hover:bg-gray-200 h-7 w-7 rounded-full flex items-center justify-center cursor-pointer'
                    onClick={(e) => handleThreeDotsClick(e, comment)}
              >
                <img className='w-5 h-5'
                  src={require('../../assets/icons/menu.png')}
                  alt=''
                />
              </div>              
            ) : (
              <></>
            )}

            {showModal === comment?.commentId && (
              <div
                  ref={modalRef}
                  className='absolute bg-white border border-gray-200 rounded shadow-xl z-10'
                  style={{
                      top: modalPosition.top,
                      left: modalPosition.left,
                  }}
              >
                  <div className='relative'>
                      <div
                          className={`absolute transform rotate-45 w-3 h-3 bg-white border-gray-200 ${
                              isAbove ? 'bottom-[-6px] border-b border-r' : 'top-[-6px] border-l border-t'
                          } left-10`}>
                      </div>
                      {user?.userId === comment?.author?.authorId ? (
                        <div className='py-2 px-1.5'>
                            <div className='flex hover:bg-gray-100 px-2 rounded'
                                  onClick={() => handleEditModal(comment, comment?.content)}
                            >
                                <img className='w-6 h-6 mr-3 mt-1'
                                    src={require('../../assets/icons/edit1.png')}
                                    alt=''
                                />
                                <p className='py-1 cursor-pointer text-black'>Edit comment </p>
                            </div>
                            <div className='flex hover:bg-red-50 px-2 rounded'
                                    onClick={() => handleConfirmDelete(comment)}
                            >
                                <img className='w-6 h-6 mr-3 mt-1'
                                    src={require('../../assets/icons/delete.png')}
                                    alt=''
                                />
                                <p className='py-1 cursor-pointer text-red-600'>Delete comment </p>
                            </div>
                        </div>                        
                      ) : (
                        <div className='py-2 px-1.5'>
                            <div className='flex hover:bg-red-50 px-2 rounded'
                                    onClick={() => handleConfirmDelete(comment)}
                            >
                                <img className='w-6 h-6 mr-3 mt-1'
                                    src={require('../../assets/icons/delete.png')}
                                    alt=''
                                />
                                <p className='py-1 cursor-pointer text-red-600'>Delete comment </p>
                            </div>
                        </div>
                      )}

                  </div>
              </div>
            )}
            {confirmationModal && selectedComment?.commentId === comment.commentId && (
                <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                    <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                        <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                            Delete Comment
                        </h2>
                        <p className='text-sm text-gray-600 mb-5'>
                            Are you sure you want to delete this comment?
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
                                  className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' 
                                  onClick={() => handleDeleteComment(selectedComment?.commentId)}>
                                  Delete
                              </button>
                          </div>
                        )}

                    </div>
                </div>
            )}
            {editModal && selectedComment?.commentId === comment.commentId && (
                <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20'>
                    <div className='w-2/5 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                      <div className='flex-1 flex justify-center  mb-2 pb-2 border-b border-gray-300'>
                        <h2 className='flex-1 flex items-center justify-center text-lg italic font-semibold'>
                            Edit Comment
                        </h2> 
                        <div className='p-2 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer'
                            onClick={handleCloseEdit}
                        >
                          <img
                            src={require('../../assets/icons/close.png')}
                            alt=''
                            className='w-4 h-4'
                          />  
                        </div>                       
                      </div>

                        <div className='flex justify-end space-x-4'>
                          <div className='flex-1 flex items-center justify-center w-full px-3 py-2 bg-white '>
                            <div className='h-10 w-10 mr-3'>
                                <img className='h-full w-full object-cover rounded-full shadow'
                                    src={profile}
                                    alt='Avatar'
                                />
                            </div>
                            <form className="w-11/12 mx-auto rounded-2xl bg-gray-100 items-center"
                                  onSubmit={() => handleEditComment(selectedComment?.commentId)}
                            >
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="1"
                                    value={description}
                                    onChange={handleInput}
                                    ref={textareaRef}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleEditComment(e, selectedComment?.commentId);  
                                        }
                                    }}
                                    className="flex-grow w-full px-4 py-2 rounded-2xl mt-1 bg-gray-100 overflow-hidden
                                        focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-100"
                                    placeholder="Write your comment here..."
                                    style={{resize: 'none'}} // Optional: Prevent manual resizing
                                />
                                {(imagePreview || imageUrl) && (
                                    <div className='m-4 flex-1 flex'>
                                        <ImageComment
                                            selectedImages = {imagePreview || imageUrl}
                                        />
                                        <div className='w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300'
                                                onClick={() => handleDeletePreView(comment?.image?.fileId)}
                                        >
                                            <img
                                                src={require('../../assets/icons/close.png')}
                                                alt=''
                                                className='w-4 h-4'
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-2 pb-2 px-3">
                                    <div className='text-gray-500 cursor-pointer'>
                                        <img className='h-6 w-6 object-cover'
                                            src={require("../../assets/icons/smile.png")}
                                            alt=''
                                        />                                 
                                    </div>
                                    <div onClick={handleImageClick} className='text-gray-500 cursor-pointer'>
                                        <img className='h-6 w-6 object-cover'
                                            src={require("../../assets/icons/camera.png")}
                                            alt=''
                                        />                                 
                                    </div>  
                                    {/* Hidden inputs */}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        ref={imageInputRef} 
                                        style={{ display: 'none' }} 
                                        onChange={handleImageChange} 
                                    />                                             
                                    <div className='flex-1'></div>
                                    {loading ? (
                                      <div>
                                        <LoadingSpinner/>
                                      </div>
                                    ):(
                                      <>
                                        {description || image ? (
                                            <button type="submit" className="text-white" onClick={(e) => handleEditComment(e, comment?.commentId)}>
                                                <img className='h-6 w-6 object-cover'
                                                    src={require("../../assets/icons/send-blue.png")}
                                                    alt=''
                                                />                            
                                            </button>                                 
                                        ) :(
                                            <div className="text-white">
                                                <img className='h-6 w-6 object-cover'
                                                    src={require("../../assets/icons/send-gray.png")}
                                                    alt=''
                                                />                            
                                            </div>   
                                        )}                                      
                                      </>
                                    )}
                               
                                </div>
                            </form>            
                          </div>
                        </div>
                    </div>
                </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
