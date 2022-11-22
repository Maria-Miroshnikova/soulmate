import React, {FC} from 'react';
import {Box, List, ListItem, Rating, Typography} from "@mui/material";
import {ItemModel} from "../../../types/ItemModel";

export interface TopListTemplateProps {
    items: ItemModel[]
    title: string
}

const ListTemplate: FC<TopListTemplateProps> = ({items, title}) => {

    return (
        <Box display="flex" flexDirection="column" sx={{marginTop: 1}}>
            <Typography> {title} </Typography>
            <List>
                {items.map((item) => (
                    <ListItem>
                        <Box display="flex" flexDirection="row">
                            <Typography> {item.title} </Typography>
                            <Rating value={item.rating} disabled />
                        </Box>
                    </ListItem>))}
            </List>
        </Box>
    );
};

export default ListTemplate;