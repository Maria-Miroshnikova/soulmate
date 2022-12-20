import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import AppLayout from "./components/appLayout";
import {Box, Typography} from "@mui/material";
import DrawerContentLayout from "./components/drawerContentLayout";
import FilterDrawerContent from "./components/filterPage/filter/FilterDrawerContent";
import FilterPageContent from "./components/filterPage/FilterPageContent";
import ProfileDrawerContent from "./components/userPfofilePage/ProfileDrawerContent";
import UserPageSearchContent from "./components/userPfofilePage/UserPageSearchContent";
import {Categories} from "./types/Categories";
import UserPageProfileContent from "./components/userPfofilePage/UserPageProfileContent";
import {ROUTES} from "./router/routes";
import PersonList from "./components/userPfofilePage/lists/PersonList";
import ItemList from "./components/userPfofilePage/lists/ItemList";
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {filterAPI} from "./services/filterService";
import {setOptions} from "./store/reducers/optionsSlice";
import {OptionsModel} from "./types/OptionModels";
import AuthPage from "./components/loginPage/authPage";
import RegistrPage from "./components/loginPage/registrPage";
import {loginAPI} from "./services/loginService";
import {login_success, logout, STORAGE_ACCESS, STORAGE_REFRESH} from "./store/reducers/authSlice";
import ItemListLayout from "./components/userPfofilePage/lists/ItemListLayout";
import {updatePageId} from "./store/reducers/searchContentSlice";
import ModeratorDrawerContent from "./components/moderatorPage/ModeratorDrawerContent";
import ModeratorPageContent from "./components/moderatorPage/ModeratorPageContent";
import {gapi} from "gapi-script";
import StartPage from "./components/loginPage/StartPage";
import ErrorPage from "./components/errorPage/ErrorPage";
import {PersonType} from "./types/PersonType";
import {refreshAPI} from "./services/refreshService";

