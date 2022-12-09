import React from 'react';
import {Box, List, ListItem, Tab, Tabs, Typography} from "@mui/material";
import UserProfileContent from "../userPfofilePage/profilecontent/UserProfileContent";
import PersonProfileContent from "../userPfofilePage/profilecontent/PersonProfileContent";
import {CommentModel} from "../../types/CommentModel";
import CommonCard from "../userPfofilePage/commonscard/CommonCard";
import CommentCard from "./CommentCard";
import {moderatorAPI} from "../../services/moderatorService";
import {useAppSelector} from "../../hooks/redux";

const ModeratorPageContent = () => {

    const textTab = "Комментарии";
    const moderatorId = useAppSelector(state => state.authReducer.userId);

    // TODO: раскомментить подкачку комментов
    const {data: comments, isLoading} = moderatorAPI.useFetchCommentsQuery({moderatorId: moderatorId!}, {
        // pollingInterval: POLLING_INTERVAL_COUNT_REQUESTS
    });

    return (
        <Box display="flex" flexDirection="column" width="100%" height="min-content">
            <Box  sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs>
                    <Tab label={textTab}/>
                </Tabs>
            </Box>
            <Box display="flex" flexDirection="column" width="100%">
                {(isLoading) ?
                    <Typography> Loading... </Typography>
                    :
                    (comments!.length === 0) ?
                        <Typography> Нет комментариев для проверки </Typography>
                        :
                        <List>
                            {comments!.map(item => <ListItem> <CommentCard data={item}/> </ListItem>)}
                        </List>
                }
            </Box>
        </Box>
    );
};

export default ModeratorPageContent;