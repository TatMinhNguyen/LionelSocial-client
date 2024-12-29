import axios from "axios";
import { apiUrl } from "../API_URL"
import { setGroups, setPosts, setUsers } from "../../redux/adminSlice";
import { TokenInvalid } from "../../utils";

export const getReportPosts = async (token, dispatch) => {
    try {
        const res = await axios.get(`${apiUrl}/admin/get-post-reported`, {
            headers: { token: `Bearer ${token}` },
        });
        dispatch(setPosts(res.data))
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const keepPost = async (token, postId) => {
    try {
        await axios.post(`${apiUrl}/admin/keep-post/${postId}`, {}, {
            headers: { token: `Bearer ${token}` },
        }); 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const deletePost = async (token, postId) => {
    try {
        await axios.delete(`${apiUrl}/admin/delete-post/${postId}`, {
            headers: { token: `Bearer ${token}` },
        }); 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const getContentReportPosts = async (token, postId) => {
    try {
        const res = await axios.get(`${apiUrl}/admin/get-report-post/${postId}`, {
            headers: { token: `Bearer ${token}` },
        });
        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const getReportedUser = async (token, dispatch) => {
    try {
        const res = await axios.get(`${apiUrl}/admin/get-reported-user`, {
            headers: { token: `Bearer ${token}` },
        });
        dispatch(setUsers(res.data))        
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const setBan = async (token, userId) => {
    try {
        await axios.post(`${apiUrl}/admin/ban-user/${userId}`, {}, {
            headers: { token: `Bearer ${token}` },
        });      
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const unBan = async (token, userId) => {
    try {
        await axios.post(`${apiUrl}/admin/unban-user/${userId}`, {}, {
            headers: { token: `Bearer ${token}` },
        });      
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const getDetailReportUser = async(token, userId) => {
    try {
        const res = await axios.get(`${apiUrl}/admin/get-detail-report-user/${userId}`, {
            headers: {token: `Bearer ${token}`}
        })
        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const getReportGroups = async (token, dispatch) => {
    try {
        const res = await axios.get(`${apiUrl}/admin/get-reported-group`, {
            headers: { token: `Bearer ${token}` },
        });
        dispatch(setGroups(res.data));
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const keepGroup = async (token, groupId) => {
    try {
        await axios.post(`${apiUrl}/admin/keep-group/${groupId}`, {}, {
            headers: { token: `Bearer ${token}` },
        }); 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const deleteGroup = async (token, groupId) => {
    try {
        await axios.delete(`${apiUrl}/admin/delete-group/${groupId}`, {
            headers: { token: `Bearer ${token}` },
        }); 
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}

export const getDetailReportGroup = async(token, groupId) => {
    try {
        const res = await axios.get(`${apiUrl}/admin/get-detail-report-group/${groupId}`, {
            headers: {token: `Bearer ${token}`}
        })
        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            TokenInvalid();
        }
    }
}