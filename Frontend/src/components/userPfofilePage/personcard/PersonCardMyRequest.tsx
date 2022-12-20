import React, {FC} from 'react';
import {Box, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";
import ButtonFriend from "../../UI/buttons/ButtonFriend";
import {PersonCardProps} from "./PersonCardFriend";
import ButtonRequest from "../../UI/buttons/ButtonRequest";
import ButtonMyRequest from "../../UI/buttons/ButtonMyRequest";

// TODO: создать для него страничку
const PersonCardMyRequest: FC<PersonCardProps> = ({person}) => {
    return (
        <Card key={person.id}>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person}/>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" flexGrow="1" alignItems="center" gap={1}>
                        <ButtonMyRequest person={person}/>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardMyRequest;