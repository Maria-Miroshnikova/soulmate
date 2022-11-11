import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import AppLayout from "./components/appLayout";
import {Box} from "@mui/material";
import DrawerContentLayout from "./components/drawerContentLayout";
import FilterDrawerContent from "./components/filterPage/filter/FilterDrawerContent";
import FilterPageContent from "./components/filterPage/FilterPageContent";
import ProfileDrawer from "./components/userPfofilePage/ProfileDrawer";
import UserPageSearchContent from "./components/userPfofilePage/UserPageSearchContent";
import {Categories} from "./types/Categories";
import UserPageProfileContent from "./components/userPfofilePage/UserPageProfileContent";
import {ROUTES} from "./router/routes";
import PersonList, {PersonListType} from "./components/userPfofilePage/lists/PersonList";
import ItemList from "./components/userPfofilePage/lists/ItemList";
import {updateUserPageId} from "./store/reducers/userItemsPageSlice";
import {useAppDispatch} from "./hooks/redux";

function App() {

  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateUserPageId(location.pathname));
  }, [location]);

  return (
      <Routes>
        <Route path={ROUTES.base_url} element={<AppLayout/>}>
          <Route index element={<Box> MAIN </Box>} />
          <Route path={ROUTES.pages.filter} element={<DrawerContentLayout drawerContent={<FilterDrawerContent/>}/>}>
            <Route index element={<FilterPageContent/>}/>
          </Route>
          <Route path={ROUTES.pages.account}>
            <Route path=":id" element={<DrawerContentLayout drawerContent={<ProfileDrawer/>}/>}>
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
