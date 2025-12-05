import {fetchMentorListApi, fetchMyRolesApi} from "./api";
import {setMyRolesInfo, setMentorList} from "./slice";

export function fetchMyRoles(courseId) {
    return async function (dispatch) {
        fetchMyRolesApi(courseId).then(({data}) => {
            dispatch(setMyRolesInfo(data));
        });
    }
}

export function fetchMentorList(courseId) {
    return async function (dispatch) {
        fetchMentorListApi(courseId).then(({data}) => {
            dispatch(setMentorList(data));
        });
    }
}
