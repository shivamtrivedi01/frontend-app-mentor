import { StandardModal } from "@openedx/paragon";
import { connect } from "react-redux";
import { useContext } from "react";
import { AppContext } from "@edx/frontend-platform/react";

import {
  openReviewModal,
  submitReview,
} from "../pages/mentor-schedule/data/thunks";

import ReviewForm from "./ReviewForm";

const ReviewModal = (props) => {
  const { reviewModalState, openReviewModal, submitReview, slotInfo } = props;

  const { authenticatedUser } = useContext(AppContext);

  const close = () => {
    openReviewModal(false);
  };

  const onSubmit = (formData) => {
    const payload = {
      ...formData,

      // provided by context
      event_id: slotInfo?.id,
    };

    submitReview(payload)
      .then(() => close())
      .catch((err) => console.error(err));
  };

  return (
    <StandardModal
      title="Review Session"
      isOpen={reviewModalState.open}
      onClose={close}
    >
      <ReviewForm slotInfo={slotInfo} onCancel={close} onSubmit={onSubmit} />
    </StandardModal>
  );
};

const mapStateToProps = (state) => {
  const { mentorScheduleReducer } = state;
  return {
    reviewModalState: mentorScheduleReducer.reviewModalState,
    slotInfo: mentorScheduleReducer.reviewModalState.slotInfo,
    courseId: mentorScheduleReducer.courseId,
  };
};

export default connect(mapStateToProps, {
  openReviewModal,
  submitReview,
})(ReviewModal);
