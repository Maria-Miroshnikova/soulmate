import React, {FC} from 'react';
import {Box, Tab, Tabs} from "@mui/material";
import {Categories} from "../../types/Categories";
import {getCategoryTabs, getFriendsTabs} from "./tabs/tabs";
import SearchBar from "../UI/searchbar/SearchBar";
import {Outlet} from "react-router";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getIdFromPath} from "../../router/routes";
import {useAppSelector} from "../../hooks/redux";

interface UserPageContentProps {
    //isFriendsContent: boolean,
    category?: Categories
}

const UserPageSearchContent: FC<UserPageContentProps> = ({category}) => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);
    console.log("id: " + pageId);
    const isFriendsContent = !(userId === pageId);
    const tabs = (isFriendsContent) ? getFriendsTabs(pageId!) : getCategoryTabs(category!, pageId!);

    const countFound = useAppSelector((state) => state.searchConentReducer.countFound);

    const navigate = useNavigate();

    const handleClickOnTab = (idx: number) => {
        navigate(tabs[idx].url_to);
    }

    // TODO сделать красивые tabs
    return (
        <Box display="flex" flexDirection="column" width="100%" height="min-content">
            <Box  sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs>
                    {tabs.map((tab, idx) => <Tab label={tab.textBotton} onClick={(event) => handleClickOnTab(idx)}/>)}
                </Tabs>
            </Box>
            <Box marginTop={0}>
                {
                    (isFriendsContent) ?
                        <SearchBar countFound={countFound} isFriends={isFriendsContent}/>
                        :
                        <SearchBar countFound={countFound} isFriends={isFriendsContent} category={category}/>
                }
            </Box>
            <Box display="flex" flexDirection="column" paddingLeft={2} paddingTop={2}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default UserPageSearchContent;