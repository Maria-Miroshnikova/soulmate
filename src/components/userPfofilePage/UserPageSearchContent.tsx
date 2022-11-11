import React, {FC} from 'react';
import {Box, Tab, Tabs} from "@mui/material";
import {Categories} from "../../types/Categories";
import {getCategoryTabs, getFriendsTabs} from "./tabs/tabs";
import SearchBar from "../UI/searchbar/SearchBar";
import {Outlet} from "react-router";

interface UserPageContentProps {
    isFriendsContent: boolean,
    category?: Categories
}

const UserPageSearchContent: FC<UserPageContentProps> = ({isFriendsContent, category}) => {

    console.log(isFriendsContent)
    const tabs = (isFriendsContent) ? getFriendsTabs() : getCategoryTabs(category!);
    console.log(tabs);

    const handleClickOnTab = (idx: number) => {
        /*

        navigate(tabs[idx])
         */
    }

    return (
        <Box display="flex" flexDirection="column" width="100%" height="min-content">
            <Box  sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs>
                    {tabs.map((tab) => <Tab label={tab.textBotton} />)}
                </Tabs>
            </Box>
            {
                (isFriendsContent) ?
                    <SearchBar countFound={0} isFriends={isFriendsContent}/>
                    :
                    <SearchBar countFound={0} isFriends={isFriendsContent} category={category}/>
            }
            <Box display="flex" flexDirection="column">
                <Outlet />
            </Box>
        </Box>
    );
};

export default UserPageSearchContent;