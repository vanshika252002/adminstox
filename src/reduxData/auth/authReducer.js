import { RESET_TOKEN, TOKENS_UPDATE, USER_DETAILS, USER_UPDATE } from "./authTypes";


const initialState = {
  user: JSON.parse(localStorage.getItem('auth')),
  accessToken: localStorage.getItem("token") || null,
  refreshtoken: localStorage.getItem("refreshtoken") || null,
  resetToken: false,
  userDetails: null
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_UPDATE:
        return {
          ...state,
          user: action.payload,
        };
      case TOKENS_UPDATE:
        return {
          ...state,
          accessToken: action.payload.token,
          refreshtoken: action.payload.refreshToken,
        };
      case RESET_TOKEN:
        return {
          ...state,
        resetToken: action.payload,
        };
      case USER_DETAILS:
        return {
          ...state,
          userDetails: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  