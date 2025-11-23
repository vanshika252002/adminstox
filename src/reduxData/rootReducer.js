import authReducer from './auth/authReducer';
import { combineReducers } from 'redux';
import userReducer from './user/userReducer';
import cmsReducer from './cms/cmsReducer';
import loaderReducer from './loader/loaderReducer';

const rootReducer = combineReducers({
  auth:authReducer,
  user:userReducer,
  cms:cmsReducer,
  loading:loaderReducer
});

export default rootReducer;
