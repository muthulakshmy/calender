
import { timeSlots } from "../../utils/TimeSlots";
import PropTypes from "prop-types";

export const WeekView = ({ daysOfWeek, groupedEvents, handleDateClick }) => {
  const hourSlotHeight = 70;
  const minEventCardContentHeight = 50;
  const timeLabelWidth = 70;
  const eventCardRightMargin = 5;
  const eventCardPadding = "1px 4px";
  const eventCardWidthPercentage = 95;
  const pixelsPerMinute = hourSlotHeight / 60;

  const getTimeInMinutesFromMidnight = (timeStr) => {
    if (!timeStr) {
      console.warn(
        "getTimeInMinutesFromMidnight received undefined/null timeStr"
      );
      return 0;
    }
    const [time, period] = timeStr.split(" ");
    let [hour, minute] = time.split(":").map(Number);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    }
    if (period === "AM" && hour === 12) {
      hour = 0;
    }
    return hour * 60 + minute;
  };

  const firstSlotMinutesFromMidnight = getTimeInMinutesFromMidnight(
    timeSlots[0]
  );
  const totalGridContentHeight = timeSlots.length * hourSlotHeight;

  const getAllEventsForDate = (dateStr) => {
    const eventsForThisDay = [];
    // Iterate through groupedEvents to find all events for the given date (regardless of time)
    for (const key in groupedEvents) {
      if (groupedEvents.hasOwnProperty(key) && key.startsWith(dateStr)) {
        eventsForThisDay.push(...groupedEvents[key]);
      }
    }
    return eventsForThisDay;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${timeLabelWidth}px repeat(${daysOfWeek.length}, 1fr)`,
          border: "1px solid #ddd",
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <div
          className="col-span-1 border-b border-r bg-gray-50 text-center font-medium"
          style={{ padding: "0.5rem 0" }}
        >
          Time
        </div>
        {daysOfWeek.map((d) => (
          <div
            key={d.toISOString()}
            className="border-b border-r bg-gray-50 text-center font-medium"
            style={{ padding: "0.5rem 0" }}
          >
            <div>
              {d.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </div>
            <div>{d.toLocaleDateString("en-GB", { weekday: "long" })}</div>
          </div>
        ))}

        <div
          style={{
            gridColumn: "1",
            gridRow: `2 / span ${timeSlots.length}`,
            borderRight: "1px solid #ddd",
            position: "relative",
          }}
        >
          {timeSlots.map((time, index) => (
            <div
              key={time}
              style={{
                height: `${hourSlotHeight}px`,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#666",
                paddingTop: "4px",
                borderBottom:
                  index < timeSlots.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              {time}
            </div>
          ))}
        </div>

        {daysOfWeek.map((day, dayIndex) => {
          const dateStr = day.toISOString().split("T")[0];

          // Get all events for this specific date
          const currentDayEvents = getAllEventsForDate(dateStr);

          // Prepare events with overlap count for rendering
          const eventsForDisplay = currentDayEvents
            .map((event) => {
              const eventStartTime = event.time;
              const eventEndTime = event.end?.time;

              const eventStartMinutesFromMidnight =
                getTimeInMinutesFromMidnight(eventStartTime);
              const eventEndMinutesFromMidnight =
                getTimeInMinutesFromMidnight(eventEndTime);

              let durationMinutes =
                eventEndMinutesFromMidnight - eventStartMinutesFromMidnight;
              if (durationMinutes < 0) {
                durationMinutes += 1440; // Handle overnight events
              }

              const top =
                (eventStartMinutesFromMidnight -
                  firstSlotMinutesFromMidnight) *
                pixelsPerMinute;
              const calculatedHeight = durationMinutes * pixelsPerMinute;
              const actualCardHeight = Math.max(
                calculatedHeight,
                minEventCardContentHeight
              );

              // Calculate overlapping events for the badge
              // We're looking for events on the same day that share any part of their time range
              const overlappingEvents = currentDayEvents.filter((otherEvent) => {
                if (otherEvent.id === event.id) return false; // Don't count self

                const otherStart = getTimeInMinutesFromMidnight(otherEvent.time);
                const otherEnd = getTimeInMinutesFromMidnight(otherEvent.end.time);
                const currentEventStart = eventStartMinutesFromMidnight;
                const currentEventEnd = eventEndMinutesFromMidnight;

                // Check for overlap: (StartA < EndB) && (EndA > StartB)
                return (currentEventStart < otherEnd) && (currentEventEnd > otherStart);
              });

              return {
                ...event,
                top,
                actualCardHeight,
                overlapCount: overlappingEvents.length + 1, // +1 to include the event itself
              };
            })
            .sort((a, b) => {
              // Sort events for proper display
              const timeA = getTimeInMinutesFromMidnight(a.time);
              const timeB = getTimeInMinutesFromMidnight(b.time);
              return timeA - timeB;
            });

          return (
            <div
              key={dateStr}
              style={{
                gridColumn: `${dayIndex + 2}`,
                gridRow: `2 / span ${timeSlots.length}`,
                borderRight:
                  dayIndex < daysOfWeek.length - 1 ? "1px solid #ddd" : "none",
                position: "relative",
                minHeight: `${totalGridContentHeight}px`,
              }}
            >
              {/* Grid lines for each day */}
              {timeSlots.map((time, index) => (
                <div
                  key={`grid-line-${dateStr}-${time}`}
                  style={{
                    position: "absolute",
                    top: `${index * hourSlotHeight}px`,
                    left: 0,
                    right: 0,
                    height: `${hourSlotHeight}px`,
                    borderBottom:
                      index < timeSlots.length - 1 ? "1px solid #eee" : "none",
                    zIndex: 1,
                  }}
                  onClick={() => handleDateClick(dateStr, time)}
                />
              ))}

              {/* Event Cards */}
              {eventsForDisplay.map((event, eventIndex) => (
                <div
                  key={`${event.description}-${event.time}-${event.interviewer}-${dateStr}-${eventIndex}`}
                  onClick={() => handleDateClick(dateStr, event.time)}
                  className="bg-white border-x-8 border-blue-500 rounded-none shadow"
                  style={{
                    position: "absolute",
                    left: "2px",
                    width: `calc(${eventCardWidthPercentage}% - 2px - ${eventCardRightMargin}px)`,
                    top: `${event.top}px`,
                    height: `${event.actualCardHeight}px`,
                    // overflow: "hidden",
                    zIndex: 10,
                    boxSizing: "border-box",
                    marginRight: `${eventCardRightMargin}px`,
                    padding: eventCardPadding,
                  }}
                >
                  {/* Event count badge */}
                  {event.overlapCount > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px", // Adjust to position above the card
                        right: "-12px", // Adjust to position to the right of the card
                        backgroundColor: "#FFEB3B", // Yellow color
                        color: "black",
                        borderRadius: "50%", // Make it round
                        width: "24px", // Size of the badge
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        zIndex: 12, // Higher than card
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // Optional shadow
                      }}
                    >
                      {event.overlapCount}
                    </div>
                  )}

                  <div
                    className="font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontSize: "0.75rem", lineHeight: "1rem" }}
                  >
                    {event.description}
                  </div>
                  <div
                    className="text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontSize: "0.65rem", lineHeight: "0.9rem" }}
                  >
                    Interviewer: {event.interviewer}
                  </div>
                  {event.time && event.end?.time && (
                    <div
                      className="text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ fontSize: "0.65rem", lineHeight: "0.9rem" }}
                    >
                      Time: {event.time} - {event.end.time}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

WeekView.propTypes = {
  daysOfWeek: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  groupedEvents: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        interviewer: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        end: PropTypes.shape({
          time: PropTypes.string.isRequired,
        }).isRequired,
      })
    )
  ).isRequired,
  handleDateClick: PropTypes.func.isRequired,
};