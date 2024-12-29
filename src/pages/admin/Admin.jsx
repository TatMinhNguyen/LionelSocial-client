import React from 'react'
import NavBar from '../../components/navbar/NavBar'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Admin = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='bg-gray-100 min-h-screen'>
        <div className='fixed top-0 w-full z-20'>
            <NavBar
            user={user}
            />
        </div>  
        <div className='h-full pt-16 flex'>
            <div className='w-1/4 bg-white fixed h-full -mt-3 shadow-2xl px-2 py-4'>
                <div>
                    <h1 className='font-bold text-2xl ml-1 pb-3'>
                        Admin
                    </h1>
                </div>
                <div className='mt-3'>
                    <div className={`flex items-center px-2 py-2 rounded-md mb-1 cursor-pointer ${location.pathname === `/admin/reported-posts` ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'}`}
                        onClick={() => navigate(`/admin/reported-posts`)}
                    >
                        {location.pathname === `/admin/reported-posts` ? (
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
                        <p className={`ml-3 text-[16px] font-medium ${location.pathname === `/admin/reported-posts` ? 'text-customBlue' : ''}`}>
                            Reported posts
                        </p>
                    </div>
                    <div className={`flex items-center px-2 py-2 rounded-md mb-1 cursor-pointer ${location.pathname === `/admin/reported-users` ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'}`}
                        onClick={() => navigate(`/admin/reported-users`)}
                    >
                        {location.pathname === `/admin/reported-users` ? (
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
                        <p className={`ml-3 text-[16px] font-medium ${location.pathname === `/admin/reported-users` ? 'text-customBlue' : ''}`}>
                            Reported users 
                        </p>
                    </div>

                    <div className={`flex items-center px-2 py-2 rounded-md mb-1 cursor-pointer ${location.pathname === `/admin/reported-groups` ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-200'}`}
                        onClick={() => navigate(`/admin/reported-groups`)}
                    >
                        {location.pathname === `/admin/reported-groups` ? (
                            <div
                            className="xtwfq29"
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#0866FF',
                                maskImage: `url(${require('../../assets/icons/team_blue.png')})`,
                                maskSize: '20px 20px',
                                maskPosition: '0px 0px',
                            }}
                            ></div>
                        ) : (
                            <img className='w-5 h-5'
                            src={require('../../assets/icons/team.png')}
                            alt=''
                            />
                        )}
                        <p className={`ml-3 text-[16px] font-medium ${location.pathname === `/admin/reported-groups` ? 'text-customBlue' : ''}`}>
                            Reported groups 
                        </p>
                    </div>
                </div>
            </div>
            <div className='flex-1'></div>
            <div className='w-3/4 -mt-2'>
                <Outlet/>
            </div>
        </div>      
    </div>
  )
}

export default Admin