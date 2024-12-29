import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { cancelRequest, getFriends, getSuggestions, requestFriends } from '../../api/friends/friends'
import { useNavigate } from 'react-router-dom'

const GetFriends = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)

  const [friends, setFriends] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [isClick, setIsClick] = useState({})

  const navigate = useNavigate();

  const handleRequest = async(userId) => {
    try {
      await requestFriends(user?.token, userId, navigate)
      setIsClick(prev => ({
        ...prev,
        [userId]: true
      }));
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancelRequest = async(userId) => {
    try {
      await cancelRequest(user?.token, userId, navigate)
      setIsClick(prev => ({
        ...prev,
        [userId]: false
      }));
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetFriends = async() => {
    try {
      const res = await getFriends(user?.token, user?.userId, navigate)
      setFriends(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetSuggestions = async() => {
    try {
      const res = await getSuggestions(user?.token, navigate)
      setSuggestions(res)
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
    if(friends?.length <= 0) {
      handleGetSuggestions()
    }
    handleGetFriends();
  },[])

  return (
    <div className='py-2 px-10'>
      <h1 className='text-[20px] font-bold mb-2'>
        All Friends
      </h1>
      {friends?.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {friends?.map((friend) => (
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
              <div className="mt-4 px-3 flex flex-col space-y-1.5">
                <button className="bg-blue-100 hover:bg-blue-200 text-customBlue font-medium py-2 px-4 rounded-lg"
                  onClick={() => handleGetProfile(friend._id)}
                >View profile</button>
              </div>
            </div>
          ))}
        </div>        
      ) : (
        <div>
          <div className='flex-1 flex items-center justify-center text-lg font-medium text-gray-500'>You have no friends</div>
          <h1 className='text-[20px] font-bold mb-2'>
            Suggestions
          </h1>
          <div className="grid grid-cols-4 gap-4">
            {suggestions?.map((friend) => (
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
                <div className="mt-4 px-3 flex flex-col space-y-1.5">
                  {!isClick[friend?._id] ? (
                    <button className="bg-blue-100 hover:bg-blue-200 text-customBlue font-medium py-2 px-4 rounded-lg"
                      onClick={() => handleRequest(friend._id)}
                    >
                      Add friend
                    </button>
                  ) : (
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg"
                      onClick={() => handleCancelRequest(friend._id)}
                    >
                      Cancel request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div> 
        </div>
      )}
    </div>
  )
}

export default GetFriends