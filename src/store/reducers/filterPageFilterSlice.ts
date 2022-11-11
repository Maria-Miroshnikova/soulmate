import {UserCardInfo} from "../../types/UserCardInfo";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FilterCheckboxesModel, FilterCheckboxModel, FilterModel} from "../../types/FilterModel";
import {Dictionary} from "typescript-collections";
import {Categories, CategoryModel} from "../../types/Categories";
import {useAppDispatch} from "../../hooks/redux";

export enum FilterStatus {
    IS_SUBMITTING,
    UNDEFINED,
    SUBMITTED
}

export interface FilterCategories {
    book: boolean,
    game: boolean,
    music: boolean,
    film: boolean
}

interface FilterState {
    filter: FilterModel,
    status: FilterStatus,
    filtes_categories_status: FilterCategories
}


const initialState: FilterState = {
    filter: {
        filter_categories: {
            book: {
                main_category: [],
                sub_category: []
            },
            film: {
                main_category: [],
                sub_category: []
            },
            music: {
                main_category: [],
                sub_category: []
            },
            game: {
                main_category: [],
                sub_category: []
            }
        },
        checkboxes: {
            book: {
                main_category: true,
                sub_category: true
            },
            film: {
                main_category: true,
                sub_category: true
            },
            music: {
                main_category: true,
                sub_category: true
            },
            game: {
                main_category: true,
                sub_category: true
            }
        },
    },
    status: FilterStatus.UNDEFINED,
    filtes_categories_status: {
        book: false,
        music: false,
        film: false,
        game: false
    }
};

// TODO: async sending to api
export const filterPageFilterSlice = createSlice({
    name: 'filterPageFilterUsers',
    initialState,
    reducers: {
        setFilterCategory: (state, action: PayloadAction<{
            category: Categories, filterCategory: CategoryModel, checkboxes: FilterCheckboxModel}>) => {
            switch (action.payload.category) {
                case Categories.BOOK: {
                    state.filter.filter_categories.book = action.payload.filterCategory;
                    state.filter.checkboxes.book = action.payload.checkboxes;
                    state.filtes_categories_status.book = true;
                    break;
                }
                case Categories.FILM: {
                    state.filter.filter_categories.film = action.payload.filterCategory;
                    state.filter.checkboxes.film = action.payload.checkboxes;
                    state.filtes_categories_status.film = true;
                    break;
                }
                case Categories.GAME: {
                    state.filter.filter_categories.game = action.payload.filterCategory;
                    state.filter.checkboxes.game = action.payload.checkboxes;
                    state.filtes_categories_status.game = true;
                    break;
                }
                case Categories.MUSIC: {
                    state.filter.filter_categories.music = action.payload.filterCategory;
                    state.filter.checkboxes.music = action.payload.checkboxes;
                    state.filtes_categories_status.music = true;
                    break;
                }
            }
            /*if ((state.filtes_categories_status.book) &&
                (state.filtes_categories_status.film) &&
                (state.filtes_categories_status.game) &&
                (state.filtes_categories_status.music))
                dispatch(submitFilterEnd());*/
        },
        setFilterTitle: (state, action: PayloadAction<string>) => {
            if (action.payload === "")
                state.filter.title = undefined;
            else
                state.filter.title = action.payload;
        },
        submitFilterStart: state => {
            state.filtes_categories_status.book = false;
            state.filtes_categories_status.music = false;
            state.filtes_categories_status.game = false;
            state.filtes_categories_status.film = false;
            state.status = FilterStatus.IS_SUBMITTING;
        },
        submitFilterEnd: state => {
            state.status = FilterStatus.SUBMITTED;
        }
    }
});

export const {setFilterCategory, setFilterTitle, submitFilterStart, submitFilterEnd} = filterPageFilterSlice.actions;
export default filterPageFilterSlice.reducer;