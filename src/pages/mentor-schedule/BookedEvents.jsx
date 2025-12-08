import { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { fetchBookedEvents, openReviewModal } from "./data/thunks";
import { AppContext } from "@edx/frontend-platform/react";
import ReviewModal from "../../atoms/ReviewModal";
import "./BookedEvents.scss"; // import the CSS

const BookedEvents = ({ bookedEvents, fetchBookedEvents, openReviewModal }) => {
  const { authenticatedUser } = useContext(AppContext);
  const [filter, setFilter] = useState("all"); // "all", "pending", "given"
  const [dateFilter, setDateFilter] = useState("all"); // "all", "upcoming", "past"

  useEffect(() => {
    if (authenticatedUser) {
      fetchBookedEvents(authenticatedUser.userId);
    }
  }, [authenticatedUser]);

  const handleUpdateClick = (event) => {
    openReviewModal(true, event);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const now = new Date();

  const filteredEvents = bookedEvents
    .filter((event) => {
      if (filter === "pending")
        return !event.is_passed && !event.review_description;
      if (filter === "given")
        return event.is_passed || !!event.review_description;
      return true;
    })
    .filter((event) => {
      const eventDate = new Date(event.start_time);
      if (dateFilter === "upcoming") return eventDate > now;
      if (dateFilter === "past") return eventDate < now;
      return true;
    });

  return (
    <div className="booked-events">
      <h3>Booked Events</h3>

      {/* Review Filter */}
      <div className="filter-group">
        <strong>Review Filter:</strong>
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`filter-button ${filter === "given" ? "active" : ""}`}
          onClick={() => setFilter("given")}
        >
          Given
        </button>
      </div>

      {/* Date Filter */}
      <div className="filter-group">
        <strong>Date Filter:</strong>
        <button
          className={`filter-button ${dateFilter === "all" ? "active" : ""}`}
          onClick={() => setDateFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${dateFilter === "upcoming" ? "active" : ""}`}
          onClick={() => setDateFilter("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`filter-button ${dateFilter === "past" ? "active" : ""}`}
          onClick={() => setDateFilter("past")}
        >
          Past
        </button>
      </div>

      <table className="booked-events-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Course ID</th>
            <th>Start</th>
            <th>End</th>
            <th>Guests</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => {
            const isPending = !event.is_passed && !event.review_description;
            return (
              <tr key={event.id} className={isPending ? "pending-review" : ""}>
                <td>{event.event_name}</td>
                <td>{event.course_id}</td>
                <td>{formatDate(event.start_time)}</td>
                <td>{formatDate(event.end_time)}</td>
                <td>{event.event_guests?.map((g) => g.username).join(", ")}</td>
                <td>
                  {isPending ? (
                    <button
                      className="update-button"
                      onClick={() => handleUpdateClick(event)}
                    >
                      Update
                    </button>
                  ) : (
                    <span>✅</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ReviewModal />
    </div>
  );
};

const mapStateToProps = (state) => ({
  bookedEvents: state.mentorScheduleReducer.bookedEvents,
});

export default connect(mapStateToProps, { fetchBookedEvents, openReviewModal })(
  BookedEvents,
);
