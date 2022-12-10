import React, {FC} from 'react';
import {Categories, CategoryModel, extractCategoryFromCategories} from "../../../types/Categories";
import {Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography} from "@mui/material";
import {getUserCardInfoCategory, UserCardInfo} from "../../../types/UserCardInfo";
import {IUserAccordion} from "../../../text/UserAccordionText";
import {UserAccordionText} from "../../../text/UserAccordionText";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UserAccordionDetail from "./UserAccordionDetail";
import {getFilterDifference, getFilterIntersection} from "../../../utils/filterPage/getFilterIntersection";
import {useAppSelector} from "../../../hooks/redux";

interface UserAccordionTemplateProps{
    category: Categories,
    user: UserCardInfo
}

// TODO: user must have FILTERED first/last! what about YOURS/FILTERS?
const UserAccordionTemplate: FC<UserAccordionTemplateProps> = ({category, user}) => {

    const filter = useAppSelector((state) => state.filterPageFilterReducer.filter);
    const filterCategory = extractCategoryFromCategories(filter.filter_categories, category);

    const accordionText: IUserAccordion = UserAccordionText(category);
    const data = getUserCardInfoCategory(user, category);
    //console.log("user data: ", data);
    if (data.main_category.length + data.sub_category.length === 0)
        return null;

    const summaryText: string = (data.main_category.length.toString() + ' ' + accordionText.summary.first + ' / '
                            + data.sub_category.length.toString() + ' ' + accordionText.summary.last);

    // TODO: разбиение пришедших данных на совпадение по фильтру и по личным
    // ATTENTION: предполагается, что общие категории юзера содержат только то, что совпало с фильтром/запросом, а не весь его набор!
    const dataFilter: CategoryModel = getFilterIntersection(data, filterCategory);
   // console.log("DATAFILER: ", dataFilter);
    const dataYou: CategoryModel = getFilterDifference(data, dataFilter);
   // console.log("DATAYOU: ", dataYou);

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1"> {accordionText.summary.category} </Typography>
                <Typography variant="subtitle2" color="primary" width="100%" align="center"> {summaryText} </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" flexDirection="column" gap={2} marginBottom={1}>
                    <UserAccordionDetail category={category} isMain={true} dataYou={dataYou.main_category} dataFilter={dataFilter.main_category} accordionText={accordionText} />
                    <UserAccordionDetail category={category} isMain={false} dataYou={dataYou.sub_category} dataFilter={dataFilter.sub_category} accordionText={accordionText} />
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default UserAccordionTemplate;