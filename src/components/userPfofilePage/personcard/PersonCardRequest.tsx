import React, {FC} from 'react';
import {PersonCardProps} from "./PersonCardFriend";
import {Box, Button, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";
import {userdataAPI} from "../../../services/userdataService";
import {useAppSelector} from "../../../hooks/redux";
import ButtonRequest from "../../UI/buttons/ButtonRequest";

const PersonCardRequest: FC<PersonCardProps> = ({person, onClick}) => {

    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person} onClick={onClick}/>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" flexGrow="1" alignItems="center" gap={1}>
                        <ButtonRequest person={person} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardRequest;