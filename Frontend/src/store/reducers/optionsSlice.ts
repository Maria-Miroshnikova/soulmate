import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {number_options, options_} from "../../test/options";
import {OptionsModel} from "../../types/OptionModels";

interface OptionsState {
    categories: OptionsModel
};

const initialState: OptionsState = {
    categories: options_
};

// TODO: async fetching from api
export const optionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        setOptions: (state, action: PayloadAction<OptionsModel>) => {
            state.categories = action.payload;
        }
    }
});

export const {setOptions} = optionsSlice.actions;
export default optionsSlice.reducer;