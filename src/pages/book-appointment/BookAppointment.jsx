import MentorCalendarStudentView from "../../atoms/MentorCalendarStudentView";
import BookMentoringEvent from "../../atoms/BookMentoringEvent";
import {useToggle} from "@openedx/paragon";
import {useParams} from "react-router";
import {useContext, useState} from "react";
import {AppContext} from "@edx/frontend-platform/react";
import {connect} from "react-redux";
import {storeCurrentSelectedBooking} from "./data/thunk";
import {bookMentoringSlotApi, cancelMentoringSlotApi} from "./data/api";
import "./student-schedule.scss";

const BookAppointment = (props) => {
    const [isOpen, open, close] = useToggle(false);
    const [shouldReloadAppointments, doReloadAppointments] = useState(false);
    const {courseId: courseIdFromUrl} = useParams();
    const {currentSelectedBooking} = props;

    const {authenticatedUser} = useContext(AppContext);

    const {
        storeCurrentSelectedBooking,
    } = props;

    const onSelectEvent = (slotInfo) => {
        if (slotInfo.disabled) {
            storeCurrentSelectedBooking(slotInfo);
        } else {
            const bookingData = {
                "event_name": "-",
                "description": "-",
                "start_time": slotInfo.start_time,
                "end_time": slotInfo.end_time,
                "organiser": slotInfo.user,
                "guests": [
                    authenticatedUser.userId
                ],
                "course_id": courseIdFromUrl
            }

            storeCurrentSelectedBooking(bookingData);
        }
        open();
    }

    return (
        <div className="student-calendar-container">
            <MentorCalendarStudentView
                shouldReloadAppointments={shouldReloadAppointments}
                onSelectEvent={onSelectEvent}
            />
            <BookMentoringEvent
                isOpen={isOpen}
                open={open}
                close={() => {
                    storeCurrentSelectedBooking(null);
                    close()
                }}
                OK={(eventInfo) => {
                    bookMentoringSlotApi({...currentSelectedBooking, ...eventInfo}).then(() => {
                        storeCurrentSelectedBooking(null);
                        close();
                    }).catch((error) => {
                        console.error(error);
                    }).finally(() => {
                        storeCurrentSelectedBooking(null);
                        close();
                        doReloadAppointments(!shouldReloadAppointments);
                    });
                }}
                cancel={(slot) => {

                    cancelMentoringSlotApi(slot.id).then(() => {
                        storeCurrentSelectedBooking(null);
                        close();
                    }).catch((error) => {
                        console.error(error);
                    }).finally(() => {
                        storeCurrentSelectedBooking(null);
                        close();
                        doReloadAppointments(!shouldReloadAppointments);
                    })
                }}
                currentSelectedBooking={currentSelectedBooking}
            />
        </div>
    )
}

function mapPropToState(state) {
    return {
        currentSelectedBooking: state.bookAppointmentReducer.currentSelectedBooking,
    }
}


export default connect(mapPropToState, {
    storeCurrentSelectedBooking,
})(BookAppointment);
