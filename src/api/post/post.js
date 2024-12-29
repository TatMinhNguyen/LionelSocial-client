import axios from "axios";
import { apiUrl } from "../API_URL"
import { setAllPosts, setFriendsPosts, setUserPost } from "../../redux/postSlice";
import { toast } from "react-toastify";

export const getAllPosts = async (token, dispatch, params, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-all-posts`, {
            headers: { token: `Bearer ${token}` },
            params: params
        });
        // console.log(res.data)
        dispatch(setAllPosts(res.data));
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }    
    }
};

export const getFriendsPosts = async (token, dispatch, params, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-friend-posts`, {
            headers: { token: `Bearer ${token}` },
            params: params
        });
        // console.log(res.data)
        dispatch(setFriendsPosts(res.data));
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }    
    }
};

export const getAPost = async (token, postId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-a-post/${postId}`, {
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

export const getUserPost = async (token, userId, dispatch, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-user-post/${userId}`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)
        dispatch(setUserPost(res.data))
        return res.data;
    } catch (error) {
        console.log(error);
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }    
    }
};

export const createPost = async (token, post, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/post/create-post`, post, {
            headers: {token: `Bearer ${token}`}
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

export const updatePost = async (token, post, postId, navigate) => {
    try {
        await axios.post(`${apiUrl}/post/update-a-post/${postId}`, post, {
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

export const deletePost = async (token, postId, navigate) => {
    try {
        await axios.delete(`${apiUrl}/post/delete-post/${postId}`, {
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

export const reportPost = async (token, postId, data, navigate) => {
    try {
        await axios.post(`${apiUrl}/post/report-post/${postId}`, data, {
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