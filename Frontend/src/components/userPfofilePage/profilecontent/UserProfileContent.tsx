import React from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent, Divider,
    FormControlLabel, Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {EditPersonalInfoRequest, userdataAPI} from "../../../services/userdataService";
import {LoginRequest} from "../../../services/loginService";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/reducers/authSlice';

const UserProfileContent = () => {

    const userId = useAppSelector(state => state.authReducer.userId);

    const {data: userInfo, isLoading} = userdataAPI.useFetchUserPersonalInfoByIdQuery({userId: userId!});

    const textNick = "Имя";
    const textAge = "Возвраст";
    const textGender = "Пол";
    const textTelegram = "Telegram";
    const textSaveButton = "Сохранить данные";
    const textDeleteAccountButton = "Удалить аккаунт";

    const textGenderRadio: string[] = ["Женщина", "Мужчина", "Они"];

    const fieldSize = "350px"

    const [deleteAccount] = userdataAPI.useDeleteUserAccountMutation();
    const [editPersonalInfo] = userdataAPI.useEditUserPersonalInfoByIdMutation();

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get("password");
        const editRequest: EditPersonalInfoRequest = {
            age:  data.get("age")!.toString(),
            gender:  data.get("gender")!.toString(),
            id: userId!,
            telegram:  data.get("telegram")!.toString(),
            nickname: data.get("nickname")!.toString()
        }
        //console.log(editRequest);

        editPersonalInfo(editRequest);

    }

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // TODO сделать в конце самом
    const handleDeleteAccount = () => {
        // спросить, точно ли он этого хочет
        deleteAccount({userId: userId!});
        dispatch(logout());
        navigate('/');
        // переброс на главную страницу, удаление из редакса
    }

    // TODO: пол правильно выставляется дефолтный?
    return (
        <Card>
            <CardContent>
                {
                    (isLoading) ?
                        <Box> Loading... </Box>
                        :
                        <Box display="flex" flexDirection="row" justifyContent="center" marginTop={4}>
                            <Box display="flex" flexDirection="column" component="form" onSubmit={handleSave} gap={2}>
                                <Box display="flex" flexDirection="row" gap={1} alignItems="center" justifyContent="flex-end">
                                    <Typography> {textNick + ":"} </Typography>
                                    <TextField
                                        sx={{width: fieldSize}}
                                        name="nickname"
                                        required
                                        variant={"standard"}
                                        defaultValue={userInfo!.nickname}
                                    />
                                </Box>
                                <Box display="flex" flexDirection="row" gap={1} alignItems="center" justifyContent="flex-end">
                                    <Typography> {textAge + ":"} </Typography>
                                    <TextField
                                        sx={{width: fieldSize}}
                                        name="age"
                                        required
                                        variant={"standard"}
                                        defaultValue={userInfo!.age}
                                    />
                                </Box>
                                <Box display="flex" flexDirection="row" gap={6} alignItems="center" justifyContent="flex-end">
                                    <Typography> {textGender + ":"} </Typography>
                                    <RadioGroup name="gender" row defaultValue={userInfo!.gender}>
                                        <FormControlLabel value="female" control={<Radio />} label={textGenderRadio[0]} />
                                        <FormControlLabel value="male" control={<Radio />} label={textGenderRadio[1]} />
                                        <FormControlLabel value="other" control={<Radio />} label={textGenderRadio[2]} />
                                    </RadioGroup>
                                </Box>
                                <Box display="flex" flexDirection="row" gap={1} alignItems="center" justifyContent="flex-end">
                                    <Typography color={((userInfo!.telegram === null) || (userInfo!.telegram === "")) ? "red" : "inherit"}> {textTelegram + ":"} </Typography>
                                    <TextField
                                        sx={{width: fieldSize}}
                                        name="telegram"
                                        required
                                        variant={"standard"}
                                        defaultValue={userInfo!.telegram}
                                    />
                                </Box>
                                <Button sx={{marginTop: 2}} type="submit" > {textSaveButton} </Button>
                                <Divider />
                                <Button onClick={handleDeleteAccount}> {textDeleteAccountButton} </Button>
                            </Box>
                        </Box>
                }
            </CardContent>
        </Card>
    );
};

export default UserProfileContent;