import React from 'react'

const ShowModal = ({modalRef, modalPosition, user, post, group, isAbove, handleEditModal, handleShowComfirmDelete, handleReportModal, handleReportUser, handleReportPostGroup}) => {
  return (
    <div
        ref={modalRef}
        className='absolute w-[350px] bg-white border border-gray-200 rounded-md shadow-2xl z-10'
        style={{
            top: modalPosition.top,
            left: modalPosition.left,
        }}                       
    >
        <div className='relative'>
            <div
                className={`absolute transform rotate-45 w-4 h-4 bg-white border-gray-200 ${
                    isAbove ? 'bottom-[-7px] border-b border-r' : 'top-[-8px] border-l border-t'
                } left-[330px]`}>
            </div>
            <div className='py-2.5 px-2 '>
                {user?.userId === post?.author?.authorId && (
                    <div className='flex hover:bg-gray-100 px-2 py-1 rounded'
                        onClick={() => handleEditModal()}
                    >
                        <img className='w-5 h-5 mr-3 mt-1.5'
                            src={require('../../assets/icons/edit1.png')}
                            alt=''
                        />
                        <p className='py-1 font-medium cursor-pointer text-black'>Edit post </p>
                    </div>                                            
                )}
                {user?.userId !== post?.author?.authorId && user?.userId !== group?.createId && user?.isAdmin === false && !post?.groupId && (
                    <>
                        <div className='flex hover:bg-gray-100 px-2 py-1 rounded'
                            onClick={() => handleReportModal()}
                        >
                            <img className='w-5 h-5 mr-3 mt-2'
                                src={require('../../assets/icons/report-post.png')}
                                alt=''
                            />
                            <p className='py-1 font-medium cursor-pointer text-black'>Report post </p>
                        </div>   
                        <div className='flex hover:bg-gray-100 px-2 py-1 rounded'
                            onClick={() => handleReportUser()}
                        >
                            <img className='w-5 h-5 mr-3 mt-2'
                                src={require('../../assets/icons/user-report.png')}
                                alt=''
                            />
                            <p className='py-1 font-medium cursor-pointer text-black'>Report profile </p>
                        </div>                 
                    </>                           
                )}
                {user?.userId !== post?.author?.authorId && user?.userId !== group?.createId && user?.isAdmin === false && post?.groupId && (
                    <>
                        <div className='flex hover:bg-gray-100 px-2 py-1 rounded'
                            onClick={() => handleReportPostGroup()}
                        >
                            <img className='w-5 h-5 mr-3 mt-2'
                                src={require('../../assets/icons/report-post.png')}
                                alt=''
                            />
                            <p className='py-1 font-medium cursor-pointer text-black'>Report post to group admin</p>
                        </div>                  
                    </>                           
                )}
                {(user?.userId === post?.author?.authorId || user?.userId === group?.createId || user?.isAdmin) && (
                    <div className='flex hover:bg-red-50 px-2 py-1 rounded'
                            onClick={() => handleShowComfirmDelete()}
                    >
                        <img className='w-5 h-5 mr-3 mt-1.5'
                            src={require('../../assets/icons/delete.png')}
                            alt=''
                        />
                        <p className='py-1 font-medium cursor-pointer text-red-600'>Delete post </p>
                    </div>                                        
                )}
            </div>                         
        </div>
    </div>
  )
}

export default ShowModal