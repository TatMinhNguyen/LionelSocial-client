import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SearchUsers = () => {
  const searchUsers = useSelector((state) => state.search.users)
  const myProfile = useSelector((state) => state?.auth?.profile)

  const navigation = useNavigate()

  const handleGetUser = async(userId) => {
    navigation(`/get-profile/${userId}`)
  }
  return (
    <div>
      {searchUsers?.length > 0 ? (
        <div className='flex-1 flex items-center justify-center'>
          <div className='w-7/12'>
            {searchUsers?.map((user) => {
              return (
                <div key={user?.userId} className='bg-white my-2 p-2 border border-white shadow rounded-md flex-1 items-center'>
                  <div className=' flex-1 flex items-center'>
                    <div className='flex mx-3 my-2'>
                      <div className='w-12 h-12'>
                          <img className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                              src= {user?.profilePicture}
                              alt=''
                          />
                      </div>
                      <div className='ml-3'>
                          <h1 className='font-medium text-[17px]'>
                              {user?.username}
                          </h1>
                          {myProfile?.friends?.includes(user?.userId) && (
                            <div className='text-sm text-gray-500'>
                              Friend.
                            </div>
                          )}
                          <p className='text-sm text-gray-500'>
                              {user?.mutualFriends} mutual friends
                          </p>
                      </div>
                    </div> 
                    <div className='flex-1'></div>
                    <div className='py-1.5 px-3 bg-blue-100 hover:bg-blue-200 rounded-md cursor-pointer mr-1'
                      onClick={() => handleGetUser(user?.userId)}
                    >
                      <p className='text-customBlue font-medium'>
                        View profile
                      </p>
                    </div>                   
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center'>No users found</div>
      )}
    </div>
  )
}

export default SearchUsers