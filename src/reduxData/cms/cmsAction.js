import axios from "axios";
import { toast } from "react-toastify";
import { check_token_expired_logout } from "../user/userAction";
import {
  GET_ALL_FAQS,
  GET_BUYING_CONTENT,
  GET_CONTACT_US_CONTENT,
  GET_FINALIZE_CONTENT,
  GET_HEADER_CONTENT,
  GET_INSERTBID_CONTENT,
  GET_NEWSLETTER_CONTENT,
  GET_PHOTO_GUIDE_CONTENT,
  GET_SELL_ITEM_CONTENT,
  GET_SELLING_CONTENT,

  // CMS 
  GET_PRIVACY_POLICY_DATA,
  GET_TERM_DATA,
  GET_COKIE_POLICY_DATA,
  GET_HOW_IT_WORK_DATA,
  GET_ABOUT_DATA,
  GET_FAQ_DATA,
  GET_DPA_DATA,
  GET_RETURN_POLICY_DATA,

} from "./cmsTypes";
import apiClient from "../../api/apiClient";

const { REACT_APP_BASE_URL } = process.env;

export const get_top_image_how_it_works = async (token, question_type) => {
  try {
    const url = `${REACT_APP_BASE_URL}admin/list-content/${question_type}`;
    const HEADERS = {
      headers: {
        'x-access-token': token,
      }
    };
    const res = await axios.get(url, HEADERS);
    if (res.data && res.data.status) {
      return res.data.data;
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const create_faq_question = async (token, form_data, id, dispatch) => {
  try {
    const urlPath = id ? `cms/edit-content/${id}` : `cms/add-content`;
    const res = await axios.post(`${REACT_APP_BASE_URL}${urlPath}`, form_data, {
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json"
      },
    });

    if (res.data && res.data.status) {
      toast.success(res.data.message, { toastId: "addeditem1", autoClose: 2000 });
      return true;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const get_all_faq_questions = async (token, question_type, dispatch) => {
  try {
    const urlPath = `cms/content/${question_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    console.log("question_type",question_type)
    if (res.data && res.data.status) {
      if (question_type === 'InsertBid_content') {
        dispatch({ type: GET_INSERTBID_CONTENT, payload: res.data.data });
      } else if (question_type === 'newsletter_content') {
        dispatch({ type: GET_NEWSLETTER_CONTENT, payload: res.data.data });
      }else if (question_type === 'termsandconditions') {
        dispatch({ type: GET_NEWSLETTER_CONTENT, payload: res.data.data });
      } else {
        dispatch({ type: GET_ALL_FAQS, payload: res.data.data });
      }
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_buying_content = async (token, content_type, dispatch) => {
  try {
    const urlPath = `admin/list-content/${content_type}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_BUYING_CONTENT, payload: res.data.data });
      return res.data.data;
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_selling_content = async (token, content_type, dispatch) => {
  try {
    const urlPath = `admin/list-content/${content_type}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_SELLING_CONTENT, payload: res.data.data });
      return res.data.data;
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_finalizing_content = async (token, content_type, dispatch) => {
  try {
    const urlPath = `admin/list-content/${content_type}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_FINALIZE_CONTENT, payload: res.data.data });
      return res.data.data;
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const update_items_sequence = async (
  token,
  sequencearr,
  question_type,
  dispatch
) => {
  try {
    const urlPath = `admin/update-sequence/${question_type}`;

    const res = await apiClient.put(urlPath, sequencearr);

    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    toast.error(error.response.data.error);
    check_token_expired_logout(error);
  }
};

export const get_contact_us_content = async (token, content_type, dispatch) => {
  try {
    const urlPath = `admin/list-content/${content_type}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_CONTACT_US_CONTENT, payload: res.data.data });
    }
  } catch (error) {
    toast.error(error.response.data.error);
    check_token_expired_logout(error);
  }
};

export const get_sell_item_content = async (token, content_type, dispatch) => {
  try {
    const urlPath = `admin/list-content/${content_type}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_SELL_ITEM_CONTENT, payload: res.data.data });
    }
  } catch (error) {
    toast.error(error.response.data.error);
    check_token_expired_logout(error);
  }
};

export const get_photo_guide_content = async (
  token,
  content_type,
  dispatch
) => {
  try {
    const urlPath = `admin/list-content/${content_type}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_PHOTO_GUIDE_CONTENT, payload: res.data.data });
    }
  } catch (error) {
    toast.error(error.response.data.error);
    check_token_expired_logout(error, dispatch);
  }
};

export const get_header_content = async (token, content_type, dispatch) => {
  try {
    const urlPath = `admin/list-content/${content_type}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_HEADER_CONTENT, payload: res.data.data });
    }
  } catch (error) {
    toast.error(error.response.data.error);
    check_token_expired_logout(error, dispatch);
  }
};

