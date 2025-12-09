import { useState, useEffect } from "react";
import "./ReviewForm.scss";

const ReviewForm = ({ slotInfo, onCancel, onSubmit }) => {
  const [result, setResult] = useState("passed"); // passed | failed
  const [failureReason, setFailureReason] = useState("absent"); // absent | other
  const [description, setDescription] = useState(""); // only when failureReason = other

  useEffect(() => {
    if (!slotInfo) return;

    // Initialize from backend fields if available
    setResult(slotInfo.result || "passed");
    setFailureReason(slotInfo.failure_reason || "absent");
    setDescription(slotInfo.description || "");
  }, [slotInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      result,
      failure_reason: result === "failed" ? failureReason : null,
      description:
        result === "failed" && failureReason === "other" ? description : null,
    };

    onSubmit(payload);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
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
