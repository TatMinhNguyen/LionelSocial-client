import React, { useState } from 'react'

import { Link, useNavigate, } from "react-router-dom";
import { forgotPass } from '../../../api/auth/auth';
import { useDispatch } from 'react-redux';

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [data, setData] = useState(null)

    const [isEmailFocused, setIsEmailFocused] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        const newEmail = {
            email: email
        }
        try {
            const res = await forgotPass(newEmail, dispatch, navigate)
            setData(res)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='bg-gray-100 h-screen'>
        <div className='flex h-full'>
            <div className="flex-1 flex items-center justify-center" style={{ flex: '45%' }}>
                <img className='h-screen object-fill'
                    src={require('../../../assets/images/Frame1.png')} 
                    alt="Ảnh của tôi" 
                />                
            </div>
            <div className="flex-1  flex items-center" style={{ flex: '55%' }}>
                <div className='w-5/6 h-[86vh] min-h-96 bg-white border border-white rounded-2xl shadow-xl p-4 mb-[3vh]'>
                    <div className='flex-1 flex items-center justify-center pt-[5vh] mb-8'>
                        <h1 className='text-center text-3xl font-medium'>
                            Forgotten password
                        </h1>
                    </div>
                    <div className='flex-1 flex items-center mb-0 px-[14vh]'>
                        <p className=' text-gray-500 text-sm'>
                            Please enter your email address to reset your account password.
                        </p>
                    </div>                    
                    <div className="p-4 px-[14vh]" >
                        <div className="relative mb-4 mt-[2vh]">
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setIsEmailFocused(true)}
                                onBlur={() => setIsEmailFocused(email !== "")}
                                className="w-full px-3 pt-3.5 pb-1 border border-gray-200 rounded-md focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-300"
                            />
                            <label
                                htmlFor="email"
                                className={`absolute left-3 transition-all ${
                                isEmailFocused || email !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                                } text-gray-500`}
                            >
                                Enter your email
                            </label>
                        </div>
                        {data ? (
                            <div>
                               <div className='ml-1'>
                                    <p className='text-gray-600 mb-2'>
                                        Account email is {data?.email}
                                    </p>
                                    <p className='text-gray-600 mb-2 flex'>
                                        New password is <p className='font-medium text-black ml-1.5'>{data?.newPassword}</p>
                                    </p>
                                </div>
                                <Link className='flex-1 flex items-center justify-center mt-10 '
                                    to = '/login'
                                >
                                    <p className='text-customBlue text-lg font-medium border-b border-customBlue hover:text-purple-700 hover:border-purple-700'>
                                        Sign in now
                                    </p>
                                </Link>                               
                            </div>                         
                        ) : (
                            <div className='flex justify-end mt-[40vh]'>
                                <div className='flex space-x-4'>
                                    <Link className='w-[10vh] bg-gray-400 text-white px-3 py-2 rounded-xl font-medium hover:bg-gray-600'
                                            to = "/login"
                                    >
                                        Cancel
                                    </Link>
                                    <button type="submit" onClick={handleForgotPassword}
                                        className="w-[10vh] bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700">
                                        Next
                                    </button>                                
                                </div>
                            </div>                            
                        )}

                    </div>
                </div>
            </div>  
        </div>
    </div>
  )
}

export default ForgotPassword