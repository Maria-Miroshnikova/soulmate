import {UserModel} from "../../types/UserModels";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface RegistrState {
    isRegistred: boolean,
    isLoading: boolean,
    error: string
}

const initialState: RegistrState = {
    isRegistred: false,
    isLoading: false,
    error: ''
}

export const registrSlice = createSlice({
    name: 'registr',
    initialState,
    reducers: {
        registr_success: (state, action) => {
            state.isRegistred = true;
            state.isLoading = false;
        },
        registr_failed: (state, action) => {
            state.isRegistred = false;
            state.isLoading = false;
            state.error = action.payload;
        },
        registr_loading: state => {
            state.isLoading = true;
            state.error = "";
        }
    }
})

export const {registr_success, registr_loading, registr_failed} = registrSlice.actions;
export default registrSlice.reducer;