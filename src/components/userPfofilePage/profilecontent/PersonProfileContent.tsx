import React from 'react';
import {Box, Button} from "@mui/material";
import CommonCard from "../commonscard/CommonCard";
import {Categories} from "../../../types/Categories";
import {PersonType} from "../lists/PersonList";
import {userdataAPI} from "../../../services/userdataService";
import {useAppSelector} from "../../../hooks/redux";
import ButtonFriend from "../../UI/buttons/ButtonFriend";
import ButtonRequest from "../../UI/buttons/ButtonRequest";
import ButtonVisited from "../../UI/buttons/ButtonVisited";

const PersonProfileContent = () => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);
    const {data: personTypeRespone, isLoading: isLoadingPersonType} = userdataAPI.useFetchTypeOfPersonForUserQuery({userId: userId!, personId: pageId});
    const {data: person, isLoading: isLoadingPerson} = userdataAPI.useFetchUserPersonalInfoByIdQuery({userId : pageId})

    const textDelete = "Удалить";
    const textDeny = "Отказать";
    const textAdd = "Принять";
    const textRequest = "Подать заявку";

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <CommonCard category={Categories.FILM}/>
            <CommonCard category={Categories.BOOK}/>
            <CommonCard category={Categories.GAME}/>
            <CommonCard category={Categories.MUSIC}/>
            <Box display="flex" flexDirection="row" justifyContent="center">
                {(isLoadingPersonType || isLoadingPerson) ?
                    null
                    :
                    (personTypeRespone!.personType === PersonType.FRIENDS) ?
                        <ButtonFriend person={person!} />
                        :
                        (personTypeRespone!.personType === PersonType.REQUESTS) ?
                            <ButtonRequest person={person!} />
                            :
                            <ButtonVisited person={person!} />
                }
            </Box>
        </Box>
    );
};

export default PersonProfileContent;