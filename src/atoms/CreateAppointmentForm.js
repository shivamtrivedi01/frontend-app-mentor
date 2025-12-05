import {ActionRow, Button, Form} from "@openedx/paragon";
import {Col} from "react-bootstrap";
import moment from "moment";

const CreateAppointmentForm = (props) => {
    const {
        selectedSlot,
        mode,
        onCancel,
        onSubmit,
        onDelete,
        listMentors,
        isSuperUser,
    } = props;
    const {slotInfo} = selectedSlot;
    return (
        <Form onSubmit={function (e) {
            e.preventDefault();

            const formData = new FormData(e.target)
            const mentor = formData.get("mentor")

            if (onSubmit) {
                const payload = {
                    start_time: moment(formData.get("start_time")).format(),
                    end_time: moment(formData.get("end_time")).format(),
                    meeting_length: formData.get("meeting_length"),
                    title: formData.get("title"),
                    slot_type: formData.get("eventType"),
                    description: formData.get("agenda"),
                    action: slotInfo ? "update" : "create",
                    id: slotInfo?.id || null
                }
                if (mentor)
                    payload.user = mentor
                onSubmit(payload);
            }
            return false;
        }}
        >
            <Form.Row>
                <Form.Control
                    type="text"
                    floatingLabel="Title"
                    maxLength={254}
                    name="title"
                    defaultValue={slotInfo?.title || ""}
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
                    name="agenda"
                    defaultValue={slotInfo?.description || ""}
                />
                <Form.Text>
                    Please describe the agenda of your meeting.
                </Form.Text>
            </Form.Row>
            <Form.Row className={"mb-3"}>
                <Form.Group as={Col} controlId="formEventType">
                    <Form.Control
                        as="select"
                        name="eventType"
                        floatingLabel="Event Type"
                        defaultValue={slotInfo?.slot_type || ""}
                        required={isSuperUser}
                    >
                        <option key="one-time" value="one-time">One Time</option>
                        <option key="recurring" value="recurring">Recurring</option>
                        <option key="all-days" value="all-days">All Days</option>
                        <option key="week-days" value="week-days">Week Days</option>
                    </Form.Control>
                    <Form.Text>
                        Please select the type for this appointment.
                    </Form.Text>
                </Form.Group>
            </Form.Row>

            {mode === "staff" && isSuperUser && <Form.Row className={"mb-3"}>
                <Form.Group as={Col} controlId="formMentorSelect">
                    <Form.Control
                        as="select"
                        name="mentor"
                        floatingLabel="Mentor"
                        defaultValue={slotInfo?.user || ""}
                        required={isSuperUser}
                    >
                        {listMentors?.map((mentor) => (
                            <option key={mentor.id} value={mentor.id}>{mentor.username}</option>
                        ))}
                    </Form.Control>
                    <Form.Text>
                        Please select the mentor for this appointment.
                    </Form.Text>
                </Form.Group>
            </Form.Row>}
            <Form.Row className={"mb-1"}>
                <Form.Group as={Col} controlId="formEventStart">
                    <Form.Control
                        floatingLabel="Start"
                        type="datetime-local"
                        name="start_time"
                        defaultValue={moment(selectedSlot?.start).format("YYYY-MM-DDTHH:mm")}
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="formEventEnd">
                    <Form.Control
                        floatingLabel="End"
                        type="datetime-local"
                        name="end_time"
                        defaultValue={moment(selectedSlot?.end).format("YYYY-MM-DDTHH:mm")}
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="formEventEnd">
                    <Form.Control
                        floatingLabel="Meeting Length (Minutes)"
                        type="integer"
                        name="meeting_length"
                        defaultValue={slotInfo?.meeting_length || 60}
                    />
                </Form.Group>
            </Form.Row>
            <ActionRow>
                <ActionRow.Spacer/>
                <Button variant="tertiary" onClick={onCancel}>Cancel</Button>
                {slotInfo && <Button variant="danger" onClick={onDelete}>Delete</Button>}
                <Button type={"submit"} disabled={isSuperUser && !listMentors.length}>{slotInfo ? "Update" : "Create"}</Button>
            </ActionRow>
        </Form>
    )
}

export default CreateAppointmentForm;
