import {createSlice} from "@reduxjs/toolkit";
import moment from 'moment';
import {generateColor} from "../../../common/helper";

const slice = createSlice({
    name: 'mentor-schedule', initialState: {
        courseId: null,
        events: [],
        loading: false,
        error: null,
        createEventModalState: {open: false, slotInfo: {start: null, end: null, slotInfo: null, meeting_length: null}},
        slots: [],
        userColor: {},
    },
    reducers: {
        updateEvent: (state, {payload}) => {
            const index = state.slots.findIndex(event => event.id === payload.slot.id);
            if (index !== -1) {
                const slot = payload.slot;
                state.userColor[`color-${slot.user}`] = state.userColor[`color-${slot.user}`] || generateColor();
                slot.color = state.userColor[`color-${slot.user}`];
                state.slots[index] = slot;
            }
        },
        openCreateEventModal: (state, {payload}) => {
            state.createEventModalState = {
                open: !!payload.open,
                start: payload.start,
                end: payload.end,
                slotInfo: payload.slotInfo,
            };
        },
        setAppointmentSlots: (state, {payload}) => {
            const {results} = payload;
            const userColor = {
                ...(results.reduce((acc, booking) => {
                    const color = state.userColor[`color-${booking.user}`] || generateColor();
                    return {...acc, [`color-${booking.user}`]: color}
                },state.userColor))
            }

            state.slots = results.map(event => ({...event, color: userColor[`color-${event.user}`]}))
            state.userColor = userColor;
        },
        addSlot: (state, {payload}) => {
            const {slot} = payload;
            state.userColor[`color-${slot.user}`] = state.userColor[`color-${slot.user}`] || generateColor();
            slot.color = state.userColor[`color-${slot.user}`];
            state.slots.push(slot);
        },
        removeAppointmentSlot: (state, {payload}) => {
            const id = payload;
            state.slots = state.slots.filter(slot => slot.id !== id);
        },
    }
});
export const {
    updateEvent,
    openCreateEventModal,
    setAppointmentSlots,
    addSlot,
    removeAppointmentSlot
} = slice.actions
export const {
    reducer,
} = slice;
