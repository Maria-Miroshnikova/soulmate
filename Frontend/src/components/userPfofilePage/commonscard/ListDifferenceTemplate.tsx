import React, {FC} from 'react';
import {Box, List, ListItem, Rating, Typography} from "@mui/material";
import {ItemModel} from "../../../types/ItemModel";
import {DifferentRatingResponse} from "../../../services/analizService";

export interface ListDifferenceTemplateProps {
    responseDifferent?: DifferentRatingResponse,
    textCategory: string,
    isLoading: boolean
}

const ListDifferenceTemplate: FC<ListDifferenceTemplateProps> = ({responseDifferent, textCategory, isLoading}) => {

    const textRatings = "Ваша оценка / оценка пользователя";

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row">
                <Typography> {textCategory + ": "} </Typography>
                <Typography align="right" flexGrow={1}> {textRatings} </Typography>
            </Box>
            <List>
                {
                    (isLoading) ?
                        <Typography> Loading... </Typography>
                        :
                        (responseDifferent!.userItems.length === 0) ?
                            null
                            :
                            (responseDifferent!.userItems.map((item, index) => (
                                <ListItem>
                                    <Box display="flex" flexDirection="row" width="100%">
                                        <Typography> {item.title} </Typography>
                                        <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end" gap={3}>
                                            <Rating value={item.rating} disabled />
                                            <Rating value={responseDifferent!.personRatings.at(index)} disabled />
                                        </Box>
                                    </Box>
                                </ListItem>)))
                }
            </List>
        </Box>
    );
};

export default ListDifferenceTemplate;