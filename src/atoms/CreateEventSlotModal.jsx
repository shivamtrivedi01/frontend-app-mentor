import {StandardModal} from "@openedx/paragon";
import {connect} from "react-redux";
import {
    createEvent,
    deleteAppointmentSlot,
    openCreateEventModal,
    updateAppointmentSlot
} from "../pages/mentor-schedule/data/thunks";
import CreateAppointmentForm from "./CreateAppointmentForm";
import {AppContext} from "@edx/frontend-platform/react";
import {useContext} from "react";

const CreateEventSlotModal = (props) => {
    const {
        courseId,
        createEvent,
        createEventModalState,
        mode,
        openCreateEventModal,
        deleteAppointmentSlot,
        updateAppointmentSlot,
        title,
        listMentors,
        isSuperUser,
        viewState,
    } = props;

    const {authenticatedUser} = useContext(AppContext);

    const close = () => {
        openCreateEventModal(false)
    }

    const onSubmit = (slot) => {
        switch (slot.action) {
            case "update": {
                updateAppointmentSlot({...slot, id: createEventModalState.slotInfo.id}, viewState).then(() => {
                    close();
                })
                break;
            }
            case "create": {
                if (!slot.user)
                    slot.user = authenticatedUser.userId;
                slot.course_id = courseId;
                createEvent(slot, viewState).then(() => {
                    close();
                }).catch((error) => {
                    console.log(error)
                })
                break
            }
        }
    }
    const onDelete = () => {
        deleteAppointmentSlot(createEventModalState.slotInfo.id).then(() => {
            close();
        })
    }

    return (<StandardModal
        title={title}
        isOpen={createEventModalState.open}
        onClose={close}
    >
        <CreateAppointmentForm
            selectedSlot={createEventModalState}
            mode={mode}
            listMentors={listMentors}
            courseId={courseId}
            onCancel={close}
            onSubmit={onSubmit}
            onDelete={onDelete}
            isSuperUser={isSuperUser}
        />
    </StandardModal>)
}

const mapStateToProps = (state) => {
    const {
        mentorScheduleReducer
    } = state;
    return {
        events: mentorScheduleReducer.events, createEventModalState: mentorScheduleReducer.createEventModalState,
    };
};

export default connect(mapStateToProps, {
    openCreateEventModal,
    createEvent,
    deleteAppointmentSlot,
    updateAppointmentSlot,
})(CreateEventSlotModal);
