import {ActionRow, Alert, AlertModal, Button, Form} from "@openedx/paragon";
import {CheckCircle} from "@openedx/paragon/icons";
import moment from "moment";
import React from "react";

const BookMentoringEvent = ({isOpen, open, close, OK, currentSelectedBooking,cancel}) => {
    let title = "Request Appointment Booking!";
    let summary = "You are about to book an appointment with a mentor. Please confirm your booking.";
    if (currentSelectedBooking?.disabled) {
        title = currentSelectedBooking.event_name || "Appointment Details!";
        summary = currentSelectedBooking.description || "You have booked an appointment with a mentor. Please confirm your booking details.";
    }
    const confirmBtnRef = React.createRef();
    return (<AlertModal
        title={title}
        isOpen={isOpen}
        onClose={close}
        variant="success"
        icon={CheckCircle}
        footerNode={(
            <ActionRow>
                <Button variant="tertiary" onClick={close}>Dismiss</Button>
                {!currentSelectedBooking?.disabled &&
                    <Button variant="success" type={'submit'} ref={confirmBtnRef}
                            form={'bookEventForm'}>Confirm</Button>}
                {currentSelectedBooking?.disabled &&
                    <Button variant="danger" onClick={() => cancel(currentSelectedBooking)}>Cancel</Button>}
            </ActionRow>
        )}
        isOverflowVisible={true}
    >
        <div>
            <Alert variant="info">
                {moment(currentSelectedBooking?.start_time).format('MMMM Do YYYY, h:mm a')} - {moment(currentSelectedBooking?.end_time).format('MMMM Do YYYY, h:mm a')}
            </Alert>
            <p>{summary}</p>
            <div>
                {currentSelectedBooking?.disabled && currentSelectedBooking?.google_calendar_json?.hangoutLink &&
                    <a href={currentSelectedBooking?.google_calendar_json?.hangoutLink} target="_blank">
                        <Button variant="success">Join Google Meet</Button>
                    </a>
                }
                {!currentSelectedBooking?.disabled && <Form id={'bookEventForm'} onSubmit={(e) => {
                    e.preventDefault();
                    confirmBtnRef.current.disabled = true;
                    confirmBtnRef.current.innerText = "Booking...";
                    const formData = new FormData(e.target);
                    const event_name = formData.get("event_name");
                    const description = formData.get("description");
                    OK({event_name, description});
                }}>
                    <Form.Row>
                        <Form.Control
                            type="text"
                            floatingLabel="Title"
                            maxLength={254}
                            name="event_name"
                            required
                        />
                        <Form.Text>
                            This is the title of your meeting.
                        </Form.Text>
                    </Form.Row>
                    <Form.Row className={"mb-3"}>
                        <Form.Control
                            type="text"
                            floatingLabel="Agenda"
                            as="textarea"
                            name="description"
                            required
                        />
                        <Form.Text>
                            Please describe the agenda of your meeting.
                        </Form.Text>
                    </Form.Row>
                </Form>}
            </div>

        </div>
    </AlertModal>);
}
export default BookMentoringEvent;