function App() {

  const [refresh] = refreshAPI.useLazyRefreshQuery();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_ACCESS);
    if (token) {
      handleRefresh();
    }
  }, [])

  const handleRefresh = () => {
    refresh().unwrap().then(response => {
      console.log("PreAuth : ", response);
      dispatch(login_success({userId: response, accessToken: localStorage.getItem(STORAGE_ACCESS)!, refreshToken: localStorage.getItem(STORAGE_REFRESH)!}));
    })
  }

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(state => state.authReducer.isAuth);

  // TODO: перенести это в unwrap к call у триггера?
 /* useEffect(() => {
    if (isSuccess && !isLoading) {
      dispatch(login_success(loginResponse!));
    }
  }, [isSuccess, isLoading])*/

  const {data: film_main} = filterAPI.useFetchOptionsFilmMainQuery();
  const {data: film_sub} = filterAPI.useFetchOptionsFilmSubQuery();
  const {data: music_main} = filterAPI.useFetchOptionsMusicMainQuery();
  const {data: music_sub} = filterAPI.useFetchOptionsMusicSubQuery();
  const {data: book_main} = filterAPI.useFetchOptionsBookMainQuery();
  const {data: book_sub} = filterAPI.useFetchOptionsBookSubQuery();
  const {data: game_main} = filterAPI.useFetchOptionsGameMainQuery();
  const {data: game_sub} = filterAPI.useFetchOptionsGameSubQuery();

  if ((film_main === undefined) || (film_sub === undefined) ||
      (book_main === undefined) || (book_sub === undefined) ||
      (music_sub === undefined) || ( music_main=== undefined) ||
      (game_main=== undefined) || (game_sub === undefined)) {

  }
  else {
    dispatch(setOptions({
      film: {
        main_category: film_main!,
        sub_category: film_sub!
      },
      book: {
        main_category: book_main!,
        sub_category: book_sub!
      },
      music: {
        main_category: music_main!,
        sub_category: music_sub!
      },
      game: {
        main_category: game_main!,
        sub_category: game_sub!
      }
    }))
  }

  const location = useLocation();

  // обновление userId при переходе по страницам
  useEffect(() => {
    dispatch(updatePageId(location.pathname.split('/')[2]));
  }, [location.pathname]);
  
  useEffect(() => {
    if (!isAuth)
      navigate('/');
  }, [isAuth])

  const isModerator = useAppSelector(state => state.authReducer.isModerator);


  /*
  <Route path={ROUTES.content_tabs.friends.subscribers} element={<UserPageSearchContent isContentAboutFriends={false}/>}>
                        <Route index element={<PersonList type={PersonType.SUBSCRIBERS}/>}/>
                      </Route>
   */
  return (isModerator) ?
      (<Routes>
        <Route path={ROUTES.base_url} element={<AppLayout/>}>
          <Route index element={<StartPage />} />
          <Route path={ROUTES.pages.filter} element={<Navigate to={ROUTES.pages.moderator} />} />
          <Route path={ROUTES.pages.moderator} element={<DrawerContentLayout drawerContent={<ModeratorDrawerContent/>}/>}>
            <Route index element={<ModeratorPageContent/>}/>
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>)
      :
      (isAuth) ?
          (<Routes>
                <Route path={ROUTES.base_url} element={<AppLayout/>}>
                  <Route index element={<StartPage />} />
                  <Route path={ROUTES.pages.filter} element={<DrawerContentLayout drawerContent={<FilterDrawerContent/>}/>}>
                    <Route index element={<FilterPageContent/>}/>
                  </Route>
                  <Route path={ROUTES.pages.account}>
                    <Route path=":id" element={<DrawerContentLayout drawerContent={<ProfileDrawerContent/>}/>}>
                      <Route index element={<Navigate to={ROUTES.content_tabs.profile} replace/>}/>
                      <Route path={ROUTES.content_tabs.profile} element={<UserPageProfileContent/>}/>
                      <Route path={ROUTES.content_tabs.friends.friends_main} element={<UserPageSearchContent isContentAboutFriends={true}/>}>
                        <Route index element={<PersonList type={PersonType.FRIENDS}/>}/>
                      </Route>
                      <Route path={ROUTES.content_tabs.friends.visited} element={<UserPageSearchContent isContentAboutFriends={true}/>}>
                        <Route index element={<PersonList type={PersonType.VISITED}/>}/>
                      </Route>
                      <Route path={ROUTES.content_tabs.friends.requests} element={<UserPageSearchContent isContentAboutFriends={true}/>}>
                        <Route index element={<PersonList type={PersonType.REQUESTS}/>}/>
                      </Route>
                      <Route path={ROUTES.content_tabs.friends.my_subscriptions} element={<UserPageSearchContent isContentAboutFriends={true}/>}>
                        <Route index element={<PersonList type={PersonType.MY_REQUEST}/>}/>
                      </Route>
                      <Route path={ROUTES.content_tabs.films.films_main} element={<UserPageSearchContent category={Categories.FILM} isContentAboutFriends={false}/>}>
                        <Route index element={<ItemListLayout category={Categories.FILM} isMain={true}/>} />
                      </Route>
                      <Route path={ROUTES.content_tabs.films.films_sub} element={<UserPageSearchContent category={Categories.FILM} isContentAboutFriends={false} />}>
                        <Route index element={<ItemListLayout category={Categories.FILM} isMain={false}/>} />
                      </Route>
                      <Route path={ROUTES.content_tabs.books.books_main} element={<UserPageSearchContent category={Categories.BOOK} isContentAboutFriends={false}/>}>
                        <Route index element={<ItemListLayout category={Categories.BOOK} isMain={true}/>} />
                      </Route>
                      <Route path={ROUTES.content_tabs.books.books_sub} element={<UserPageSearchContent category={Categories.BOOK} isContentAboutFriends={false}/>}>
                        <Route index element={<ItemListLayout category={Categories.BOOK} isMain={false}/>} />
                      </Route>
                      <Route path={ROUTES.content_tabs.music.music_main} element={<UserPageSearchContent category={Categories.MUSIC} isContentAboutFriends={false}/>}>
                        <Route index element={<ItemListLayout category={Categories.MUSIC} isMain={true}/>} />
                      </Route>
                      <Route path={ROUTES.content_tabs.music.music_sub} element={<UserPageSearchContent category={Categories.MUSIC} isContentAboutFriends={false}/>}>
                        <Route index element={<ItemListLayout category={Categories.MUSIC} isMain={false}/>} />
                      </Route>
                      <Route path={ROUTES.content_tabs.games.games_main} element={<UserPageSearchContent category={Categories.GAME} isContentAboutFriends={false}/>}>
                        <Route index element={<ItemListLayout category={Categories.GAME} isMain={true}/>} />
                      </Route>
                      <Route path={ROUTES.content_tabs.games.games_sub} element={<UserPageSearchContent category={Categories.GAME} isContentAboutFriends={false}/>}>
                        <Route index element={<ItemListLayout category={Categories.GAME} isMain={false}/>}/>
                      </Route>
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<ErrorPage />} />
              </Routes>
          )
          :
          (<Routes>
                <Route path={ROUTES.base_url} element={<AppLayout/>}>
                  <Route index element={<StartPage />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
              </Routes>
          )
      ;
}

export default App;
