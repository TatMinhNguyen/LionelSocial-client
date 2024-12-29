import React, { useEffect, useState } from 'react'
import { getDetailReportGroup } from '../../api/admin/admin'

const GetDetailReportGroups = ({user, group, isClose}) => {
    const [data, setData] = useState([])

    const handleGetReport = async() => {
        try {
            const res = await getDetailReportGroup(user?.token, group?._id)
            setData(res);
        } catch (error) {
            console.log(error)
        }
    }

    /* eslint-disable */
    useEffect(() => {
        if(user?.token) {
            handleGetReport()
        }
    },[])
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg h-[80vh]">
            <div className="flex justify-end items-center p-3 py-2">
                <h3 className="text-lg font-medium flex-1 flex items-center justify-center text-center">
                    Detailed report of the group {group?.name}
                </h3>
                <button  onClick={()=> isClose()}
                    className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                >
                    <img  
                        src={require('../../assets/icons/close.png')}
                        alt='Earth'
                        className='w-4 h-4 '
                    />
                </button>
            </div>
            <div>
                {data?.map((report) => (
                    <div key={report._id}>
                        <div className='pl-4 pr-1 pt-4 pb-1 flex items-center'>
                            <div className='w-9 h-9 overflow-hidden rounded-full'>
                                <img
                                    className='h-full w-full object-cover rounded-full shadow hover:opacity-90'
                                    src={report?.author?.authorAvatar}
                                    alt=''
                                />
                            </div>  
                            <div className='w-11/12'>
                                <p className='text-sm text-gray-500 ml-2'>
                                    <strong className='font-medium text-black mr-0.5'>
                                        {report.author.authorName}    
                                    </strong>  reported this group for  
                                    {report.type === 1 ? (
                                        <strong className='font-medium pl-1.5 text-black'>
                                            nudity or sexual activity.
                                        </strong>                                  
                                    ) : report.type === 2 ? (
                                        <strong className='font-medium pl-1.5 text-black'>bullying or harassment.</strong>
                                    ) : report.type === 3 ? (
                                        <strong className='font-medium pl-1.5 text-black'>suicide, self-injury or eating disorders.</strong>
                                    ) : report.type === 4 ? (
                                        <strong className='font-medium pl-1.5 text-black'>violence, hate or exploitation.</strong>
                                    ) : report.type === 5 ? (
                                        <strong className='font-medium pl-1.5 text-black'>selling or promoting restricted items.</strong>
                                    ) : report.type === 6 ? (
                                        <strong className='font-medium pl-1.5 text-black'>scam, fraud or impersonation.</strong>
                                    ) : report.type === 7 ? (
                                        <strong className='font-medium pl-1.5 text-black'>false information.</strong>
                                    ) : (
                                        <strong className='font-medium pl-1.5 text-black'>intellectual property.</strong>
                                    )}  
                                </p>    
                            </div>                            
                        </div>
                        {report.content !== '' && (
                            <div className='flex mx-4 ml-12 border border-red-200 p-2'>
                                <h1 className='text-[13px] mr-1'>
                                    Comment: 
                                </h1>
                                <p className='text-[13px]'>{report.content}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>            
        </div>
    </div>
  )
}

export default GetDetailReportGroups