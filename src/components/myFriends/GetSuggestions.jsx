import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { cancelRequest, getSuggestions, requestFriends } from '../../api/friends/friends'
import { useNavigate } from 'react-router-dom'

const GetSuggestions = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)
  const [suggestions, setSuggestions] = useState([])
  const [isClick, setIsClick] = useState({})

  const navigate = useNavigate();

  const handleGetSuggestions = async() => {
    try {
      const res = await getSuggestions(user?.token, navigate)
      setSuggestions(res)
    } catch (error) {
      console.log(error)
    }
  }

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

  const handleGetProfile = (userId) => {
    navigate(`/get-profile/${userId}`)
  }

  /* eslint-disable */
  useEffect(()=> {
    if (!user) {
      navigate("/login");
    } 
    handleGetSuggestions()
  },[])

  return (
    <div className='py-2 px-10'>
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
  )
}

export default GetSuggestions