export const upload_cms_photo = async (photo, token, dispatch) => {
  const formData = new FormData();

  photo.forEach((v) => {
    formData.append(`images`, v);
  });
  // formData.append("type", "cms/image");

  try {
    const urlPath = `${REACT_APP_BASE_URL}cms/upload-image`;
    const res = await axios.post(urlPath, formData, {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data && res.data.status) {
      // toast.success(res.data.message);
      return res;
    } else {
      toast.error(res.error, { toastId: "editphotoerrr", autoClose: 2000 });
      return false;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const upload_cms_video = async (video, token, dispatch) => {
  // dispatch(start_loading());
  try {
    const url = `${REACT_APP_BASE_URL}add-item/videoupload`;
    const HEADERS = {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": token,
      }
    };
    const formData = new FormData();
    video.forEach((v) => {
      formData.append(`video`, v);
    });
    formData.append('type', 'cms/video');

    const res = await axios.post(url, formData, HEADERS);
    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return res;
    } else {
      toast.error(res.error, { toastId: "editvideoerrr", autoClose: 2000 });
      return false;
    }
  } catch (error) {
    toast.error(error.response.data.message);
    check_token_expired_logout(error);
  } finally {
    // dispatch(stop_loading());
  }
};




// cms 

export const get_privacy_policy_data = async (token, content_type, dispatch) => {
  try {
    const urlPath = `cms/content/${content_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    if (res.data && res.data.status) {
      if (content_type === 'privacy_policy') {
        dispatch({ type: GET_PRIVACY_POLICY_DATA, payload: res.data.data });
      }
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_faq_data = async (token, content_type, dispatch) => {
  try {
    const urlPath = `cms/content/${content_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    if (res.data && res.data.status) {
        dispatch({ type: GET_FAQ_DATA, payload: res.data.data });
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_term_data = async (token, content_type, dispatch) => {
  try {
    const urlPath = `cms/content/${content_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    if (res.data && res.data.status) {
      if (content_type === 'termsandconditions') {
        dispatch({ type: GET_TERM_DATA, payload: res.data.data });
      }
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_cookie_policy_data = async (token, content_type, dispatch) => {
  try {
    const urlPath = `cms/content/${content_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    if (res.data && res.data.status) {
      if (content_type === 'cookie_policy') {
        dispatch({ type: GET_COKIE_POLICY_DATA, payload: res.data.data });
      }
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_how_it_work_data = async (token, content_type, dispatch) => {
  try {
    const urlPath = `cms/content/${content_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    if (res.data && res.data.status) {
      if (content_type === 'how_it_work') {
        dispatch({ type: GET_HOW_IT_WORK_DATA, payload: res.data.data });
      }
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_about_data = async (token, content_type, dispatch) => {
  try {
    const urlPath = `cms/content/${content_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    if (res.data && res.data.status) {
      if (content_type === 'aboutus') {
        dispatch({ type: GET_ABOUT_DATA, payload: res.data.data });
      }
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const get_dpa_data = async (token, content_type, dispatch) => {
  try {
    const urlPath = `cms/content/${content_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    if (res.data && res.data.status) {
      if (content_type === 'data_processing_agreement') {
        dispatch({ type: GET_DPA_DATA, payload: res.data.data });
      }
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};



export const get_return_policy_data = async (token, content_type, dispatch) => {
  try {
    const urlPath = `cms/content/${content_type}`;

    const res = await axios.get(`${REACT_APP_BASE_URL}${urlPath}`, {
      headers: {
        "x-access-token": token
      },
    });
    if (res.data && res.data.status) {
      if (content_type === 'return_policy') {
        dispatch({ type: GET_RETURN_POLICY_DATA, payload: res.data.data });
      }
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};