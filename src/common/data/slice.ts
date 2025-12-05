import {createSlice} from "@reduxjs/toolkit";
import {MentorUser, MyRolesInfo} from "../../types/common";

interface StateType {
    myRolesInfo: MyRolesInfo;
    mentorList: MentorUser[];
}

const slice = createSlice({
    name: 'myRolesInfo',
    initialState: {
        myRolesInfo: {} as MyRolesInfo,
        mentorList: [] as MentorUser[]
    } as StateType,
    reducers: {
        setMyRolesInfo(state, action) {
            return {
                ...state,
                myRolesInfo: {...action.payload},
            };
        },
        setMentorList(state, action) {
            return {
                ...state,
                mentorList: action.payload,
            };
        }
    },
});

export const {
    setMyRolesInfo,
    setMentorList,
} = slice.actions;

export const {reducer} = slice;
