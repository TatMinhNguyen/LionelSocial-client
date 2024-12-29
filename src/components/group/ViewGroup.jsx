import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAGroup, leaveGroup } from '../../api/group/group';
import { useDispatch, useSelector } from 'react-redux';
import { formatToMonthYear } from '../../utils';
import ChangePhoto from './ChangePhoto';
import ChangeName from './ChangeName';
import InviteMembers from './InviteMembers';
import ReportGroup from './ReportGroup';
import ComfirmReport from '../post/ComfirmReport';
import LoadingSpinner from '../spinner/LoadingSpinner';

const ViewGroup = () => {
    const user = useSelector((state) => state.auth.login?.currentUser)
    const group = useSelector((state) => state.group.group)
    const { groupId } = useParams();
    const modalRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();

    const [loading, setLoading] = useState(false);

    const [showEditPicture, setShowEditPicture] = useState(false)
    const [showEditName, setShowEditName] = useState(false)

    const [modalReport, setModalReport] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [reportGroup, setReportGroup] = useState(false)
    const [reportGroupSuccess, setReportGroupSuccess] = useState(false)
    const [notiSuccess, setNotiSuccess] = useState(false)

    const [showAddMembers, setShowAddMembers] = useState(false)

    const [showLeave, setShowLeave] = useState(false)

    const handleShowComfirmLeave = () => {
        setModalReport(false)
        setShowLeave(true)
    }

    const handleCancel = () => {
        setShowLeave(false)
      }

    const handleLeaveGroup = async () => {
        setLoading(true)
        try {
            await leaveGroup(user?.token, groupId, navigate)

            navigate(`/groups`)
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }

    const handleThreeDotsClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setModalPosition({
            top: rect.bottom + window.scrollY + 15,
            left: rect.left + window.scrollX - 80,
        });

        setModalReport(true);
    }

    const handleReportGroup = () => {
        setModalReport(false)
        setReportGroup(true)
        setReportGroupSuccess(true)
    }

    const handleGetAGroup = async () => {
        try {
            await getAGroup(user?.token, groupId, dispatch, navigate)

        } catch (error) {
            console.log(error)
        }
    }

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setModalReport(false)
        }
    };

    useEffect(() => {
        if ( modalReport) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [ modalReport]);

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
    <div className='mx-10'>
        <div className='-mt-5 bg-white shadow rounded-xl'>
            <div className='relative'>
                <img
                    className='w-full h-[60vh] object-cover rounded-xl shadow'
                    src={group?.avatar}
                    alt=''
                /> 
                {group?.createId === user?.userId && (
                    <div 
                        onClick={() => setShowEditPicture(true)}
                        className='absolute flex bottom-3 right-5 px-3 py-1.5 bg-white rounded-md shadow cursor-pointer hover:bg-gray-100'>
                        <img
                            src={require('../../assets/icons/camera-black.png')}
                            alt=''
                            className='w-5 h-5 mt-0.5 opacity-90 hover:opacity-100'
                        />   
                        <p className='font-medium ml-2'>
                            Edit photo    
                        </p> 
                    </div>                    
                )}
                
            </div>
            <div className='m-5 mb-2'>
                <h1 className='text-[24px] font-bold mb-1'>
                    {group?.name}
                </h1>
                {group?.type === false ? (
                    <div className='flex'>
                        <div className='flex '>
                            <img className='w-3.5 h-3.5 opacity-60 mt-[3px]'
                                src={require('../../assets/icons/padlock.png')}
                                alt=''
                            />
                            <p className='ml-2 text-[15px] text-gray-600 mr-1'>
                                Private group
                            </p>
                            <p className='text-gray-500 font-medium'>
                                . {group?.members?.length} members
                            </p>                            
                        </div>
                        <div className='flex-1'></div>
                        <div className='mb-3 flex'>
                            <div className='flex bg-customBlue hover:bg-blue-600 px-5 pr-6 h-10 items-center text-white font-medium rounded-md cursor-pointer'
                                onClick={() => setShowAddMembers(true)}
                            >
                                + Invite 
                            </div>
                            {group?.createId === user?.userId && (
                                <div className='flex items-center h-10 px-4 bg-gray-200 hover:bg-gray-300 rounded-md ml-2 cursor-pointer'
                                    onClick={() => setShowEditName(true)}
                                >
                                    <img className='w-5 h-5 mt-0.5'
                                        src={require('../../assets/icons/edit.png')}
                                        alt=''
                                    />
                                    <p className='font-medium ml-1'>
                                        Edit group
                                    </p>
                                </div>                                
                            )}
                            <div className='flex items-center hover:bg-gray-300 bg-gray-200 cursor-pointer px-2 py-2 rounded-md ml-3'
                                onClick={handleThreeDotsClick}
                            >
                                <img className='h-6 w-6 mt-px'
                                    src={require("../../assets/icons/menu.png")}
                                    alt=''
                                />                                                
                            </div>
                        </div>
                    </div>                    
                ) : (
                    <div className='flex'>
                        <img className='w-3.5 h-3.5 opacity-60 mt-[4px]'
                            src={require('../../assets/icons/earth.png')}
                            alt=''
                        />
                        <p className='ml-2 text-[15px] text-gray-600 mr-1'>
                            Public group
                        </p>
                        <p className='text-gray-500 font-medium'>
                            . {group?.members?.length} members
                        </p>
                        <div className='flex-1'></div>
                        <div className='mb-3 flex'>
                            <div className='flex bg-customBlue hover:bg-blue-600 px-5 pr-6 h-10 items-center rounded-md cursor-pointer'
                                onClick={() => setShowAddMembers(true)}
                            >
                                <p className='text-white font-medium'>
                                    + Invite
                                </p>
                            </div>
                            {group?.createId === user?.userId && (
                                <div className='flex items-center h-10 px-4 bg-gray-200 hover:bg-gray-300 rounded-md ml-2 cursor-pointer'
                                    onClick={() => setShowEditName(true)}
                                >
                                    <img className='w-5 h-5 mt-0.5'
                                        src={require('../../assets/icons/edit.png')}
                                        alt=''
                                    />
                                    <p className='font-medium ml-1'>
                                        Edit group
                                    </p>
                                </div>
                            )}
                            <div className='flex items-center hover:bg-gray-300 bg-gray-200 cursor-pointer px-2 py-2 rounded-md ml-3'
                                onClick={handleThreeDotsClick}
                            >
                                <img className='h-6 w-6 mt-px'
                                    src={require("../../assets/icons/menu.png")}
                                    alt=''
                                />                                                
                            </div>
                        </div>
                    </div>
                )}
                {modalReport && (
                    <div
                        ref={modalRef}
                        className='absolute w-[300px] bg-white border border-gray-200 rounded shadow-2xl z-10'
                        style={{
                            top: modalPosition.top,
                            left: modalPosition.left,
                        }}                        
                    >
                        <div className='relative'>
                            <div
                                className={`absolute transform rotate-45 w-4 h-4 bg-white border-gray-300
                                        top-[-8px] border-l border-t
                                } left-[92px]`}>
                            </div> 
                            <div className=' pt-2.5 px-2'>
                                <div className='flex hover:bg-gray-100 px-2 py-1 rounded cursor-pointer'
                                    onClick={() => handleReportGroup()}
                                >
                                    <img className='w-5 h-5 mr-3 mt-2'
                                        src={require('../../assets/icons/report-post.png')}
                                        alt=''
                                    />
                                    <p className='py-1 font-medium  text-black'>Report group </p>
                                </div>                                    
                            </div>   
                            <div className='pb-2.5 px-2'>
                                <div className='flex hover:bg-gray-100 px-2 py-1 rounded cursor-pointer'
                                    onClick={() => handleShowComfirmLeave()}
                                >
                                    <img className='w-5 h-5 mr-3 mt-2'
                                        src={require('../../assets/icons/leave.png')}
                                        alt=''
                                    />
                                    <p className='py-1 font-medium  text-black'>Leave group </p>
                                </div>                                    
                            </div>                                                           
                        </div>
                    </div>
                )}
                {reportGroup && (
                    <ReportGroup
                        user={user}
                        groupId={groupId}
                        isCloseModal = {() => setReportGroup(false)}
                        setNotiSuccess={() => setNotiSuccess(true)}                          
                    />
                )}
                {notiSuccess && (
                    <ComfirmReport
                        setNotiSuccess={() => setNotiSuccess(false)}
                        reportGroupSuccess={reportGroupSuccess}
                        setReportUserSuccess={() => setReportGroupSuccess(false)}
                        setReportPostSuccess={() => setReportGroupSuccess(false)}
                        setReportGroupSuccess={()=> setReportGroupSuccess(false)}
                    />
                )}
                {showAddMembers && (
                    <InviteMembers
                        groupId = {groupId}
                        isCloseModal = {() => setShowAddMembers(false)}
                    />
                )}
                {showEditPicture && (
                    <ChangePhoto
                        isCloseModal = {() => setShowEditPicture(false)}
                        avatar = {group?.avatar}
                        user = {user}
                        groupId = {groupId}
                    />
                )}
                {showEditName && (
                    <ChangeName
                        isCloseModal = {() => setShowEditName(false)}
                        name = {group?.name}
                        type = {group?.type}
                        user = {user}
                        groupId = {groupId}
                    />
                )}
                {showLeave && (
                    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20'>
                        <div className='w-1/3 bg-white p-4 rounded shadow-2xl border border-gray-100'>
                            <h2 className='flex justify-center text-lg italic font-semibold mb-2 pb-2 border-b border-gray-300'>
                                Leave group?
                            </h2>
                            <p className='text-sm text-gray-600 mb-5'>
                            Are you sure you want to leave {group?.name}
                            </p>
                            {loading ? (
                                <div className='flex justify-center'>
                                    <LoadingSpinner/>
                                </div>
                            ):(
                                <div className='flex justify-end space-x-4'>
                                    <button 
                                        className='bg-gray-200 px-4 py-2 rounded hover:bg-gray-300' 
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' 
                                        onClick={() => handleLeaveGroup()}
                                    >
                                        Leave group
                                    </button>
                                </div>                                        
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div className='mt-4 flex '>
            <div className='w-3/5 mr-2'>
                <div className='flex bg-white border border-white shadow rounded-md mb-3'>
                    <div className='w-1/2  flex-1 flex items-center justify-center '
                            onClick={() => navigate(`/groups/${groupId}`)}
                    >
                        <p className={`text-lg font-bold font-mono mt-2 cursor-pointer ${location.pathname === `/groups/${groupId}` ? 'border-b-4 border-b-customBlue pb-1' : 'pb-2'}`}>
                            Posts
                        </p>                                
                    </div>
                    <div className='w-1/2 flex-1 flex items-center justify-center r'
                            onClick={() => navigate(`/groups/${groupId}/members`)}
                    >
                        <p className={`text-lg font-bold font-mono mt-2 cursor-pointer ${location.pathname === `/groups/${groupId}/members` ? 'border-b-4 border-b-customBlue pb-1' : 'pb-2'}`}>
                            Members
                        </p>                                
                    </div>
                </div>
                <Outlet context={group}/>
            </div>
            <div className='w-2/5 bg-white ml-2 border border-white shadow rounded-md self-start mb-2'>
                <p className='text-xl font-bold font-sans m-2 ml-4 mb-5'>
                    About  
                </p>
                {group?.type === false ? (
                    <div className='flex mx-4'>
                        <img
                            src={require('../../assets/icons/padlock.png')}
                            alt=''
                            className='w-4 h-4 mt-0.5 opacity-90 mt-1'
                        />
                        <div className='ml-3'>
                            <h1 className='font-medium text-[16.5px]'>
                               Private 
                            </h1> 
                            <p className='text-[15px] ml-px'>
                                Only members can see who's in the group and what they post
                            </p>                            
                        </div>
                               
                    </div>                    
                ) : (
                    <div className='flex mx-4'>
                        <img
                            src={require('../../assets/icons/earth.png')}
                            alt=''
                            className='w-5 h-5 mt-0.5 opacity-90 mt-1'
                        />  
                        <div className='ml-3'>
                            <h1 className='font-medium text-[16.5px]'>
                               Public 
                            </h1> 
                            <p className='ml-px text-[15px]'>
                                Anyone can see who's in the group and what they post
                            </p>                                
                        </div>                                           
                    </div> 
                )}

                <div className='flex ml-4 my-3'>
                    <img
                        src={require('../../assets/icons/visibility.png')}
                        alt=''
                        className='w-5 h-5 mt-0.5'
                    />
                    <div className='ml-3'>
                        <h1 className='font-medium text-[16.5px]'>
                            Visible
                        </h1>
                        <p className='ml-px text-[15px]'>
                            Anyone can find this group
                        </p>                        
                    </div>

                </div>
                <div className='flex ml-4 my-3'>
                    <img
                        src={require('../../assets/icons/clock1.png')}
                        alt=''
                        className='w-5 h-5 mt-0.5'
                    />
                    <p className='ml-3 text-gray-900'>
                        Created {formatToMonthYear(group?.createdAt)} 
                    </p>
                </div>
            </div>            
        </div>
    </div>
  )
}

export default ViewGroup