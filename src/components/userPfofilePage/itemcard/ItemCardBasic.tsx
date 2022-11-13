import React, {FC, useState} from 'react';
import {ItemModel} from "../../../types/ItemModel";
import {Box, Button, Card, CardContent, Collapse, IconButton, Rating, TextField, Typography} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import CommentIcon from "@mui/icons-material/Comment";
import ClearIcon from "@mui/icons-material/Clear";
import {useAppDispatch} from "../../../hooks/redux";
import {deleteComment, deleteItem, setComment, setRating} from "../../../store/reducers/userItemsPageSlice";

export interface ItemCardBasicProps {
    item: ItemModel
}

const ItemCardBasic: FC<ItemCardBasicProps> = ({item}) => {

    const textCommentLabel = "Ваш комментарий";
    const textBtnSave = "Сохранить";
    const textBtnDeleteComment = "Удалить";

    const [commentValue, setCommentValue] = useState<string>(item.comment!);
    const [ratingValue, setRatingValue] = useState<number>(item.rating);

    const [expanded, setExpanded] = useState<boolean>(false);

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

    const handleExpand = () => {
        setExpanded(!expanded);
    }

    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <Typography width="100%"> {item.title} </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" alignItems="center" gap={1}>
                        {
                            (item.comment === undefined) ?
                                <IconButton onClick={handleExpand}> <CreateIcon /> </IconButton>
                                :
                                <IconButton  onClick={handleExpand}> <CommentIcon/> </IconButton>
                        }
                        <Rating value={ratingValue} onChange={(event, newValue) => handleChangeRating(newValue)}/>
                        <IconButton onClick={handleDeleteItem} sx={{ marginLeft: 2}}> <ClearIcon/> </IconButton>
                    </Box>
                </Box>
            </CardContent>
            <Collapse in={expanded}>
                <CardContent>
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
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default ItemCardBasic;