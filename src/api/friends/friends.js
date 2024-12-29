import axios from "axios";
import { apiUrl } from "../API_URL"
import { toast } from "react-toastify";

export const getFriends = async (token, userId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/friend/get-friends/${userId}`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)

        return res.data;
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            // toast.info("Your session has expired.");
        }
    }
};

export const getSuggestions = async (token, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/friend/get-suggest-friends`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)

        return res.data;
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            // toast.info("Your session has expired.");
        }
    }
};

export const getRequested = async (token, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/friend/get-requested`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)

        return res.data;
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            // toast.info("Your session has expired.");
        }
    }
};

export const getMutuals = async (token, userId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/friend/get-mutual-friends/${userId}`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)

        return res.data;
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
};

// Gửi lời mời kết bạn
export const requestFriends = async (token, userId, navigate) => {
    try {
        await axios.post(
            `${apiUrl}/friend/request-friend/${userId}`, 
            {}, 
            {
                headers: { token: `Bearer ${token}` }
            }
        );
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

// Hủy lời mời kết bạn
export const cancelRequest = async (token, userId, navigate) => {
    try {
        await axios.post(
            `${apiUrl}/friend/cancel-request-friend/${userId}`, 
            {}, 
            {
                headers: { token: `Bearer ${token}` }
            }
        );
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

//chap nhan ket ban
export const acceptRequest = async (token, userId, navigate) => {
    try {
        await axios.post(
            `${apiUrl}/friend/accepet-friend/${userId}`, {}, 
            {
                headers: { token: `Bearer ${token}` }
            }
        );
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

//Tu choi ket ban
export const refuseRequest = async (token, userId, navigate) => {
    try {
        await axios.post(
            `${apiUrl}/friend/refuse-friend/${userId}`, {}, 
            {
                headers: { token: `Bearer ${token}` }
            }
        );
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

//Hủy bạn bè
export const cancelFriend = async (token, userId, navigate) => {
    try {
        await axios.post(
            `${apiUrl}/friend/cancel-friend/${userId}`, {}, 
            {
                headers: { token: `Bearer ${token}` }
            }
        );
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}