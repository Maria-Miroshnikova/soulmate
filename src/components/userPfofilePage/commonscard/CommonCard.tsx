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
import {analizAPI} from "../../../services/analizService";
import SharedItemsAnalizComponent from "./SharedItemsAnalizComponent";

export interface CommonCardProps {
    category: Categories;
}

const CommonCard: FC<CommonCardProps> = ({category}) => {

    const textCommons = "У вас совпали:";
    const textNew = "Новое для вас:";
    const textDifference = "Противоположные оценки";
    const textCategories = UserAccordionText(category);
    const textCategoriesDifference = CommonCardText(category);

    const userId = useAppSelector(state => state.authReducer.userId);
    const pageId = useAppSelector((state) => state.searchConentReducer.pageId);

    const [expanded, setExpanded] = useState<boolean>(false);

    const textNoDifferentRatings = "Не нашлось :(";

    const handleExpand = () => {
        setExpanded(!expanded);
    }

    // Совпадения/новое для пользователя
    const {data: itemsSharedMain, isLoading: isLoadingSharedMain} = analizAPI.useFetchCommonDataQuery({
        userId: userId!,
        personId: pageId,
        category: category,
        isMain: true
    });
    const {data: itemsSharedSub, isLoading: isLoadingSharedSub} = analizAPI.useFetchCommonDataQuery({
        userId: userId!,
        personId: pageId,
        category: category,
        isMain: false
    });
    const {data: itemsNewMain, isLoading: isLoadingNewMain} = analizAPI.useFetchNewDataQuery({
        userId: userId!,
        personId: pageId,
        category: category,
        isMain: true
    });
    const {data: itemsNewSub, isLoading: isLoadingNewSub} = analizAPI.useFetchNewDataQuery({
        userId: userId!,
        personId: pageId,
        category: category,
        isMain: true
    });

    // Противоположные рэйтинги
    const {data: differentItemsMain, isLoading: isLoadingDifferentMain} = analizAPI.useFetchDifferentRatingDataQuery({
        userId: userId!,
        personId: pageId,
        category: category,
        isMain: true
    });
    const {data: differentItemsSub, isLoading: isLoadingDifferentSub} = analizAPI.useFetchDifferentRatingDataQuery({
        userId: userId!,
        personId: pageId,
        category: category,
        isMain: false
    });

    return (
        <Card sx={{paddingLeft: 3, paddingRight: 3, paddingTop: 1, paddingBottom: 1}}>
            <CardContent>
                <Typography variant="h5" marginBottom={3}> {textCategories.summary.category} </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                    <SharedItemsAnalizComponent
                        isLoading={(isLoadingSharedMain || isLoadingSharedSub)}
                        itemsMain={itemsSharedMain}
                        itemsSub={itemsSharedSub}
                        title={textCommons}
                        textCategories={textCategories} />
                    <SharedItemsAnalizComponent
                        isLoading={(isLoadingNewMain || isLoadingNewSub)}
                        itemsMain={itemsNewMain}
                        itemsSub={itemsNewSub}
                        title={textNew}
                        textCategories={textCategories} />
                </Box>
                <TopListTemplate isHighList={true} category={category} personId={pageId}/>
                <TopListTemplate isHighList={false} category={category} personId={pageId}/>
                <Box display="flex" flexDirection="row" alignItems="center" sx={{marginTop: 1}}>
                    <Typography variant="h6" color={themeMain.palette.primary.main}> {textDifference} </Typography>
                    {
                        (isLoadingDifferentSub || isLoadingDifferentMain) ?
                            <Typography align="center" flexGrow="1" > Loading ...</Typography>
                            :
                            ((differentItemsMain!.userItems.length === 0) && (differentItemsSub!.userItems.length === 0)) ?
                                <Typography align="center" flexGrow="1" > {textNoDifferentRatings} </Typography>
                                :
                                (<>
                                    <Typography align="center" flexGrow="1" > { differentItemsMain!.userItems.length + " " + textCategories.summary.first + " / " + differentItemsSub!.userItems.length + " " + textCategories.summary.last} </Typography>
                                    <ExpandCircleDownIcon color="primary" onClick={handleExpand}/>
                                </>)
                    }
                </Box>
            </CardContent>
            <Collapse in={expanded}>
                <CardContent>
                    <ListDifferenceTemplate responseDifferent={differentItemsMain} textCategory={textCategoriesDifference.main} isLoading={isLoadingDifferentMain}/>
                    <ListDifferenceTemplate responseDifferent={differentItemsSub} textCategory={textCategoriesDifference.sub} isLoading={isLoadingDifferentSub}/>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default CommonCard;