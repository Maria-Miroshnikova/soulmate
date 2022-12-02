import React, {FC} from 'react';
import {Avatar, Box, Button, Card, CardContent, CardHeader, Typography} from "@mui/material";
import {UserCardInfo} from "../../../types/UserCardInfo";
import UserAccordionTemplate from "./UserAccordionTemplate";
import {Categories} from "../../../types/Categories";
import {userdataAPI} from "../../../services/userdataService";
import {useAppSelector} from "../../../hooks/redux";
import {PersonType} from "../../userPfofilePage/lists/PersonList";
import ButtonFriend from "../../UI/buttons/ButtonFriend";
import ButtonRequest from "../../UI/buttons/ButtonRequest";
import ButtonVisited from "../../UI/buttons/ButtonVisited";

interface UserCardProps{
    user: UserCardInfo
}

// TODO: очередность аккордионов с категориями наверное определяется приоритетом.
//  Аккордион с наибольшим совп? самый важный?
// TODO: avatar

/*
old version
<Box paddingTop={2} gap={1} display="flex" justifyContent="flex-end" width="100%">
                    <Button variant="contained">ПРИГЛАСИТЬ</Button>
                    <Button variant="contained">ПОСМОТРЕТЬ</Button>
                </Box>
 */
const UserCard: FC<UserCardProps> = ({user}) => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const {data: personTypeRespone, isLoading: isLoadingPersonType} = userdataAPI.useFetchTypeOfPersonForUserQuery({userId: userId!, personId: user.personal_data.id});

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
                    {(isLoadingPersonType) ?
                        <Typography> LOADING ... </Typography>
                        :
                        (personTypeRespone!.personType === PersonType.FRIENDS) ?
                            <ButtonFriend person={user.personal_data!} />
                            :
                            (personTypeRespone!.personType === PersonType.REQUESTS) ?
                                <ButtonRequest person={user.personal_data!} />
                                :
                                <ButtonVisited person={user.personal_data!} />
                    }
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;