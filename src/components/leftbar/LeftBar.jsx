import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getUserGroups } from '../../api/group/group';

const LeftBar = ({profile, user}) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([])

  const handleGetUserGroup = async () => {
    try {
      const result = await getUserGroups(user?.token, navigate)
      setGroups(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetGroup = async(groupId) => {
    navigate(`/groups/${groupId}`)
  }

  /* eslint-disable */
  useEffect(()=> {
    handleGetUserGroup();
  },[])
  return (
    <div className='w-[22vw] -mt-1 overflow-y-auto h-[91vh] no-scrollbar'>
      {!profile?.isAdmin && (
        <div className='flex items-center cursor-pointer hover:bg-gray-200 px-2 py-2 w-full rounded-md'
          onClick={()=> navigate(`/get-profile/${profile?._id}`)}
        >
          <div className='h-9 w-9'>
            <img className='h-full w-full object-cover rounded-full hover:opacity-90'
              src={profile?.profilePicture}
              alt='avatar'
            />
          </div> 
          <p className='ml-3 font-medium'>
            {profile?.username}  
          </p>       
        </div>        
      )}

      {profile?.isAdmin && (
        <div className='flex items-center cursor-pointer hover:bg-gray-200 px-2 py-2 rounded-md'
          onClick={() => navigate('/admin/reported-posts')}
        >
          <div className='h-9 w-9'>
            <img className='h-full w-full object-cover rounded-full hover:opacity-90'
              src={require('../../assets/icons/protection.png')}
              alt='avatar'
            />
          </div> 
          <p className='ml-3 font-medium'>
            Admin 
          </p>       
        </div>        
      )}
      <div className='flex items-center cursor-pointer hover:bg-gray-200 px-2 py-2 rounded-md'
        onClick={() => navigate('/friends')}
      >
        <div className='h-9 w-9'
          style={{ backgroundPosition: '0px -333px', backgroundImage: `url(${require('../../assets/icons/media.png')})` }}
        >
        </div> 
        <p className='ml-3 font-medium'>
          Friends 
        </p>       
      </div>

      <div className='flex items-center cursor-pointer ml-px hover:bg-gray-200 px-2 py-2 rounded-md'
        onClick={()=> navigate('/messenger')}
      >
        <div className='h-8 w-8'>
          <img className='h-full w-full object-cover rounded-full hover:opacity-90'
            src={require('../../assets/icons/mess.png')}
            alt='avatar'
          />
        </div> 
        <p className='ml-[15px] font-medium'>
          Messenger 
        </p>       
      </div>

      <div className='flex items-center cursor-pointer hover:bg-gray-200 px-2 py-2 rounded-md mb-1.5'
        onClick={() => navigate('/groups')}
      >
        <div className='h-9 w-9'
          style={{ backgroundPosition: '0px -37px', backgroundImage: `url(${require('../../assets/icons/media.png')})` }}
        >
        </div> 
        <p className='ml-3 font-medium'>
          Groups 
        </p>       
      </div>

      <div className='border-t border-gray-300'>
        <h1 className='font-medium text-gray-500 mt-1 ml-1'>
          Your shortcuts
        </h1>
        <div>
          {groups?.map((group) => (
            <div key={group._id} className='flex items-center mb-1 py-2 px-2 hover:bg-gray-200 rounded-lg cursor-pointer'
              onClick={()=> handleGetGroup(group._id)}
            >
              <img className='w-10 h-10 rounded-md object-cover'
                src={group.avatar}
                alt=''
              />
              <h1 className='font-medium text-[15px] ml-3'>
                {group.name}  
              </h1> 
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftBar