import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { editGroup, getAGroup } from '../../api/group/group'
import LoadingSpinner from '../spinner/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

const ChangeName = ({isCloseModal, name, type, user, groupId}) => {
    const [groupName, setGroupName] = useState(name);
    const [groupType, setGroupType] = useState(type);

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleCloseModal = () => {
        isCloseModal(false);        
    }

    const handleChangeProfile = async() => {
        setLoading(true)
        const newGroup = {
            name: groupName,
            type: groupType,
        }
        try {
            await editGroup(user?.token, groupId, newGroup, navigate)
            
            handleCloseModal();

            await getAGroup(user?.token, groupId, dispatch, navigate)
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
                        Edit Group
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
                <h3 className='text-lg font-bold mb-2'>
                    Group Name
                </h3>
                <div className='flex-1 flex items-center justify-center relative'> 
                    <img
                        src={require('../../assets/icons/edit1.png')}
                        alt=''
                        className='w-5 h-5 mr-3'
                    />                 
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your group name" 
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-1/2 bg-gray-00 rounded-md focus:outline-none"
                    />
                </div>
            </div>
            <div className='px-5 py-3'>
                <h3 className='text-lg font-bold mb-2'>
                    Privacy
                </h3>
                <div className='flex-1 flex items-center relative ml-24'>   
                    <label className='mr-6'>
                        <input
                            type="radio"
                            name="privacy"
                            value="public"
                            checked={groupType === true}
                            onChange={(e) => setGroupType(true)}
                            className="mr-2"
                        />
                        Public
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="privacy"
                            value="private"
                            checked={groupType === false}
                            onChange={(e) => setGroupType(false)}
                            className="mr-2"
                        />
                        Private
                    </label>             
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
                    {groupName || groupType  ? (
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

export default ChangeName