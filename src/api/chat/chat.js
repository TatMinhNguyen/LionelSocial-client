import axios from "axios";
import { apiUrl } from "../API_URL"
import { setChat, setChats, setMessages } from "../../redux/chatSlice";

import { toast } from "react-toastify";

export const getUserChat = async (token, dispatch, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/chat/get-user-chat`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)
        dispatch(setChats(res.data))
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
};

export const getAChat = async (token, chatId, dispatch, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/chat/get-a-chat/${chatId}`, {
            headers: { token: `Bearer ${token}` },
        })
        dispatch(setChat(res.data))
        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const createChat1vs1 = async (token, userId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/chat/create-chat/${userId}`, {}, {
            headers: { token: `Bearer ${token}` },
        })
        navigate(`/messenger/${res.data._id}`)
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
        if(error.response.data.error === 'Phòng chat đã tồn tại'){
            navigate(`/messenger/${error.response.data.chatId}`)
        }
    }
}

export const checkMessages = async (token, chatId, navigate) => {
    try {
        await axios.post(`${apiUrl}/chat/check-message/${chatId}`, {}, {
            headers: { token: `Bearer ${token}` },
        })
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const getMess = async (token, chatId, params, dispatch,navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/chat/get-message/${chatId}`, {
            headers: { token: `Bearer ${token}` },
            params: params
        })
        dispatch(setMessages(res.data))
        // return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const addMess = async (token, message, navigate) => {
    try {
        const  res = await axios.post(`${apiUrl}/chat/add-message`, message, {
            headers: {token: `Bearer ${token}`}
        })
        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const getMembers = async (token, chatId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/chat/get-members/${chatId}`, {
            headers: { token: `Bearer ${token}` },
        })
        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const searchUser = async(token, input, chatId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/chat/search-user/${chatId}`, input, {
            headers: { token: `Bearer ${token}` },
        })
        return res.data;
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const searchMembers = async(token, input, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/chat/search-members`, input, {
            headers: { token: `Bearer ${token}` },
        })
        return res.data;
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const addMemberes = async(token, members, chatId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/chat/add-members/${chatId}`, members, {
            headers: { token: `Bearer ${token}` },
        })
        return res.data;
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const deleteMember = async(token, members, chatId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/chat/delete-members/${chatId}`, members, {
            headers: { token: `Bearer ${token}` },
        })
        return res.data;
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }    
}

export const leaveGroup = async(token, chatId, navigate) => {
    try {
        await axios.post(`${apiUrl}/chat/leave-group/${chatId}`, {}, {
            headers: { token: `Bearer ${token}`}
        })
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const createChatRoom = async(token, chat, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/chat/create-group-chat`, chat, {
            headers: { token: `Bearer ${token}`}
        }) 
        navigate(`/messenger/${res.data.chat._id}`)       
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const changePhoto = async(token, photo, chatId, navigate) => {
    try {
        await axios.post(`${apiUrl}/chat/change-avatar/${chatId}`, photo, {
            headers: { token: `Bearer ${token}`}
        }) 
        navigate(`/messenger/${chatId}`) 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }    
}

export const changeName = async(token, name, chatId, navigate) => {
    try {
        await axios.post(`${apiUrl}/chat/change-name/${chatId}`, name, {
            headers: { token: `Bearer ${token}`}
        }) 
        navigate(`/messenger/${chatId}`) 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }    
}