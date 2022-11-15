import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {UserCardInfo} from "../types/UserCardInfo";
import {FilterModel} from "../types/FilterModel";
import {Categories} from "../types/Categories";
import {makeRequestString} from "../utils/api_convertations";
import {makeParamsFromFilter} from "../types/api/ParamsFilter";
import {OptionItemModel} from "../types/OptionModels";
import {baseQueryWithReauth} from "./baseQueryFunctions";
//import {fetchUserCardsAll} from "../store/reducers/action_creators/filter_fetch_usercards";

// TODO: params!
export const filterAPI = createApi({
    reducerPath: 'filterAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        // ТЕСТОВЫЙ
        fetchUserCardsAll: build.query<UserCardInfo[], void>({
            query: () => ({
                url: '/userfilter',
            })
        }), //

        // TODO: checkboks пока не отправляю, потом надо будет
        // TODO: если пустой массив, то как?
        fetchUserCardsByFilter: build.query<UserCardInfo[], {filter: FilterModel, priority: Categories[]}>({
            query: (arg) => ({
                url: '/userfilter',
                params: makeParamsFromFilter(arg.filter, arg.priority)
            })
        }),

        // все эти функции для загрузки всей анталогии перед стартом приложения (в дальнейшем лучше сделать подгрузку по необходимости!)
        fetchOptionsBookMain: build.query<OptionItemModel[], void>({
            query: () => ({
                url: '/options_book_main',
            })
        }),
        fetchOptionsBookSub: build.query<OptionItemModel[], void>({
            query: () => ({
                url: '/options_book_sub',
            })
        }),
        fetchOptionsFilmMain: build.query<OptionItemModel[], void>({
            query: () => ({
                url: '/options_film_main',
            })
        }),
        fetchOptionsFilmSub: build.query<OptionItemModel[], void>({
            query: () => ({
                url: '/options_film_sub',
            })
        }),
        fetchOptionsMusicMain: build.query<OptionItemModel[], void>({
            query: () => ({
                url: '/options_music_main',
            })
        }),
        fetchOptionsMusicSub: build.query<OptionItemModel[], void>({
            query: () => ({
                url: '/options_music_sub',
            })
        }),
        fetchOptionsGameMain: build.query<OptionItemModel[], void>({
            query: () => ({
                url: '/options_game_main',
            })
        }),
        fetchOptionsGameSub: build.query<OptionItemModel[], void>({
            query: () => ({
                url: '/options_game_sub',
            })
        })
    })
});