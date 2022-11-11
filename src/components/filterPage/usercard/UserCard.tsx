import React, {FC} from 'react';
import {Avatar, Box, Button, Card, CardContent, CardHeader} from "@mui/material";
import {UserCardInfo} from "../../../types/UserCardInfo";
import UserAccordionTemplate from "./UserAccordionTemplate";
import {Categories} from "../../../types/Categories";

interface UserCardProps{
    user: UserCardInfo
}

// TODO: очередность аккордионов с категориями наверное определяется приоритетом.
//  Аккордион с наибольшим совп? самый важный?
// TODO: avatar
const UserCard: FC<UserCardProps> = ({user}) => {

    return (
        <Card sx={{paddingLeft: 1, paddingRight: 1, paddingTop: 1}}>
            <CardHeader
                title={user.personal_data.nickname}
                sx={{paddingBottom: 1}}
                avatar={
                <Avatar sx={{ bgcolor: "primary" }} aria-label="avatar">
                    ?
                </Avatar>
            } />
            <CardContent>
                <UserAccordionTemplate category={Categories.FILM} user={user} />
                <UserAccordionTemplate category={Categories.BOOK} user={user} />
                <UserAccordionTemplate category={Categories.GAME} user={user} />
                <UserAccordionTemplate category={Categories.MUSIC} user={user} />
                <Box paddingTop={2} gap={1} display="flex" justifyContent="flex-end" width="100%">
                    <Button variant="contained">ПРИГЛАСИТЬ</Button>
                    <Button variant="contained">ПОСМОТРЕТЬ</Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;