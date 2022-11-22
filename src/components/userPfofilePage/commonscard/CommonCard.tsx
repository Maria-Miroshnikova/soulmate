import React, {FC, useState} from 'react';
import {Box, Card, CardContent, Collapse, Typography} from "@mui/material";
import {Categories} from "../../../types/Categories";
import {useAppSelector} from "../../../hooks/redux";
import {UserAccordionText} from "../../../text/UserAccordionText";
import TopListTemplate from "./TopListTemplate";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ListDifferenceTemplate from "./ListDifferenceTemplate";
import {CommonCardText} from "../../../text/CommonCardText";
import {themeMain} from "../../../theme";

export interface CommonCardProps {
    category: Categories;
}

const CommonCard: FC<CommonCardProps> = ({category}) => {

    const textCommons = "У вас совпали:";
    const textNew = "Новое для вас:";
    const textTopHigh = "Топ-5 высоких оценок";
    const textTopLow = "Топ-5 низких оценок";
    const textYours = "Ваша оценка";
    const textHis = "Оценка пользователя";
    const textDifference = "Противоположные оценки";
    const textCategories = UserAccordionText(category);
    const textCategoriesDifference = CommonCardText(category);

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);

    const [expanded, setExpanded] = useState<boolean>(false);

    const count = "1"

    const handleExpand = () => {
        setExpanded(!expanded);
    }

    return (
        <Card sx={{paddingLeft: 2, paddingRight: 2, paddingTop: 1, paddingBottom: 1}}>
            <CardContent>
                <Typography variant="h5" marginBottom={3}> {textCategories.summary.category} </Typography>
                <Box display="flex" flexDirection="row">
                    <Typography> {textCommons} </Typography>
                    <Typography align="center" flexGrow="1" > { count + " " + textCategories.summary.first + " / " + count + " " + textCategories.summary.last} </Typography>
                </Box>
                <Box display="flex" flexDirection="row" sx={{marginTop: 1}}>
                    <Typography> {textNew} </Typography>
                    <Typography align="center" flexGrow="1" > { count + " " + textCategories.summary.first + " / " + count + " " + textCategories.summary.last} </Typography>
                </Box>
                <TopListTemplate isHighList={true} yourMain={[]} yourSub={[]} hisMain={[]} hisSub={[]} textCategoryMain={textCategories.summary.first} textCategorySub={textCategories.summary.last}/>
                <TopListTemplate isHighList={false} yourMain={[]} yourSub={[]} hisMain={[]} hisSub={[]} textCategoryMain={textCategories.summary.first} textCategorySub={textCategories.summary.last}/>
                <Box display="flex" flexDirection="row" alignItems="center" sx={{marginTop: 1}}>
                    <Typography variant="h6" color={themeMain.palette.primary.main}> {textDifference} </Typography>
                    <Typography align="center" flexGrow="1" > { count + " " + textCategories.summary.first + " / " + count + " " + textCategories.summary.last} </Typography>
                    <ExpandCircleDownIcon color="primary" onClick={handleExpand}/>
                </Box>
            </CardContent>
            <Collapse in={expanded}>
                <CardContent>
                    <ListDifferenceTemplate items={[]} rating_your={[]} rating_his={[]} textCategory={textCategoriesDifference.main} />
                    <ListDifferenceTemplate items={[]} rating_your={[]} rating_his={[]} textCategory={textCategoriesDifference.sub} />
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default CommonCard;