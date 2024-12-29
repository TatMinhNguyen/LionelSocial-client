import axios from "axios";
import { apiUrl } from "../API_URL"
import { toast } from "react-toastify";

export const setFelt = async(token, data, navigate) => {
    try {
        await axios.post(`${apiUrl}/comment/set-feel`, data, {
            headers: { token: `Bearer ${token}` },
        }); 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const updateFelt = async(token, data, postId, navigate) =>{
    try {
        await axios.post(`${apiUrl}/comment/update-feel/${postId}`, data, {
            headers: { token: `Bearer ${token}` },
        }); 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }    
}

export const unFelt = async(token, postId, navigate) => {
    try {
        await axios.delete(`${apiUrl}/comment/delete-feel/${postId}`, {
            headers: { token: `Bearer ${token}` },
        }); 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    } 
}

export const getFelt = async(token, postId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/comment/get-feel/${postId}`, {
            headers: { token: `Bearer ${token}` },
        }); 

        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    } 
}

