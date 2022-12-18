import React, {FC} from 'react';
import {Box, Button, Card, CardContent, IconButton, Rating, Typography} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import {UserPersonalInfoModel} from "../../../types/UserModels";
import PersonHeader from "./PersonHeader";
import {userdataAPI} from "../../../services/userdataService";
import {useAppSelector} from "../../../hooks/redux";
import ButtonFriend from "../../UI/buttons/ButtonFriend";

export interface PersonCardProps {
    person: UserPersonalInfoModel,
    //onClick: (id: string) => void
}

const PersonCardFriend: FC<PersonCardProps> = ({person}) => {

    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person}/>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" flexGrow="1" alignItems="center" gap={1}>
                        <ButtonFriend person={person}/>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardFriend;