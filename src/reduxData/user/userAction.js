import axios from "axios";
import { toast } from "react-toastify";
import {
  GET_ALL_BID_AUCTIONS,
  GET_ALL_CATEGORIES,
  GET_ALL_PAST_AUCTIONS,
  GET_ALL_RUNNING_AUCTIONS,
  GET_ALL_USERS,
  GET_ANALYTICS_DATA,
  GET_BADGE_LISTS,
  GET_BID_TOTAL,
  GET_CONTACT_LISTS,
  GET_ITEM_LISTING,
  GET_ITEM_TOTAL,
  GET_LOGS_DATA,
  GET_NEWSLETTER_LISTS,
  GET_ORDER_LISTS,
  GET_PAST_TOTAL,
  GET_PAYMENT_LISTS,
  GET_RUNNING_TOTAL,
  GET_SINGLE_STAFF,
  GET_STAFF_LISTING,
  GET_TOTAL_CATEGORIES,
  GET_TOTAL_USERS,
  USER_DISPUTES,
  USER_FLAG_COMMENTS,
} from "./userTypes";
import { start_loading, stop_loading } from "../loader/loaderAction";
import moment from "moment";
import { RESET_TOKEN } from "../auth/authTypes";
import apiClient from "../../api/apiClient";
// import { Category } from "@mui/icons-material";

const { REACT_APP_BASE_URL } = process.env;
const get_token = () => {
  let token = localStorage.getItem("token");
  return token;
};
// const token = get_token()
export const DESIGNATION = [
  {
    label: "Reviewer",
    value: "reviewers",
  },
  {
    label: "Manager",
    value: "managers",
  },
  {
    label: "Owner",
    value: "owners",
  },
];

export const show_success = (message) => {
  toast(message, { autoClose: 2000 });
};

const headers = {
  "Content-Type": "application/json",
  "x-access-token": get_token(),
};

export const check_token_expired_logout = (data, dispatch) => {
  if (data?.request?.status === 401) {
    toast.error(data.response.data.error, {
      toastId: "sessionexpired",
      autoClose: 2000,
    });
    dispatch({ type: RESET_TOKEN, payload: true });
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
  }
};

