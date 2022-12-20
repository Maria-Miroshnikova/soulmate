import React from 'react';
import {useAppSelector} from "../../hooks/redux";
import {Box, Tab, Tabs} from "@mui/material";
import MyBadge from "../UI/badge/MyBadge";
import SearchBar from "../UI/searchbar/SearchBar";
import {Outlet} from "react-router";
import {getProfileTabs} from "./tabs/tabs";
import PersonProfileContent from "./profilecontent/PersonProfileContent";
import UserProfileContent from "./profilecontent/UserProfileContent";
import {useLocation} from "react-router-dom";

const UserPageProfileContent = () => {

    const userId = useAppSelector(state => state.authReducer.userId);
    //const pageId = useAppSelector((state) => state.searchConentReducer.pageId);
    const location = useLocation();
    const pageId = location.pathname.split('/')[2];
    console.log("userID: ", userId);
    console.log("pageID: ", pageId);
   // console.log("pageId === userID: ", userId === pageId );
    const isUserPage = userId === pageId;

    const tabs = getProfileTabs();

    const handleClickOnTab = (idx: number) => {
        console.log("idx: ", idx);
    }

    return (
        <Box display="flex" flexDirection="column" width="100%" height="min-content">
            <Box  sx={{ borderBottom: 1, borderColor: 'divider' }} display="flex" flexDirection="row" justifyContent="center">
                <Tabs value={false}>
                    {
                        tabs.map((tab, idx) => {
                            return <Tab label={tab.textBotton} key={idx} onClick={(event) => handleClickOnTab(idx)}/>
                    })
                    }
                </Tabs>
            </Box>
            <Box display="flex" flexDirection="column" paddingLeft={2}>
                {(isUserPage) ?
                    <UserProfileContent />
                    :
                    <PersonProfileContent />
                }
            </Box>
        </Box>
    );
};

export default UserPageProfileContent;