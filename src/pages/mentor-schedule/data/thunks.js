import {
  addSlot,
  updateEvent as modifyEvent,
  openCreateEventModal as shouldOpenCreateEventModal,
  setAppointmentSlots,
  removeAppointmentSlot,
  setBookedEvents,
  updateBookedEvent,
  openReviewModal as openReviewModalAction,
} from "./slice";

import {
  createAppointmentSlot,
  deleteAppointmentSlotApi,
  fetchAppointmentSlotApi,
  updateAppointmentSlotApi,
  fetchBookedEventsApi,
  updateEventReviewApi,
} from "./api";

// -----------------------
// Appointment Slot Thunks
// -----------------------
export function createEvent(event, viewState) {
  return async function (dispatch) {
    const { data } = await createAppointmentSlot(event, viewState);
    dispatch(addSlot({ slot: data }));
  };
}

export function updateAppointmentSlot(slot, viewState) {
  return async function (dispatch) {
    const { data } = await updateAppointmentSlotApi(
      {
        start_time: slot.start_time,
        end_time: slot.end_time,
        meeting_length: slot.meeting_length,
        user: slot.user,
        title: slot.title,
        slot_type: slot.slot_type,
        description: slot.description,
      },
      slot.id,
      viewState,
    );
    dispatch(modifyEvent({ slot: data }));
  };
}

export function openCreateEventModal(open, start, end, slotInfo) {
  return async function (dispatch) {
    dispatch(shouldOpenCreateEventModal({ open, start, end, slotInfo }));
  };
}

export function fetchAppointmentSlots(userId, courseId, filters) {
  return async function (dispatch) {
    const { data } = await fetchAppointmentSlotApi(userId, courseId, filters);
    dispatch(setAppointmentSlots(data));
  };
}

export function deleteAppointmentSlot(id) {
  return async function (dispatch) {
    await deleteAppointmentSlotApi(id);
    dispatch(removeAppointmentSlot(id));
  };
}

// -----------------------
// Booked Events Thunks
// -----------------------
export const fetchBookedEvents = (organizerId) => async (dispatch) => {
  const { data } = await fetchBookedEventsApi(organizerId);
  dispatch(setBookedEvents(data));
};

export function updateEventReview(eventId, payload) {
  return async function (dispatch) {
    const { data } = await updateEventReviewApi(eventId, payload);
    dispatch(updateBookedEvent({ event: data }));
  };
}

// -----------------------
// Review Modal Thunks
// -----------------------
export function openReviewModal(open, slotInfo = null) {
  return async function (dispatch) {
    dispatch(openReviewModalAction({ open, slotInfo }));
  };
}

export function submitReview(payload) {
  return async function (dispatch) {
    const { event_id, ...rest } = payload;

    const { data } = await updateEventReviewApi(event_id, rest);

    dispatch(updateBookedEvent({ event: data }));
    dispatch(openReviewModalAction({ open: false }));
  };
}
