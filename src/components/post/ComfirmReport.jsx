import React from 'react'

const ComfirmReport = ({setNotiSuccess, reportPostSuccess, reportUserSuccess, reportGroupSuccess, setReportUserSuccess, setReportPostSuccess, setReportGroupSuccess }) => {
    const handleCloseModal = () => {
        setNotiSuccess();
        setReportUserSuccess();
        setReportPostSuccess();
        setReportGroupSuccess();
    }
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-85 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh]">
            <div className='flex flex-col items-center py-4'>
                <img className='w-8 h-8'
                    src={require("../../assets/icons/check-button.png")}
                    alt=''
                />
                <h1 className='text-[19px] font-bold mt-2 mb-1'>
                    Thanks for letting us know
                </h1>
                <p className='px-3 text-gray-600'>
                    We use your feedback to help our systems learn when something's
                </p>
                <p className='text-gray-600'>
                    not right.
                </p>
            </div>
            <div className='px-5 flex items-center'>
                <img className='w-5 h-5 mr-4'
                    src={require("../../assets/icons/tick.png")}
                    alt=''
                />
                <div>
                    <h3 className='font-medium'>
                        Reported to admin
                    </h3>
                    {reportPostSuccess && ! reportUserSuccess && !reportGroupSuccess && (
                        <p className='text-[14px] text-gray-600'> 
                            You notified an admin about this post.
                        </p>                        
                    )}
                    {!reportPostSuccess && reportUserSuccess && !reportGroupSuccess && (
                        <p className='text-[14px] text-gray-600'> 
                            You notified an admin about this profile.
                        </p>                        
                    )}
                    {!reportPostSuccess && !reportUserSuccess && reportGroupSuccess && (
                        <p className='text-[14px] text-gray-600'> 
                            You notified an admin about this group.
                        </p>                        
                    )}
                </div>
            </div>
            <div className='p-2 px-3 pt-6'>
                <button className='bg-customBlue hover:bg-blue-600 w-full text-white font-medium py-1 pb-1.5 rounded-lg'
                    onClick={handleCloseModal}
                >
                    Done
                </button>                
            </div>
        </div>
    </div>
  )
}

export default ComfirmReport