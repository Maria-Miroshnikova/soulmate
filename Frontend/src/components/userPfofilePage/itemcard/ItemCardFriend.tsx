import React, {FC, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Box, Button, Card, CardContent, Collapse,
    IconButton,
    Rating,
    TextField,
    Typography
} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import {ItemCardBasicProps} from "./ItemCardBasic";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";

/*export interface ItemCardFriendProps {
    item:
}*/

const ItemCardFriend: FC<ItemCardBasicProps> = ({item, isMain, category}) => {

    const textCommentLabel = "Комментарий пользователя";

    const [expanded, setExpanded] = useState<boolean>(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    }

    return (
        <Card key={item.id}>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <Typography width="100%"> {item.title} </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" width="100%" alignItems="center" gap={1}>
                        {
                            ((item.comment === undefined) || (item.comment === "")) ?
                                null
                                :
                                <IconButton onClick={handleExpand}> <CommentIcon/> </IconButton>
                        }
                        <Rating value={item.rating} readOnly/>
                    </Box>
                </Box>
            </CardContent>
            {(item.comment === undefined) ?
                null
                :
                <Collapse in={expanded}>
                    <CardContent>
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
                    </CardContent>
                </Collapse>
            }
        </Card>
    );
};

export default ItemCardFriend;