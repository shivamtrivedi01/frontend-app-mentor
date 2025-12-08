import { useState, useEffect } from "react";
import "./ReviewForm.scss"; // import the CSS

const ReviewForm = ({ slotInfo, onCancel, onSubmit }) => {
  const [reviewDescription, setReviewDescription] = useState("");
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    if (slotInfo) {
      setReviewDescription(slotInfo.review_description || "");
      setIsPassed(slotInfo.is_passed || false);
    }
  }, [slotInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      review_description: reviewDescription,
      is_passed: isPassed,
    });
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div>
        <label>Review Description</label>
        <textarea
          value={reviewDescription}
          onChange={(e) => setReviewDescription(e.target.value)}
        />
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          checked={isPassed}
          onChange={(e) => setIsPassed(e.target.checked)}
        />
        <label>Passed</label>
      </div>
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
