import {UserModel} from "../../types/UserModels";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {filterAPI} from "../../services/filterUsercardsService";
import {LoginResponse} from "../../services/loginService";

// Этот слой отвечает только за AccessToken и за UserId!
// UserModel подгружать отдельно!
interface AuthState {
    isAuth: boolean,
    isLoading: boolean,
    error: string,
    userId?: string
}

const initialState: AuthState = {
    isAuth: false,
    isLoading: false,
    error: ''
}

// для регистрации как - отдельный? но они ведь пересекаются...
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login_success: (state, action: PayloadAction<LoginResponse>) => {
            state.isAuth = true;
            state.isLoading = false;
            state.userId = action.payload.userId;
            localStorage.setItem('accessToken', action.payload.accessToken);
            console.log('token = ', action.payload.accessToken);
        },
        logout: state => {
            state.isAuth = false;
            state.userId = undefined;
            state.isLoading = false;
            localStorage.removeItem('accessToken');
        },
        login_failed: (state, action) => {
            state.isAuth = false;
            state.isLoading= false;
            state.error = action.payload;
        },
        login_loading: state => {
            state.isLoading = true;
            state.error = "";
        }
    }
})

export const {login_success, login_loading, login_failed, logout} = authSlice.actions;
export default authSlice.reducer;