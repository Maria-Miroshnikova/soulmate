import React, {FC} from 'react';
import {Avatar, Box, Button, Card, CardContent, CardHeader, Typography} from "@mui/material";
import {UserCardInfo} from "../../../types/UserCardInfo";
import UserAccordionTemplate from "./UserAccordionTemplate";
import {Categories} from "../../../types/Categories";
import {userdataAPI} from "../../../services/userdataService";
import {useAppSelector} from "../../../hooks/redux";
import ButtonFriend from "../../UI/buttons/ButtonFriend";
import ButtonRequest from "../../UI/buttons/ButtonRequest";
import ButtonVisited from "../../UI/buttons/ButtonVisited";
import AvatarClickable from "../../UI/avatar/AvatarClickable";
import {PersonType} from "../../../types/PersonType";
import ButtonMyRequest from "../../UI/buttons/ButtonMyRequest";
import ButtonOldRequest from "../../UI/buttons/ButtonOldRequest";

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
    // TODO: раскоммитить после интеграции с API
  //  const {data: personTypeRespone, isLoading: isLoadingPersonType} = userdataAPI.useFetchTypeOfPersonForUserQuery({userId: userId!, personId: user.personal_data.id});
    const personTypeRespone = { personType: PersonType.VISITED };
    const isLoadingPersonType = false;

    return (
        <Card sx={{paddingLeft: 1, paddingRight: 1, paddingTop: 1}}>
            <CardHeader
                title={user.personal_data.nickname}
                sx={{paddingBottom: 1}}
                avatar={
                <AvatarClickable person={user.personal_data}/>
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
                                (personTypeRespone!.personType === PersonType.MY_REQUEST) ?
                                    <ButtonMyRequest person={user.personal_data} />
                                    :
                                    (personTypeRespone!.personType === PersonType.SUBSCRIBERS) ?
                                        <ButtonOldRequest person={user.personal_data} />
                                        :
                                        <ButtonVisited person={user.personal_data!} />
                    }
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;