import React, {FC, useState} from 'react';
import {ItemModel} from "../../../types/ItemModel";
import {Box, Button, Card, CardContent, Collapse, IconButton, Rating, TextField, Typography} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import CommentIcon from "@mui/icons-material/Comment";
import ClearIcon from "@mui/icons-material/Clear";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {Categories, CategoriesModel} from "../../../types/Categories";

export interface ItemCardBasicProps {
    item: ItemModel,
    category: Categories,
    isMain: boolean
}

const ItemCardBasic: FC<ItemCardBasicProps> = ({item, category, isMain}) => {

    const textCommentLabel = "Ваш комментарий";
    const textBtnSave = "Сохранить";
    const textBtnDeleteComment = "Удалить";

    const userId = useAppSelector(state => state.authReducer.userId);
    const [commentValue, setCommentValue] = useState<string>(item.comment!);
    const [ratingValue, setRatingValue] = useState<number>(item.rating);

    const [expanded, setExpanded] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const [removeItem] = userdataAPI.useRemoveItemMutation();
    const [changeRating] = userdataAPI.useUpdateItemRatingMutation();
    const [changeComment] = userdataAPI.useUpdateItemCommentMutation();



    // TODO: как будет перерисовываться после обновления??
    const handleSaveComment = () => {
        changeComment({itemId: item.id, value: commentValue, category: category, isMain: isMain});
        setExpanded(!expanded);
    }

    const handleDeleteComment = () => {
        setCommentValue("");
        changeComment({itemId: item.id, value: "", category: category, isMain: isMain});
        setExpanded(!expanded);
    }

    const handleChangeRating = (value: number | null) => {
        setRatingValue(value!);
        changeRating({itemId: item.id, value: value!.toString(), category: category, isMain: isMain});
    }

    const handleChangeComment = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCommentValue(event.target.value);
    }

    const handleDeleteItem = () => {
        removeItem({
            itemId: item.id,
            userId: userId!,
            category: category,
            isMain: isMain})
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
                            ((item.comment === undefined) || (item.comment === "")) ?
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
                            <Button variant="contained" onClick={handleSaveComment}> {textBtnSave} </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default ItemCardBasic;