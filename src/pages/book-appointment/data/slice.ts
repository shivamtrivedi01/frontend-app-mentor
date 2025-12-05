import {createSlice} from "@reduxjs/toolkit";
import {generateColor} from "../../../common/helper";

const slice = createSlice({
    name: 'student-bookings-store',
    initialState: {
        availableBookings: [],
        userColor: {},
        currentSelectedBooking: null,
    },
    reducers: {
        setStudentBookings: (state, {payload}) => {
            const userColor = {
                ...((payload.available_slots || []).reduce((acc, booking) => {
                    const color = state.userColor[`color-${booking.user}`] || generateColor();
                    return {...acc, [`color-${booking.user}`]: color}
                }, state.userColor))
            }
            var availableBookings = payload.available_slots.map((booking) => {
                const color = userColor[`color-${booking.user}`];
                return {...booking, color}
            });
            availableBookings = availableBookings.concat(payload.booked_events.map(e => ({
                ...e,
                disabled: true,
                color: userColor[`color-${e.organizer}`]
            })));
            return {
                ...state,
                userColor: userColor,
                availableBookings: availableBookings
            }
        },
        clearStudentBookings: (state, {payload}) => {
            return {
                ...state,
                availableBookings: []
            }
        },
        setCurrentSelectedBooking: (state, {payload}) => {
            return {
                ...state,
                currentSelectedBooking: payload
            }
        },
    }
})

export const {
    setStudentBookings,
    clearStudentBookings,
    setCurrentSelectedBooking
} = slice.actions
export const {reducer} = slice;
