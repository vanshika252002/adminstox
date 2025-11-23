import axios from "axios";
import store from "../reduxData/store";
import { toast } from "react-toastify";
import { TOKENS_UPDATE } from "../reduxData/auth/authTypes";

const UPDATE_USER_TOKEN = "UPDATE_USER_TOKEN";
const RESET_REFRESH_TOKEN = "RESET_REFRESH_TOKEN"; 
const LOGOUT = "LOGOUT";

const baseURL = process.env.REACT_APP_BASE_URL;
// const baseURL = 'http://localhost:3500/'

const apiClient = axios.create({
  baseURL: baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();

    const accessToken = state.auth?.accessToken;
    const refreshToken = state.auth?.refreshtoken;

  
    if (accessToken && config.url !== "/user/authorization") { 
      config.headers["x-access-token"] = accessToken;
    }

    if (refreshToken) {
      config.headers["refreshtoken"] = refreshToken;
    }

    // console.log(
    //   "Interceptor: Attaching token to request for:", 
    //   config.url, 
    //   accessToken ? `Yes (ends ...${accessToken.slice(-6)})` : "No"
    // );
    return config;
  },
  (error) => {
    console.error("Axios Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const logoutUserAndClearData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshtoken");
  localStorage.removeItem("userData"); 

  store.dispatch({ type: LOGOUT });
  window.location.reload(); 
};

async function attemptTokenRefresh() {
  try {
    const state = store.getState();
    const currentRefreshToken = state.auth?.refreshtoken; 

    if (!currentRefreshToken) {
      console.error("No refresh token available for token refresh attempt.");
      return Promise.reject(new Error("No refresh token"));
    }

    // console.log("Attempting to refresh token with:", currentRefreshToken ? `Present (ends ...${currentRefreshToken.slice(-6)})` : "Not Present");
    
    const response = await axios.get(`${baseURL}/user/authorization`, { 
      headers: {
        'refreshtoken': currentRefreshToken
      }
    });

    const { data } = response; 
    
    if (data && data.status === true && data.data?.token) {
      const newAccessToken = data.data.token;
      const newRefreshTokenFromResponse = data.data.refreshToken;

      localStorage.setItem("token", newAccessToken); // Use "token" for access token in localStorage
      store.dispatch(   { type: TOKENS_UPDATE, payload: data.data });
      
      if (newRefreshTokenFromResponse && newRefreshTokenFromResponse !== currentRefreshToken) { 
          localStorage.setItem("refreshtoken", newRefreshTokenFromResponse);
          store.dispatch(   { type: TOKENS_UPDATE, payload: data.data });
      } else {
          localStorage.setItem("refreshtoken", currentRefreshToken);
      }
      
      // console.log("Token refreshed successfully.");
      return newAccessToken;
    } else {
      throw new Error(data?.message || "Failed to refresh token: Invalid response structure from refresh endpoint.");
    }
  } catch (error) {
    console.error("Token refresh error:", error.response?.data || error.message);
   // logoutUserAndClearData(); 
    return Promise.reject(error);
  }
}

apiClient.interceptors.response.use(
  (response) => {
    return response; 
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const responseData = error.response?.data; 

    console.error(
      `Axios Response Error: Status ${status || 'N/A'}`,
      `Message: ${error.message}`,
      `URL: ${originalRequest.url}`,
      `Response Data:`, responseData || "No response data"
    );

    if (status === 401 && !originalRequest._retry && originalRequest.url !== "/user/authorization") { 
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers['x-access-token'] = token;
              resolve(apiClient(originalRequest)); 
            },
            reject: (err) => {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true; 
      isRefreshing = true;

      try {
        // console.log("Attempting token refresh due to 401 on:", originalRequest.url);
        const newAccessToken = await attemptTokenRefresh(); 
        isRefreshing = false; 
        processQueue(null, newAccessToken); 
        
        // console.log("Retrying original request with new token:", originalRequest.url);
        originalRequest.headers['x-access-token'] = newAccessToken;
        return apiClient(originalRequest); 
      } catch (refreshError) {
        isRefreshing = false; 
        processQueue(refreshError, null); 

        if (!toast.isActive("sessionExpired")) {
          toast.error("Session expired. Please log in again.", { toastId: "sessionExpired" });
         //logoutUserAndClearData(); 
  
        }
        return Promise.reject(refreshError);
      }
    } else if (status === 401 && originalRequest._retry) {
      console.error(`Error ${status}: Unauthorized even after token refresh attempt for ${originalRequest.url}.`);
      if (!toast.isActive("unauthorized_retry_failed")) {
           toast.error(responseData?.error || "Authentication failed after retry. Please log in again.", { toastId: "unauthorized_retry_failed" });
      }
      // logoutUserAndClearData(); 
    } else if (status === 403) {
      console.error(`Error ${status}: Forbidden for ${originalRequest.url}.`, responseData?.error || '');
      if (!toast.isActive("forbidden")) {
        toast.error(responseData?.error || "You don't have permission for this action.", { toastId: "forbidden" });
      }
    } else if (status === 500 || status === 502 || status === 503 || status === 504) {
      console.error(`Error ${status}: Server Error for ${originalRequest.url}.`, responseData?.error || '');
      if (!toast.isActive("servererror")) {
        toast.error(responseData?.error || "A server error occurred. Please try again later.", { toastId: "servererror" });
      }
    } else {
      // Handles errors where error.response exists but status is not one of the above,
      // OR error.request exists (network error),
      // OR it's a request setup error (error.message)
      if (error.response) { 
        // An HTTP error occurred, but not 401, 403, or 50x
        console.warn(`Unhandled HTTP error status: ${status} for ${originalRequest.url}`, responseData);
        if (responseData?.error && !toast.isActive("genericApiError_" + status)) { // Unique toastId
            toast.error(responseData.error, {toastId: "genericApiError_" + status});
        } else if (!responseData?.error && !toast.isActive("unknownApiError_" + status)) { // Unique toastId
             toast.error(`An API error occurred (Status: ${status}). Please try again.`, {toastId: "unknownApiError_" + status});
        }
      } else if (error.request) { 
        // The request was made but no response was received (network error)
        console.error("Network Error (no response received):", error.request);
        if (!toast.isActive("networkerror")) {
          toast.error("Cannot connect to server. Please check your network connection.", { toastId: "networkerror" });
        }
      } else { 
        // Something happened in setting up the request that triggered an Error
        console.error('Request Setup Error (error before request was sent):', error.message);
        if (!toast.isActive("setuperror")) {
          toast.error('An error occurred while setting up the request. Please try again.', { toastId: "setuperror" });
        }
      }
    }

    return Promise.reject(error); // IMPORTANT: Always reject the error for the original caller to handle if needed
  }
);

// everywhere an api call is made must use this now 

export default apiClient;
