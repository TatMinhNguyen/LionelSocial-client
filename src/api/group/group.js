import axios from "axios"
import { apiUrl } from "../API_URL"
import { setGroup, setMembers, setPosts } from "../../redux/groupSlice"
import { toast } from "react-toastify"

export const getUserGroups = async(token, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-user-group`, {
            headers: { token: `Bearer ${token}` },
        })
        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            // toast.info("Your session has expired.");
        }
    }
}

export const getSuggestGroup = async(token, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-suggest`, {
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

export const joinGroup = async (token, groupId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/join-group/${groupId}`, {}, {
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

export const cancelJoinGroup = async (token, groupId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/cancel-join/${groupId}`, {}, {
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

export const leaveGroup = async (token, groupId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/leave-group/${groupId}`, {}, {
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

export const getAGroup = async (token, groupId, dispatch, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-a-group/${groupId}`,{
            headers: { token: `Bearer ${token}` },
        })
        dispatch(setGroup(res.data))
        return res.data         
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const getMembers = async (token, groupId, dispatch, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-members/${groupId}`,{
            headers: { token: `Bearer ${token}` },
        })
        dispatch(setMembers(res.data))
        return res.data         
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }    
}

export const getPendingMembers = async (token, groupId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-pending-members/${groupId}`,{
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

export const deleteMember = async (token, member, groupId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/remove-members/${groupId}`, member, {
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

export const approve = async (token, groupId, userId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/accept-members/${groupId}/${userId}`, {}, {
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

export const decline = async (token, groupId, userId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/refuse-members/${groupId}/${userId}`, {}, {
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

export const editGroup = async (token, groupId, group, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/change-name/${groupId}`, group, {
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

export const editPhoto = async (token, groupId, group, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/change-avatar/${groupId}`, group, {
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

export const createGroup = async (token, group, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/create-group`, group, {
            headers: {token: `Bearer ${token}`}
        })

        navigate(`/groups/${res.data.group._id}`)
        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const getSuggestionUser = async(token, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-suggest-user`,{
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

export const SearchSuggestionUser = async(token, input, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/search-suggest-user`, input, {
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

export const SearchInviteUser = async(token, input, groupId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/search-invite-user/${groupId}`, input, {
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

export const InviteUser = async(token, member, groupId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/add-members/${groupId}`, member, {
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

export const getGroupPosts = async(token, groupId, dispatch, params, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-all-posts/${groupId}`, {
            headers: { token: `Bearer ${token}` },
            params: params
        })
        dispatch(setPosts(res.data))
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const getPendingPosts = async(token, groupId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-pending-post/${groupId}`, {
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

export const getAPostGroup = async (token, postId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-a-post/${postId}`, {
            headers: { token: `Bearer ${token}` },
        });
        // console.log(res.data)

        return res.data;
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        };
    }
};

export const updatePostGroup = async (token, post, postId, navigate) => {
    try {
        await axios.post(`${apiUrl}/group/update-a-post/${postId}`, post, {
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

export const deletePostGroup = async (token, postId, groupId, navigate) => {
    try {
        await axios.delete(`${apiUrl}/group/delete-post/${groupId}/${postId}`, {
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

export const createPostGroup = async (token, post, groupId, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/group/create-post/${groupId}`, post, {
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

export const reportPostGroup = async (token, postId, data, navigate) => {
    try {
        await axios.post(`${apiUrl}/group/report-post/${postId}`, data, {
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

export const getReportPosts = async (token, groupId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-post-reported/${groupId}`, {
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

export const getContentReportPosts = async (token, postId, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/group/get-detail-report/${postId}`, {
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

export const keepPost = async (token, postId, navigate) => {
    try {
        await axios.post(`${apiUrl}/group/keep-post/${postId}`, {}, {
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

export const reportGroup = async (token, groupId, data, navigate) => {
    try {
        await axios.post(`${apiUrl}/group/report-group/${groupId}`, data, {
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