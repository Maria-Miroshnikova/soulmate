import {ItemModel} from "../../types/ItemModel";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface ItemsState {
    items: ItemModel[]
}


const initialState: ItemsState = {
    items: []
};


// TODO: fetch items from api
export const userItemPageSlice = createSlice({
    name: 'userItemPage',
    initialState,
    reducers: {
        setComment: (state, action: PayloadAction<{id: string, comment: string}>) => {
            let newItems = [...state.items];
            const idx = state.items.findIndex((item) => item.id === action.payload.id);
            const element = state.items[idx];
            element.comment = action.payload.comment;
            newItems[idx] = element;
            state.items = newItems;
        },
        deleteComment: (state, action: PayloadAction<string>) => {
            let newItems = [...state.items];
            const idx = state.items.findIndex((item) => item.id === action.payload);
            const element = state.items[idx];
            element.comment = undefined;
            newItems[idx] = element;
            state.items = newItems;
        },
        setRating: (state, action: PayloadAction<{id: string, rating: number}>) => {
            let newItems = [...state.items];
            const idx = state.items.findIndex((item) => item.id === action.payload.id);
            const element = state.items[idx];
            element.rating = action.payload.rating;
            newItems[idx] = element;
            state.items = newItems;
        },
        addItem: (state, action: PayloadAction<string>) => {
            // вызов обновления пользовательского списка?
            let newItems = [...state.items];
            const idx = state.items.findIndex((item) => item.id === action.payload);
            const element = state.items[idx];
            element.comment = undefined;
            element.rating = 0;
            newItems[idx] = element;
            state.items = newItems;
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            let newItems = state.items.filter((item) => item.id != action.payload);
            state.items = newItems;
        },
    }
});

export const {setComment, setRating, deleteComment, deleteItem, addItem} = userItemPageSlice.actions;
export default userItemPageSlice.reducer;