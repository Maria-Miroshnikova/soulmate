import React, {FC} from 'react';
import {ItemModel} from "../../../types/ItemModel";
import {Box, List, ListItem, Rating, Typography} from "@mui/material";
import CategoryListTemplate from "./CategoryListTemplate";
import {Categories} from "../../../types/Categories";
import {UserAccordionText} from "../../../text/UserAccordionText";
import {useAppSelector} from "../../../hooks/redux";

export interface TopListTemplateProps {
    isHighList: boolean,
    category: Categories,
    personId: string
}

// TODO нужно ли выкачивать прямо itemModel или упрощенную?
const TopListTemplate: FC<TopListTemplateProps> = ({isHighList, category, personId}) => {

    const textTopHigh = "Топ-5 высоких оценок";
    const textTopLow = "Топ-5 низких оценок";
    const textYours = "Ваша оценка";
    const textHis = "Оценка пользователя";

    const userId = useAppSelector(state => state.authReducer.userId);

    const textCategories = UserAccordionText(category);

    return (
        <Box display="flex" flexDirection="column" sx={{marginTop: 3}}>
            <Typography variant="h6" color="secondary"> {(isHighList) ? textTopHigh : textTopLow} </Typography>
            <Box display="flex" flexDirection="row" width="100%">
                <Box display="flex" flexDirection="column" flexGrow={1}>
                    <CategoryListTemplate title={textYours + " " + textCategories.summary.first} isMain={true} personId={userId!} category={category} isHigh={isHighList}/>
                    <CategoryListTemplate title={textYours + " " +  textCategories.summary.last} isMain={false} personId={userId!} category={category} isHigh={isHighList}/>
                </Box>
                <Box display="flex" flexDirection="column" flexGrow={1}>
                    <CategoryListTemplate title={textHis} isMain={true} personId={personId} category={category} isHigh={isHighList}/>
                    <CategoryListTemplate title={textHis} isMain={false} personId={personId} category={category} isHigh={isHighList}/>
                </Box>
            </Box>
        </Box>
    );
};

export default TopListTemplate;