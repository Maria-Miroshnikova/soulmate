import React, {FC} from 'react';
import {Box, List, ListItem, Rating, Typography} from "@mui/material";
import {ItemModel} from "../../../types/ItemModel";
import {Categories} from "../../../types/Categories";
import {analizAPI} from "../../../services/analizService";
import {useAppSelector} from "../../../hooks/redux";

export interface TopListTemplateProps {
    title: string,
    category: Categories,
    isMain: boolean,
    personId: string,
    isHigh: boolean
}

const CategoryListTemplate: FC<TopListTemplateProps> = ({title, category, isMain, personId, isHigh}) => {

    const {data: items, isLoading} = analizAPI.useFetchTopDataQuery({
        userId: personId,
        category: category,
        isMain: isMain,
        isHigh: isHigh
    });

    //убрать разграничение когда нормальный ответ от API будет
    const userId = useAppSelector(state => state.authReducer.userId);
    const isUsers = userId === personId;

    console.log("isLoading: ", isLoading);
    console.log("data: ", items)

    return (
        <Box display="flex" flexDirection="column" sx={{marginTop: 1}}>
            <Typography> {title} </Typography>
            {(isLoading) ?
                <Typography> Loading... </Typography>
                :
                (<List>
                    {(isUsers) ?
                        (items!.userTop.map((item) => (
                                <ListItem>
                                    <Box display="flex" flexDirection="row">
                                        <Typography> {item.title} </Typography>
                                        <Rating value={item.rating} disabled />
                                    </Box>
                                </ListItem>)))
                        :
                        (items!.personTop.map((item) => (
                                <ListItem>
                                    <Box display="flex" flexDirection="row">
                                        <Typography> {item.title} </Typography>
                                        <Rating value={item.rating} disabled />
                                    </Box>
                                </ListItem>)))
                    }
                </List>)
            }
        </Box>
    );
};

export default CategoryListTemplate;