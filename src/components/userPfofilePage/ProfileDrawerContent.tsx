import React, {FC, useEffect, useState} from 'react';
import {Badge, Box, Button, Icon, List, ListItem, ListItemButton, Typography} from "@mui/material";
import UserHeader from "./UserHeader";
import {loadingPersonalInfoModel, UserModel, UserPersonalInfoModel} from "../../types/UserModels";
import {userpersonalinfo_number_set} from "../../test/userpersonalinfo";
import {getDrawerOptions} from "./tabs/drawerOptions";
import {INavButton} from "../../types/INavButton";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getIdFromPath} from "../../router/routes";
import {useAppSelector} from "../../hooks/redux";
import {POLLING_INTERVAL_COUNT_REQUESTS, userdataAPI} from "../../services/userdataService";
import PersonHeader from "./personcard/PersonHeader";
import MyBadge from "../UI/badge/MyBadge";

interface ProfileDrawerProps {
    isUserProfile: boolean
};

const ProfileDrawerContent: FC = () => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);
    const isUserProfile = pageId === userId!;
    const options: INavButton[] = getDrawerOptions(isUserProfile, pageId!);

    const {data: user, isLoading} = userdataAPI.useFetchUserPersonalInfoByIdQuery({ userId: pageId });

    const navigate = useNavigate();

    const handleClickOnOption = (idx: number) => {
        navigate(options[idx].url_to);
    }

    // TODO! avatar update
    const handleClickOnAvatar = (id: string) => {

    }

    // TODO: т к это нужно только на пользовательской странице, хорошо бы разнести по разным....
    const {data: countResponse, isLoading: isLoadingCount} = userdataAPI.useFetchUserCountOfRequestsToFriendsQuery({userId: userId!}, {
        //pollingInterval: POLLING_INTERVAL_COUNT_REQUESTS
    });

    const [isVisibleBadge, setIsVisibleBadge] = useState<boolean>(false);

    useEffect(() => {
        if (isLoadingCount) {
            setIsVisibleBadge(false);
        }
        else {
            setIsVisibleBadge((countResponse!.countRequests > 0));
        }
    }, [countResponse, isLoadingCount]);

    //<UserHeader user={} />
    // TODO: в будущем можно добавить иконку для действия с юзером
    return (
        <Box>
            <List>
                <ListItem key={-1}>
                    {
                        (isLoading) ?
                            <PersonHeader person={loadingPersonalInfoModel} onClick={handleClickOnAvatar}/>
                            :
                            <PersonHeader person={user!} onClick={handleClickOnAvatar}/>
                    }
                </ListItem>
                {options.map((option, idx) =>
                    <ListItemButton key={idx} onClick={() => handleClickOnOption(idx)}>
                        {
                            (option.isFiends) ?
                                <Box display="flex" flexDirection="row" gap={2}>
                                    <Typography> {option.textBotton} </Typography>
                                    {(isVisibleBadge) ?
                                        <MyBadge />
                                        : null
                                    }
                                </Box>
                                :
                                <Typography> {option.textBotton} </Typography>
                        }
                    </ListItemButton>
                )}
            </List>
        </Box>
    );
};

export default ProfileDrawerContent;