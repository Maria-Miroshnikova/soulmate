import React, {FC, useState} from 'react';
import {Box, Button, List, ListItem, ListItemButton, Typography} from "@mui/material";
import UserHeader from "./UserHeader";
import {UserModel, UserPersonalInfoModel} from "../../types/UserModels";
import {userpersonalinfo_number_set} from "../../test/userpersonalinfo";
import {getDrawerOptions} from "./tabs/drawerOptions";
import {INavButton} from "../../types/INavButton";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getIdFromPath} from "../../router/routes";
import {useAppSelector} from "../../hooks/redux";

interface ProfileDrawerProps {
    isUserProfile: boolean
};

/*
<Button onClick={(event) => handleClickOnOption(idx)}> {option.textBotton} </Button>
 */

const ProfileDrawerContent: FC = () => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);
    console.log("user id: " + userId + " pageid: " + pageId);
    const isUserProfile = pageId === userId!;
    const options: INavButton[] = getDrawerOptions(isUserProfile, pageId!);

    // TODO: redux
    // TODO: type = UserModel!
    const [user, setUser] = useState<UserPersonalInfoModel>(userpersonalinfo_number_set[0]);

    const navigate = useNavigate();

    const handleClickOnOption = (idx: number) => {
        navigate(options[idx].url_to);
    }

    //<UserHeader user={} />
    // TODO: в будущем можно добавить иконку для действия с юзером
    return (
        <Box>
            <List>
                <ListItem>
                    <UserHeader user={user} />
                </ListItem>
                {options.map((option, idx) =>
                    <ListItemButton onClick={() => handleClickOnOption(idx)}>
                        <Typography> {option.textBotton} </Typography>
                    </ListItemButton>
                )}
            </List>
        </Box>
    );
};

export default ProfileDrawerContent;