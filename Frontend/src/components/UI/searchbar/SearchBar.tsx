import React, {FC} from 'react';
import {Card, CardContent, FormControl, IconButton, Input, InputAdornment, InputLabel, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {Categories} from "../../../types/Categories";

interface SearchBarProps {
    countFound: number
    isFriends: boolean
    category?: Categories
}

const SearchBar: FC<SearchBarProps> = ({countFound, category, isFriends}) => {

    const countFoundText = "Найдено: " + countFound.toString();
    const notFoundText = "Не найдено совпадений по запросу.";
    const searchNameText = "Искать в названии ...";

    // управляет списком. самое важное: как именно!
    const handleClickSearch = () => {

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