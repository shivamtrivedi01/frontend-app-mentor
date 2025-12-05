import {
    addSlot,
    updateEvent as modifyEvent,
    openCreateEventModal as shouldOpenCreateEventModal,
    setAppointmentSlots,
    removeAppointmentSlot,
} from "./slice";
import {
    createAppointmentSlot,
    deleteAppointmentSlotApi,
    fetchAppointmentSlotApi,
    updateAppointmentSlotApi
} from "./api";

export function createEvent(event, viewState) {
    return async function (dispatch, getState) {
        createAppointmentSlot(event, viewState).then(({data}) => {
            dispatch(addSlot({slot: data}));
        });
    }
}

export function updateAppointmentSlot(slot, viewState) {
    return async function (dispatch, getState) {
        updateAppointmentSlotApi({
            start_time: slot.start_time,
            end_time: slot.end_time,
            meeting_length: slot.meeting_length,
            user: slot.user,
            title: slot.title,
            slot_type: slot.slot_type,
            description: slot.description,
        }, slot.id, viewState).then(({data}) => {
            dispatch(modifyEvent({slot: data}));
        })
    }
}

export function openCreateEventModal(open, start, end, slotInfo) {
    return async function (dispatch) {
        dispatch(shouldOpenCreateEventModal({open, start, end, slotInfo}));
    }
}

export function fetchAppointmentSlots(userId, courseId, filters) {
    return async function (dispatch) {
        fetchAppointmentSlotApi(userId, courseId, filters).then(({data}) => {
            dispatch(setAppointmentSlots(data));
        });

    }
}

export function deleteAppointmentSlot(id) {
    return async function (dispatch) {
        deleteAppointmentSlotApi(id).then(() => dispatch(removeAppointmentSlot(id)));
    }
}
