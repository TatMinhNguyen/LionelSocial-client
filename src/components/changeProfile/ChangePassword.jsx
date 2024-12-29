import React, { useState } from 'react'
import { changePassword } from '../../api/auth/auth';
import { useNavigate } from 'react-router-dom';

const ChangePassword = ({isCloseModal, user}) => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const [newPassword, setNewPassword] = useState('')
    const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false)

    const [reTypePassword, setReTypePassword] = useState('')
    const [isReTypePasswordFocused, setIsReTypePasswordFocused] = useState(false)

    const navigate = useNavigate();

    const handleCloseModal = () => {
        isCloseModal()
    }

    // Kiểm tra mật khẩu mới có hợp lệ hay không
    const isPasswordValid = (password) => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return password.length >= 6 && hasLetter && hasNumber;
    };

    const isFormValid = () => {
        return (
            currentPassword &&
            isPasswordValid(newPassword) &&
            reTypePassword === newPassword
        );
    };

    const handleChangePassword = async() => {
        try {
            const data = {
                oldPassword: currentPassword,
                newPassword: reTypePassword
            }
            const result = await changePassword(user?.token, data, navigate)

            if(result){
                isCloseModal();
                setCurrentPassword('')
                setNewPassword('')
                setReTypePassword('')                
            }

        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh]">
            <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-xl font-bold flex-1 flex items-center justify-center">Change password</h3>
                <button onClick={handleCloseModal} className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center">
                <img  
                    src={require('../../assets/icons/close.png')}
                    alt='Earth'
                    className='w-5 h-5 '
                />
                </button>
            </div>
            <div className='py-2 px-4 mb-4'>
                <p className='text-base text-gray-600'>
                    Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%).
                </p>
            </div>
            <div className="relative mb-5 px-4">
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder=""
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(currentPassword !== "")}
                    className="w-full px-4 pt-3.5 pb-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-500"
                />
                <label
                    htmlFor="currentPassword"
                    className={`absolute left-8 transition-all ${
                    isPasswordFocused || currentPassword !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                    } text-gray-500`}
                >
                    Current password
                </label>
            </div>
            {isPasswordValid(newPassword) === true || newPassword === '' ? (
                <div className="relative mb-5 px-4">
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder=""
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setIsNewPasswordFocused(true)}
                        onBlur={() => setIsNewPasswordFocused(newPassword !== "")}
                        className="w-full px-4 pt-3.5 pb-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-500"
                    />
                    <label
                        htmlFor="newPassword"
                        className={`absolute left-8 transition-all ${
                        isNewPasswordFocused || newPassword !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                        } text-gray-500`}
                    >
                        New password
                    </label>
                </div>                
            ) : (
                <div className="relative mb-5 px-4">
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder=""
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setIsNewPasswordFocused(true)}
                        onBlur={() => setIsNewPasswordFocused(newPassword !== "")}
                        className="w-full px-4 pt-3.5 pb-1 border border-red-500 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-red-500"
                    />
                    <label
                        htmlFor="newPassword"
                        className={`absolute left-8 transition-all ${
                        isNewPasswordFocused || newPassword !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                        } text-red-500`}
                    >
                        New password
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
            {newPassword === reTypePassword || reTypePassword === '' ? (
                <div className="relative mb-5 px-4">
                    <input
                        type="password"
                        id="reTypePassword"
                        name="reTypePassword"
                        placeholder=""
                        value={reTypePassword}
                        onChange={(e) => setReTypePassword(e.target.value)}
                        onFocus={() => setIsReTypePasswordFocused(true)}
                        onBlur={() => setIsReTypePasswordFocused(reTypePassword !== "")}
                        className="w-full px-4 pt-3.5 pb-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-500"
                    />
                    <label
                        htmlFor="reTypePassword"
                        className={`absolute left-8 transition-all ${
                        isReTypePasswordFocused || reTypePassword !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                        } text-gray-500`}
                    >
                        Re-type new password
                    </label>
                </div>                
            ) : (
                <div className="relative mb-5 px-4">
                    <input
                        type="password"
                        id="reTypePassword"
                        name="reTypePassword"
                        placeholder=""
                        value={reTypePassword}
                        onChange={(e) => setReTypePassword(e.target.value)}
                        onFocus={() => setIsReTypePasswordFocused(true)}
                        onBlur={() => setIsReTypePasswordFocused(reTypePassword !== "")}
                        className="w-full px-4 pt-3.5 pb-1 border border-red-500 rounded-md focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-red-500"
                    />
                    <label
                        htmlFor="reTypePassword"
                        className={`absolute left-8 transition-all ${
                        isReTypePasswordFocused || reTypePassword !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                        } text-red-500`}
                    >
                        Re-type new password
                    </label>
                    <div className='mt-2 flex'>
                        <img
                            src={require("../../assets/icons/warning.png")}
                            alt=''
                            className='w-4 h-4 mt-[0px] mr-1'
                        />
                        <p className='text-xs text-red-500'>
                            New password does not match. Enter new password again here.
                        </p>
                    </div>
                </div>
            )}

            <div className="p-4">
                {isFormValid() ? (
                    <button className="w-full bg-customBlue text-white py-2 px-4 rounded-lg"
                            onClick={handleChangePassword}
                    >
                        Change password
                    </button>
                    ) : (
                    <button
                        className="w-full bg-blue-300 text-white py-2 px-4 rounded-lg"
                        disabled
                    >
                        Change password
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}

export default ChangePassword