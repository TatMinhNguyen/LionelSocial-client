import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useOutletContext } from "react-router-dom"
import GetFriends from './getFriends/GetFriends'
import GetRequests from './getRequests/GetRequests'
import GetSuggestions from './getSuggestions/GetSuggestions'
import MutualFriends from './mutualFriends/MutualFriends'

const Friends = () => {
    const userId = useOutletContext()
    const user = useSelector((state) => state.auth.login?.currentUser)

    const [onClick, setOnClick] = useState('0')

    const handleGetFriends = () => {
        setOnClick('0');
    }

    const handleGetRequests = () => {
        setOnClick('1')
    }

    const handleGetSuggestions = () => {
        setOnClick('2')
    }

    const handleGetMutual = () => {
        setOnClick('3')
    }
    return (
        <div className='bg-white border border-white shadow rounded-md mb-3'>
            {userId === user?.userId ? (
                <div className='flex mb-1.5'>
                    <div onClick={handleGetFriends}
                        className='w-1/3 flex-1 flex items-center justify-center my-2'>
                        <p className={`cursor-pointer text-base font-medium 
                            ${onClick === '0' ? 'text-customBlue border-b-2 border-b-customBlue' : 'text-gay-700'}`}
                        >
                            Friends
                        </p>                       
                    </div>
                    <div onClick={handleGetRequests}
                        className='w-1/3 flex-1 flex items-center justify-center my-2'>
                        <p className={`cursor-pointer text-base font-medium 
                            ${onClick === '1' ? 'text-customBlue border-b-2 border-b-customBlue' : 'text-gay-700'}`}
                        >
                            Respond
                        </p>                       
                    </div>
                    <div onClick={handleGetSuggestions}
                        className='w-1/3 flex-1 flex items-center justify-center my-2'>
                        <p className={`cursor-pointer text-base font-medium 
                            ${onClick === '2' ? 'text-customBlue border-b-2 border-b-customBlue' : 'text-gay-700'}`}
                        >
                            Suggestions
                        </p>
                    </div>                     
                </div>
            ) : (
                <div className='flex mb-1.5'>
                    <div className='w-1/2 flex-1 flex items-center justify-center my-2'
                            onClick={handleGetFriends}
                    >
                        <p className={`cursor-pointer text-base font-medium 
                            ${onClick === '0' ? 'text-customBlue border-b-2 border-b-customBlue' : 'text-gay-700'}`}
                        >
                           Friends 
                        </p>
                    </div>
                    <div className='w-1/2 flex-1 flex items-center justify-center my-2'
                            onClick={handleGetMutual}
                    >
                        <p className={`cursor-pointer text-base font-medium 
                            ${onClick === '3' ? 'text-customBlue border-b-2 border-b-customBlue' : 'text-gay-700'}`}
                        >
                            Mutual friends
                        </p>
                    </div>                     
                </div>
            )}

            {onClick === '0' ? (
                <div>
                    <GetFriends
                        userId = {userId}
                        user = {user}
                    />
                </div>                
            ) : onClick === '1' ? (
                <div>
                    <GetRequests
                        user={user}
                    />
                </div>
            ) : onClick === '2' ? (
                <div>
                    <GetSuggestions
                        user = {user}
                    />
                </div>
            ) : (
                <div>
                    <MutualFriends
                        user={user}
                        userId={userId}
                    />
                </div>
            )}

        </div>
    )
}

export default Friends