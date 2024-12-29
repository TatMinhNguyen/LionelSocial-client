import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate, } from "react-router-dom";
import NavBar from '../../components/navbar/NavBar'
import { getMyProfile } from '../../api/profile/profile';
import RightBar from '../../components/rightbar/RightBar';
import LeftBar from '../../components/leftbar/LeftBar';
import { clearGroup } from '../../redux/groupSlice';

const Home = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)
  const profile = useSelector((state) => state?.auth?.profile)

  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGetProfile = async () => {
    try {
      await getMyProfile(user?.token,dispatch, navigate)
    } catch (error) {
      console.error('Errors:', error);
    }
  }

  /* eslint-disable */
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if(user?.token) {
      handleGetProfile();
      dispatch(clearGroup())
    }
  }, []);

  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='fixed top-0 w-full z-50'>
        <NavBar 
          user={user}
        />
      </div>
      <div className='flex h-full pt-[70px]'>
        <div className='fixed ml-3' style={{ flex: '30%' }}>
          <LeftBar
            profile={profile}
            user={user}
          />
        </div>
        <div className='mx-[30%]' style={{ flex: '40%' }}>
          <div className='h-12 bg-white border border-white shadow rounded-md flex-1 flex items-center'>
            <div className='w-1/2 flex-1 flex items-center justify-center cursor-pointer'
              onClick={() => navigate('/')}
            >
              <p className={`text-lg font-bold ${location.pathname === '/' && 'py-2 border-b-4 border-b-blue-500'} `}>
                For you
              </p>
            </div>
            <div className='w-1/2 flex-1 flex items-center justify-center cursor-pointer'
              onClick={() => navigate(`/friends's-posts`)}
            >
              <p className={`text-lg font-bold py-2 ${location.pathname === `/friends's-posts` && 'py-2 border-b-4 border-b-blue-500'}`}>
                Friends's
              </p>
            </div>
          </div>
          <Outlet/>

        </div>
        <div className='fixed right-0' style={{ flex: '30%' }}>
          <RightBar
            user={user}
          />
        </div>
      </div>
    </div>
  )
}

export default Home