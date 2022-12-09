import React, {FC} from 'react';
import {Box, Button, Card, CardContent, Chip, Collapse, IconButton, Rating, TextField, Typography} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import {ItemModel} from "../../types/ItemModel";
import {CommentModel} from "../../types/CommentModel";
import {useAppSelector} from "../../hooks/redux";
import {moderatorAPI} from "../../services/moderatorService";

export interface CommentCardProps {
    data: CommentModel
}

const CommentCard: FC<CommentCardProps> = ({data}) => {

    const textCommentLabel = "Комментарий пользователя";
    const textAccept = "Одобрить";
    const textReject = "Отклонить";

    const moderatorId = useAppSelector(state => state.authReducer.userId);

    const [approveComment] = moderatorAPI.useApproveCommentMutation();
    const [rejectComment] = moderatorAPI.useRejectCommentMutation();

    // TODO: запросы
    const handleAcceptComment = () => {
        approveComment(
            {
                moderatorId: moderatorId!,
                comment: data
            }
        );
    }

    const handleRejectComment = () => {
        rejectComment(
            {
                moderatorId: moderatorId!,
                comment: data
            }
        )
    }

    return (
        <Card sx={{width: "100%"}}>
            <CardContent>
                <Box display="flex" flexDirection="row" alignItems="center" gap={3}>
                    <Typography width="100%"> {data.item.title} </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" alignItems="center" gap={1}>
                        <Rating value={data.item.rating} readOnly/>
                    </Box>
                </Box>
            </CardContent>
            <Collapse in={true}>
                <CardContent>
                    <Box display="flex" flexDirection="column" width="100%" gap={2}>
                        <TextField
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            multiline
                            label={textCommentLabel}
                            defaultValue={data.item.comment}
                        >
                        </TextField>
                    </Box>
                </CardContent>
            </Collapse>
            <CardContent>
                <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" gap={1}>
                    <Button variant="contained" onClick={handleRejectComment}> {textReject} </Button>
                    <Button variant="contained" onClick={handleAcceptComment}> {textAccept} </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CommentCard;