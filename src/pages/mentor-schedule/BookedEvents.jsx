import { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { fetchBookedEvents, openReviewModal } from "./data/thunks";
import { AppContext } from "@edx/frontend-platform/react";
import ReviewModal from "../../atoms/ReviewModal";
import "./BookedEvents.scss";

const BookedEvents = ({
  bookedEvents,
  fetchBookedEvents,
  openReviewModal,
  myRolesInfo,
}) => {
  const { authenticatedUser } = useContext(AppContext);

  const [filter, setFilter] = useState("all"); // "all", "pending", "given"
  const [dateFilter, setDateFilter] = useState("all"); // "all", "upcoming", "past"
  const [attendanceFilter, setAttendanceFilter] = useState("all"); // "all", "attended", "not_attended"

  const isMentor = myRolesInfo?.is_mentor;

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

  // -------------------------------
  // FILTERED EVENTS
  // -------------------------------
  const filteredEvents = bookedEvents
    // Review filter
    .filter((event) => {
      if (filter === "pending") return !event.result;
      if (filter === "given") return !!event.result;
      return true;
    })
    // Date filter
    .filter((event) => {
      const eventDate = new Date(event.start_time);
      if (dateFilter === "upcoming") return eventDate > now;
      if (dateFilter === "past") return eventDate < now;
      return true;
    })
    // Attendance filter
    .filter((event) => {
      if (attendanceFilter === "attended") {
        return isMentor
          ? event.mentor_attendance === true
          : event.failure_reason !== "absent";
      }
      if (attendanceFilter === "not_attended") {
        return isMentor
          ? event.mentor_attendance === false
          : event.failure_reason === "absent";
      }
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

      {/* Attendance Filter */}
      <div className="filter-group">
        <strong>Attendance Filter:</strong>
        <button
          className={`filter-button ${attendanceFilter === "all" ? "active" : ""}`}
          onClick={() => setAttendanceFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${attendanceFilter === "attended" ? "active" : ""}`}
          onClick={() => setAttendanceFilter("attended")}
        >
          Attended
        </button>
        <button
          className={`filter-button ${attendanceFilter === "not_attended" ? "active" : ""}`}
          onClick={() => setAttendanceFilter("not_attended")}
        >
          Not Attended
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
            <th>Attendance</th>
            {isMentor && <th>Review</th>}
          </tr>
        </thead>

        <tbody>
          {filteredEvents.map((event) => (
            <tr key={event.id}>
              <td>{event.event_name}</td>
              <td>{event.course_id}</td>
              <td>{formatDate(event.start_time)}</td>
              <td>{formatDate(event.end_time)}</td>
              <td>{event.event_guests?.map((g) => g.username).join(", ")}</td>
              <td>
                {isMentor
                  ? event.mentor_attendance === true
                    ? "Yes"
                    : event.mentor_attendance === false
                      ? "No"
                      : "—"
                  : event.failure_reason === "absent"
                    ? "No"
                    : "Yes"}
              </td>
              {isMentor && (
                <td>
                  <button
                    className={`update-button ${event.result ? "review-given" : ""}`}
                    onClick={() => handleUpdateClick(event)}
                  >
                    {event.result ? "View/Edit Review" : "Add Review"}
                  </button>

                  {event.result && <span className="review-check"> ✅</span>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isMentor && <ReviewModal />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  bookedEvents: state.mentorScheduleReducer.bookedEvents,
  myRolesInfo: state.commonReducer.myRolesInfo,
});

export default connect(mapStateToProps, { fetchBookedEvents, openReviewModal })(
  BookedEvents,
);
