import { Button, Form } from "@openedx/paragon";
import { Col, Row } from "react-bootstrap";
import { useState } from "react";

const weekDays = [
  { label: "Monday", value: 0 },
  { label: "Tuesday", value: 1 },
  { label: "Wednesday", value: 2 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 4 },
  { label: "Saturday", value: 5 },
  { label: "Sunday", value: 6 },
];

const generateTimes = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    ["00", "30"].forEach((m) => {
      times.push(`${String(h).padStart(2, "0")}:${m}`);
    });
  }
  return times;
};

const TIME_OPTIONS = generateTimes();

export default function CreateAppointmentForm({
  selectedSlot,
  mode,
  onCancel,
  onSubmit,
  onDelete,
  listMentors,
  isSuperUser,
}) {
  const { slotInfo } = selectedSlot;

  const [weekly, setWeekly] = useState(
    weekDays.map((day) => ({
      ...day,
      enabled: false,
      ranges: [{ start: "", end: "" }],
    })),
  );

  const updateRange = (dayIndex, rangeIndex, field, value) => {
    const copy = [...weekly];
    copy[dayIndex].ranges[rangeIndex][field] = value;

    // Reset end if it is now before start
    if (field === "start" && copy[dayIndex].ranges[rangeIndex].end <= value) {
      copy[dayIndex].ranges[rangeIndex].end = "";
    }

    setWeekly(copy);
  };

  const addRange = (dayIndex) => {
    const copy = [...weekly];
    copy[dayIndex].ranges.push({ start: "", end: "" });
    setWeekly(copy);
  };

  const deleteRange = (dayIndex, rangeIndex) => {
    const copy = [...weekly];
    copy[dayIndex].ranges.splice(rangeIndex, 1);
    if (copy[dayIndex].ranges.length === 0) {
      copy[dayIndex].ranges.push({ start: "", end: "" });
    }
    setWeekly(copy);
  };

  // Prevent overlapping start times
  const getAvailableStartTimes = (dayIndex, rangeIndex) => {
    const existingRanges = weekly[dayIndex].ranges
      .filter((_, i) => i !== rangeIndex)
      .map((r) => [r.start, r.end])
      .filter(([s, e]) => s && e);

    return TIME_OPTIONS.filter(
      (time) => !existingRanges.some(([s, e]) => time >= s && time < e),
    );
  };

  // Prevent overlapping end times
  const getAvailableEndTimes = (dayIndex, rangeIndex, start) => {
    if (!start) return TIME_OPTIONS;

    const existingRanges = weekly[dayIndex].ranges
      .filter((_, i) => i !== rangeIndex)
      .map((r) => [r.start, r.end])
      .filter(([s, e]) => s && e);

    return TIME_OPTIONS.filter(
      (time) =>
        time > start && !existingRanges.some(([s, e]) => time > s && time <= e),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      weekly_availability: weekly
        .filter((d) => d.enabled)
        .map((d) => ({
          day: d.value,
          ranges: d.ranges.filter((r) => r.start && r.end),
        })),
      meeting_length: 60,
      action: slotInfo ? "update" : "create",
      id: slotInfo?.id,
    };
    if (mode === "staff" && isSuperUser) {
      payload.user = e.target.mentor.value;
    }
    onSubmit(payload);
  };

  return (
    <Form onSubmit={handleSubmit} style={{ padding: "10px", maxWidth: "100%" }}>
      {mode === "staff" && isSuperUser && (
        <Form.Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Control
              as="select"
              floatingLabel="Mentor"
              name="mentor"
              required
              defaultValue={slotInfo?.user || ""}
            >
              {listMentors?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.username}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
      )}

      <h5 className="mb-2">Weekly Availability</h5>

      {/* Scrollable content */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 6,
          padding: "10px",
          maxHeight: "400px",
          overflowY: "auto",
          backgroundColor: "#fff",
        }}
      >
        {weekly.map((day, dayIndex) => (
          <div key={day.value} style={{ marginBottom: "12px" }}>
            <Form.Check
              type="checkbox"
              label={day.label}
              checked={day.enabled}
              onChange={(e) => {
                const copy = [...weekly];
                copy[dayIndex].enabled = e.target.checked;
                setWeekly(copy);
              }}
            />

            {day.ranges.map((r, rangeIndex) => (
              <Row key={rangeIndex} className="align-items-center mb-2">
                <Col xs={5}>
                  <Form.Control
                    as="select"
                    disabled={!day.enabled}
                    value={r.start}
                    onChange={(e) =>
                      updateRange(dayIndex, rangeIndex, "start", e.target.value)
                    }
                  >
                    <option value="">Start</option>
                    {getAvailableStartTimes(dayIndex, rangeIndex).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Form.Control>
                </Col>

                <Col xs={5}>
                  <Form.Control
                    as="select"
                    disabled={!day.enabled || !r.start}
                    value={r.end}
                    onChange={(e) =>
                      updateRange(dayIndex, rangeIndex, "end", e.target.value)
                    }
                  >
                    <option value="">End</option>
                    {getAvailableEndTimes(dayIndex, rangeIndex, r.start).map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ),
                    )}
                  </Form.Control>
                </Col>

                <Col xs={2}>
                  {day.ranges.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteRange(dayIndex, rangeIndex)}
                    >
                      ×
                    </Button>
                  )}
                </Col>
              </Row>
            ))}

            {day.enabled && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => addRange(dayIndex)}
              >
                + Add time
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Footer buttons outside scroll */}
      <div
        style={{
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "#fff",
        }}
      >
        <Button
          variant="tertiary"
          onClick={onCancel}
          style={{ marginRight: "8px" }}
        >
          Cancel
        </Button>
        {slotInfo && (
          <Button
            variant="danger"
            onClick={onDelete}
            style={{ marginRight: "8px" }}
          >
            Delete
          </Button>
        )}
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}
