import React, { useState } from 'react'
import LoadingSpinner from '../spinner/LoadingSpinner';
import { reportGroup } from '../../api/group/group';
import { useNavigate } from 'react-router-dom';

const ReportGroup = ({isCloseModal, user, groupId, setNotiSuccess}) => {
    const [type, setType] = useState(null)
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleReportGroup = async() => {
        const data = {
            content: content,
            type: type
        }
        setLoading(true)
        try {
            await reportGroup(user?.token, groupId, data, navigate)
            isCloseModal()
            setNotiSuccess()
            setContent('')
            setType(null)
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className='bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh]'>
            <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-xl font-bold flex-1 flex items-center justify-center">Report group</h3>
                <button onClick={()=>isCloseModal()} 
                    className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                >
                    <img  
                        src={require('../../assets/icons/close.png')}
                        alt='Earth'
                        className='w-5 h-5 '
                    />
                </button>
            </div>
            <div className='py-2 px-2'>
                <h1 className='text-lg font-bold mx-2 mb-2'>
                    Why are you reporting this group?
                </h1>
                <div className="flex flex-col">
                    <label className="flex items-center justify-between my-0.5 py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <span className='text-[17px] font-medium'>Nudity or sexual activity</span>
                        <input
                            type="radio"
                            value="1"
                            checked={type === 1}
                            onChange={() => setType(1)}
                            className="ml-2 w-4 h-4"
                        />
                    </label>
                    <label className="flex items-center justify-between my-0.5 py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <span className='text-[17px] font-medium'>Bullying or harassment</span>
                        <input
                            type="radio"
                            value="2"
                            checked={type === 2}
                            onChange={() => setType(2)}
                            className="ml-2 w-4 h-4"
                        />
                    </label>
                    <label className="flex items-center justify-between my-0.5 py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <span className='text-[17px] font-medium'>Suicide, self-injury or eating disorders</span>
                        <input
                            type="radio"
                            value="3"
                            checked={type === 3}
                            onChange={() => setType(3)}
                            className="ml-2 w-4 h-4"
                        />
                    </label>
                    <label className="flex items-center justify-between my-0.5 py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <span className='text-[17px] font-medium'>Violence, hate or exploitation</span>
                        <input
                            type="radio"
                            value="4"
                            checked={type === 4}
                            onChange={() => setType(4)}
                            className="ml-2 w-4 h-4"
                        />
                    </label>
                    <label className="flex items-center justify-between my-0.5 py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <span className='text-[17px] font-medium'>Selling or promoting restricted items</span>
                        <input
                            type="radio"
                            value="5"
                            checked={type === 5}
                            onChange={() => setType(5)}
                            className="ml-2 w-4 h-4"
                        />
                    </label>
                    <label className="flex items-center justify-between my-0.5 py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <span className='text-[17px] font-medium'>Scam, fraud or impersonation</span>
                        <input
                            type="radio"
                            value="6"
                            checked={type === 6}
                            onChange={() => setType(6)}
                            className="ml-2 w-4 h-4"
                        />
                    </label>
                    <label className="flex items-center justify-between my-0.5 py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <span className='text-[17px] font-medium'>False information</span>
                        <input
                            type="radio"
                            value="7"
                            checked={type === 7}
                            onChange={() => setType(7)}
                            className="ml-2 w-4 h-4"
                        />
                    </label>
                    <label className="flex items-center justify-between my-0.5 py-2 px-2 rounded-md hover:bg-gray-200 cursor-pointer">
                        <span className='text-[17px] font-medium'>Intellectual property</span>
                        <input
                            type="radio"
                            value="8"
                            checked={type === 8}
                            onChange={() => setType(8)}
                            className="ml-2 w-4 h-4"
                        />
                    </label>
                </div>
                <div className='mx-1'>
                    <textarea
                        id='content'
                        name='content'
                        rows={2}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className='flex-grow w-full px-2 py-2 rounded mt-1 bg-gray-100 overflow-hidden
                                        focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-100'
                        style={{resize: 'none'}}
                        placeholder="Write your comment here..."
                    />
                </div>                
            </div>
            <div className="p-2 px-3 pt-0">
                {loading ? (
                    <div className="flex justify-center">
                        <LoadingSpinner/>
                    </div>
                ) : (
                    <button
                        onClick={handleReportGroup}
                        className={`w-full text-white font-medium py-2 px-4 rounded-lg ${type ? 'bg-customBlue' : 'bg-blue-300'}`}
                        disabled={!(type)}
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}

export default ReportGroup