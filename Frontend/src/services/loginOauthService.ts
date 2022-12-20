import {BaseQueryFn, createApi, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ROUTES} from "../router/routes";

export const href_HACK = 'https://github.com/login/oauth/authorize?client_id=1e4b52fb83f6adac47ba';

// вообще не работает из-за cors. Обход:
// получение кода - по переходу href_HACK
// получение токена - обращение к gatekeeper, запуск этого сервиса: cd gatekeeper, node index.js
export const loginOauthAPI = createApi({
    reducerPath: 'loginOauthAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: ''
    }),
    endpoints: (build) => ({
        login:  build.query<any, void>({
            query: () => ({
                url: 'https://github.com/login/oauth/authorize',
                params: {
                    client_id: "1e4b52fb83f6adac47ba"
                }
            })
        }),
        getAccessToken: build.mutation<any, string>({
            query: (arg) => ({
                url: 'https://github.com/login/oauth/authorize',
                method: "POST",
                params: {
                    client_id: "1e4b52fb83f6adac47ba",
                    client_secret: "5dc7f3e119cca38161d392320c326148c958b1cb",
                    code: arg,
                  //  redirect_uri: ROUTES.base_url + ROUTES.pages.filter
                }
            })
        }),
    })
})