export const gotToExport = (data, label) => {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${label}(${moment()?.format("MMM DD, YYYY")?.replace(/,/g, "")}).csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const upload_image = async (photo, token, dispatch) => {
  const formData = new FormData();
  // photo.forEach((v) => {
  //   formData.append(`images`, v);
  // });
  formData.append("image", photo);

  const HEADERS = {
    headers: {
      "x-access-token": token,
    },
  };

  try {
    const urlPath = `${REACT_APP_BASE_URL}auth/upload-image`;
    const res = await axios.post(urlPath, formData, HEADERS);

    if (res.data && res.data.status) {
      // toast.success(res.data.message, { toastId: "uploadphto", autoClose: 2000, });
      return res;
    } else {
      toast.error(res.data.message, { toastId: "photoerr", autoClose: 2000 });
      return false;
    }
  } catch (error) {
    toast.error(error.response.data.message);
    // check_token_expired_logout(error, dispatch);
  }
};

export const upload_multiple_image = async (formData, token) => {
  const HEADERS = {
    headers: {
      "x-access-token": token,
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const urlPath = `${REACT_APP_BASE_URL}item/upload-item-image`;
    const res = await axios.post(urlPath, formData, HEADERS);
    return res;
  } catch (error) {
    toast.error(error.response?.data?.message || "Image upload failed");
    return false;
  }
};

export const get_export_users = async (dispatch, token, userId) => {
  dispatch(start_loading());
  try {
    const urlPath = `admin/export-user`;

    const res = await apiClient.post(urlPath, {
      userIds: userId ? [userId] : [],
    });

    if (res?.data) {
      return res?.data;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
    console.error("Error:", error);
  } finally {
    dispatch(stop_loading());
  }
};

export const update_password = async (userdata, token, dispatch) => {
  try {
    const urlPath = `profile/change-password`;

    const res = await apiClient.put(urlPath, userdata);

    if (res.data && res.data.status) {
      toast.success(res.data.message, { toastId: "updatpwd", autoClose: 1000 });
      return true;
    } else {
      toast.error(res.data.message, {
        toastId: "updatedpwderr",
        autoClose: 1000,
      });
      return false;
    }
  } catch (error) {
    toast.error(error.response.data.error, {
      toastId: "updatedwwwww",
      autoClose: 1000,
    });
    // catch_errors_handle(error);
    check_token_expired_logout(error, dispatch);
  }
};

export const get_export_sales = async (dispatch, token, userId, year) => {
  dispatch(start_loading());
  try {
    const urlPath = `admin/export-sales-report`;

    const res = await apiClient.post(urlPath, {
      user_id: userId === "ALL" ? null : userId,
      start_date: moment().year(year).startOf("year"),
      end_date: moment().year(year).endOf("year"),
    });

    if (res?.data) {
      return res?.data;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
    console.error("Error:", error);
  } finally {
    dispatch(stop_loading());
  }
};

export const withdraw_auction = async (dispatch, token, itemId) => {
  dispatch(start_loading());
  try {
    const urlPath = `admin/auction-withdrawn`;

    const res = await apiClient.put(urlPath, { itemId: itemId });

    if (res?.data) {
      return res?.data;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  } finally {
    dispatch(stop_loading());
  }
};

// export const get_users = async (
//   dispatch,
//   token,
//   currentPage,
//   perPage,
//   search,
// ) => {
//   try {
//     const HEADERS = {
//       headers: {
//         "x-access-token": token
//       }
//     };
//     const urlPath = `${REACT_APP_BASE_URL}admin/user-list?page=${currentPage}&limit=${perPage}${search ? `&search=${search}` : ""}`;

//     const res = await axios.get(urlPath, HEADERS);

//     if (res?.data?.data) {
//       dispatch({ type: GET_ALL_USERS, payload: res?.data?.data });
//       dispatch({ type: GET_TOTAL_USERS, payload: Number(res.data.length) });
//       return res?.data;
//     } else {
//       console.log("You have an error");
//     }
//   } catch (error) {
//     check_token_expired_logout(error, dispatch);
//     console.error("Error:", error);
//   }
// };

export const get_users = async (
  dispatch,
  token,
  currentPage,
  perPage,
  search,
  status,
  role
) => {
  try {
    const HEADERS = {
      headers: {
        "x-access-token": token,
      },
    };

    let urlPath = `${REACT_APP_BASE_URL}admin/user-list?page=${currentPage}&limit=${perPage}`;
    if (search) urlPath += `&search=${search}`;
    if (status && status !== "All") urlPath += `&status=${status}`;
    // if (role) urlPath += `&role=${role}`; // 👈 append filter

    const res = await axios.get(urlPath, HEADERS);

    if (res?.data?.data) {
      dispatch({ type: GET_ALL_USERS, payload: res?.data?.data });
      dispatch({ type: GET_TOTAL_USERS, payload: Number(res.data.length) });
      return res?.data;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
    console.error("Error:", error);
  }
};

export const get_particular_user = async (id, token, dispatch) => {
  try {
    const HEADERS = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}admin/user-details/${id}`;

    const res = await axios.get(urlPath, HEADERS);

    if (res?.data?.data) {
      return res?.data?.data;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const get_newsletter_lists = async (
  token,
  dispatch,
  page,
  limit,
  search
) => {
  try {
    const HEADERS = {
      headers: { "x-access-token": token },
    };
    let urlPath = `${REACT_APP_BASE_URL}admin/get-newsletter?page=${page}&limit=${limit}`;
    if (search) urlPath += `&search=${search}`;
    const res = await axios.get(urlPath, HEADERS);
    if (res?.data && res?.data?.status) {
      dispatch({ type: GET_NEWSLETTER_LISTS, payload: res?.data });
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const delete_newsletter_email = async (dispatch, token, id) => {
  try {
    const HEADERS = {
      headers: { "x-access-token": token },
    };
    const urlPath = `${REACT_APP_BASE_URL}admin/delete-newsletter/${id}`;
    const res = await axios.delete(urlPath, HEADERS);
    if (res?.data && res?.data?.status) {
      show_success("Email Deleted Successfully");
      return true;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const get_contact_lists = async (
  token,
  dispatch,
  page,
  limit,
  search
) => {
  try {
    const HEADERS = {
      headers: { "x-access-token": token },
    };
    let urlPath = `${REACT_APP_BASE_URL}admin/get-query-form?page=${page}&limit=${limit}`;
    if (search) urlPath += `&search=${search}`;

    const res = await axios.get(urlPath, HEADERS);
    if (res?.data && res?.data?.status) {
      dispatch({ type: GET_CONTACT_LISTS, payload: res?.data });
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const searchUsersAPI = async (searchTerm) => {
  try {
    const res = await apiClient.get(
      `admin/search-users?searchTerm=${searchTerm}`
    );
    if (res.data && res.data.status) {
      return res.data.users;
    }
    return [];
  } catch (error) {
    console.error("API Error searching users:", error);
    toast.error("Could not fetch users.");
    return [];
  }
};

export const sendNotificationAPI = async (payload) => {
  try {
    const res = await apiClient.post("admin/notify", payload);
    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return true;
    }
    toast.error(res.data.message || "An error occurred.");
    return false;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to send notification."
    );
    return false;
  }
};

export const update_user = async (
  id,
  data,
  navigate,
  token,
  dispatch,
  isActive,
  message
) => {
  // if (data?.isDeactive === "Deactivate") {
  //   data.isDeactive = true;
  // } else {
  //   data.isDeactive = false;
  // }

  try {
    const urlPath = `${REACT_APP_BASE_URL}admin/user-edit/${id}`;

    const res = await axios.post(urlPath, JSON.stringify(data), {
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
    });

    if (res?.data?.data) {
      // if (!isActive) {
      show_success(isActive ? message : res?.data?.message);
      navigate("/users");
      // }
      return true;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const delete_user = async (dispatch, token, userId) => {
  // dispatch(start_loading());
  try {
    const HEADERS = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}admin/delete-user/${userId}`;
    const res = await axios.delete(urlPath, HEADERS);

    if (res?.data) {
      show_success(res?.data?.message);
      return true;
    }
  } catch (error) {
    //check_token_expired_logout(error, dispatch);
  } finally {
    // dispatch(stop_loading());
  }
};

export const delete_product = async (token, id) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const url = `${REACT_APP_BASE_URL}item/delete-master-product/${id}`;
    const res = await axios.delete(url, headers);
    if (res?.data) {
      show_success(res?.data?.message);
      return true;
    }
  } catch (error) {}
};

export const update_admin = async (data, navigate, token, dispatch) => {
  try {
    const urlPath = `${REACT_APP_BASE_URL}admin/edit-admin`;
    const HEADERS = {
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(urlPath, JSON.stringify(data), HEADERS);
    if (res.status && res?.data?.data) {
      localStorage.setItem("profile", JSON.stringify(res?.data?.data));
      show_success("Profile Updated Successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2700);
      return true;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    //check_token_expired_logout(error, dispatch);
  }
};

export const get_all_sell_Item = async (
  token,
  dispatch,
  page,
  limit,
  listtype,
  queryCat
) => {
  try {
    // const urlPath = `admin/list_for_approval?page=${page}&limit=${limit}&type=${listtype}${
    //   queryCat ? `&${queryCat}` : ""
    // }`;
    const urlPath = `${REACT_APP_BASE_URL}admin/list-item?status=${listtype}&page=${page}&limit=${limit}`;
    const HEADERS = {
      headers: { "x-access-token": token },
    };

    const res = await axios.get(urlPath, HEADERS);

    if (res.data && res.data.status) {
      dispatch({ type: GET_ITEM_LISTING, payload: res.data.data });
      dispatch({ type: GET_ITEM_TOTAL, payload: res.data.length });
      return res;
    } else {
      dispatch({ type: GET_ITEM_LISTING, payload: [] });
      dispatch({ type: GET_ITEM_TOTAL, payload: 0 });
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    dispatch({ type: GET_ITEM_LISTING, payload: [] });
    dispatch({ type: GET_ITEM_TOTAL, payload: 0 });
    // check_token_expired_logout(error, dispatch);
  }
};

export const get_single_sell_Item = async (id, dispatch) => {
  try {
    const urlPath = `item/detail?slug=${id}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      return res.data.data;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const get_product_Detail = async (token, id) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}item/master-product-details?product_id=${id}`;
    const res = await axios.get(urlPath, headers);
    if (res?.data) {
      return res?.data;
    }
  } catch (error) {
    toast.error(error?.response?.message || error?.response?.data?.message||"Failed")
  }
};

export const edit_item_list = async (user, navigate, token) => {
  try {
    const urlPath = `item/add`;

    const res = await axios.post(urlPath, user);

    if (res?.data?.status) {
      navigate("/item-listing");
      show_success(res?.data?.message);
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);

    check_token_expired_logout(error);
    // Handle error here
  } finally {
  }
};

export const auction_details = async (slug, token, dispatch) => {
  try {
    const url = `${REACT_APP_BASE_URL}admin/item-details/${slug}`;
    const HEADERS = {
      headers: {
        "x-access-token": token,
      },
    };
    const res = await axios.get(url, HEADERS);

    if (res?.data && res?.data?.status) {
      return res.data.data;
    }
  } catch (error) {
    // console.error("Error:", error);
    //check_token_expired_logout(error, dispatch);
  }
};

export const approve_auction = async (
  itemdata,
  navigate,
  token,
  dispatch,
  status
) => {
  try {
    const url = `${REACT_APP_BASE_URL}admin/approve-item`;
    const HEADERS = {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    };
    const res = await axios.post(url, itemdata, HEADERS);

    if (res?.data && res?.data?.status) {
      show_success(
        status === "approved"
          ? "Approved Successfully"
          : "Rejected Successfully"
      );
      // navigate("/item-listing");
      return res.data;
    }
  } catch (error) {
    console.error("Error:", error);
    //check_token_expired_logout(error, dispatch);
  } finally {
  }
};

export const unapprove_auction = async (
  itemdata,
  navigate,
  token,
  dispatch
) => {
  try {
    const urlPath = `admin/approve_auction`;

    const res = await apiClient.put(urlPath, itemdata);

    if (res?.data && res?.data?.status) {
      navigate("/item-listing");
      show_success(res?.data?.message);
      return res;
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  } finally {
  }
};

export const get_past_auctions = async (
  dispatch,
  token,
  page,
  limit,
  categories
) => {
  try {
    const urlPath = `admin/past_auction?page=${page}&limit=${limit}${
      categories ? `&${categories}` : ""
    }`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_ALL_PAST_AUCTIONS, payload: res?.data?.data });
      dispatch({ type: GET_PAST_TOTAL, payload: res.data.total });
      return res;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const manage_sub_category = async (data, token, dispatch, id) => {
  try {
    const urlPath = id
      ? `/admin/sub_edit_category/${id}`
      : `/admin/sub_category`;

    const response = await apiClient.post(urlPath, data);

    if (response?.status >= 200 && response?.status < 300) {
      show_success(response?.data?.message);
    } else {
      throw new Error("Network response was not ok");
    }
    return response;
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

// export const add_category = async (data, token, dispatch) => {
//   try {
//     const HEADERS = {
//       headers: {
//         "x-access-token": token,
//         "Content-Type": 'application/json'
//       }
//     };
//     const urlPath = `${REACT_APP_BASE_URL}admin/create-category`;
//     const response = await axios.post(urlPath, JSON.stringify(data), HEADERS);

//     // Check if the response is successful (status code 2xx)
//     if (response?.status >= 200 && response?.status < 300) {
//       show_success(response?.data?.message);
//     } else {
//       throw new Error("Network response was not ok");
//     }

//     return response;
//   } catch (error) {
//     console.error("Error:", error);
//     check_token_expired_logout(error, dispatch);
//     throw error; // Rethrow the error to handle it in the calling code if needed
//   }
// };

export const add_category = async (data, token, dispatch) => {
  try {
    const HEADERS = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}admin/create-category`;
    const response = await axios.post(urlPath, data, HEADERS);

    // If backend created successfully
    if (response?.status >= 200 && response?.status < 300) {
      toast.success(
        response?.data?.message || "Category created successfully!"
      );
    }
    return response;
  } catch (error) {
    console.error("Error:", error);

    if (error?.response?.status === 422) {
      toast.error(error?.response?.data?.message || "Category already exists!");
      return error.response; // return so caller knows it failed
    }

    if (error?.response?.data?.message) {
      console.log(error.response.data.message);
    } else {
      console.log("Something went wrong. Please try again.");
    }

    check_token_expired_logout(error, dispatch);
    throw error;
  }
};

export const edit_category = async (data, token, id, dispatch) => {
  try {
    const HEADERS = {
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}admin/edit-category/${id}`;
    const response = await axios.put(urlPath, JSON.stringify(data), HEADERS);

    if (!response?.data?.status) {
      throw new Error("Network response was not ok");
    } else {
      show_success(response?.data?.message);
    }

    return response;
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const edit_product = async (token, values, id, navigate) => {
  try {
    const HEADERS = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}item/edit-master-product/${id}`;

    const res = await axios.put(urlPath, values, HEADERS);
    if (res.data) {
      show_success(res?.data?.message);
      navigate("/products");
      return true;
    }
  } catch (error) {}
};

export const apply_feature_category = async (data, token, id, dispatch) => {
  try {
    const urlPath = `admin/edit_category/${id}`;

    const response = await apiClient.put(urlPath, data);

    if (response.data && response?.data?.status) {
      toast.success(response.data.message, { toastId: "succesone" });
    }
  } catch (error) {
    toast.error(error.response.data.message, { toastId: "suceestwo" });
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

// export const get_category = async (dispatch, token, page, limit, search) => {
//   try {
//     const HEADERS = {
//       headers: {
//         "x-access-token": token,
//       }
//     };
//     const urlPath = `${REACT_APP_BASE_URL}admin/list-category?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;

//     const res = await axios.get(urlPath, HEADERS);

//     if (res.data && res.data.status) {
//       dispatch({ type: GET_ALL_CATEGORIES, payload: res.data.data });
//       dispatch({ type: GET_TOTAL_CATEGORIES, payload: Number(res.data.length) });
//       return res;
//     } else {
//       console.log("You have an error");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     check_token_expired_logout(error, dispatch);
//   }
// };

export const get_category = async (
  dispatch,
  token,
  page,
  limit,
  search,
  status
) => {
  try {
    const HEADERS = {
      headers: {
        "x-access-token": token,
      },
    };

    // Build query params dynamically
    let urlPath = `${REACT_APP_BASE_URL}admin/list-category`;
    if (page || limit) urlPath += `?page=${page}&limit=${limit}`;
    if (search) urlPath += `&search=${search}`;
    if (status && status !== "All") urlPath += `&status=${status}`;

    const res = await axios.get(urlPath, HEADERS);

    if (res.data && res.data.status) {
      dispatch({ type: GET_ALL_CATEGORIES, payload: res?.data?.data });
      // localStorage.setItem("categories", JSON.stringify(res?.data?.data));
      dispatch({
        type: GET_TOTAL_CATEGORIES,
        payload: Number(res.data.length),
      });

      return res.data;
    } else {
      console.log("Error: Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const search_products = async (token, s, page, limit) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}item/get-master-products?search=${s}`;
    const res = await axios.get(urlPath, headers);
    if (res?.data) {
      return res?.data;
    }
  } catch {}
};

export const delete_category = async (id, token, dispatch, message) => {
  try {
    const HEADERS = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}admin/delete-category/${id}`;
    const res = await axios.delete(urlPath, HEADERS);

    if (res.data && res.data.status) {
      show_success(message);
      // show_success(res?.data?.message);
      return res;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const get_running_auctions = async (
  dispatch,
  token,
  page,
  limit,
  categories
) => {
  try {
    const urlPath = `admin/running_auction?page=${page}&limit=${limit}${
      categories ? `&${categories}` : ""
    }`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_ALL_RUNNING_AUCTIONS, payload: res?.data?.data });
      dispatch({ type: GET_RUNNING_TOTAL, payload: res?.data?.total });
      return res;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const get_all_auction_category = async () => {
  try {
    const urlPath = `admin/list_category`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      return res.data.data;
    } else {
    }
  } catch (error) {
    check_token_expired_logout(error);
  }
};

export const sell_video_game = async (userdata, dispatch) => {
  try {
    const urlPath = `item/add`;

    const res = await apiClient.post(urlPath, userdata);

    if (res.data && res.data.status) {
      toast.success(res.data.message, {
        toastId: "itemupdetsws",
        autoClose: 2000,
      });
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (error) {
    // console.log("//////////////", error)
    check_token_expired_logout(error, dispatch);
  }
};

export const upload_sell_item_photo = async (photo, token, dispatch) => {
  const formData = new FormData();

  photo.forEach((v) => {
    formData.append(`photos`, v);
  });
  formData.append("type", "item/image");

  try {
    const urlPath = `add-item/mediaImage`;

    const res = await apiClient.post(urlPath, formData);

    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return res;
    } else {
      toast.error(res.error, { toastId: "editphotoerrr", autoClose: 2000 });
      return false;
    }
  } catch (error) {
    toast.error(error.response.data.message);
    // catch_errors_handle(error);
    check_token_expired_logout(error, dispatch);
  }
};

export const upload_public_doc = async (photo, token, dispatch) => {
  const formData = new FormData();

  photo.forEach((v) => {
    formData.append(`public_file`, v);
  });

  try {
    const urlPath = `upload-public-doc`;

    const res = await apiClient.post(urlPath, formData);

    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return res;
    } else {
      toast.error(res.data.error, {
        toastId: "editphotoerrr",
        autoClose: 2000,
      });
      return false;
    }
  } catch (error) {
    toast.error(error.response.data.message);
    check_token_expired_logout(error, dispatch);
  }
};

export const upload_edit_item_video = async (video, token, dispatch) => {
  // dispatch(start_loading());
  try {
    const formData = new FormData();
    video.forEach((v) => {
      formData.append(`video`, v);
    });
    formData.append("type", "item/video");

    const urlPath = `add-item/videoupload`;

    const res = await apiClient.post(urlPath, formData);

    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return res;
    } else {
      toast.error(res.error, { toastId: "editvideoerrr", autoClose: 2000 });
      return false;
    }
  } catch (error) {
    toast.error(error.response.data.message);
    check_token_expired_logout(error, dispatch);
  } finally {
    // dispatch(stop_loading());
  }
};
export const add_item = async (token, values) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `item/add-master-product`;
    const res = await apiClient.post(urlPath, values, headers);
    if (res.data && res.data.status) {
      show_success(res.data.message);
      return res;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error adding item");
  }
};

export const get_master_products = async (token) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `item/get-master-products`;
    const res = await apiClient.get(urlPath, headers);
    if (res.data) {
      return res;
    }
  } catch (error) {
    toast.error(res?.response?.data);
  }
};

export const upload_sell_item_logal_docs = async (
  legal_doc,
  token,
  dispatch
) => {
  try {
    const formData = new FormData();
    legal_doc.forEach((doc) => {
      formData.append("legal_doc", doc);
    });
    formData.append("type", "item/legalDocs");

    // formData.append('legal_doc', legal_doc);
    const urlPath = `add-item/legaldocs`;

    const res = await apiClient.post(urlPath, formData);

    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return res;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const get_all_bid_items = async (
  dispatch,
  token,
  search,
  page,
  limit
) => {
  try {
    const urlPath = `item/all_items?search=${
      search ? search : ""
    }&page=${page}&limit=${limit}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_ALL_BID_AUCTIONS, payload: res.data.data });
      dispatch({ type: GET_BID_TOTAL, payload: res.data.total });
      return res;
    }
  } catch (error) {
    console.log("bid management", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const get_item_bid_detail = async (itemId, token, dispatch) => {
  try {
    const urlPath = `item/all_bids?itemId=${itemId}`;

    const res = await apiClient.get(urlPath);

    return res;
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

//badge apis

export const get_badge_lists = async (token, dispatch) => {
  try {
    const urlPath = `admin/list-badge`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_BADGE_LISTS, payload: res.data.data });
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const add_badge = async (token, badge_data, badgeId, dispatch) => {
  try {
    const urlPath = badgeId
      ? `admin/update-badge/${badgeId}`
      : `admin/add-badge`;

    const res = await (badgeId
      ? apiClient.put(urlPath, badge_data)
      : apiClient.post(urlPath, badge_data));

    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return true;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const delete_badge = async (token, badgeId, dispatch) => {
  try {
    const urlPath = `admin/delete-badge/${badgeId}`;

    const res = await apiClient.delete(urlPath);

    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return true;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const delete_faq_question = async (token, faqId, dispatch) => {
  try {
    const url = `${REACT_APP_BASE_URL}admin/delete-content/seller`;
    const HEADERS = {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      data: { id: faqId },
    };

    const res = await axios.delete(url, HEADERS);
    if (res.data && res.data.status) {
      toast.success(res.data.message);
      return true;
    }
  } catch (error) {
    toast.error(error.response.data.message, {
      toastId: "deltefaw",
      autoClose: 2000,
    });
    check_token_expired_logout(error, dispatch);
  }
};

export const get_user_sales_history = async (token, data, dispatch) => {
  try {
    const urlPath = `user/sales-report`;

    const res = await apiClient.post(urlPath, data);

    if (res.data && res.data.status) {
      // console.log(res.data);
      return res.data.data;
    } else {
    }
  } catch (error) {
    toast.error(error.response.data.error, {
      toastId: "saleshistiewr",
      autoClose: 2000,
    });
    check_token_expired_logout(error, dispatch);
  }
};

export const get_all_staff = async (
  token,
  dispatch,
  page,
  limit,
  search,
  uid
) => {
  try {
    const urlPath = `admin/staff-list?page=${page}&limit=${limit}${
      search ? `&search=${search}` : ""
    }`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_STAFF_LISTING, payload: { ...res.data, uid: uid } });
      return res;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const get_staff = async (token, dispatch, id) => {
  try {
    const urlPath = `admin/get-staff/${id}`;

    const res = await apiClient.get(urlPath);

    if (res.data && res.data.status) {
      dispatch({ type: GET_SINGLE_STAFF, payload: res.data.data });
      return res;
    } else {
      console.log("You have an error");
    }
  } catch (error) {
    console.error("Error:", error);
    check_token_expired_logout(error, dispatch);
  }
};

export const manage_staff = async (token, data, id, dispatch) => {
  try {
    const urlPath = id ? `admin/editUser?userId=${id}` : `admin/create-staff`;

    const res = await (id
      ? apiClient.put(urlPath, data)
      : apiClient.post(urlPath, data));

    if (res.data && res.data.status) {
      toast.success(res.data.message);
      get_all_staff(token, dispatch, 1, 10, null);
      return true;
    } else {
      toast.error(res.data.error, {
        toastId: "errorsearchsaved",
        autoClose: 1000,
      });
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    //toast.error(error.response.data.error || error.response.data.message, { toastId: "errorsearchsaved", autoClose: 1000 });
    check_token_expired_logout(error, dispatch);
  }
};

export const user_dispute = async (
  dispatch,
  token,
  page,
  limit,
  search,
  method,
  data
) => {
  try {
    const urlPath =
      method === "get"
        ? `admin/dispute-list?page=${page}&limit=${limit}${
            search ? `&search=${search}` : ""
          }`
        : `admin/change-status`;

    const res = await (method === "get"
      ? apiClient.get(urlPath)
      : apiClient.put(urlPath, data));

    if (res.data && res.data.status) {
      if (method == "get") {
        dispatch({ type: USER_DISPUTES, payload: res.data });
      } else {
        toast.success(res.data.message, {
          toastId: "savedsearchshs",
          autoClose: 1000,
        });
        return true;
      }
    }
  } catch (error) {
    toast.error(error.response.data.error, {
      toastId: "errorsearchsaved",
      autoClose: 1000,
    });
    check_token_expired_logout(error, dispatch);
  }
};

export const user_flag_comments = async (
  dispatch,
  token,
  page,
  limit,
  search,
  method,
  data
) => {
  try {
    const urlPath =
      method === "get"
        ? `item/flag-Comments?page=${page}&limit=${limit}${
            search ? `&search=${search}` : ""
          }`
        : `item/flag-Comments-status`;

    const res = await (method === "get"
      ? apiClient.get(urlPath)
      : apiClient.post(urlPath, data));

    if (res.data && res.data.status) {
      if (method == "get") {
        dispatch({ type: USER_FLAG_COMMENTS, payload: res.data });
      } else {
        toast.success("Succussfully updated flag comment status!", {
          toastId: "savedsearchshs",
          autoClose: 1000,
        });
        return true;
      }
    }
  } catch (error) {
    toast.error(error.response.data.error, {
      toastId: "errorsearchsaved",
      autoClose: 1000,
    });
    check_token_expired_logout(error, dispatch);
    return false;
  }
};

export const getPendingFlagsAPI = async (page = 1, limit = 10) => {
  try {
    const res = await apiClient.get(
      `admin/flags/pending?page=${page}&limit=${limit}`
    );

    if (res.data && res.data.status) {
      return res.data;
    } else {
      toast.error(res.data.message || "Could not fetch reports.");
      return { data: [], total: 0 };
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load reports.");
    console.error("API Error fetching pending flags:", error);
    return null;
  }
};

export const reviewFlagAPI = async (payload) => {
  try {
    const res = await apiClient.post("admin/flags/review", payload);

    if (res.data && res.data.status) {
      return true;
    } else {
      toast.error(
        res.data.message || "An error occurred while reviewing the report."
      );
      return false;
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to review the report."
    );
    console.error("API Error reviewing flag:", error);
    return false;
  }
};

export const getAwardsAPI = async () => {
  try {
    const res = await apiClient.get("admin/list-award");

    if (res.data && res.data.status) {
      return res.data.data;
    } else {
      toast.error(res.data.message || "Could not fetch awards.");
      return [];
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load awards.");
    console.error("API Error fetching awards:", error);
    return null;
  }
};

export const createAwardAPI = async (awardData) => {
  try {
    const res = await apiClient.post("admin/add-award", awardData);

    if (res.data && res.data.status) {
      toast.success("Award created successfully!");
      return res.data.data;
    } else {
      toast.error(res.data.message || "Could not create award.");
      return null;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create award.");
    console.error("API Error creating award:", error);
    return null;
  }
};

export const grantAwardAPI = async (userId, awardId) => {
  try {
    const res = await apiClient.post("admin/grant-award", { userId, awardId });

    if (res.data && res.data.status) {
      toast.success(res.data.message || "Award granted successfully!");
      return true;
    } else {
      toast.error(res.data.message || "Could not grant award.");
      return false;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to grant award.");
    console.error("API Error granting award:", error);
    return false;
  }
};

export const updateAwardAPI = async (awardId, awardData) => {
  try {
    const res = await apiClient.put(`admin/update-award/${awardId}`, awardData);

    if (res.data && res.data.status) {
      toast.success("Award updated successfully!");
      return res.data.data;
    } else {
      toast.error(res.data.message || "Could not update award.");
      return null;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update award.");
    console.error("API Error updating award:", error);
    return null;
  }
};

export const deleteAwardAPI = async (awardId) => {
  try {
    const res = await apiClient.delete(`admin/delete-award/${awardId}`);

    if (res.data && res.data.status) {
      toast.success("Award deleted successfully!");
      return true;
    } else {
      toast.error(res.data.message || "Could not delete award.");
      return false;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete award.");
    console.error("API Error deleting award:", error);
    return false;
  }
};

export const uploadAwardImageAPI = async (formData) => {
  try {
    const res = await apiClient.post("admin/upload-award-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data && res.data.status) {
      toast.success(res.data.message || "Image uploaded successfully!");
      return res.data;
    } else {
      toast.error(res.data.message || "Could not upload image.");
      return null;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Image upload failed.");
    console.error("API Error uploading image:", error);
    return null;
  }
};

export const get_all_orders = async (token, dispatch, status, page, limit) => {
  try {
    const urlPath = `${REACT_APP_BASE_URL}admin/order-list?status=${status}&page=${page}&limit=${limit}`;
    const HEADERS = {
      headers: { "x-access-token": token },
    };
    const res = await axios.get(urlPath, HEADERS);

    if (res.data && res.data.status) {
      dispatch({ type: GET_ORDER_LISTS, payload: res.data });
      return res;
    } else {
      return null;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const get_all_payments = async (token, dispatch, page, limit) => {
  try {
    const urlPath = `${REACT_APP_BASE_URL}admin/payment-list?page=${page}&limit=${limit}`;
    const HEADERS = {
      headers: { "x-access-token": token },
    };
    const res = await axios.get(urlPath, HEADERS);

    if (res.data && res.data.status) {
      dispatch({ type: GET_PAYMENT_LISTS, payload: res.data });
      return res;
    } else {
      return null;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const get_analytics_data = async (token, dispatch) => {
  try {
    const urlPath = `${REACT_APP_BASE_URL}admin/dashboard_analytics`;
    const HEADERS = {
      headers: { "x-access-token": token },
    };
    const res = await axios.get(urlPath, HEADERS);
    if (res.data && res.data.status) {
      dispatch({ type: GET_ANALYTICS_DATA, payload: res.data });
      return res;
    } else {
      return null;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};

export const get_logs_data = async (
  token,
  dispatch,
  page,
  limit,
  filterval
) => {
  try {
    const urlPath = `${REACT_APP_BASE_URL}admin/user-logs?page=${page}&limit=${limit}&action_type=${filterval}`;
    const HEADERS = {
      headers: { "x-access-token": token },
    };
    const res = await axios.get(urlPath, HEADERS);
    if (res.data && res.data.status) {
      dispatch({ type: GET_LOGS_DATA, payload: res.data });
      return res;
    } else {
      return null;
    }
  } catch (error) {
    check_token_expired_logout(error, dispatch);
  }
};



export const get_attributes = async (token) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}item/get-attributes`;
    const res = await axios.get(urlPath, headers);
    if (res?.data) {
      return res;
    }
  } catch (error) {}
};

export const add_variant = async (token, data) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}items/add-variants`;

    const res = await axios.post(urlPath, data, headers);
    if (res?.data) {
      toast.success(res?.data?.message || "Added");
    }
  } catch (error) {
    toast.error(error?.response?.message || "Failed");
  }
};

export const add_size = async (token, data) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}item/add-sizes`;
    const res = await axios.post(urlPath, data, headers);
    if (res?.data) {
      toast.success(res?.data?.message || "Added");
    }
  } catch (error) {
    toast.error(error?.response?.message || "Failed");
  }
};

// BRAND APIS START

export const add_brand_name = async (token, data) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}item/add-brand`;
    const res = await axios.post(urlPath, data, headers);
    if (res?.data) {
      show_success(res?.data?.message || "Brand name is added");
      return true;
    }
  } catch (error) {
    console.log("resposne error ", error?.response?.data?.error);
    toast.error(error?.response?.message || error?.response?.data?.error);
  }
};

export const get_brand_name = async (token) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}item/get-brands`;
    const res = await axios.get(urlPath, headers);
    if (res?.data) {
      return res?.data;
    }
  } catch (error) {
    toast.error(error?.response?.message || error?.response?.data?.error);
  }
};

export const delete_brand_name = async (token, id) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}item/delete-brand/${id}`;
    const res = await axios.delete(urlPath, headers);
    if (res?.data) {
      show_success(res?.data?.message || "Deleted Successfully");
      return true;
    }
  } catch (error) {
    toast.error(error?.response?.message || error?.response?.data?.error);
  }
};

export const update_brand_name = async (token, id, payload) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}item/update-brand/${id}`;
    const res = await axios.put(urlPath, payload, headers);
    if (res?.data) {
      show_success(res?.data?.message || "Updated Successfully");
      return true;
    }
  } catch (error) {
    toast.error(error?.response?.message || error?.response?.data?.error);
  }
};

// BRAND APIS END

//ATTRIBUTES APIS START

export const add_attribute = async (token, data) => {
  try {
    const headers = {
      headers: { "x-access-token": token },
    };
    const urlPath = `${REACT_APP_BASE_URL}item/add-attributes`;
    const res = await axios.post(urlPath, data, headers);
    if (res?.data) {
      show_success(res?.data?.message);
      return true;
    }
  } catch (error) {
    toast.error(error?.response?.message  || error?.response?.data?.error || "Failed");
  }
};

export const delete_attribute = async (token, id) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    const urlPath = `${REACT_APP_BASE_URL}item/delete-attribute-value/${id}`;
    const res = await axios.delete(urlPath, headers);
    if (res?.data) {
      show_success(res?.data?.message || "Deleted Successfully");
      return true;
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.error || error?.response?.message || "Failed"
    );
  }
};

export const edit_atribute = async (token, data, id) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}item/edit-attribute/${id}`;

    const res = await axios.put(urlPath, data, headers);
    if (res?.data) {
      show_success(res?.data?.message || "Updated Successfully");
      return true;
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.error || error?.response?.message || "Failed"
    );
  }
};

export const add_values_attributes = async (token, data) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}item/add-attribute-value`;
    const res = await axios.post(urlPath, data, headers);
    if (res?.data) {
      show_success(res?.data?.message || "Values added Successfully");
      return true;
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.error ||
        error?.response?.message ||
        "Failed to add Values"
    );
  }
};

export const get_attributes_values = async (token, id) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };
    let urlPath = `${REACT_APP_BASE_URL}item/get-attributes-value`;
    if (id) {
      urlPath += `?attribute_id=${id}`;
    }
    
    const res = await axios.get(urlPath, headers);
    
    if (res?.data) {
      return res?.data;
    }
  } catch (error) {}
};

export const delete_attribute_values = async (token, id) => {
  try {
    const headers = {
      headers: {
        "x-access-token": token,
      },
    };

    const urlPath = `${REACT_APP_BASE_URL}/item/delete-attribute-value/${id}`;
    const res = await axios.delete(urlPath, headers);
    if (res?.data) {
      show_success(res?.data?.message || "Deleted Successfully");
    }
  } catch (error) {
    toast.error(
      error?.response?.message ||
        error?.response?.data?.error ||
        "Failed to delete"
    );
  }
};



export const generate_variants = async(token ,ids )=>
{
  try{
  
    const urlPath = `${REACT_APP_BASE_URL}item/add-variants`;
    const headers={
      headers:{
        "x-access-token":token
      }
    }

    const  res= await axios.post(urlPath,ids,headers);
 if(res?.data)
 {
  show_success(res?.data?.message);
  return true;
 }
  }catch(error)
  {
 toast.error(error?.response?.message || error?.response?.data?.error || "Failed to generate Variants")
  }
}

// ATTRIBUTES APIS END



// VARIANTS START

export const get_variants = async(token,id)=>{
  
  try{
     const headers  = {
      headers:{
        "x-access-token": token,
         "Content-Type": "application/json",
      }
     }
     console.log("hedaers token", token)
     const urlPath = `${REACT_APP_BASE_URL}item/get-variants?product_id=${id}`;
     const res= await axios.get(urlPath,headers);
     if(res?.data)
     {
      return res?.data ;
     }
  }catch(error)
  {
  }
}

export const delete_variant = async(token,id)=>{
  try{
    const headers = {
      headers:{
        "x-access-token":token
      }
    }
    const urlPath =`${REACT_APP_BASE_URL}item/delete-variant/${id}`;
    const res = await axios.delete(urlPath,headers);
    if(res?.data)
    {
      show_success(res?.data?.message || "Deleted Successfully");
      return true;
    }
  }catch(error)
  {
    toast.error(error?.response?.data?.error || error?.response?.message || "Failed")
  }
}



export const edit_variants = async(token, variantId, body)=>{
  try{
    const headers = {
      headers:{
        "x-access-token": token,
        "Content-Type": "application/json",
      }
    };
    
    const urlPath = `${REACT_APP_BASE_URL}item/edit-variant/${variantId}`;
    const res = await axios.put(urlPath, body, headers);
    
    if(res?.data) {
      show_success(res?.data?.message || "Variant updated successfully");
      return true;
    }
  }catch(error){
    toast.error(error?.response?.data?.error || error?.response?.message || "Failed to update variant");
    return false;
  }
}
// VARIANTS END
