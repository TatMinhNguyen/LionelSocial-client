import axios from "axios";
import { clearUser, setEmail, setLogin, setLogOut, setVerificationCode } from "../../redux/authSlice";
import { apiUrl } from "../API_URL"
import { toast } from "react-toastify";
import { setClearChat } from "../../redux/chatSlice";
import { setClearGroup } from "../../redux/groupSlice";
import { setClearPost } from "../../redux/postSlice";
import { setClearSearch } from "../../redux/searchSlice";

export const loginUser = async (user, dispatch, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/auth/login`, user);

        dispatch(setLogin(res.data));
        navigate("/");
        dispatch(clearUser());
    } catch (error) {
        console.log(error);
        if (error?.response.data === 'Account banned') {
            toast.error("Your account has been banned! Please contact admin.");
        }
        if (error?.response.data === 'Incorrect password or email') {
            toast.error("Account or password is incorrect!");
        }
        if (error?.response.data === "Account Invalid") {
            toast.info("Account Invalid");
        }
    }
};

export const registerUser = async (newUser, dispatch, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/auth/register`, newUser);
        // console.log(res.data)

        dispatch(setVerificationCode(res.data))
        navigate('/set-verify-code')
    } catch (error) {
        console.log(error);
        toast.error("Account already exists!");
    }
}

export const setVeryficationCode = async (code, dispatch, navigate) => {
    try {
        await axios.post(`${apiUrl}/auth/set-verify`, code);

        // dispatch(clearVerificationCode())
        // navigate('/login')        
    } catch (error) {
        console.log(error);
        toast.error("The verification code is incorrect or has expired!");        
    }
}

export const getVeryficationCode = async (email, dispatch, navigate) => {
    try {
        const res = await axios.post(`${apiUrl}/auth/get-verify`, email);
        // console.log(res.data)

        dispatch(setVerificationCode(res.data))
        dispatch(setEmail(res.data.email))
        navigate('/set-verify-code')        
    } catch (error) {
        console.log(error);
        toast.error("Your account could not be found or the account has been verified!");        
    }
}

export const forgotPass = async(email, dispatch)=> {
    try {
        const res = await axios.post(`${apiUrl}/auth/forgot-password`, email);

        // dispatch(setEmail(res.data.email))
        // dispatch(setPassword(res.data.newPassword))

        return res.data;
    } catch (error) {
        console.log(error)
        toast.error("Your account could not be found!");
    }
}

export const logOut = async(token, dispatch, navigate) => {
    try {
        await axios.post(`${apiUrl}/auth/logout`, {}, {
            headers: {token: `Bearer ${token}`}
        })
        navigate('/login') 
        dispatch(setLogOut());
        dispatch(setClearChat())
        dispatch(setClearGroup())
        dispatch(setClearPost())
        dispatch(setClearSearch())
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        }
    }
}

export const changePassword = async (token, pass, navigate) => {
    try {
        const res =  await axios.post(`${apiUrl}/auth/change-password`, pass, {
            headers: {token: `Bearer ${token}`}
        }) 
        toast.success('Password changed successfully')

        return res.data;
    } catch (error) {
        console.log(error)
        if(error?.response.data === 'Token is not valid!'){
            navigate('/login');
            toast.info("Your session has expired.");
        } else {
            toast.error('Incorrect old password')
        }
    }
}