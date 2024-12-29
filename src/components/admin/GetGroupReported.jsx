import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteGroup, getReportGroups, keepGroup } from '../../api/admin/admin'
import GetDetailReportGroups from './GetDetailReportGroups'
import LoadingSpinner from '../spinner/LoadingSpinner'

const GetGroupReported = () => {
    const user = useSelector((state) => state.auth.login?.currentUser)
    const groups = useSelector((state) => state.admin.groups)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [showDetailReport, setShowDetail] = useState(false)

    const [showModal, setShowModal] = useState(null); 

    const handleShowComfirmDelete = (group) => {
        setShowModal(true)
        setSelectedGroup(group)
    }

    const handleCancel = () => {
        setShowModal(false)
        setSelectedGroup(null) 
        setShowDetail(false)   
    }

    const handleShowDetail = (post) => {
        setShowDetail(true)
        setSelectedGroup(post)
    }

    const handleGetGroups = async() => {
        try {
            await getReportGroups(user?.token, dispatch);
        } catch (error) {
            console.log(error)
        }
    }

    const handleKeepGroup = async (groupId) => {
        try {
            await keepGroup(user?.token, groupId)
            handleGetGroups();
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePost = async (groupId) => {
        setLoading(true)
        try {
            await deleteGroup(user?.token, groupId)
            handleGetGroups();
            handleCancel();
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

    /* eslint-disable */
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        if(user?.token) {
            handleGetGroups()
        }
    },[])
  return (
    <div>
        <div className='flex w-full h-[8vh] bg-white shadow items-center fixed z-10'>
            <h1 className='text-2xl font-bold ml-[5vw]'>
                Number of reported groups  ·
            </h1> 
            <p className='text-2xl font-bold ml-2 text-gray-500'>
                {groups?.length}
            </p>       
        </div>
        <div className='py-[9vh]'>
            {groups?.map((group) => (
                <div key={group._id}
                    className='flex items-center justify-center'
                >
                    <div className='w-2/3 bg-white border border-gray-100 shadow-sm rounded-md mb-3'>
                        <div className='border-b mx-3 py-2 text-gray-500'>
                            This group has been reported.
                            <span className='text-customBlue text-[13px] ml-2 border-b border-customBlue italic cursor-pointer hover:text-purple-700 hover:border-purple-700'
                                onClick={()=> handleShowDetail(group)}
                            >
                                detail
                            </span>
                        </div> 
                        <div className='flex-1 flex items-center mx-3 my-2.5 '>
                            <div className='w-10 h-10 cursor-pointer'
                                // onClick={()=> handleGetUser(user._id)}
                            >
                                <img className='h-full w-full object-cover rounded-lg shadow'
                                    src={group?.avatar}
                                    alt=''
                                />
                            </div>  
                            <div className='ml-3 cursor-pointer'
                                // onClick={()=> handleGetUser(user._id)}
                            >
                                <h1 className='font-medium text-base'>
                                    {group?.name}
                                </h1>
                            </div> 
                            <div className='flex-1'></div>
                            <div>
                                <div className='flex items-center justify-center'>
                                    <button className='bg-customBlue hover:bg-blue-600 font-medium mr-2 w-1/2 py-1 pb-1.5 px-8 rounded-md text-white'
                                        onClick={() => handleKeepGroup(group._id)}
                                    >
                                        Keep
                                    </button>
                                    <button className='bg-gray-200 hover:bg-gray-300 font-medium ml-2 w-1/2 py-1 pb-1.5 px-5 rounded-md'
                                        onClick={() => handleShowComfirmDelete(group)}
                                    >
                                        Remove
                                    </button>
                                </div>                            
                            </div>                                                    
                        </div>
                        {showModal && selectedGroup?._id === group?._id && (
                            <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                                <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                                    <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                        Delete {selectedGroup?.name} group
                                    </h2>
                                    <p className='text-sm text-gray-600 mb-5'>
                                        Are you sure you want to delete this group?
                                    </p>
                                    {loading ? (
                                        <div className='flex justify-center'>
                                            <LoadingSpinner/>
                                        </div>
                                    ):(
                                        <div className='flex justify-end space-x-4'>
                                            <button 
                                                className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300' 
                                                onClick={()=> handleCancel()}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' 
                                                    onClick={() => handleDeletePost(selectedGroup?._id)}
                                                >
                                                Delete
                                            </button>
                                        </div>                                        
                                    )}
                                </div>
                            </div>
                        )}
                        {showDetailReport && selectedGroup?._id === group?._id && (
                            <GetDetailReportGroups
                                user={user}
                                group={group}
                                isClose={()=> handleCancel()}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default GetGroupReported