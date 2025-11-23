import { START_LOADING, STOP_LOADING } from './loaderTypes'

export const start_loading = () => {
    return {
      type: START_LOADING,
    };
  };
  
  export const stop_loading = () => {
    return {
      type: STOP_LOADING,
    };
  };

  