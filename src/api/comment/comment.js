import axios from "axios";
import { apiUrl } from "../API_URL"
import { setComments } from "../../redux/postSlice";
import { toast } from "react-toastify";

export const getComments = async (token, dispatch, postId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/comment/get-comments/${postId}`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)

        dispatch(setComments(res.data));
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
};

export const createComment = async (token, comment, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/comment/set-comment`, comment, {
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

export const deleteComment = async (token, commentId, navigate) => {
    try {
        await axios.delete(`${apiUrl}/comment/delete-comment/${commentId}`, {
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

export const editcomment = async(token, comment, commentId, navigate) => {
    try {
        await axios.post(`${apiUrl}/comment/update-comment/${commentId}`, comment, {
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