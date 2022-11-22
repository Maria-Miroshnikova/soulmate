import React, {FC} from 'react';
import {Box, List, ListItem, Rating, Typography} from "@mui/material";
import {ItemModel} from "../../../types/ItemModel";

export interface ListDifferenceTemplateProps {
    items: ItemModel[],
    rating_your: number[],
    rating_his: number[]
    textCategory: string;
}

const ListDifferenceTemplate: FC<ListDifferenceTemplateProps> = ({items, rating_your, rating_his, textCategory}) => {

    const textRatings = "Ваша оценка / оценка пользователя";

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row">
                <Typography> {textCategory + ": "} </Typography>
                <Typography align="right" flexGrow={1}> {textRatings} </Typography>
            </Box>
            <List>
                {items.map((item, index) => (
                    <ListItem>
                        <Box display="flex" flexDirection="row">
                            <Typography> {item.title} </Typography>
                            <Rating value={rating_your.at(index)} disabled/>
                            <Rating value={rating_his.at(index)} disabled/>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ListDifferenceTemplate;