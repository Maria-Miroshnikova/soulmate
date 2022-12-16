import React, {FC} from 'react';
import {PersonCardProps} from "./PersonCardFriend";
import {Box, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";
import ButtonRequest from "../../UI/buttons/ButtonRequest";

const PersonCardOldRequest: FC<PersonCardProps> = ({person}) => {
    return (
        <Card>
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

export default PersonCardOldRequest;