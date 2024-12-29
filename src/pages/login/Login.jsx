import React, { useState } from 'react'

import { Link, useNavigate, } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from '../../api/auth/auth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const newUser = {
                email : email,
                password : password
            }
            await loginUser(newUser, dispatch, navigate)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='bg-gray-100 h-screen'>
            <div className='h-full flex-1 flex items-center justify-center'>
                {/* <div className="flex-1 flex items-center justify-center" style={{ flex: '45%' }}>
                    <img className='h-screen object-fill'
                        src={require('../../assets/images/Frame1.png')} 
                        alt="Ảnh của tôi" 
                    />
                </div> */}
                <div className="flex items-center justify-center w-1/2">
                    <div className=' h-[86vh] min-h-96 bg-white border border-white rounded-2xl shadow-xl p-4'>
                        <div className='flex-1 flex flex-col items-center justify-center py-[1vh]'>
                            <h1 className='text-center text-3xl font-medium mb-3'>
                                See more on Lionelsocial
                            </h1>
                            <img
                                src={require('../../assets/images/logo.png')}
                                alt=''
                                className='w-32 h-32'
                            />
                        </div>
                        <form className="p-4 px-[50px]" onSubmit={handleLogin}>
                            <div className="relative mb-5 mt-[2vh]">
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
                            <div className="relative mb-3">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(password !== "")}
                                    className="w-full px-3 pt-3.5 pb-1 border border-gray-200 rounded-md focus:outline-none focus:border-gray-200 focus:ring-1 focus:ring-gray-300"
                                />
                                <label
                                    htmlFor="password"
                                    className={`absolute left-3 transition-all ${
                                    isPasswordFocused || password !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                                    } text-gray-500`}
                                >
                                    Enter your password
                                </label>
                            </div>
                            <div className=' flex items-center'>
                                <div className='flex-1'></div>                               
                                <div className='text-blue-600 text-sm font-medium my-1 hover:text-blue-800'>
                                    <Link to = "/reset-password">
                                        Forgotten password ?
                                    </Link>                                
                                </div>
                            </div> 
                            {/* <div className=' flex items-center'>
                                <div className='flex-1'></div>
                                <div>
                                    <Link className='text-gray-500 border-b border-gray-400 font-medium my-2 text-sm hover:text-blue-900 hover:border-blue-900'
                                            to = "/get-verify-code"
                                    >
                                        Forgot verification code ?
                                    </Link>                                
                                </div> 
                            </div>                              */}
                            <div className='flex-1 flex items-center justify-center mt-20'>
                                <button type="submit" 
                                    className="w-[40vh] bg-customBlue text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-500"
                                >
                                    Log In
                                </button>                                
                            </div>
                        </form>

                        <div className='flex-1 flex items-center justify-center mt-[0vh]'>
                            <div className='text-gray-400'>
                                __________________________
                            </div>
                            <div className='mx-[5vh] mt-2 text-gray-500 font-medium text-base'>
                                Or
                            </div>
                            <div className='text-gray-400'>
                                __________________________
                            </div>
                        </div>
                        <div className='flex-1 flex items-center justify-center mt-[4vh]'>
                            <div>
                                Don't have an account yet?
                            </div>
                            <div className='ml-1 hover:border-blue-600'>
                                <Link className='text-customBlue hover:text-blue-700 py-0 rounded-xl font-medium '
                                    to="/register"
                                >
                                    Create a new account
                                </Link>                                
                            </div>                           
                        </div>
                    </div>
                </div>
            </div>        
        </div>
    );     
}

export default Login