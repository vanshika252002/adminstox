import { START_LOADING, STOP_LOADING } from "./loaderTypes";

const initialState = {
    isLoading: false
  };
  
  const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
      case START_LOADING:
        return { ...state, 
            isLoading: true 
        };
      case STOP_LOADING:
        return { ...state, 
            isLoading: false 
        };
      default:
        return state;
    }
  };
  
  export default loaderReducer;