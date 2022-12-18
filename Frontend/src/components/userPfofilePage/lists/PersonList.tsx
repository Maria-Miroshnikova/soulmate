import React, {FC, useEffect} from 'react';
import {userdataAPI} from "../../../services/userdataService";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {Box} from "@mui/material";
import PersonCardFriend from "../personcard/PersonCardFriend";
import PersonCardVisited from "../personcard/PersonCardVisited";
import {setCountFound} from "../../../store/reducers/searchContentSlice";
import {useLocation} from "react-router-dom";
import {PersonType} from "../../../types/PersonType";
import PersonCardMyRequest from "../personcard/PersonCardMyRequest";
import PersonCardOldRequest from "../personcard/PersonCardOldRequest";
import PersonCardRequest from "../personcard/PersonCardRequest";

interface PersonListProps {
    type: PersonType
}

const PersonList: FC<PersonListProps> = ({type}) => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const title = useAppSelector(state => state.searchConentReducer.title);
    // TODO title правильно там хранится/обнуляется?
    const {data: persons, isLoading} = userdataAPI.useFetchUserPersonsByIdQuery({userId: userId!, personsType: type, title: title!});
    console.log("persons ", persons);

    const dispatch = useAppDispatch();
    const location = useLocation();

    // обновление coundFound
    useEffect(() => {
        if (!isLoading && persons) {
            dispatch(setCountFound(persons!.length));
        }
    }, [isLoading, persons, location.pathname])


    return (isLoading) ?
        <Box> Loading... </Box>
        :
        (
            <Box display="flex" flexDirection="column" gap={2}>
                { (type === PersonType.FRIENDS) ?
                    persons!.map(person =>  <PersonCardFriend person={person}/>)
                    :
                    (type === PersonType.VISITED) ?
                        persons!.map(person =>  <PersonCardVisited person={person}/>)
                        :
                        (type === PersonType.MY_REQUEST) ?
                            persons!.map(person =>  <PersonCardMyRequest person={person}/>)
                            :
                            (type === PersonType.SUBSCRIBERS) ?
                                persons!.map(person =>  <PersonCardOldRequest person={person}/>)
                                :
                                persons!.map(person =>  <PersonCardRequest person={person}/>)
                }
            </Box>)
        ;
};

export default PersonList;