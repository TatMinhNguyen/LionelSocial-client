import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { createGroup, getSuggestionUser, SearchSuggestionUser } from '../../api/group/group';
import { useNavigate } from 'react-router-dom';

const CreateGroup = ({isClose}) => {
    const user = useSelector((state) => state.auth.login?.currentUser)

    const typeRef = useRef(null);

    const navigate = useNavigate();

    const [members, setMembers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [username, setUsername] = useState('');
    const [groupType, setGroupType] = useState(null);

    const [showOptions, setShowOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [isFocusType, setIsFocusType] = useState(false)

    const [searchInput, setInput] = useState('')

    const handleSelect = (selectedUser) => {
        setSelectedUsers((prevSelected) => {
            const isSelected = prevSelected.some(user => user._id === selectedUser._id);
            if (isSelected) {
                // Bỏ chọn nếu đã được chọn
                return prevSelected.filter(user => user._id !== selectedUser._id);
            } else {
                // Thêm người dùng vào danh sách đã chọn
                return [...prevSelected, selectedUser];
            }
        });
    };

    const getNewMembersId = (selectedUsers) => {
        return selectedUsers.map(user => user._id);
    };

    const newMembersId = getNewMembersId(selectedUsers);

    const handleRemove = (selectedUser) => {
        setSelectedUsers((prevSelected) => 
            prevSelected.filter(user => user._id !== selectedUser._id)
        );
    };
  
    const handleInputClick = () => {
        setShowOptions(true);
    };

    const handleOptionClick = (option) => {
        setGroupType(option === 'Public');
        setShowOptions(false);
        setSelectedOption(option)
    };

    const isUsernameValid = (username) => {
        return username.length >= 5 && username.length <= 50;
    }

    const handleClickOutside = (event) => {
        if (typeRef.current && !typeRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    const handleCreateGroup = async(e) => {
        e.preventDefault();
        const newGroup = {
            members: newMembersId,
            name: username,
            type: groupType
        }
        try {
            await createGroup(user?.token, newGroup, navigate)
            isClose();
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetSuggest = async() => {
        try {
            const result = await getSuggestionUser(user?.token, navigate)
            setMembers(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = async(e) => {
        e.preventDefault();
        const data = {
            searchInput: searchInput
        }
        const res =  await SearchSuggestionUser(user?.token, data, navigate)
        setMembers(res)
    }

    /* eslint-disable */
    useEffect(() => {
        handleGetSuggest();
    }, [])

    useEffect(() => {
        if (showOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptions]);
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className='bg-white rounded-lg shadow-lg w-1/2 h-[80vh]'>
            <div className="flex justify-between items-center border-b border-gray-200 p-4 py-3">
                <h3 className="text-[18px] font-bold flex-1 flex items-center justify-center">Create New Group</h3>
                <button onClick={() => isClose()} 
                    className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                >
                    <img  
                        src={require('../../assets/icons/close.png')}
                        alt='Earth'
                        className='w-4 h-4 '
                    />
                </button>
            </div>
            <div className='flex h-[64.5vh] border-b border-zinc-200'>
                <div className='w-3/5 px-4'>
                    <div className="flex items-center mt-4">
                        <div className='w-9 h-9'>
                            <img 
                                src={user?.avatar} 
                                alt="Profile" 
                                className="h-full w-full object-cover rounded-full" />
                        </div>
                        <div className="ml-2">
                            <h4 className="font-semibold text-[15px]">
                                {user?.username}
                            </h4>
                            <div className="text-[13px] text-gray-800 ml-[1px]">
                                Admin
                            </div>
                        </div>
                    </div>
                    {isUsernameValid(username) === true || username === '' ? (
                        <div className="relative mx-1 my-4">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => setIsUsernameFocused(true)}
                                onBlur={() => setIsUsernameFocused(username !== "")}
                                className="w-full px-0 pt-3.5 pb-1 border-b border-gray-200 focus:outline-none focus:border-customBlue"
                            />
                            <label
                                htmlFor="username"
                                className={`absolute left-0 transition-all ${
                                isUsernameFocused || username !== "" ? "-top-0.5 text-xs  text-blue-500" : "top-2 text-base text-gray-400"
                                } `}
                            >
                                Enter the group name
                            </label>                            
                        </div>                            
                    ) : (
                        <div className="relative mx-1 my-4">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={() => setIsUsernameFocused(true)}
                                onBlur={() => setIsUsernameFocused(username !== "")}
                                className="w-full px-0 pt-3.5 pb-1 border-b border-gray-200 focus:outline-none focus:border-red-500"
                            />
                            <label
                                htmlFor="username"
                                className={`absolute left-0 transition-all ${
                                isUsernameFocused || username !== "" ? "-top-0.5 text-xs" : "top-2 text-base"
                                } text-red-500`}
                            >
                                Enter the group name
                            </label> 
                            <div className='mt-2 flex'>
                                <img
                                    src={require("../../assets/icons/warning.png")}
                                    alt=''
                                    className='w-4 h-4 mt-[0px] mr-1'
                                />
                                <p className='text-xs text-red-500'>
                                    Name must be at least 5 characters and no more than 50 characters.
                                </p>
                            </div>                           
                        </div>
                    )}
                    <div className="relative mx-1 my-4 border-b border-gray-200"
                        ref={typeRef}
                    >
                        <input
                            type="text"
                            id='groupType'
                            name='groupType'
                            value={selectedOption}
                            onClick={handleInputClick}
                            readOnly
                            className="w-full px-0 pt-3.5 pb-1 border-b border-white focus:outline-none focus:border-customBlue cursor-pointer"
                            placeholder=""
                            onFocus={() => setIsFocusType(true)}
                            onBlur={() => setIsFocusType(selectedOption !== '')}
                        />
                        <label
                            htmlFor="groupType"
                            className={`absolute left-0 transition-all ${
                            isFocusType || selectedOption !== '' ? "-top-0.5 text-xs  text-blue-500" : "top-2 text-base text-gray-400"
                            } `}
                        >     
                            Choose privacy
                        </label> 
                        <div className='absolute right-1 -mt-7'>
                            <img className='w-3.5 h-3.5'
                                src={require('../../assets/icons/down.png')}
                                alt=''
                            />
                        </div>
                        {showOptions && (
                            <div className="absolute top-full left-0 mt-1 px-2 w-full border border-white bg-white shadow-lg rounded-md">
                                <div
                                    onClick={() => handleOptionClick('Public')}
                                    className="p-2 rounded mt-2 pb-1 cursor-pointer hover:bg-gray-100"
                                >
                                    Public
                                </div>
                                <div
                                    onClick={() => handleOptionClick('Private')}
                                    className="p-2 rounded mb-2 cursor-pointer hover:bg-gray-100"
                                >
                                    Private
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='mx-0'>
                        <form className='flex-1 flex items-center p-1 pl-2 mt-1.5 bg-gray-100 focus-within:border-customBlue mx-auto rounded-3xl'
                                onSubmit={handleSearch}
                        >
                            <button>
                                <img className='w-5 h-5 ml-1 mt-0.5'
                                    src = {require('../../assets/icons/search.png')}
                                    alt=''
                                />                    
                            </button>
                            <input
                                type='text'
                                id='search'
                                name='search'
                                placeholder='Search members'
                                value={searchInput}
                                onChange={(e) => setInput(e.target.value)}
                                className='flex-grow w-full pl-3 pr-1 py-1 rounded-3xl bg-gray-100 overflow-hidden
                                            focus:outline-none'
                            />
                        </form>
                    </div>
                    <div className='mt-3 ml-1 '>
                        {members?.length > 0 && (
                            <div className='overflow-y-auto h-[31.2vh]'>
                                <h3 className='font-medium text-[15px] mb-2'>
                                    Suggested
                                </h3>
                                {members?.map((user) => (
                                    <div key={user._id}
                                        className='mx-3 mb-3 flex-1 flex items-center cursor-pointer'
                                        onClick={() => handleSelect(user)}
                                    >
                                        <div className='w-9 h-9'>
                                            <img className='h-full w-full object-cover rounded-full'
                                                src={user.profilePicture}
                                                alt=''
                                            />                                
                                        </div>
                                        <div className='ml-2'>
                                            <h3 className='font-medium text-[15px]'>
                                                {user.username}
                                            </h3>
                                        </div>
                                        <div className='flex-1'></div>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.some(selected => selected._id === user._id)}
                                            onChange={() => handleSelect(user)}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                width: '10px',
                                                height: '10px',
                                                transform: 'scale(1.5)',
                                                accentColor: '#0866FF',
                                                cursor: 'pointer',
                                            }}
                                        />                            
                                    </div>
                                ))}
                            </div>
                        )}                        
                    </div>
                </div>
                <div className='w-2/5 bg-slate-100'>
                    {selectedUsers?.length > 0 ? (
                        <div className="mx-3 my-3 overflow-y-auto h-[63vh] no-scrollbar">
                            {selectedUsers?.map((user) => (
                                <div key={user._id} 
                                    className="mb-4 flex-1 flex items-center"
                                >
                                    <div className='w-9 h-9'>
                                        <img className='h-full w-full object-cover rounded-full'
                                            src={user.profilePicture}
                                            alt=''
                                        />                                
                                    </div>
                                    <div className='ml-2'>
                                        <h3 className='font-medium text-[15px]'>
                                            {user.username}
                                        </h3>
                                    </div> 
                                    <div className='flex-1'></div>
                                    <div className='hover:bg-gray-200 p-2 rounded-full cursor-pointer'
                                        onClick={() => handleRemove(user)}
                                    >
                                        <img className='x-3 h-3'
                                            src={require('../../assets/icons/close.png')}
                                            alt=''
                                        />    
                                    </div>                         
                                </div>
                            ))}
                        </div>                    
                    ):(
                        <div className='flex-1 flex items-center justify-center mt-4 text-[14px] text-gray-600'>
                            No users selected
                        </div>
                    )}
                </div>
            </div>
            <div className='flex-1 flex items-center justify-center h-[7.8vh]'>
                <div className='flex-1'></div>
                <button className='text-blue-600 font-medium rounded-md hover:bg-gray-200 py-1.5 pb-[7px] px-3'
                    onClick={()=> isClose()}
                >
                    Cancel
                </button>
                {username && groupType !== null ? (
                    <button className='py-1.5 pb-[7px] px-5 rounded-md bg-customBlue hover:bg-blue-600 text-white font-medium my-[9px] mx-4'
                        onClick={handleCreateGroup}
                    >
                        Create
                    </button>                    
                ) : (
                    <div className='py-1.5 pb-[7px] px-5 rounded-md bg-gray-100 text-gray-300 font-medium my-[9px] mx-4'>
                        Create
                    </div>
                )}

            </div>
        </div>
    </div>
  )
}

export default CreateGroup