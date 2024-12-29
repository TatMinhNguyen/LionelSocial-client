import React, { useEffect, useState } from 'react'
import NavBar from '../navbar/NavBar'
import { useDispatch, useSelector } from 'react-redux'
import ViewAdminGroup from './ViewAdminGroup'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { getAGroup } from '../../api/group/group'

const GetViewGroup = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)
  const { groupId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [group, setGroup] = useState({})

  const handleGetAGroup = async () => {
      try {
          const result = await getAGroup(user?.token, groupId , dispatch, navigate)
          setGroup(result)
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
    <div className={`bg-gray-100 min-h-screen ${group?.createId === user?.userId ? '' : 'flex-1 flex justify-center'}`}>
      <div className='fixed top-0 w-full z-50'>
        <NavBar
          user={user}
        />
      </div>
      {group?.createId === user?.userId ? (
        <div className='h-full pt-16 flex'>
          <div className='w-1/4 bg-white fixed h-full -mt-3 shadow-2xl px-2 py-4'>
            <ViewAdminGroup/>
          </div>
          <div className='flex-1'></div>
          <div className='w-3/4 -mt-2.5'>
            <Outlet/>
          </div>
        </div>         
      ) : (
        <div className='pt-16 w-3/4'>
          <Outlet/>
        </div>
      )}
     
    </div>
  )
}

export default GetViewGroup