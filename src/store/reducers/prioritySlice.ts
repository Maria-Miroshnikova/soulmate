
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Categories} from "../../types/Categories";

interface PriorityState {
    priority: Categories[]
}


const initialState: PriorityState = {
    priority: []
};

export const prioritySlice = createSlice({
    name: 'priority',
    initialState,
    reducers: {
        setPriority: (state, action: PayloadAction<Categories[]>) => {
            state.priority = action.payload;
        }
    }
});

export const {setPriority} = prioritySlice.actions;
export default prioritySlice.reducer;