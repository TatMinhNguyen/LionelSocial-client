import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, setVeryficationCode } from '../../../api/auth/auth';

const VerifyCode = () => {
    const verificationCode = useSelector((state) => state.auth.verificationCode);
    const email = useSelector((state) => state.auth.user?.email)
    const password = useSelector((state) => state.auth.user?.password)

    const [code, setCode] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleVerifyAccount = async(e) => {
        e.preventDefault();
        try {
            const newCode = {
                email : verificationCode.email,
                verificationCode : code,
            }
            const newUser = {
                email : email,
                password : password
            }
            await setVeryficationCode(newCode, dispatch, navigate)
            await loginUser(newUser, dispatch, navigate)
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
                    <div className='flex-1 flex items-center justify-center pt-[5vh]'>
                        <h1 className='text-center text-3xl font-medium'>
                            Verification code
                        </h1>
                    </div>
                    <div className='mt-[5vh]'>
                        <div className='px-[14vh]'>
                            <p className='text-[16px] text-gray-700'>
                                Your verification code has been sent to the email:  
                            </p>
                            <p className='text-black text-base font-medium'>
                                {verificationCode.email}
                            </p>
                        </div>
                        {/* <div className='flex-1 flex items-center px-[15vh] mt-4'>
                            <p className='text-center text-gray-700 text-base'>
                                Enter it below to verify account:
                            </p>
                        </div> */}
                    </div>
                    <form className="p-4 px-[14vh]" onSubmit={handleVerifyAccount}>
                        <div className="mb-5 mt-[0vh]">
                            <input
                                type="text"
                                id="code"
                                name="code"
                                placeholder="Enter your verify code" 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-300"
                            />
                        </div>
                        <div className='flex-1 flex items-center justify-center mb-6'>
                            <p className='text-center text-gray-500 text-sm'>
                                You will officially join our community when you enter the verification code and press enter.
                            </p>
                        </div>
                        <div className='flex-1 flex items-center justify-center'>
                            <button type="submit" 
                                className="w-[40vh] bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700"
                            >
                                Next
                            </button>                                
                        </div>
                        <div className='flex-1 flex items-center justify-center mt-4 text-gray-500 font-medium text-base'>
                            <Link to = "/get-verify-code">
                                Can you send me the verification code again?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>  
        </div>
    </div>
  )
}

export default VerifyCode