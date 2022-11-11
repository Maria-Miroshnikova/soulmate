import React, {FC, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Box, Button,
    IconButton,
    Rating,
    TextField,
    Typography
} from "@mui/material";
import {ItemModel} from "../../../types/ItemModel";
import CommentIcon from '@mui/icons-material/Comment';
import CreateIcon from '@mui/icons-material/Create';
import ClearIcon from '@mui/icons-material/Clear';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {deleteComment, deleteItem, setComment, setRating} from "../../../store/reducers/userItemsPageSlice";

export interface ItemCardProps {
    item: ItemModel
}

const ItemCard: FC<ItemCardProps> = ({item}) => {

    const textCommentLabel = "Ваш комментарий";
    const textBtnSave = "Сохранить";
    const textBtnDeleteComment = "Удалить";

    const [commentValue, setCommentValue] = useState<string>(item.comment!);
    const [ratingValue, setRatingValue] = useState<number>(item.rating);

    const dispatch = useAppDispatch();

    // TODO: переделать всё в экшены
    // TODO: переделать с редакс-тул-китом
    const handleEditComment = () => {

        dispatch(setComment({id: item.id, comment: commentValue}));
        /*
        dispatch(udpateComment()) -> запись в БД
        */
    }

    const handleDeleteComment = () => {
        dispatch(deleteComment(item.id));
    }

    const handleChangeRating = (value: number | null) => {
        setRatingValue(value!);
        dispatch(setRating({id:item.id, rating: value!}));
    }

    const handleChangeComment = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCommentValue(event.target.value);
    }

    const handleDeleteItem = () => {
        dispatch(deleteItem(item.id));
    }

    return (
        <Accordion sx={{ paddingBottom: 1, minWidth: "max-content"}} >
            <AccordionSummary>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <Typography> {item.title} </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" alignItems="center" gap={1}>
                        {
                            (item.comment === undefined) ?
                                <IconButton> <CreateIcon /> </IconButton>
                                :
                                <IconButton> <CommentIcon/> </IconButton>
                        }
                        <Rating value={ratingValue} onChange={(event, newValue) => handleChangeRating(newValue)}/>
                        <IconButton onClick={handleDeleteItem} sx={{ marginLeft: 2}}> <ClearIcon/> </IconButton>
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" flexDirection="column" width="100%" gap={2}>
                    <TextField
                        fullWidth
                        multiline
                        label={textCommentLabel}
                        value={commentValue}
                        onChange={(event) => handleChangeComment(event)}
                    >
                    </TextField>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" gap={1}>
                        <Button variant="contained" onClick={handleDeleteComment}> {textBtnDeleteComment} </Button>
                        <Button variant="contained" onClick={handleEditComment}> {textBtnSave} </Button>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default ItemCard;