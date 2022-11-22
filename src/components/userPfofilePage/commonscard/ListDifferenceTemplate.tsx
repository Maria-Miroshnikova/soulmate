import React, {FC} from 'react';
import {Box, List, ListItem, Rating, Typography} from "@mui/material";
import {ItemModel} from "../../../types/ItemModel";

export interface ListDifferenceTemplateProps {
    userItems: ItemModel[]
    rating_his: number[]
    textCategory: string;
}

const ListDifferenceTemplate: FC<ListDifferenceTemplateProps> = ({userItems, rating_his, textCategory}) => {

    const textRatings = "Ваша оценка / оценка пользователя";

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row">
                <Typography> {textCategory + ": "} </Typography>
                <Typography align="right" flexGrow={1}> {textRatings} </Typography>
            </Box>
            <List>
                {userItems.map((item, index) => (
                    <ListItem>
                        <Box display="flex" flexDirection="row">
                            <Typography> {item.title} </Typography>
                            <Rating value={item.rating} disabled/>
                            <Rating value={rating_his.at(index)} disabled/>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ListDifferenceTemplate;