import {createAsyncThunk} from "@reduxjs/toolkit";
/*import UserCard from "../../../components/filterPage/usercard/UserCard";
import {UserCardInfo} from "../../../types/UserCardInfo";
import axios from "axios";
import {usercard_number_set} from "../../../test/usercards";

const URL = "";

export const fetchUserCardsAll = createAsyncThunk(
    'userCard/fetchByFilter',
    async (_, thunkAPI) => {
        try {
            //const response = await axios.get<UserCardInfo[]>(URL);
            //return response.data;
            return usercard_number_set;
        } catch (error) {
            return thunkAPI.rejectWithValue("Не удалось загрузить usercards");
        }
    }
)

export const fetchUserCardsByFiler = createAsyncThunk(
    'userCard/fetchByFilter',
    async (filter, thunkAPI) => {
        const response = await axios.get<UserCardInfo[]>(URL, {

        });

        return response.data;
    }
)*/