import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { acceptRequest, getRequested, refuseRequest } from '../../api/friends/friends'
import { useNavigate } from 'react-router-dom'

const GetRequests = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)

  const [requests, setRequests] = useState([])
  const [clickedUsers, setClickedUsers] = useState({});
  const [accept, setAccept] = useState({})

  const navigate = useNavigate();

  const handleRequests = async() => {
    try {
      const res = await getRequested(user?.token, navigate)
      setRequests(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleAccept = async (userId) => {
    try {
        await acceptRequest(user?.token, userId, navigate);
        setClickedUsers(prev => ({
            ...prev,
            [userId]: true
        }));
        setAccept(prev => ({
          ...prev,
          [userId]: true
      }));
    } catch (error) {
        console.log(error);
    }
  };

  const handleRefuse = async (userId) => {
      try {
          await refuseRequest(user?.token, userId, navigate);
          setClickedUsers(prev => ({
            ...prev,
            [userId]: true
        }));
          setAccept(prev => ({
            ...prev,
            [userId]: false
        }));
      } catch (error) {
          console.log(error)
      }
  }

  const handleGetProfile = (userId) => {
    navigate(`/get-profile/${userId}`)
  }

  /* eslint-disable */
  useEffect(()=> {
    if (!user) {
      navigate("/login");
    } 
    handleRequests()
  },[])

  return (
    <div className='py-2 px-10'>
      <h1 className='text-[20px] font-bold mb-2'>
      Friend Requests
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {requests?.map((friend) => (
          <div key={friend._id} className="border bg-white rounded-lg pb-2">
            <img src={friend.profilePicture} alt='' 
              className="w-full h-[30vh] cursor-pointer object-cover rounded-t-md hover:opacity-90" 
              onClick={() => handleGetProfile(friend._id)}
            />
            <div className='mt-2 px-3'>
              <h2 className="text-[17px] font-medium cursor-pointer hover:text-gray-700"
                onClick={() => handleGetProfile(friend._id)}
              >{friend.username}</h2>
              <p className="text-sm text-gray-500">{friend.mutualFriends} mutual friends</p>              
            </div>
            {clickedUsers[friend?._id] ? (
              <div className='mt-4 px-3 flex flex-col space-y-1.5'>
                <button className="bg-white text-white py-2 px-4 rounded-lg" disabled>Confirm</button>
                {accept[friend._id] ? (
                  <button className="bg-gray-200 text-gray-400 font-medium py-2 px-4 rounded-lg" disabled>Request accepted</button>
                ) : (
                  <button className="bg-gray-200 text-gray-400 font-medium py-2 px-4 rounded-lg" disabled>Request deleted</button>
                )}             
              </div>
            ) : (
              <div className="mt-4 px-3 flex flex-col space-y-1.5">
                <button className="bg-customBlue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
                  onClick={() => handleAccept(friend._id)}
                >
                  Confirm
                </button>
                <button className="bg-gray-300 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg"
                  onClick={() => handleRefuse(friend._id)}
                >
                  Delete
                </button>
              </div>              
            )}

          </div>
        ))}
      </div> 
    </div>
  )
}

export default GetRequests