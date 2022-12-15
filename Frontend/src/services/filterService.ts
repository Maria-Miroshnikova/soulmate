import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {UserCardInfo} from "../types/UserCardInfo";
import {FilterModel} from "../types/FilterModel";
import {Categories} from "../types/Categories";
import {makeRequestString} from "../utils/api_convertations";
import {makeParamsFromFilter} from "../types/api/ParamsFilter";
import {OptionItemModel} from "../types/OptionModels";
import {baseQueryWithReauth} from "./baseQueryFunctions";
import {UserCardJson, UserCardsByFilterJson, UserInfoJson} from "../types/response_types/userCardsByFilterJson";
import UserCard from "../components/filterPage/usercard/UserCard";
//import {fetchUserCardsAll} from "../store/reducers/action_creators/filter_fetch_usercards";


export interface OptionsRequest {
    category: Categories,
    isMain: boolean,
    title?: string
}

// TODO: params!
export const filterAPI = createApi({
    reducerPath: 'filterAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        // TODO: checkboks пока не отправляю, потом надо будет
        // TODO: если пустой массив, то как?
        fetchUserCardsByFilter: build.query<UserCardInfo[], {userId: string, filter: FilterModel, priority: Categories[]}>({
            query: (arg) => ({
                url: '/userfilter',
                params: makeParamsFromFilter(arg.userId, arg.filter, arg.priority)
            }),
            transformResponse: (response: UserCardsByFilterJson, meta, arg) => {
                //console.log("response ODIN: ", response1);
                //const user =  JSON.parse(response1);
                //const response : UserCardsByFilterJson = JSON.parse(response1);
              //  console.log("RESPONSE: ", response);
                const result: UserCardInfo[] = [];
                for (var i = 0; i < response.FoundUsers.length; ++i) {
                    const user : UserCardJson = response.FoundUsers[i];
                    const userInfo : UserInfoJson = response.FoundUsers[i].User;
//                    console.log("user: ", user);
                    console.log("userInfo: ", userInfo);
                    result.push({
                        personal_data: {
                            id: response.FoundUsers[i].User.id,
                            nickname: response.FoundUsers[i].User.username,
                            avatar: "",
                            age: response.FoundUsers[i].User.age,
                            gender: response.FoundUsers[i].User.gender,
                            telegram: response.FoundUsers[i].User.telegram
                        },
                        categories: {
                            film: {
                                main_category: response.FoundUsers[i].Film,
                                sub_category: response.FoundUsers[i].Director
                            },
                            book: {
                                main_category: response.FoundUsers[i].Book,
                                sub_category: response.FoundUsers[i].Author
                            },
                            music: {
                                main_category: response.FoundUsers[i].Song,
                                sub_category: response.FoundUsers[i].Artist
                            },
                            game: {
                                main_category: response.FoundUsers[i].Game,
                                sub_category: response.FoundUsers[i].Studio
                            }
                        }
                    })
                }
              //  console.log("RESULT: ", result)
                return result;
            }
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
        }),

        // TODO сделать универсальной для всех подкачек опций, удалить всё что сверху!/
        // TODO: Title не забываем просить!!!
        fetchOptions: build.query<OptionItemModel[], OptionsRequest>({
            query: (arg) => ({
                url: '/options_film_main',
            })
        }),
    })
});