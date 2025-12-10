import { useState, useEffect } from "react";
import "./ReviewForm.scss";

const ReviewForm = ({ slotInfo, onCancel, onSubmit }) => {
  const [mentorAttendance, setMentorAttendance] = useState("yes"); // yes | no

  const [result, setResult] = useState("passed");
  const [failureReason, setFailureReason] = useState("absent");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!slotInfo) return;

    setMentorAttendance(slotInfo.mentor_attendance ? "yes" : "no");
    setResult(slotInfo.result || "passed");
    setFailureReason(slotInfo.failure_reason || "absent");
    setDescription(slotInfo.description || "");
  }, [slotInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const mentor_attendance_bool = mentorAttendance === "yes";

    const payload = {
      mentor_attendance: mentor_attendance_bool, // true/false sent to backend
      result: mentor_attendance_bool ? result : null,
      failure_reason:
        mentor_attendance_bool && result === "failed" ? failureReason : null,
      description:
        mentor_attendance_bool &&
        result === "failed" &&
        failureReason === "other"
          ? description
          : null,
    };

    onSubmit(payload);
  };

  const attended = mentorAttendance === "yes";

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {/* Mentor Attendance Dropdown */}
      <div className="form-group">
        <label>Mentor Attendance</label>
        <select
          value={mentorAttendance}
          onChange={(e) => setMentorAttendance(e.target.value)}
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {/* Show fields only when mentor attended */}
      {attended && (
        <>
          {/* Result Dropdown */}
          <div className="form-group">
            <label>Result</label>
            <select value={result} onChange={(e) => setResult(e.target.value)}>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Failure Reason - Only When Failed */}
          {result === "failed" && (
            <div className="form-group">
              <label>Reason for Failure</label>
              <select
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
              >
                <option value="absent">Absent</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Description Field - Only When Failed + Other */}
          {result === "failed" && failureReason === "other" && (
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter details"
              />
            </div>
          )}
        </>
      )}

      <div className="buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
