import React, {FC} from 'react';
import {Box, List, ListItem, Rating, Typography} from "@mui/material";
import {ItemModel} from "../../../types/ItemModel";
import {Categories} from "../../../types/Categories";
import {analizAPI} from "../../../services/analizService";
import {useAppSelector} from "../../../hooks/redux";
import {noop} from "@reduxjs/toolkit/dist/listenerMiddleware/utils";

export interface TopListTemplateProps {
    title: string,
    items: ItemModel[],
}

const CategoryListTemplate: FC<TopListTemplateProps> = ({title, items}) => {

    const textNoItems = "У пользователя нет избранного :(";

    return (
        <Box display="flex" flexDirection="column" sx={{marginTop: 1}}>
            <Typography> {title} </Typography>
            {(items.length > 0) ?
                <List>
                    {items.map((item) => (
                        <ListItem>
                            <Box display="flex" flexDirection="row" gap={1}>
                                <Typography> {item.title} </Typography>
                                <Rating value={item.rating} disabled />
                            </Box>
                        </ListItem>))}
                </List>
                :
                <Typography marginTop={2} variant="body2"> {textNoItems} </Typography>
            }
        </Box>
    );
};

export default CategoryListTemplate;