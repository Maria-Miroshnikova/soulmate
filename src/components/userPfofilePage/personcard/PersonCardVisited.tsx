import React, {FC} from 'react';
import {PersonCardProps} from "./PersonCardFriend";
import {Box, Button, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import ButtonVisited from "../../UI/buttons/ButtonVisited";

const PersonCardVisited: FC<PersonCardProps> = ({person, onClick}) => {

    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person} onClick={onClick}/>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" flexGrow="1" alignItems="center" gap={1}>
                        <ButtonVisited person={person}/>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardVisited;