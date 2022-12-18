import {ItemModel} from "../../types/ItemModel";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getIdFromPath, ROUTES} from "../../router/routes";


interface ItemsState {
    pageId?: string,
    //isUserId: boolean,
    countFound: number,
    title?: string
}

// Чей профиль просматриваем
const initialState: ItemsState = {
    //isUserId: true,
    countFound: 0
};

// TODO: update id -> title, count - правильно ли связаны?
export const searchContentSlice = createSlice({
    name: 'searchConent',
    initialState,
    reducers: {
        updatePageId: (state, action: PayloadAction<string>) => {
            state.pageId = action.payload;
           // state.countFound = 0;
           // state.title = undefined;
        },
        setTitleToSearch: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setCountFound: (state, action: PayloadAction<number>) => {
            state.countFound = action.payload;
        }
    }
});

export const {setCountFound, setTitleToSearch, updatePageId} = searchContentSlice.actions;
export default searchContentSlice.reducer;