import axios from "axios";
import { apiUrl } from "../API_URL"
import { setProfile, setProfileDiff } from "../../redux/authSlice";
import { toast } from "react-toastify";

export const getProfile = async (token, dispatch, userId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/user/get-profile/${userId}`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)
        dispatch(setProfileDiff(res.data))
        return res.data;
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        } 
    }
};

export const getMyProfile = async (token, dispatch, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/user/get-my-profile`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)
        dispatch(setProfile(res.data))
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            // toast.info("Your session has expired.");
        } 
    }
};

export const changeAvatar = async (token, image, navigate) => {
    try {
        await axios.post(`${apiUrl}/user/update-avatar`, image, {
            headers: {token: `Bearer ${token}`}
        })
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        } 
    }
}

export const changeCover = async (token, image, navigate) => {
    try {
        await axios.post(`${apiUrl}/user/update-background`, image, {
            headers: {token: `Bearer ${token}`}
        })
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        } 
    }
}

export const changeProfile = async(token, profile, navigate) => {
    try {
        await axios.post(`${apiUrl}/user/update-profile`, profile, {
            headers: {token: `Bearer ${token}`}
        })
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        } 
    }    
}

export const reportUser = async (token, userId, data, navigate) => {
    try {
        await axios.post(`${apiUrl}/user/report/${userId}`, data, {
            headers: {token: `Bearer ${token}`}
        })
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        } 
    } 
}