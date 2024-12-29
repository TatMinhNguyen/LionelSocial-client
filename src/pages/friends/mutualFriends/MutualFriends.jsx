import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getMutuals } from '../../../api/friends/friends';

const MutualFriends = ({userId , user}) => {
    const [data, setData] = useState([])
    // console.log(data)

    const navigation = useNavigate();

    const handleGetFriends = async() =>{
        try {
            const result = await getMutuals(user?.token, userId, navigation)
            setData(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetUser = async(userId, navigation) => {
        navigation(`/get-profile/${userId}`)
    }

    /* eslint-disable */
    useEffect(() => {
        handleGetFriends();
    },[userId])

    return (
        <div>
            {data?.map((friend) => {
                return (
                    <div key={friend?._id} className='flex-1 flex items-center justify-center'>
                        <div className='w-11/12 flex bg-white border border-gray-100 shadow-sm rounded-md mb-3'>
                            <div onClick={() => handleGetUser(friend?._id)} 
                                className='flex mx-3 my-2 cursor-pointer'>
                                <div className='w-10 h-10'>
                                    <img className='h-full w-full object-cover rounded-full shadow'
                                        src= {friend?.profilePicture}
                                        alt=''
                                    />
                                </div>
                                <div className='ml-3'>
                                    <h1 className='font-medium text-base'>
                                        {friend?.username}
                                    </h1>
                                    <p className='text-xs text-gray-500'>
                                        {friend?.mutualFriends} mutual friends
                                    </p>
                                </div>
                            </div>  
                            <div className='flex-1'></div>
                            <div className='mr-3 cursor-pointer flex items-center'>
                                <img className='w-6 h-6'
                                    src={require('../../../assets/icons/menu.png')}
                                    alt="" 
                                />
                            </div>                      
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MutualFriends