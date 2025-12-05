import {fetchNonSuperUsersApi, toggleMentorApi} from "./api";
import {setNonSuperUsers} from "./slice";

export function fetchNonSuperUsers(courseId) {
    return async function (dispatch) {
        fetchNonSuperUsersApi(courseId).then(({data}) => {
            dispatch(setNonSuperUsers(data));
        });
    }
}

export function toggleMentor(username, courseId) {
    return async function (dispatch, getState) {
        toggleMentorApi(username, courseId).then(({data}) => {
            if(data.status==="success"){
                fetchNonSuperUsersApi(courseId).then(({data}) => {
                    dispatch(setNonSuperUsers(data));
                });
            }
        });
    }
}
