import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createChatRoom, getUserChat, searchMembers } from '../../api/chat/chat'
import { useNavigate } from 'react-router-dom'

const CreateGroupChat = ({isClose}) => {
    const user = useSelector((state) => state.auth.login?.currentUser)
    const [searchInput, setInput] = useState('')
    const [data, setData] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isnameFocused, setIsnameFocused] = useState(false);
    const [name, setname] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getNewMembersId = (selectedUsers) => {
        return selectedUsers.map(user => user.userId);
    };

    const newMembersId = getNewMembersId(selectedUsers);

    const handleSearch = async(e) => {
        e.preventDefault();
        const data = {
            searchInput: searchInput
        }
        const res =  await searchMembers(user?.token, data, navigate)
        setData(res)
    }

    const handleSelect = (selectedUser) => {
        setSelectedUsers((prevSelected) => {
            const isSelected = prevSelected.some(user => user.userId === selectedUser.userId);
            if (isSelected) {
                // Bỏ chọn nếu đã được chọn
                return prevSelected.filter(user => user.userId !== selectedUser.userId);
            } else {
                // Thêm người dùng vào danh sách đã chọn
                return [...prevSelected, selectedUser];
            }
        });
    };

    const handleRemove = (selectedUser) => {
        setSelectedUsers((prevSelected) => 
            prevSelected.filter(user => user.userId !== selectedUser.userId)
        );
    };

    const handleCreateGroup = async(e) => {
        e.preventDefault();
        const newGroup = {
            members: newMembersId,
            name: name
        }
        try {
            await createChatRoom(user?.token, newGroup, navigate)
            isClose();
            await getUserChat(user?.token, dispatch, navigate)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className='bg-white rounded-lg shadow-lg w-full max-w-lg h-[90vh]'>
            <div className="flex justify-between items-center border-b border-gray-300 p-4">
                <h3 className="text-md font-medium flex-1 flex items-center justify-center">Create Group</h3>
                <button onClick={() => isClose()} 
                    className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                >
                    <img  
                        src={require('../../assets/icons/close.png')}
                        alt='Earth'
                        className='w-3.5 h-3.5 '
                    />
                </button>
            </div>
            <div className="relative mx-7 my-4">
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder=" "
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    onFocus={() => setIsnameFocused(true)}
                    onBlur={() => setIsnameFocused(name !== "")}
                    className="w-full px-0 pt-3.5 pb-1 border-b border-gray-200 focus:outline-none focus:border-customBlue"
                />
                <label
                    htmlFor="name"
                    className={`absolute left-0 transition-all ${
                    isnameFocused || name !== "" ? "-top-0.5 text-xs text-blue-500" : "top-2 text-base text-gray-400"
                    } `}
                >
                    Enter the chat group name
                </label>
            </div>
            <div className='mx-4'>
                <form className='flex-1 flex items-center p-1 pl-2 mt-1.5 border border-gray-200 focus-within:border-customBlue bg-white mx-auto rounded-3xl'
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
                        className='flex-grow w-full pl-3 pr-1 py-1 rounded-3xl bg-white overflow-hidden
                                    focus:outline-none'
                    />
                </form>
            </div>
            {selectedUsers?.length > 0 ? (
                <div className="flex mx-6 pt-4 pb-3 overflow-x-auto no-scrollbar">
                    {selectedUsers?.map((user) => (
                        <div key={user.userId} 
                            className="flex flex-col items-center min-w-[80px] flex-shrink-0 mx-1"
                        >
                            <div className='relative w-10 h-10'>
                                <img className='h-full w-full object-cover rounded-full'
                                    src={user.profilePicture}
                                    alt=''
                                />
                                <button
                                    onClick={() => handleRemove(user)}
                                    className="absolute -top-1 -right-1 w-5 h-5 shadow bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center"
                                >
                                    <span className="text-sm font-semibold text-gray-600 mb-1">x</span>
                                </button>                                
                            </div> 
                            <p className='text-[11px] text-center truncate w-[80px] text-gray-600'>
                                {user.username}    
                            </p>                           
                        </div>
                    ))}
                </div>                    
            ):(
                <div className='flex-1 flex items-center justify-center h-[84.5px] text-[14px] text-gray-600'>
                    No users selected
                </div>
            )}
            {data?.length > 0 ? (
                <p className='mx-5 text-[13px] mb-2'>
                    Result
                </p>                    
            ):(
                <div className='h-[27.5px]'></div>
            )}

            <div className='overflow-y-auto h-[44vh]'>
                {data?.map((user) => (
                    <div key={user.userId}
                        className='mx-6 mb-3 flex-1 flex items-center cursor-pointer'
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
                            checked={selectedUsers.some(selected => selected.userId === user.userId)}
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
            <div className='flex-1 flex justify-center mt-2.5'>
                {newMembersId?.length >= 2 && name ? (
                    <button className={`bg-customBlue text-white w-11/12 py-1 pb-1.5 rounded-md font-medium text-[14px]`}
                        onClick={handleCreateGroup}
                    >
                        Create group
                    </button>                        
                ):(
                    <div className={`flex justify-center bg-gray-100 text-gray-300 w-11/12 py-1 pb-1.5 rounded-md font-medium text-[14px]`}>
                        Create group
                    </div>
                )}

            </div>
        </div>
    </div>
  )
}

export default CreateGroupChat