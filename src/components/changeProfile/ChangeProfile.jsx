import React, { useState } from 'react'
import { changeProfile, getMyProfile } from '../../api/profile/profile'
import { useDispatch } from 'react-redux'
import LoadingSpinner from '../spinner/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

const ChangeProfile = ({user, isCloseModal, myProfile}) => {
    const [username, setUsername] = useState(myProfile?.username)
    const [work, setWork] = useState(myProfile?.work)
    const [address, setAddress] = useState(myProfile?.address)

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleCloseModal = () => {
        isCloseModal(false);        
    }

    const handleChangeProfile = async() => {
        setLoading(true)
        const profile = {
            username: username,
            work: work,
            address: address
        }
        try {
            await changeProfile(user?.token, profile, navigate)
            
            handleCloseModal();

            await getMyProfile(user?.token, dispatch, navigate)
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
                        Edit profile
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
                    Username
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
            <div className='px-5 py-3'>
                <h3 className='text-lg font-bold mb-3'>
                    Customize your intro
                </h3>
                <div className='flex'>
                    <img
                        src={require('../../assets/icons/suitcase.png')}
                        alt=''
                        className='w-5 h-5 mr-2 mt-0.5 ml-2'
                    />                    
                    <p className='font-medium'>
                        Works at
                    </p>                    
                </div>
                <div className='flex-1 flex items-center justify-center relative'> 
                    <img
                        src={require('../../assets/icons/edit1.png')}
                        alt=''
                        className='w-5 h-5 mr-3'
                    />                 
                    <input
                        type="text"
                        id="work"
                        name="work"
                        placeholder="Enter your work" 
                        value={work}
                        onChange={(e) => setWork(e.target.value)}
                        className="w-1/2 bg-gray-00 rounded-md focus:outline-none"
                    />
                </div>
                <div className='flex mt-2'>
                    <img
                        src={require('../../assets/icons/address.png')}
                        alt=''
                        className='w-5 h-5 mr-2 mt-0.5 ml-2'
                    />                    
                    <p className='font-medium'>
                        Lives in
                    </p>                    
                </div>
                <div className='flex-1 flex items-center justify-center relative'> 
                    <img
                        src={require('../../assets/icons/edit1.png')}
                        alt=''
                        className='w-5 h-5 mr-3'
                    />                 
                    <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Enter your address" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                    {username || work || address ? (
                        <button className='mr-5 ml-2 my-4 text-white bg-customBlue px-5 py-1 rounded-md font-medium hover:bg-blue-700'
                            onClick={handleChangeProfile}
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

export default ChangeProfile