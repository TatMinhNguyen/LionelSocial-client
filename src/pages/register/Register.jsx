import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import { Link, useNavigate, } from "react-router-dom";
import { registerUser } from '../../api/auth/auth';
import { setEmail, setPassword } from '../../redux/authSlice';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setCurrentEmail] = useState('');
    const [password, setCurrentPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isPasswordValid = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return password.length >= 6 && hasLetter && hasNumber;
    };

    const isUsernameValid = (username) => {
        return username.length >=5 && username.length <= 20;
    }

    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };    

    const handleRegister = async(e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const newUser = {
                username : username,
                email : email,
                password : password
            }
            await registerUser(newUser, dispatch, navigate)
            dispatch(setEmail(newUser.email));
            dispatch(setPassword(newUser.password));
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='bg-gray-100 h-screen'>
        <div className='flex h-full'>
            <div className="flex-1 flex items-center justify-center" style={{ flex: '45%' }}>
                <img className='h-screen object-fill'
                    src={require('../../assets/images/Frame1.png')} 
                    alt="Ảnh của tôi" 
                />                
            </div>
            <div className="flex-1  flex items-center" style={{ flex: '55%' }}>
                <div className='w-5/6 h-[86vh] min-h-96 bg-white border border-white rounded-2xl shadow-xl p-4 mb-[3vh]'>
                    <div className='flex-1 flex items-center justify-center pt-[5vh]'>
                        <h1 className='text-center text-3xl font-medium'>
                            Create a new account
                        </h1>
                    </div>
                    <form className="p-4 px-[14vh]" onSubmit={handleRegister}>
                        {isUsernameValid(username) === true || username === '' ? (
                            <div className="relative mb-5 mt-[2vh]">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={() => setIsUsernameFocused(true)}
                                    onBlur={() => setIsUsernameFocused(username !== "")}
                                    className="w-full px-3 pt-3.5 pb-1 border border-gray-200 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-500"
                                />
                                <label
                                    htmlFor="username"
                                    className={`absolute left-3 transition-all ${
                                    isUsernameFocused || username !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                                    } text-gray-500`}
                                >
                                    Enter your username
                                </label>                            
                            </div>                            
                        ) : (
                            <div className="relative mb-5 mt-[2vh]">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={() => setIsUsernameFocused(true)}
                                    onBlur={() => setIsUsernameFocused(username !== "")}
                                    className="w-full px-3 pt-3.5 pb-1 border border-red-500 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-red-500"
                                />
                                <label
                                    htmlFor="username"
                                    className={`absolute left-3 transition-all ${
                                    isUsernameFocused || username !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                                    } text-red-500`}
                                >
                                    Enter your username
                                </label> 
                                <div className='mt-2 flex'>
                                    <img
                                        src={require("../../assets/icons/warning.png")}
                                        alt=''
                                        className='w-4 h-4 mt-[0px] mr-1'
                                    />
                                    <p className='text-xs text-red-500'>
                                        Username must be at least 5 characters and no more than 20 characters.
                                    </p>
                                </div>                           
                            </div>
                        )}
                        {isEmailValid(email) || email === '' ? (
                            <div className="relative mb-4 mt-[2vh]">
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder=" "
                                    value={email}
                                    onChange={(e) => setCurrentEmail(e.target.value)}
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={() => setIsEmailFocused(email !== "")}
                                    className="w-full px-3 pt-3.5 pb-1 border border-gray-200 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-500"
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
                        ) : (
                            <div className="relative mb-4 mt-[2vh]">
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder=" "
                                    value={email}
                                    onChange={(e) => setCurrentEmail(e.target.value)}
                                    onFocus={() => setIsEmailFocused(true)}
                                    onBlur={() => setIsEmailFocused(email !== "")}
                                    className="w-full px-3 pt-3.5 pb-1 border border-red-500 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-red-500"
                                />
                                <label
                                    htmlFor="email"
                                    className={`absolute left-3 transition-all ${
                                    isEmailFocused || email !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                                    } text-red-500`}
                                >
                                    Enter your email
                                </label>
                                <div className='mt-2 flex'>
                                    <img
                                        src={require("../../assets/icons/warning.png")}
                                        alt=''
                                        className='w-4 h-4 mt-[0px] mr-1'
                                    />
                                    <p className='text-xs text-red-500'>
                                        Must enter correct email format.
                                    </p>
                                </div>
                            </div>
                        )}

                        {isPasswordValid(password) === true || password === '' ? (
                            <div className="relative mb-[5vh]">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(password !== "")}
                                    className="w-full px-3 pt-3.5 pb-1 border border-gray-200 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-500"
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
                        ) : (
                            <div className="relative mb-[5vh]">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(password !== "")}
                                    className="w-full px-3 pt-3.5 pb-1 border border-red-500 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-red-500"
                                />
                                <label
                                    htmlFor="password"
                                    className={`absolute left-3 transition-all ${
                                    isPasswordFocused || password !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                                    } text-red-500`}
                                >
                                    Enter your password
                                </label>
                                <div className='mt-2 flex'>
                                    <img
                                        src={require("../../assets/icons/warning.png")}
                                        alt=''
                                        className='w-4 h-4 mt-[0px] mr-1'
                                    />
                                    <p className='text-xs text-red-500'>
                                        It should be at least 6 characters and include a combination of numbers and letters.
                                    </p>
                                </div>
                            </div>                            
                        )}

                        <div className='flex-1 flex items-center justify-center mb-6'>
                            <p className='text-center text-gray-500 text-sm'>
                                By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. 
                                You may receive notifications from us and can join out at any time.
                            </p>
                        </div>
                        <div className='flex-1 flex items-center justify-center'>
                            {loading ? (
                                <LoadingSpinner/>
                            ) : (
                                <button type="submit" 
                                    className="w-[40vh] bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700"
                                >
                                    Sign Up
                                </button>                                 
                            )}
                               
                        </div>
                    </form>
                    <div className='flex-1 flex items-center justify-center'>
                        <Link className='text-center text-blue-500 font-medium hover:text-blue-700'
                                to =  "/login"
                        >
                            Already have an account?
                        </Link>
                    </div>
                </div>
            </div>  
        </div>
    </div>
  )
}

export default Register