
import {createSlice} from "@reduxjs/toolkit";
import {UserCardInfo} from "../../types/UserCardInfo";
import {usercard_number_set} from "../../test/usercards";

interface FoundUsersState {
    userCards: UserCardInfo[]
}

const initialState: FoundUsersState = {
    userCards: usercard_number_set
};

// TODO: async fetching from api
export const filterPageFoundUsersSlice = createSlice({
    name: 'filterPageFoundUsers',
    initialState,
    reducers: {
        setUserCards: (state: FoundUsersState, action) => {
            state.userCards = action.payload
        }
    }
});

export const {setUserCards} = filterPageFoundUsersSlice.actions;
export default filterPageFoundUsersSlice.reducer;