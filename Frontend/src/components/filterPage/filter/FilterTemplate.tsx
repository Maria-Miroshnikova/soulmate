import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import {
    Autocomplete,
    Card,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    CardContent,
    Box,
    Chip
} from "@mui/material";
import {Categories, extractCategoryFromCategories} from "../../../types/Categories";
import {IFilter} from "../../../text/FiltersText";
import {FiltersText} from "../../../text/FiltersText";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {extractOptionFromOptions} from "../../../types/OptionModels";
import {FilterStatus, setFilterCategory} from "../../../store/reducers/filterPageFilterSlice";

interface FilterTemplateProps extends PropsWithChildren{
    category: Categories
}
const FilterTemplate: FC<FilterTemplateProps> = ({category}) => {

    const filterText: IFilter = FiltersText(category);

    const options_ontology = useAppSelector((state) => state.optionsReducer.categories);
    const options = extractOptionFromOptions(options_ontology!, category);
    //console.log("options: ", options);

    const [selectedOptionsMain, setSelectedOptionsMain] = React.useState<any | null>([]);
    const [selectedOptionsSub, setSelectedOptionsSub] = React.useState<any | null>([]);
    const [isCheckedMain, setIsCheckedMain] = useState<boolean>(true);
    const [isCheckedSub, setIsCheckedSub] = useState<boolean>(true);

    const submitStatus = useAppSelector((state) => state.filterPageFilterReducer.status);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (submitStatus === FilterStatus.IS_SUBMITTING) {
            dispatch(setFilterCategory({
                category: category,
                filterCategory: {main_category: selectedOptionsMain, sub_category: selectedOptionsSub},
                checkboxes: {main_category: isCheckedMain, sub_category: isCheckedSub}
            }));
        }
    }, [submitStatus])

    const updateFilter = (isCheckbox: boolean, isMain: boolean, value: any) => {
        const opt_main = (isCheckbox) ?
            selectedOptionsMain
            :
            (isMain) ?
                value
                :
                selectedOptionsMain;
        const opt_sub = (isCheckbox) ?
            selectedOptionsSub
            :
            (isMain) ?
                selectedOptionsSub
                :
                value;
        const check_main = (!isCheckbox) ?
            isCheckedMain
            :
            (isMain) ?
                value
                :
                isCheckedMain;
        const check_sub = (!isCheckbox) ?
            isCheckedSub
            :
            (isMain) ?
                isCheckedSub
                :
                value;

        dispatch(setFilterCategory({
            category: category,
            filterCategory: {main_category: opt_main, sub_category: opt_sub},
            checkboxes: {main_category: check_main, sub_category: check_sub}
        }));
    }

    const handleChoseOptions = (newValue: any | null, isMain: boolean) => {
        const options = newValue.map((option: { value: any; }) => option.value || option);
        if (isMain)
            setSelectedOptionsMain(options);
        else
            setSelectedOptionsSub(options);
        updateFilter(false, isMain, options);
    }

    const handleCheckMain = () => {
        const value = !isCheckedMain;
        setIsCheckedMain(value);
        updateFilter(true, true, value);
    }

    const handleCheckSub = () => {
        const value = !isCheckedSub;
        setIsCheckedSub(value);
        updateFilter(true, false, value);
    }

    // add LOADING to AUTOCOMPLETE when fetch
    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="column">
                    <Typography variant="h6" marginBottom={2}> {filterText.category} </Typography>
                    <Autocomplete
                        multiple
                        //options={options.main_category.keys()}
                        options={options.main_category.map((option) => option.id)}
                        //getOptionLabel={(option) => options.main_category.getValue(option)!}
                        getOptionLabel={(id) => options.main_category.find((option) => {return option.id === id})!.title}
                        filterSelectedOptions={true}
                        renderInput={(params) => <TextField {...params} label={filterText.labelFirstTextField} />}
                        value={selectedOptionsMain}
                        onChange={(event: any, newValue: any | null) => handleChoseOptions(newValue, true)}
                        renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((id, index) => (
                            //return tagValue.map((option, index) => (
                                //<Chip {...getTagProps({ index })} label={options.main_category.getValue(option)} color="primary" sx={{minWidth: "72px"}} />
                                <Chip {...getTagProps({ index })} label={options.main_category.find((option) => {return option.id === id})!.title} color="primary" sx={{minWidth: "72px"}} />
                            ));}}
                        sx={{ marginBottom: 2 }}
                    />
                    <Autocomplete
                        multiple
                        //options={options.sub_category.keys()}
                        options={options.sub_category.map((option) => option.id)}
                        //getOptionLabel={(option) => options.sub_category.getValue(option)!}
                        getOptionLabel={(id) => options.sub_category.find((option) => {return option.id === id})!.title}
                        filterSelectedOptions={true}
                        renderInput={(params) => <TextField {...params} label={filterText.labelLastTextField} />}
                        value={selectedOptionsSub}
                        onChange={(event: any, newValue: any | null) => handleChoseOptions(newValue, false)}
                        renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((id, index) => (
                            //return tagValue.map((option, index) => (
                            //    <Chip {...getTagProps({ index })} label={options.sub_category.getValue(option)} color="primary" sx={{minWidth: "72px"}} />
                                <Chip {...getTagProps({ index })} label={options.sub_category.find((option) => {return option.id === id})!.title} color="primary" sx={{minWidth: "72px"}} />
                            ));}}
                        sx={{ marginBottom: 1}}
                    />
                    <FormControlLabel control={<Checkbox checked={isCheckedMain} onChange={handleCheckMain} />} label={filterText.labelFirstCheckBox} />
                    <FormControlLabel control={<Checkbox checked={isCheckedSub} onChange={handleCheckSub}/>} label={filterText.labelLastCheckBox} />
            </Box>
            </CardContent>
        </Card>
    );
};

export default FilterTemplate;