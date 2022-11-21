import React, {FC, useEffect} from 'react';
import {userdataAPI} from "../../../services/userdataService";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {Box} from "@mui/material";
import ItemCardFriend from "../itemcard/ItemCardFriend";
import PersonCardFriend from "../personcard/PersonCardFriend";
import PersonCardVisited from "../personcard/PersonCardVisited";
import PersonCardRequest from "../personcard/PersonCardRequest";
import {setCountFound} from "../../../store/reducers/searchContentSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {getFullProfilePath} from "../../../router/routes";

export enum PersonType {
    FRIENDS,
    VISITED,
    REQUESTS
}

interface PersonListProps {
    type: PersonType
}

const PersonList: FC<PersonListProps> = ({type}) => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const title = useAppSelector(state => state.searchConentReducer.title);
    // TODO title правильно там хранится/обнуляется?
    const {data: persons, isLoading} = userdataAPI.useFetchUserPersonsByIdQuery({userId: userId!, personsType: type, title: title!});

    const dispatch = useAppDispatch();
    const location = useLocation();

    // обновление coundFound
    useEffect(() => {
        if (!isLoading && persons) {
            dispatch(setCountFound(persons!.length));
        }
    }, [isLoading, persons, location.pathname])

    const [addToVisited] = userdataAPI.useAddPersonToVisitedMutation();
    const navigate = useNavigate();

    // TODO добавить такое же на filterPage
    const handleGoToProfile = (personId: string) => {
        addToVisited({
            personId: personId,
            userId: userId!
        });
        navigate(getFullProfilePath(personId));
    }

    return (isLoading) ?
        <Box> Loading... </Box>
        :
        (
            <Box display="flex" flexDirection="column" gap={2}>
                { (type === PersonType.FRIENDS) ?
                    persons!.map(person =>  <PersonCardFriend person={person} onClick={handleGoToProfile}/>)
                    :
                    (type === PersonType.VISITED) ?
                        persons!.map(person =>  <PersonCardVisited person={person} onClick={handleGoToProfile}/>)
                        :
                        persons!.map(person =>  <PersonCardRequest person={person} onClick={handleGoToProfile}/>)
                }
            </Box>)
        ;
};

export default PersonList;