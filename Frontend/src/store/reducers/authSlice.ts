import {UserModel} from "../../types/UserModels";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {filterAPI} from "../../services/filterService";
import {LoginResponse} from "../../services/loginService";

// Этот слой отвечает только за AccessToken и за UserId!
// UserModel подгружать отдельно!
interface AuthState {
    isAuth: boolean,
    isLoading: boolean,
    error: string,
    userId?: string,
    isModerator?: boolean
}

// TODO сделать false
const initialState: AuthState = {
    isAuth: false,
 //   isAuth: true,
    isLoading: false,
    error: '',
    // TODO: убрать
 //   userId: '2',
    // TODO: убрать
    isModerator: false
}

// для регистрации как - отдельный? но они ведь пересекаются...
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login_success: (state, action: PayloadAction<LoginResponse>) => {
            state.isAuth = true;
            state.isLoading = false;

            // TODO убрать после тестов
          //  state.userId = "2";
             state.userId = action.payload.userId;
            // TODO: обработка модератора!
            state.isModerator = false;
            localStorage.setItem('accessToken', action.payload.accessToken);
            //console.log('token = ', action.payload.accessToken);
        },
        logout: state => {
            console.log("REDUCER: OUT");
            state.isAuth = false;
            state.userId = undefined;
            state.isLoading = false;
            state.isModerator = undefined;
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