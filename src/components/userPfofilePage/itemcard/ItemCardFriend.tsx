import React, {FC, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Box,
    IconButton,
    Rating,
    TextField,
    Typography
} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import {ItemCardProps} from "./ItemCard";

const ItemCardFriend: FC<ItemCardProps> = ({item}) => {

    const textCommentLabel = "Комментарий пользователя";

    const [isExpanded, setIsExpanded] = useState(false);

    const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        if (item.comment !== undefined)
            setIsExpanded(!isExpanded);
    }

    return (
        <Accordion sx={{ paddingBottom: 1, minWidth: "max-content"}} expanded={isExpanded} onClick={(event) => onClick(event)}>
            <AccordionSummary>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <Typography> {item.title} </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" alignItems="center" gap={1}>
                        {
                            (item.comment === undefined) ?
                                null
                                :
                                <IconButton> <CommentIcon/> </IconButton>
                        }
                        <Rating value={item.rating} readOnly/>
                    </Box>
                </Box>
            </AccordionSummary>
            {
                (item.comment === undefined) ?
                    null
                    :
                    <AccordionDetails>
                        <Box display="flex" flexDirection="column" width="100%" gap={2}>
                            <TextField
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                multiline
                                label={textCommentLabel}
                                defaultValue={item.comment}
                            >
                            </TextField>
                        </Box>
                    </AccordionDetails>
            }
        </Accordion>
    );
};

export default ItemCardFriend;