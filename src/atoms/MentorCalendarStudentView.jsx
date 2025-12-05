import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import './mentor-calendar.scss'
import {fetchAvailableBooking} from "../pages/book-appointment/data/thunk";
import {connect} from "react-redux";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {formatDate} from "../common/helper";

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar);

const MentorCalendarStudentView = (props) => {
    // actions
    const {
        fetchAvailableBooking,
        onSelectEvent
    } = props;
    // state
    const {
        availableBookings, shouldReloadAppointments
    } = props;
    const startOfWeek = formatDate(moment().startOf("week"))
    const endOfWeek = formatDate(moment().endOf("week"))
    const [state, setState] = useState({startOfWeek, endOfWeek, view: "week"});

    const {courseId: courseIdFromUrl} = useParams();

    useEffect(() => {

        fetchAvailableBooking(undefined, courseIdFromUrl, state.startOfWeek, state.endOfWeek);
    }, [state, shouldReloadAppointments]);

    const eventPropGetter = (event, start, end, isSelected) => {
        const backgroundColor = event.color;
        const style = {
            backgroundColor,
            borderRadius: '5px',
            padding: '5px',
            opacity: event.disabled ? 0.5 : 1,
            color: 'black',
            display: 'block',
        };
        return {
            style
        }
    }
    return (
        <div className="mentor-calendar-placeholder">
            <Calendar
                defaultView="week"
                localizer={localizer}
                events={availableBookings.map(event => ({
                    ...event,
                    start: moment(event.start_time).toDate(),
                    end: moment(event.end_time).toDate(),
                }))}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventPropGetter}
                onView={(view) => {
                    setState({
                        ...state, view, startOfWeek: formatDate(moment(state.endOfWeek).startOf(view)),
                        endOfWeek: formatDate(moment(state.endOfWeek).endOf(view))
                    })
                }}
                onNavigate={(date, view) => {
                    setState({
                        view,
                        startOfWeek: formatDate(moment(date).startOf(view)),
                        endOfWeek: formatDate(moment(date).endOf(view))
                    })
                }}
            />
        </div>
    )
}

function mapToProps(state) {
    return {
        availableBookings: state.bookAppointmentReducer.availableBookings
    }
}

export default connect(mapToProps, {
    fetchAvailableBooking
})(MentorCalendarStudentView);
