import React, {FC} from 'react';
import {
    Accordion,
    AccordionSummary, Box, Button, Card, CardContent, Collapse,
    IconButton, Rating, TextField,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {ItemCardBasicProps} from "./ItemCardBasic";
import CreateIcon from "@mui/icons-material/Create";
import CommentIcon from "@mui/icons-material/Comment";
import ClearIcon from "@mui/icons-material/Clear";
import {Categories} from "../../../types/Categories";
import {OptionItemModel} from "../../../types/OptionModels";
import {userdataAPI} from "../../../services/userdataService";
import {themeMain} from "../../../theme";

export interface ItemCardSearchProps {
    option: OptionItemModel
    category: Categories,
    isMain: boolean
}

const ItemCardSearch: FC<ItemCardSearchProps> = ({option, category, isMain}) => {

    const [addItem] = userdataAPI.useAddItemMutation();
    const userId = useAppSelector(state => state.authReducer.userId);

    const onAdd = () => {
        addItem({
            itemId: option.id,
            userId: userId!,
            category: category,
            isMain: isMain
        })
    }

    // TODO: padding bottom изменить
    return (
        <Card>
            <CardContent sx={{
                opacity: .5,
                '& .MuiCardContent-root': {
                    paddingBottom: 2
                }}}>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <Typography width="100%"> {option.title} </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" alignItems="center" gap={1}>
                        <IconButton onClick={onAdd}> <AddIcon/> </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ItemCardSearch;