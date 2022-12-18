import React, {FC, useEffect, useState} from 'react';
import {Box, Tab, Tabs} from "@mui/material";
import {Categories} from "../../types/Categories";
import {getCategoryTabs, getFriendsTabs, getSubscribeTabs} from "./tabs/tabs";
import SearchBar from "../UI/searchbar/SearchBar";
import {Outlet} from "react-router";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getIdFromPath} from "../../router/routes";
import {useAppSelector} from "../../hooks/redux";
import {POLLING_INTERVAL_COUNT_REQUESTS, userdataAPI} from "../../services/userdataService";
import MyBadge from "../UI/badge/MyBadge";

interface UserPageContentProps {
    isContentAboutFriends: boolean,
    isSubscribers: boolean,
    category?: Categories
}

const UserPageSearchContent: FC<UserPageContentProps> = ({category, isContentAboutFriends, isSubscribers}) => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);
    console.log("id: " + pageId);
    const isUserPage = !(userId === pageId!);
    const tabs = (isContentAboutFriends) ?
        getFriendsTabs(pageId!)
        :
        (isSubscribers) ?
            getSubscribeTabs(pageId!)
            :
            getCategoryTabs(category!, pageId!);

    const countFound = useAppSelector((state) => state.searchConentReducer.countFound);

    const navigate = useNavigate();

    const handleClickOnTab = (idx: number) => {
        navigate(tabs[idx].url_to);
    }


    const {data: countResponse, isLoading: isLoadingCount} = userdataAPI.useFetchUserCountOfRequestsToFriendsQuery({userId: userId!}, {
       // pollingInterval: POLLING_INTERVAL_COUNT_REQUESTS
    });

    const [isVisibleBadge, setIsVisibleBadge] = useState<boolean>(false);

    useEffect(() => {
        if (isLoadingCount) {
            setIsVisibleBadge(false);
            console.log("loading response");
        }
        else {
            setIsVisibleBadge((countResponse!.countRequests > 0));
            console.log(countResponse);
        }
    }, [countResponse, isLoadingCount]);

    // TODO сделать красивые tabs
    return (
        <Box display="flex" flexDirection="column" width="100%" height="min-content">
            <Box  sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs>
                    {tabs.map((tab, idx) => {
                        if (tab.isFiends && (idx === 1) && isVisibleBadge)
                            return <Box width="100%" display="flex" justifyContent="center"><Tab label={tab.textBotton} key={idx} icon={<MyBadge/>} iconPosition={"end"} onClick={(event) => handleClickOnTab(idx)}/></Box>
                        else
                            return <Box width="100%" display="flex" justifyContent="center"><Tab label={tab.textBotton} key={idx} onClick={(event) => handleClickOnTab(idx)}/></Box>
                    })}
                </Tabs>
            </Box>
            <Box marginTop={0}>
                {
                    (isContentAboutFriends) ?
                        <SearchBar countFound={countFound} isFriends={isContentAboutFriends}/>
                        :
                        <SearchBar countFound={countFound} isFriends={isContentAboutFriends} category={category}/>
                }
            </Box>
            <Box display="flex" flexDirection="column" paddingLeft={2} paddingTop={2}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default UserPageSearchContent;