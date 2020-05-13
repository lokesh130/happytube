import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    VERIFY_EMAIL,
    CHECK_EMAIL,
    UPDATE_PASS
} from '../_actions/types';


export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case CHECK_EMAIL:
            return {...state, checkEmail: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case VERIFY_EMAIL:
            return {...state, verifyData: action.payload }
        case UPDATE_PASS:
            return {...state, verifyData: action.payload }
        case LOGOUT_USER:
            return {...state }
        default:
            return state;
    }
}
