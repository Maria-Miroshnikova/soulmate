import React, {FC, useState} from 'react';
import {Box, List, ListItem, Typography} from "@mui/material";
import UserHeader from "./UserHeader";
import {UserModel, UserPersonalInfoModel} from "../../types/UserModels";
import {userpersonalinfo_number_set} from "../../test/userpersonalinfo";
import {getDrawerOptions} from "./tabs/drawerOptions";
import {INavButton} from "../../types/INavButton";
import {useParams} from "react-router-dom";

interface ProfileDrawerProps {
    isUserProfile: boolean
};

const ProfileDrawer: FC = () => {

    const {userId} = useParams();
    const isUserProfile = true;
    const options: INavButton[] = getDrawerOptions(isUserProfile);

    // TODO: redux
    // TODO: type = UserModel!
    const [user, setUser] = useState<UserPersonalInfoModel>(userpersonalinfo_number_set[0]);


    const handleClickOnOption = (idx: number) => {
        /*
        navigate(option)
        * */
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
                    <ListItem onClick={(event) => handleClickOnOption(idx)}>
                        <Typography> {option.textBotton} </Typography>
                    </ListItem>
                )}
            </List>
        </Box>
    );
};

export default ProfileDrawer;