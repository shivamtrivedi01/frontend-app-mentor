import {bookMentoringSlotApi, fetchAvailableBookingApi} from "./api";
import {setCurrentSelectedBooking, setStudentBookings} from "./slice";

export function fetchAvailableBooking(userId, courseId, start, end) {
    return async (dispatch) => {
        fetchAvailableBookingApi(userId, courseId, start, end).then(({data}) => {
            dispatch(setStudentBookings(data));
        })
    };
}

export function storeCurrentSelectedBooking(booking) {
    return async (dispatch) => {
        dispatch(setCurrentSelectedBooking(booking));
    };
}
