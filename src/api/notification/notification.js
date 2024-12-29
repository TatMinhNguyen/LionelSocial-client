import axios from "axios";
import { apiUrl } from "../API_URL"
import { toast } from "react-toastify";

export const getNotification = async(token, navigate) => {
    try {
        const res = await axios.get(`${apiUrl}/notification/get-notification`, {
            headers: { token: `Bearer ${token}` },
        });

        return res.data
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            // toast.info("Your session has expired.");
        }
    }
}

export const checkNotification = async(token, notificationId, navigate) => {
    try {
        await axios.post(`${apiUrl}/notification/check-notification/${notificationId}`, {}, {
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