import React, {FC, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Input, InputAdornment, IconButton
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {setFilterTitle, submitFilterStart} from "../../../store/reducers/filterPageFilterSlice";

interface SearchNameDrawerProps {
    countFound: number;
}

// TODO: Фильтр по имени применяется к уже скаченным или на сервере?
// TODO: logic of fetching and updating COUNT FOUND!
const SearchNameDrawer: FC<SearchNameDrawerProps> = ({countFound}) => {

    const countFoundText = "Soulmates: " + countFound.toString();
    const notFoundText = "No Soulmates found.";
    const searchNameText = "Введие имя для поиска ...";

    const dispatch = useAppDispatch();

    const [title, setTitle] = useState<string>("");

    const handleClickSearch = () => {
        dispatch(setFilterTitle(title));
        dispatch(submitFilterStart());
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();
        // TODO: точно работает?
        setTitle(event.target.value);
    }

    return (
        <Card
            sx={{
                minWidth: "400px",
                borderBottomLeftRadius: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0
            }}
        >
            <CardContent sx={{marginLeft: 1, marginRight: 1, marginTop: 2}}>
                <FormControl fullWidth>
                    <InputLabel> {searchNameText} </InputLabel>
                    <Input
                        value={title}
                        onChange={(event) => handleInputChange(event)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickSearch}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Typography variant="body1" color="primary" marginTop={2}> {
                    (countFound > 0) ?
                        countFoundText
                        :
                        notFoundText
                    }
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SearchNameDrawer;