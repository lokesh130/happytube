import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    VERIFY_EMAIL,
    CHECK_EMAIL,
    UPDATE_PASS
} from './types';
import { USER_SERVER } from '../components/Config.js';



export function checkEmail(email){
  const request = axios.post(`${USER_SERVER}/checkEmail`,{email})
      .then(response => response.data);

  return {
      type: CHECK_EMAIL,
      payload: request
  }
}

export function verifyEmail(dataToSubmit){
  const request = axios.post(`${USER_SERVER}/sendMail`,dataToSubmit)
      .then(response => response.data)
      .catch(err => {

        return {success:false};
      });

    return {
        type: VERIFY_EMAIL,
        payload: request
    }
}

export function updatePass(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/updatePass`,dataToSubmit)
        .then(response => response.data);

    return {
        type: UPDATE_PASS,
        payload: request
    }
}

export function registerUser(dataToSubmit , fixed=true){
    const request = axios.post(`${USER_SERVER}/register`,{...dataToSubmit,fixed:fixed})
        .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit, fixed=true){
    const request = axios.post(`${USER_SERVER}/login`,{...dataToSubmit,fixed:fixed})
                .then(response => response.data );

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}
