
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserCardInfo} from "../../types/UserCardInfo";
import {usercard_number_set} from "../../test/usercards";
//import {fetchUserCardsAll} from "./action_creators/filter_fetch_usercards";

interface FoundUsersState {
    userCards: UserCardInfo[],
    isLoading: boolean,
    error?: string
}

const initialState: FoundUsersState = {
    userCards: [],
    isLoading: false
};

// TODO: пока что загрузка делается через filterServer вне редакса, этот слайс сейчас НЕ НУЖЕН
export const filterPageFoundUsersSlice = createSlice({
    name: 'filterPageFoundUsers',
    initialState,
    reducers: { },
    extraReducers: {
        /*[fetchUserCardsAll.fulfilled.type]: (state, action: PayloadAction<UserCardInfo[]>) => {
            state.isLoading = false;
            state.userCards = action.payload;
        },
        [fetchUserCardsAll.pending.type]: state => {
            state.isLoading = true;
            state.error = undefined;
        },
        [fetchUserCardsAll.pending.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.userCards = [];
        }*/
    }
});

export const {} = filterPageFoundUsersSlice.actions;
export default filterPageFoundUsersSlice.reducer;