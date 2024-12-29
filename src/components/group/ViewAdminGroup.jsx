import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAGroup } from '../../api/group/group';

const ViewAdminGroup = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)
  const group = useSelector((state) => state.group.group)

  const { groupId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();

  const handleGetAGroup = async () => {
      try {
          await getAGroup(user?.token, groupId, dispatch, navigate)
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
          handleGetAGroup()
      }
  },[])
  return (
    <div>
      <div className='flex items-center border-b border-gray-200 pb-3'>
        <img className='h-12 w-12 object-cover rounded-md shadow'
          src={group?.avatar}
          alt=''
        />   
        <div className='ml-3'>
          <h3 className='font-medium text-[15px]'>
            {group?.name}
          </h3>
          {group?.type === false ? (
            <div className='flex '>
                <img className='w-3 h-3 opacity-60 mt-1'
                    src={require('../../assets/icons/padlock.png')}
                    alt=''
                />
                <p className='ml-2 text-[13px] text-gray-600 mr-1'>
                    Private group
                </p>
                <p className='text-gray-500 font-medium text-[13px]'>
                    . {group?.members?.length} members
                </p>                            
            </div>            
          ) : (
            <div className='flex '>
                <img className='w-3.5 h-3.5 opacity-60 mt-[3.5px]'
                    src={require('../../assets/icons/earth.png')}
                    alt=''
                />
                <p className='ml-2 text-[13px] text-gray-600 mr-1'>
                    Public group
                </p>
                <p className='text-gray-500 font-medium text-[13px]'>
                    . {group?.members?.length} members
                </p>                            
            </div>
          )}
        </div>          
      </div>
      <div className='mt-3'>
        <div className={`flex items-center px-2 py-2 rounded-md mb-1 cursor-pointer 
          ${(location.pathname === `/groups/${groupId}` || location.pathname === `/groups/${groupId}/members`) ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'}`}
          onClick={() => navigate(`/groups/${groupId}`)}
        >
          {(location.pathname === `/groups/${groupId}` || location.pathname === `/groups/${groupId}/members`) ? (
            <img className='w-5 h-5'
              src={require('../../assets/icons/home1.png')}
              alt=''
            />
          ) : (
            <img className='w-5 h-5'
              src={require('../../assets/icons/home.png')}
              alt=''
            />
          )}
          <p className={`ml-3 text-[16px] font-medium ${(location.pathname === `/groups/${groupId}` || location.pathname === `/groups/${groupId}/members`) ? 'text-customBlue' : ''}`}>
            Community home
          </p>
        </div>
        <div className={`flex items-center px-2 py-2 rounded-md mb-1 cursor-pointer ${location.pathname === `/groups/${groupId}/member-requests` ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'}`}
          onClick={() => navigate(`/groups/${groupId}/member-requests`)}
        >
          {location.pathname === `/groups/${groupId}/member-requests` ? (
            <div
              className="xtwfq29"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#0866FF',
                maskImage: `url(${require('../../assets/icons/request1.png')})`,
                maskSize: '20px 20px',
                maskPosition: '0px 0px',
              }}
            ></div>
          ) : (
            <img className='w-5 h-5'
              src={require('../../assets/icons/request.png')}
              alt=''
            />
          )}
          <p className={`ml-3 text-[16px] font-medium ${location.pathname === `/groups/${groupId}/member-requests` ? 'text-customBlue' : ''}`}>
            Members requests
          </p>
        </div>
        {/* <div className={`flex items-center px-2 py-2 rounded-md mb-1 cursor-pointer ${location.pathname === `/groups/${groupId}/pending-posts` ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'}`}
          onClick={() => navigate(`/groups/${groupId}/pending-posts`)}
        >
          {location.pathname === `/groups/${groupId}/pending-posts` ? (
            <div
              className="xtwfq29"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#0866FF',
                maskImage: `url(${require('../../assets/icons/post1.png')})`,
                maskSize: '20px 20px',
                maskPosition: '0px 0px',
              }}
            ></div>
          ) : (
            <img className='w-5 h-5'
              src={require('../../assets/icons/post.png')}
              alt=''
            />
          )}
          <p className={`ml-3 text-[16px] font-medium ${location.pathname === `/groups/${groupId}/pending-posts` ? 'text-customBlue' : ''}`}>
            Pending approvals
          </p>
        </div> */}
        <div className={`flex items-center px-2 py-2 rounded-md mb-1 cursor-pointer ${location.pathname === `/groups/${groupId}/reported-posts` ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'}`}
          onClick={() => navigate(`/groups/${groupId}/reported-posts`)}
        >
          {location.pathname === `/groups/${groupId}/reported-posts` ? (
            <div
              className="xtwfq29"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#0866FF',
                maskImage: `url(${require('../../assets/icons/report-post.png')})`,
                maskSize: '20px 20px',
                maskPosition: '0px 0px',
              }}
            ></div>
          ) : (
            <img className='w-5 h-5'
              src={require('../../assets/icons/report.png')}
              alt=''
            />
          )}
          <p className={`ml-3 text-[16px] font-medium ${location.pathname === `/groups/${groupId}/reported-posts` ? 'text-customBlue' : ''}`}>
            Member-reported content 
          </p>
        </div>
      </div>
     
    </div>
  )
}

export default ViewAdminGroup