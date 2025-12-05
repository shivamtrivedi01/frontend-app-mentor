import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import './mentor-calendar.scss'
import {connect} from "react-redux";
import {openCreateEventModal, updateAppointmentSlot} from "../pages/mentor-schedule/data/thunks";

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar);


const MentorCalendar = ({
                            slots,
                            updateEvent,
                            openCreateEventModal,
                            createEventModalState,
                            onView,
                            onNavigate,
                            viewState
                        }) => {
    const onEventDrop = (data) => {
        const {start, end, event} = data;
        updateEvent({...event, start_time: moment(start).format(), end_time: moment(end).format()}, viewState);
    };
    const onEventResize = (data) => {
        const {start, end, event} = data;

        updateEvent({...event, start_time: moment(start).format(), end_time: moment(end).format()}, viewState);
    };

    const onSlotSelect = (slotInfo) => {
        switch (slotInfo.action) {
            default: {
                // when event will be click or doubleclick
                const start = moment(slotInfo.start).valueOf();
                const end = moment(slotInfo.slots[slotInfo.slots.length - 1]).valueOf();
                openCreateEventModal(!createEventModalState.open, start, end);
                break;
            }
        }
    }

    const onSelectEvent = (slotInfo) => {
        const start = moment(slotInfo.start_time).valueOf();
        const end = moment(slotInfo.end_time).valueOf();
        openCreateEventModal(!createEventModalState.open, start, end, slotInfo);
    }

    const eventPropGetter = (event, start, end, isSelected) => {
        const backgroundColor = event.color;
        const style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'black',
            display: 'block',
        };
        return {
            style
        }
    }


    return (
        <div className="mentor-calendar-placeholder">
            <DnDCalendar
                defaultView="week"
                localizer={localizer}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                events={slots.map((event) => {
                    const events = event.events;
                    return events.map(e => ({...e, color: event.color}))
                }).flat().map(event => ({
                    ...event,
                    start: moment(event.start_time).toDate(),
                    end: moment(event.end_time).toDate(),
                }))}
                resizable
                onSelectSlot={onSlotSelect}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventPropGetter}
                selectable
                onView={onView}
                onNavigate={onNavigate}
            />
        </div>
    );
}

const mapStateToProps = (state) => {
    const {
        mentorScheduleReducer
    } = state;
    return {
        events: mentorScheduleReducer.events,
        slots: mentorScheduleReducer.slots,
        createEventModalState: mentorScheduleReducer.createEventModalState,
    };
};

export default connect(mapStateToProps, {
    updateEvent: updateAppointmentSlot,
    openCreateEventModal
})(MentorCalendar);
