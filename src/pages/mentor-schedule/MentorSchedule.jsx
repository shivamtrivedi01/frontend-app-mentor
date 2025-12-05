import MentorCalendar from "../../atoms/MentorCalendar";
import moment from 'moment'
import './mentor-schedule.scss'
import {connect} from "react-redux";
import CreateEventSlotModal from "../../atoms/CreateEventSlotModal";
import {useParams} from "react-router";
import {fetchAppointmentSlots} from "./data/thunks";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "@edx/frontend-platform/react";
import {formatDate} from "../../common/helper";

const MentorSchedule = (props) => {
    const [state, setState] = useState({
        startOfWeek: formatDate(moment().startOf("week")),
        endOfWeek: formatDate(moment().endOf("week")),
        view: "week"
    });
    const {courseId: courseIdFromUrl} = useParams();

    const {authenticatedUser} = useContext(AppContext);


    const {fetchAppointmentSlots} = props;
    const {
        mentorList,
        myRolesInfo
    } = props


    useEffect(() => {
        if (authenticatedUser) {
            fetchAppointmentSlots(myRolesInfo.is_superuser ? undefined : authenticatedUser.userId, courseIdFromUrl, state);
        }

    }, [state]);

    return (
        <div className="mentor-calendar-container">
            <MentorCalendar
                viewState={state}
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
            <CreateEventSlotModal
                title={"Create appointment slots."}
                mode="staff"
                courseId={courseIdFromUrl}
                listMentors={mentorList}
                isSuperUser={myRolesInfo.is_superuser || false}
                viewState={state}
            />
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        courseId: state.mentorScheduleReducer.courseId,
        createEventModalState: state.mentorScheduleReducer.createEventModalState,
        mentorList: state.commonReducer.mentorList,
    };
};

export default connect(mapStateToProps, {
    fetchAppointmentSlots
})(MentorSchedule);
