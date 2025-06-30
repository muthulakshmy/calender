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

          const currentDayEvents = getAllEventsForDate(dateStr);

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

              {currentDayEvents
                .sort((a, b) => {
                  const timeA = getTimeInMinutesFromMidnight(a.time);
                  const timeB = getTimeInMinutesFromMidnight(b.time);
                  return timeA - timeB;
                })
                .map((event, eventIndex) => {
                  const eventStartTime = event.time;
                  const eventEndTime = event.end?.time;

                  const eventStartMinutesFromMidnight =
                    getTimeInMinutesFromMidnight(eventStartTime);
                  const eventEndMinutesFromMidnight =
                    getTimeInMinutesFromMidnight(eventEndTime);

                  let durationMinutes =
                    eventEndMinutesFromMidnight - eventStartMinutesFromMidnight;
                  if (durationMinutes < 0) {
                    durationMinutes += 1440;
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

                  return (
                    <div
                      key={`${event.description}-${event.time}-${event.interviewer}-${dateStr}-${eventIndex}`}
                      onClick={() => handleDateClick(dateStr, event.time)}
                      className="bg-white border-x-8 border-blue-500 rounded-none shadow"
                      style={{
                        position: "absolute",
                        left: "2px",
                        width: `calc(${eventCardWidthPercentage}% - 2px - ${eventCardRightMargin}px)`, 
                        top: `${top}px`,
                        height: `${actualCardHeight}px`,
                        overflow: "hidden",
                        zIndex: 10,
                        boxSizing: "border-box",
                        marginRight: `${eventCardRightMargin}px`,
                        padding: eventCardPadding,
                      }}
                    >
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
                  );
                })}
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
