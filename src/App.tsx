import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import AppLayout from "./components/appLayout";
import {Box} from "@mui/material";
import DrawerContentLayout from "./components/drawerContentLayout";
import FilterDrawerContent from "./components/filterPage/filter/FilterDrawerContent";
import FilterPageContent from "./components/filterPage/FilterPageContent";
import ProfileDrawerContent from "./components/userPfofilePage/ProfileDrawerContent";
import UserPageSearchContent from "./components/userPfofilePage/UserPageSearchContent";
import {Categories} from "./types/Categories";
import UserPageProfileContent from "./components/userPfofilePage/UserPageProfileContent";
import {ROUTES} from "./router/routes";
import PersonList, {PersonListType} from "./components/userPfofilePage/lists/PersonList";
import ItemList from "./components/userPfofilePage/lists/ItemList";
import {updateUserPageId} from "./store/reducers/userItemsPageSlice";
import {useAppDispatch} from "./hooks/redux";
import {filterAPI} from "./services/filterUsercardsService";
import {setOptions} from "./store/reducers/optionsSlice";
import {OptionsModel} from "./types/OptionModels";
import AuthPage from "./components/loginPage/authPage";
import RegistrPage from "./components/loginPage/registrPage";

function App() {

  const dispatch = useAppDispatch();

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
  /* Подгрузка онтологии */
  /*(useEffect(() => {
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
  }, [])*/

  const location = useLocation();

  useEffect(() => {
    dispatch(updateUserPageId(location.pathname));
  }, [location]);

  return (
      <Routes>
        <Route path={ROUTES.base_url + ROUTES.pages.login} element={<AuthPage />}/>
        <Route path={ROUTES.base_url + ROUTES.pages.registr} element={<RegistrPage />}/>
        <Route path={ROUTES.base_url} element={<AppLayout/>}>
          <Route index element={<Box> MAIN </Box>} />
          <Route path={ROUTES.pages.filter} element={<DrawerContentLayout drawerContent={<FilterDrawerContent/>}/>}>
            <Route index element={<FilterPageContent/>}/>
          </Route>
          <Route path={ROUTES.pages.account}>
            <Route path=":id" element={<DrawerContentLayout drawerContent={<ProfileDrawerContent/>}/>}>
              <Route index element={<Navigate to={ROUTES.content_tabs.profile} replace/>}/>
              <Route path={ROUTES.content_tabs.profile} element={<UserPageProfileContent/>}/>
              <Route path={ROUTES.content_tabs.friends.friends_main} element={<UserPageSearchContent isFriendsContent={true}/>}>
                <Route index element={<PersonList type={PersonListType.FRIENDS}/>}/>
              </Route>
              <Route path={ROUTES.content_tabs.friends.visited} element={<UserPageSearchContent isFriendsContent={true}/>}>
                <Route index element={<PersonList type={PersonListType.VISITED}/>}/>
              </Route>
              <Route path={ROUTES.content_tabs.friends.requests} element={<UserPageSearchContent isFriendsContent={true}/>}>
                <Route index element={<PersonList type={PersonListType.REQUESTS}/>}/>
              </Route>
              <Route path={ROUTES.content_tabs.films.films_main} element={<UserPageSearchContent isFriendsContent={false} category={Categories.FILM}/>}>
                <Route index element={<ItemList category={Categories.FILM} isMain={true}/>} />
              </Route>
              <Route path={ROUTES.content_tabs.films.films_sub} element={<UserPageSearchContent isFriendsContent={false} category={Categories.FILM}/>}>
                <Route index element={<ItemList category={Categories.FILM} isMain={false}/>} />
              </Route>
              <Route path={ROUTES.content_tabs.books.books_main} element={<UserPageSearchContent isFriendsContent={false} category={Categories.BOOK}/>}>
                <Route index element={<ItemList category={Categories.BOOK} isMain={true}/>} />
              </Route>
              <Route path={ROUTES.content_tabs.books.books_sub} element={<UserPageSearchContent isFriendsContent={false} category={Categories.BOOK}/>}>
                <Route index element={<ItemList category={Categories.BOOK} isMain={false}/>} />
              </Route>
              <Route path={ROUTES.content_tabs.music.music_main} element={<UserPageSearchContent isFriendsContent={false} category={Categories.MUSIC}/>}>
                <Route index element={<ItemList category={Categories.MUSIC} isMain={true}/>} />
              </Route>
              <Route path={ROUTES.content_tabs.music.music_sub} element={<UserPageSearchContent isFriendsContent={false} category={Categories.MUSIC}/>}>
                <Route index element={<ItemList category={Categories.MUSIC} isMain={false}/>} />
              </Route>
              <Route path={ROUTES.content_tabs.games.games_main} element={<UserPageSearchContent isFriendsContent={false} category={Categories.GAME}/>}>
                <Route index element={<ItemList category={Categories.GAME} isMain={true}/>} />
              </Route>
              <Route path={ROUTES.content_tabs.games.games_sub} element={<UserPageSearchContent isFriendsContent={false} category={Categories.GAME}/>}>
                <Route index element={<ItemList category={Categories.GAME} isMain={false}/>}/>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
  );
}

export default App;
