import React, {FC} from 'react';
import {
    Accordion,
    AccordionSummary, Box,
    IconButton,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ItemCardProps} from "./ItemCard";
import {useAppDispatch} from "../../../hooks/redux";
import {addItem} from "../../../store/reducers/userItemsPageSlice";

const ItemCardSearch: FC<ItemCardProps> = ({item}) => {

    const dispatch = useAppDispatch();

    // TODO: переделать всё в экшены
    // TODO: переделать с редакс-тул-китом
    const onAdd = () => {
        dispatch(addItem(item.id));

        /*
        * удаление этого варианта из списка для добавки!
        * */
    }

    return (
        <Accordion sx={{ paddingBottom: 1, minWidth: "max-content"}} expanded={false}>
            <AccordionSummary>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <Typography> {item.title} </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" alignItems="center" gap={1}>
                        <IconButton> <AddIcon/> </IconButton>
                    </Box>
                </Box>
            </AccordionSummary>
        </Accordion>
    );
};

export default ItemCardSearch;