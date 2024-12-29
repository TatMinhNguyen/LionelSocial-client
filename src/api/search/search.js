import axios from "axios";
import { apiUrl } from "../API_URL"
import { setSearchPosts, setSearchUsers } from "../../redux/searchSlice";

import { toast } from "react-toastify";

export const search = async(token, params, dispatch, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/search/search`, {}, {
            headers: { token: `Bearer ${token}` },
            params: params
        })
        dispatch(setSearchPosts(res.data.posts))
        dispatch(setSearchUsers(res.data.users))
        return res.data;
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        } 
    }
}