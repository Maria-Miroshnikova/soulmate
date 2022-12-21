import React, {FC} from 'react';
import {Avatar} from "@mui/material";
import {UserPersonalInfoModel} from "../../../types/UserModels";
import {getFullProfilePath} from "../../../router/routes";
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {useNavigate} from "react-router-dom";

export interface AvatarProps {
    person: UserPersonalInfoModel,
    onClick?: (id: string) => void
}

const AvatarClickable: FC<AvatarProps> = ({person, onClick}) => {

    const navigate = useNavigate();

    const handleGoToProfile = (personId: string) => {
        navigate(getFullProfilePath(personId));
    }

    if (onClick === undefined)
        onClick = handleGoToProfile;

    return (
        <Avatar onClick={(event) => onClick!(person.id)} src={person.avatar}>
        </Avatar>
    );
};

export default AvatarClickable;