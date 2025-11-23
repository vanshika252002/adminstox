import axios from 'axios';
import {start_loading,stop_loading} from '../loader/loaderAction'
import { TOKENS_UPDATE, USER_DETAILS, USER_UPDATE } from './authTypes';
import {  toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { check_token_expired_logout } from '../user/userAction';

const { REACT_APP_BASE_URL } = process.env;

const headers = {
  headers: {
    'Content-Type': 'application/json',
    'Accept':'application/json'
  },
};

export const set_update_user = (user,navigate) => {
  localStorage.setItem('auth',JSON.stringify(user));
  localStorage.setItem('token',user?.token);
  localStorage.setItem('refreshtoken',user?.refreshtoken);
  navigate('/');
  return {
    type: USER_UPDATE,
    payload: user,
  };
};


export const login_user = async (data, dispatch, navigate) => {
  dispatch(start_loading());
  try {
    const HEADERS = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}admin/login`;
    const res = await axios.post(urlPath, JSON.stringify(data), HEADERS);

    if (res?.data?.data) {
      toast.success(res?.data?.message,{toastId: "Loginuser"});
      dispatch({ type: TOKENS_UPDATE, payload: res.data.data });
      dispatch(set_update_user(res?.data?.data,navigate));
      localStorage.setItem("attributes",[])
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.log("Error:", error);
    toast(error?.response ? error?.response?.data?.error : error?.message);
  } finally {
    dispatch(stop_loading());
  }
};

export const get_login_user=()=>{
 let data= localStorage.getItem('auth')
 if(data){
  return data
 } else {return false};
}

export const upload_image = async (photo,token,dispatch) => {
  const formData = new FormData();
  photo.forEach((v) => { formData.append(`images`, v); });
  // formData.append("type", "item/image");

  const HEADERS = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-access-token": token,
    },
  };

  try {
    const urlPath = `${REACT_APP_BASE_URL}item/upload-item-image`;
    const res = await axios.post(urlPath, formData, HEADERS);

    if (res.data && res.data.status) {
      toast.success(res.data.message, { toastId: "uploadphto", autoClose: 2000, });
      return res;
    } else {
      toast.error(res.data.message, { toastId: "photoerr", autoClose: 2000 });
      return false;
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const admin_profile = async (token, dispatch) => {
  try {
    const urlPath = `${REACT_APP_BASE_URL}auth/get-profile`;
    const HEADERS = {
      headers: {
       "x-access-token": token,
      },
    };

    const response = await axios.get(urlPath, HEADERS);
    localStorage.setItem('auth', JSON.stringify(response.data.data));
    if(response.data && response.data.data){
      dispatch({ type: USER_DETAILS, payload: response.data.data });
    }
    return response.data.data; 
  } catch (error) {
    check_token_expired_logout(error, dispatch);
    throw error; 
  }
};

export const user_logout = async (dispatch, token) => {
  try {
    const urlPath = `${REACT_APP_BASE_URL}auth/logout`;
    const HEADERS = {
      headers: {
        "x-access-token": token,
      }
    };
    const res = await axios.get(urlPath, HEADERS);
 
    if (res.data && res.data.status) {
      toast.success(res.data.message, { toastId: "updatpwd", autoClose: 1000 });
      return true;
    } else {
      toast.error(res.data.message, { toastId: "updatedpwderr", autoClose: 1000 });
      return false;
    }
  } catch (error) {
    // toast.error(error.response.data.error, { toastId: "updatedwwwww", autoClose: 1000 });
    // check_token_expired_logout(error, dispatch);
  }
};
