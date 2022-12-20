import React, {FC} from 'react';
import {PersonCardProps} from "./PersonCardFriend";
import {Box, Button, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";
import {userdataAPI} from "../../../services/userdataService";
import {useAppSelector} from "../../../hooks/redux";
import ButtonRequest from "../../UI/buttons/ButtonRequest";

const PersonCardRequest: FC<PersonCardProps> = ({person}) => {

    return (
        <Card key={person.id}>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person}/>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" flexGrow="1" alignItems="center" gap={1}>
                        <ButtonRequest person={person} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardRequest;