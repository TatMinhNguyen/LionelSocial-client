import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { approve, decline, getAGroup, getPendingMembers } from '../../api/group/group'
import { useDispatch, useSelector } from 'react-redux'

const GetMembersRequest = () => {
  const user = useSelector((state) => state.auth.login?.currentUser) 

  const { groupId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [members, setMemberes] = useState([])
  const [group, setGroup] = useState({})

  const handleGetMemberes = async() => {
    try {
      const result = await getPendingMembers(user?.token, groupId,navigate)
      setMemberes(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetAGroup = async () => {
    try {
        const result = await getAGroup(user?.token, groupId, dispatch, navigate)
        setGroup(result)
    } catch (error) {
        console.log(error)
    }
  }

  const handleApprove = async (userId) => {
    try {
      await approve(user?.token, groupId, userId, navigate)

      handleGetMemberes();
      handleGetAGroup();
    } catch (error) {
      console.log(error)
    }
  }

  const handleDecline = async (userId) => {
    try {
      await decline(user?.token, groupId, userId, navigate)

      handleGetMemberes();
      handleGetAGroup();
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
        handleGetAGroup()
    }
  },[])
  return (
    <div className=''>
      <div className='flex w-full h-[8vh] bg-white shadow items-center fixed z-10'>
        <h1 className='text-2xl font-bold ml-[5vw]'>
          Member requests  ·
        </h1> 
        <p className='text-2xl font-bold ml-2 text-gray-500'>
          {group?.pendingMembers?.length}
        </p>       
      </div>
      <div className='pt-[10vh]'>
        {members?.map((member) => (
          <div key={member._id} className=' flex items-center justify-center'>
            <div className='w-2/3 flex bg-white border border-gray-100 shadow-sm rounded-md mb-3'>
              <div className='flex-1 flex items-center mx-3 my-2.5 '>
                  <div className='w-10 h-10 cursor-pointer'>
                      <img className='h-full w-full object-cover rounded-full shadow'
                          src={member?.profilePicture}
                          alt=''
                      />
                  </div>
                  <div className='ml-3 cursor-pointer'>
                      <h1 className='font-medium text-base'>
                          {member?.username}
                      </h1>
                  </div>
                  <div className='flex-1'></div>
                  <div className='flex items-center'>
                    <button className='bg-customBlue hover:bg-blue-600 font-medium mx-2 px-8 py-1.5 pb-2 rounded-md text-white'
                      onClick={() => handleApprove(member._id)}
                    >
                      Approve
                    </button>
                    <button className='bg-gray-200 hover:bg-gray-300 font-medium mx-2 px-8 py-1.5 pb-2 rounded-md'
                      onClick={() => handleDecline(member._id)}
                    >
                      Decline
                    </button>
                  </div> 
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GetMembersRequest