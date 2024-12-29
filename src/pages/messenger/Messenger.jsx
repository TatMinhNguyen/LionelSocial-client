import React from 'react'
import NavBar from '../../components/navbar/NavBar'
import { useSelector } from 'react-redux'
import GetChats from '../../components/messenger/GetChats'
import { Outlet} from 'react-router-dom'
const Messenger = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)
  
  return (
    <div className='bg-gray-100 min-h-screen overflow-y-scroll '>
      <div className='fixed top-0 w-[calc(100vw-15px)] z-50'>
        <NavBar 
            user={user}
        />
      </div>
      <div className='pt-16 mt-2 flex overflow-hidden pr-3 pl-2 pb-1 max-h-[99vh]'>
        <div className='w-1/3 bg-white rounded-lg shadow mr-5 h-[calc(98vh-72px)] overflow-y-auto'>
          <GetChats/>
        </div>
        <div className='w-2/3 bg-white rounded-lg shadow h-[calc(98vh-72px)] overflow-y-auto'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Messenger