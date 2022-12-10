import React, {FC} from 'react';
import {IUserAccordion} from "../../../text/UserAccordionText";
import {Box, Chip, Divider, Typography} from "@mui/material";
import {extractOptionFromOptions} from "../../../types/OptionModels";
import {useAppSelector} from "../../../hooks/redux";
import {Categories} from "../../../types/Categories";

interface UserAccordionDetailProps{
    category: Categories,
    dataYou: string[],
    dataFilter: string[],
    accordionText: IUserAccordion,
    isMain: boolean
}

// TODO: возможно, передавать список you и filter вместе, и уже здесь считать пересечение и бить на два?
const UserAccordionDetail: FC<UserAccordionDetailProps> = ({dataYou, dataFilter, accordionText, isMain, category}) => {

    const detailsTextStart: string = "Cовпадения по";
    const detailsTextYou: string = ": с вами ";
    const detailsTextFilters: string = " / с фильтром ";
    const categoryText: string = (isMain) ? accordionText.details.first : accordionText.details.last;
    const detailsText: string = (detailsTextStart + ' ' + categoryText + detailsTextYou
        + dataYou.length.toString() + detailsTextFilters + dataFilter.length.toString());

    const options_ontology = useAppSelector((state) => state.optionsReducer.categories);
    const options_both = extractOptionFromOptions(options_ontology, category);
    const options = (isMain) ? options_both.main_category : options_both.sub_category;
    /*console.log("opt: ", options);
    console.log("you: ", dataYou);
    console.log("find", dataYou.map((id) => {
        console.log("id =", id);
        console.log("id type ", typeof(id));
        options.find((option) => {
            console.log("option id =", option.id);
            console.log("option id type ", typeof(option.id));
            return option.id === id.toString()});
    }))*/

    return (dataYou.length + dataFilter.length === 0) ?
            null
            :
        (
            <Box display="flex" flexDirection="column" width="100%">
                <Divider sx={{marginBottom: 1}} />
                <Typography variant="subtitle2"> {detailsText} </Typography>
                <Box
                    display="flex"
                    width="100%"
                    gap="8px"
                    flexWrap="wrap"
                    marginTop={1}
                >
                    {dataYou.map((id) => <Chip key={id} label={options.find((option) => {
                        //console.log("--- id : ", id);
                        return option.id === id})!.title} color="primary" sx={{minWidth: "72px"}}/>)}
                    {dataFilter.map((id) => <Chip key={id} label={options.find((option) => {return option.id === id})!.title} color="secondary" sx={{minWidth: "72px"}}/>)}
                </Box>
            </Box>
        );
};

export default UserAccordionDetail;