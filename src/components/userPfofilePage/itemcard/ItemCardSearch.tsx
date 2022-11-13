import React, {FC} from 'react';
import {
    Accordion,
    AccordionSummary, Box, Button, Card, CardContent, Collapse,
    IconButton, Rating, TextField,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useAppDispatch} from "../../../hooks/redux";
import {addItem} from "../../../store/reducers/userItemsPageSlice";
import {ItemCardBasicProps} from "./ItemCardBasic";
import CreateIcon from "@mui/icons-material/Create";
import CommentIcon from "@mui/icons-material/Comment";
import ClearIcon from "@mui/icons-material/Clear";


// TODO: изменить itemmodel на option?
const ItemCardSearch: FC<ItemCardBasicProps> = ({item}) => {

    const dispatch = useAppDispatch();

    // TODO: переделать всё в экшены
    // TODO: переделать с редакс-тул-китом
    const onAdd = () => {
        dispatch(addItem(item.id));

        /*
        * удаление этого варианта из списка для добавки!
        * */
    }

    // TODO: padding bottom изменить
    return (
        <Card>
            <CardContent sx={{ '& .MuiCardContent-root': {
                    paddingBottom: 2
                }}}>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <Typography width="100%"> {item.title} </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" alignItems="center" gap={1}>
                        <IconButton> <AddIcon/> </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ItemCardSearch;