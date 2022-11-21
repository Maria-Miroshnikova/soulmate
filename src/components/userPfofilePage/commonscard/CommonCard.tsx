import React, {FC} from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import {Categories} from "../../../types/Categories";
import {useAppSelector} from "../../../hooks/redux";

export interface CommonCardProps {
    category: Categories;
}

const CommonCard: FC<CommonCardProps> = ({category}) => {

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);

    return (
        <Card>
            <CardContent>
                <Typography></Typography>
            </CardContent>
        </Card>
    );
};

export default CommonCard;