import {UserPersonalInfoModel} from "../types/UserModels";

export const range = [0, 1, 2, 3, 4];

export const userpersonalinfo_number_set: UserPersonalInfoModel[] = range.map((i) => {
    return (
        {
            id: i.toString(),
            nickname: i.toString(),
            avatar: i.toString(),
            age: i.toString(),
            gender: "M",
            telegram: i.toString()
        });
});