import {UserModel} from "../../types/UserModels";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {filterAPI} from "../../services/filterUsercardsService";


interface AuthState {
    isAuth: boolean,
    isLoading: boolean,
    error: string,
    user?: UserModel
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
        login: (state, action: PayloadAction<UserModel>) => {
            state.isAuth = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        logout: state => {
            state.isAuth = false;
            state.user = undefined;
            state.isLoading = false;
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

export const {login, login_loading, login_failed, logout} = authSlice.actions;
export default authSlice.reducer;