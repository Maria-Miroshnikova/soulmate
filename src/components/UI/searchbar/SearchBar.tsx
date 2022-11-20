import React, {FC, useEffect, useState} from 'react';
import {Card, CardContent, FormControl, IconButton, Input, InputAdornment, InputLabel, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {Categories} from "../../../types/Categories";
import {useAppDispatch} from "../../../hooks/redux";
import {setTitleToSearch} from "../../../store/reducers/searchContentSlice";
import {useLocation} from "react-router-dom";

interface SearchBarProps {
    countFound: number
    isFriends: boolean
    category?: Categories
}

const SearchBar: FC<SearchBarProps> = ({countFound, category, isFriends}) => {

    const countFoundText = "Найдено: " + countFound.toString();
    const notFoundText = "Не найдено совпадений по запросу.";
    const searchNameText = "Искать в названии ...";

    const dispatch = useAppDispatch();
    const [title, setTitle] = useState<string>("");

    const location = useLocation();

    // обнуляем тайтл при первом заходе на страницу
    useEffect(() => {
        setTitle("");
        dispatch(setTitleToSearch(""));
    }, [location.pathname])

    const handleClickSearch = () => {
        dispatch(setTitleToSearch(title));
    }

    const handleChange = (event:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(event.target.value);
        dispatch(setTitleToSearch(event.target.value));
    }

    // TODO: это полностью SearchNameBar из Filter, только поведение немного другое
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
                        onChange={(event) => handleChange(event)}
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

export default SearchBar;