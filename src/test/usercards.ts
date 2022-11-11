import {UserCardInfo} from "../types/UserCardInfo";
import {range, userpersonalinfo_number_set} from "./userpersonalinfo";
import {number_sets_1, number_sets_2, number_sets_3} from "./categories";

export const usercard_number_set: UserCardInfo[] = range.map((i) => {
    return (new UserCardInfo(userpersonalinfo_number_set[i], {
        book: number_sets_3[i],
        film: number_sets_1[i],
        music: number_sets_2[i],
        game: number_sets_3[i]
    }));
});