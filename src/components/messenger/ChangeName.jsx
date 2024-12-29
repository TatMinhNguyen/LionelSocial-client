import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import LoadingSpinner from '../spinner/LoadingSpinner'
import { changeName, getAChat, getMess, getUserChat } from '../../api/chat/chat'
import { useNavigate } from 'react-router-dom'

const ChangeName = ({chat, user, isCloseModal, isClose}) => {
    const [username, setUsername] = useState(chat?.name)

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleCloseModal = () => {
        isCloseModal(false);        
    }

    const handleChangeName = async() => {
        setLoading(true)
        const profile = {
            newName: username,
        }
        const params = {
            page: 1,
            index: 20,
        }
        try {
            await changeName(user?.token, profile, chat?._id, navigate)
            
            handleCloseModal();
            isClose()

            await getAChat(user?.token, chat?._id, dispatch, navigate)
            await getMess(user?.token, chat?._id, params, dispatch, navigate);
            await getUserChat(user?.token, dispatch, navigate)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh]'>
            <div className="flex justify-between items-center border-b p-4 py-2">
                    <h3 className="text-xl font-bold flex-1 flex items-center justify-center mb-3 mt-2">
                    Change chat name
                    </h3>
                    <button onClick={handleCloseModal} 
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center">
                        <img  
                            src={require('../../assets/icons/close.png')}
                            alt='Earth'
                            className='w-5 h-5 '
                        />
                    </button>
            </div>
            <div className='px-5 py-3'>
                <h3 className='text-lg font-bold'>
                    Chat name
                </h3>
                <div className='flex-1 flex items-center justify-center relative'> 
                    <img
                        src={require('../../assets/icons/edit1.png')}
                        alt=''
                        className='w-5 h-5 mr-3'
                    />                 
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-1/2 bg-gray-00 rounded-md focus:outline-none"
                    />
                </div>
            </div>
            <div className='flex'>
                <div className='flex-1'></div>
                <div className='flex'>
                    <button className='ml-2 my-4 text-customBlue px-2 py-1 rounded-md font-medium hover:bg-gray-100'
                            onClick={handleCloseModal}
                    >
                        Cancel
                    </button>
                    {username ? (
                        <button className='mr-5 ml-2 my-4 text-white bg-customBlue px-5 py-1 rounded-md font-medium hover:bg-blue-700'
                            onClick={handleChangeName}
                        >
                            Save
                        </button>                        
                    ) : (
                        <button className='mr-5 ml-2 my-4 text-white bg-blue-300 px-5 py-1 rounded-md font-medium'
                        disabled
                        >
                            Save
                        </button>
                    )}
                </div>              
            </div>
            {loading && (
                <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-55'>
                    <LoadingSpinner/>
                </div>
            )}
        </div>
    </div>
  )
}

export default ChangeName