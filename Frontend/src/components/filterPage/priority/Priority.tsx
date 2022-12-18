import React, {FC, useEffect} from 'react';
import {Autocomplete, Chip, TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {FilterStatus} from "../../../store/reducers/filterPageFilterSlice";
import {setPriority} from "../../../store/reducers/prioritySlice";
import {Categories} from "../../../types/Categories";
import {Dictionary} from "typescript-collections";

const Priority: FC = () => {

    const priorityText = "Порядок сортировки";

    const options_array = [
        {
            category: Categories.FILM,
            title: "КИНО"
        },
        {
            category: Categories.BOOK,
            title: "КНИГИ"
        },
        {
            category: Categories.MUSIC,
            title: "МУЗЫКА"
        },
        {
            category: Categories.GAME,
            title: "ИГРЫ"
        },
    ]

    const options_dict = new Dictionary<Categories, string>();
    options_array.map(i => options_dict.setValue(i.category, i.title));

    const [selectedOptions, setSelectedOptions] = React.useState<any | null>([]);
    const filterStatus = useAppSelector((state) => state.filterPageFilterReducer.status);
    const dispatch = useAppDispatch();

   /* useEffect(() => {
        if (filterStatus == FilterStatus.IS_SUBMITTING)
            dispatch(setPriority(selectedOptions));
    }, [filterStatus])*/

    const handleChange = (newValue: any | null) => {
        const result = newValue.map((option: { value: any; }) => option.value || option)
        setSelectedOptions(result)
        // интерактивность
        dispatch(setPriority(result));
    }
    //console.log(selectedOptions);

    return (
        <Autocomplete
            multiple
            options={options_dict.keys()}
            filterSelectedOptions={true}
            getOptionLabel={(option) => options_dict.getValue(option)!}
            renderInput={(params) => <TextField {...params} label={priorityText} />}
            value={selectedOptions}
            onChange={(event: any, newValue: any | null) => handleChange(newValue)}
            renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                    <Chip {...getTagProps({ index })} label={options_dict.getValue(option)} color="primary" sx={{minWidth: "72px"}} />
                ));}}
        />
    );
};

export default Priority;