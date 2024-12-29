import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { deleteMember, getAGroup, getMembers, leaveGroup } from '../../api/group/group';
import { createChat1vs1 } from '../../api/chat/chat';
import LoadingSpinner from '../spinner/LoadingSpinner';

const GetMembers = () => {
  const user = useSelector((state) => state.auth.login?.currentUser) 
  const members = useSelector((state) => state.group.members)
  const { groupId } = useParams();

  const group = useOutletContext()

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isAbove, setIsAbove] = useState(false);
  const modalRef = useRef(null);

  // console.log(showModal)

//   const [members, setMemberes] = useState([])
  const [showDelete, setShowDelete] = useState(false)
  const [showLeave, setShowLeave] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleShowComfirmDelete = (user) => {
    setShowModal(null)
    setShowDelete(true)
    setSelectedUser(user)
  }

  const handleShowComfirmLeave = (user) => {
      setShowModal(null)
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
    try {
        const member = {
            memberId: memberId
        }
        await deleteMember(user?.token, member, groupId, navigate)
        
        handleGetMemberes();
        await getAGroup(user?.token, groupId, dispatch, navigate)
    } catch (error) {
        console.log(error)
    } finally{
      setLoading(false)
    }
  }

  const handleLeaveGroup = async () => {
    setLoading(true)
    try {
        await leaveGroup(user?.token, groupId, navigate)

        navigate(`/groups`)
    } catch (error) {
        console.log(error)
    } finally{
      setLoading(false)
    }
  }

  const handleCreateChat = async (userId) => {
    try {
        await createChat1vs1(user?.token, userId, navigate)
    } catch (error) {
        console.log(error)
    }
  }

  const handleThreeDotsClick = (event, friend) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.bottom > viewportHeight - 50) {
      setIsAbove(true);
  
      if (group?.createId !== user?.userId) {
          setModalPosition({
              top: rect.top + window.scrollY - 60,
              left: rect.left + window.scrollX - 275,
          });
      } else {
          setModalPosition({
              top: rect.top + window.scrollY - 90,
              left: rect.left + window.scrollX - 275,
          });
      }
    } else {
        setIsAbove(false);
        setModalPosition({
            top: rect.bottom + window.scrollY + 10,
            left: rect.left + window.scrollX - 275,
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

  const handleGetMemberes = async() => {
    try {
      await getMembers(user?.token, groupId, dispatch, navigate)
    //   setMemberes(result)
    } catch (error) {
      console.log(error)
    }
  }

  /* eslint-disable */
  useEffect(() => {
    if (!user) {
        navigate("/login");
    }
    if(user?.token) {
        handleGetMemberes()
    }
  },[])
  return (
    <div className='bg-white pt-3 rounded-md shadow mb-3'>
      {members?.map((member) => (
        <div key={member._id} className='flex-1 flex items-center justify-center'>
          <div className='w-11/12 flex bg-white border border-gray-100 shadow-sm rounded-md mb-3'>
            <div 
                className='flex-1 flex items-center mx-3 my-2 cursor-pointer'>
                <div className='w-10 h-10'>
                    <img className='h-full w-full object-cover rounded-full shadow'
                        src={member?.profilePicture}
                        alt=''
                    />
                </div>
                <div className='ml-3'>
                    <h1 className='font-medium text-base'>
                        {member?.username}
                    </h1>
                    {member._id === group?.createId && (
                      <p className='text-xs text-customBlue bg-blue-50 w-fit px-1 py-0.5 pb-[3px] rounded-md'>
                        Admin
                      </p>                      
                    )}
                </div>
                <div className='flex-1'></div>
                <div className='mr-1 cursor-pointer flex items-center hover:bg-gray-200 p-1 rounded-full' 
                  onClick={(e) => handleThreeDotsClick(e, member)}
                >
                    <img className='w-6 h-6'
                        src={require('../../assets/icons/menu.png')}
                        alt=""
                    />
                </div> 
            </div>
            {showModal === member._id && (
                <div
                    ref={modalRef}
                    className='absolute bg-white border border-gray-200 rounded w-1/5 shadow-md z-10'
                    style={{
                        top: modalPosition.top,
                        left: modalPosition.left,
                    }}>
                    <div className='relative'>
                        <div
                            className={`absolute transform rotate-45 w-3.5 h-3.5 bg-white border-gray-200 ${
                                isAbove ? 'bottom-[-7px] border-b border-r' : 'top-[-8px] border-l border-t'
                            } right-1`}>
                        </div>
                        {member._id === user?.userId ? (
                          <div className='py-2 px-1.5'>
                              <div className='flex items-center hover:bg-gray-100 px-2 rounded'
                                  onClick={() => handleShowComfirmLeave(member)}
                              >
                                  <img className='w-5 h-5 mr-3 '
                                      src={require('../../assets/icons/leave.png')}
                                      alt=''
                                  />
                                  <p className='py-1 cursor-pointer font-medium'>Leave group </p>
                              </div>                            
                          </div>
                        ) : (
                          <div className='py-2 px-1.5'>
                              <div className='flex items-center hover:bg-gray-100 px-2 rounded'
                                  onClick={() => handleCreateChat(member?._id)}
                              >
                                  <img className='w-6 h-6 mr-3 '
                                      src={require('../../assets/icons/chat.png')}
                                      alt=''
                                  />
                                  <p className='py-1 cursor-pointer font-medium'>Message </p>
                              </div>
                              {group?.createId === user?.userId  && (
                                <div className='flex items-center hover:bg-gray-100 px-2 rounded'
                                        onClick={() => handleShowComfirmDelete(member)}
                                >
                                    <img className='w-6 h-6 mr-3 '
                                        src={require('../../assets/icons/unfriend.png')}
                                        alt=''
                                    />
                                    <p className='py-1 cursor-pointer font-medium'>Remove member </p>
                                </div>                                
                              )}
                          </div>
                        )}

                    </div>
                </div>
            )}
            {showDelete && selectedUser?._id === member._id && (
                <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                    <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                        <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                            Remove From Group?
                        </h2>
                        <p className='text-sm text-gray-600 mb-5'>
                          Are you sure you want to remove this person from the group? They will no longer be able to see content in the group.
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
                            Leave group?
                        </h2>
                        <p className='text-sm text-gray-600 mb-5'>
                          Are you sure you want to leave {group?.name}
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
        </div>
      ))}
    </div>
  )
}

export default GetMembers