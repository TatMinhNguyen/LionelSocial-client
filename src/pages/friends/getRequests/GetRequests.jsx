import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { acceptRequest, getRequested, refuseRequest } from '../../../api/friends/friends';

const GetRequests = ({user}) => {
    const [data, setData] = useState([])
    // console.log(data)
    const [clickedUsers, setClickedUsers] = useState({});

    const navigation = useNavigate();

    const handleGetRequested = async() =>{
        try {
            const result = await getRequested(user?.token, navigation)
            setData(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAccept = async (userId) => {
        try {
            await acceptRequest(user?.token, userId, navigation);
            setClickedUsers(prev => ({
                ...prev,
                [userId]: true
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefuse = async (userId) => {
        try {
            await refuseRequest(user?.token, userId, navigation);
            handleGetRequested()
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetUser = async(userId) => {
        navigation(`/get-profile/${userId}`)
    }

    /* eslint-disable */
    useEffect(() => {
        handleGetRequested();
    },[])
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
                            {clickedUsers[friend?._id] ? (
                                <div className='flex items-center mr-3'>
                                    <p className='text-sm text-gray-500'>
                                        Request accepted
                                    </p>
                                </div>
                            ) : (
                                <div className='flex items-center'>
                                    <div className='mr-3 cursor-pointer bg-customBlue py-1.5 px-6 rounded-md'
                                            onClick={() => handleAccept(friend?._id)}
                                    >
                                        <p className='text-white font-medium text-sm'>
                                            Confirm
                                        </p>
                                    </div> 
                                    <div className='mr-3 cursor-pointer bg-gray-300 py-1.5 px-6 rounded-md'
                                            onClick={() => handleRefuse(friend?._id)}
                                    >
                                        <p className='text-black font-medium text-sm'>
                                            Delete
                                        </p>
                                    </div>                                                               
                                </div> 
                            )}                    
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default GetRequests