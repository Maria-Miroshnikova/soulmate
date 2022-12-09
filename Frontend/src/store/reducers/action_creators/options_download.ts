import {createAsyncThunk} from "@reduxjs/toolkit";
import {usercard_number_set} from "../../../test/usercards";
import {filterAPI} from "../../../services/filterService";
import {OptionModel} from "../../../types/OptionModels";

// как выглядит онтология
// убрать загрушки из редакса, чтобы можно было тестить апи!

/*export const fetchOptionsOntology = createAsyncThunk(
    'userCard/fetchByFilter',
    async (_, thunkAPI) => {
        try {
            const film: OptionModel = {
                main_category: await filterAPI.useFetchOptionsFilmMainQuery()!,
                sub_category: await filterAPI.useFetchOptionsFilmSubQuery()!
            };
            return response.data;
            return usercard_number_set;
        } catch (error) {
            return thunkAPI.rejectWithValue("Не удалось загрузить usercards");
        }
    }
)*/