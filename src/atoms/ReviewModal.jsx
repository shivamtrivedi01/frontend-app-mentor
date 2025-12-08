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
  const {
    reviewModalState,
    openReviewModal,
    submitReview,
    slotInfo,
    courseId,
  } = props;

  const { authenticatedUser } = useContext(AppContext);

  const close = () => {
    openReviewModal(false);
  };

  const onSubmit = (reviewData) => {
    const payload = {
      ...reviewData,
      event_id: slotInfo?.id,
      course_id: courseId,
      user: authenticatedUser?.userId,
    };

    submitReview(payload)
      .then(() => close())
      .catch((err) => console.log(err));
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
  };
};

export default connect(mapStateToProps, {
  openReviewModal,
  submitReview,
})(ReviewModal);
