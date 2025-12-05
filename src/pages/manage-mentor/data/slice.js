import {createSlice} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'mentor-management',
    initialState: {
        courseId: null,
        loading: false,
        error: null,
        nonSupervisorMentor: [],
    },
    reducers: {
        setCourseId: (state, {payload}) => {
            state.courseId = payload;
        },
        setLoading: (state, {payload}) => {
            state.loading = payload;
        },
        setError: (state, {payload}) => {
            state.error = payload;
        },
        setNonSuperUsers: (state, {payload}) => {
            state.nonSupervisorMentor = payload;
        }
    }
})

export const {
    setCourseId,
    setLoading,
    setError,
    setNonSuperUsers
} = slice.actions
export const {
    reducer,
} = slice;
