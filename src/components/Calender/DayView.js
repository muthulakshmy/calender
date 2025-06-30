
import PropTypes from "prop-types";
import { timeSlots } from "../../utils/TimeSlots";


export const DayView = ({ currentDate, groupedEvents, handleDateClick }) => {
  const today = new Date(currentDate);
  const dateStr = today.toISOString().split("T")[0]; 

  const hourSlotHeight = 70;
  const minEventCardContentHeight = 50;
  const timeLabelWidth = 70;
  const eventCardFixedWidth = 200;
  const eventCardRightMargin = 10;
  const eventCardPadding = '2px 4px';
  const pixelsPerMinute = hourSlotHeight / 60;

  const getTimeInMinutesFromMidnight = (timeStr) => {
    if (!timeStr) return 0;

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

  const firstSlotMinutesFromMidnight = getTimeInMinutesFromMidnight(timeSlots[0]);

  const eventsForDayView = [];
  for (const dateTimeKey in groupedEvents) {
    if (Object.prototype.hasOwnProperty.call(groupedEvents, dateTimeKey)) {
      if (dateTimeKey.startsWith(dateStr)) {
        const eventsInThisSlot = groupedEvents[dateTimeKey];
        const overlapCount = eventsInThisSlot.length;

        eventsInThisSlot.forEach((event, idx) => { 
          const eventStartMinutesFromMidnight = getTimeInMinutesFromMidnight(event.time);
          const eventEndMinutesFromMidnight = getTimeInMinutesFromMidnight(event.end?.time);

          let durationMinutes = eventEndMinutesFromMidnight - eventStartMinutesFromMidnight;
          if (durationMinutes < 0) {
            durationMinutes += 1440; 
          }

          const topOffsetMinutes = eventStartMinutesFromMidnight - firstSlotMinutesFromMidnight;
          const top = topOffsetMinutes * pixelsPerMinute;

          const calculatedHeight = durationMinutes * pixelsPerMinute;
          const actualCardHeight = Math.max(calculatedHeight, minEventCardContentHeight);

          eventsForDayView.push({
            ...event, 
            overlapCount: overlapCount, 
            top: top, 
            actualCardHeight: actualCardHeight, 
           
            uniqueId: `${event.description}-${event.time}-${event.interviewer}-${dateStr}-${idx}`,
          });
        });
      }
    }
  }
 

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ fontWeight: "600", marginBottom: "1rem" }}>
        {today.toDateString()}
      </h3>

      <div
        style={{
          display: "flex",
          border: "1px solid #ddd",
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            width: `${timeLabelWidth}px`,
            flexShrink: 0,
            borderRight: "1px solid #ddd",
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
                paddingTop: '4px',
                borderBottom: index < timeSlots.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              {time}
            </div>
          ))}
        </div>

        <div
          style={{
            flexGrow: 1,
            position: "relative",
            minHeight: `${timeSlots.length * hourSlotHeight}px`,
            overflowY: "auto", 
            overflowX: "hidden",
          }}
        >
  
          {timeSlots.map((time, index) => (
            <div
              key={`grid-line-${time}`}
              style={{
                position: "absolute",
                top: `${index * hourSlotHeight}px`,
                left: 0,
                right: 0,
                height: `${hourSlotHeight}px`,
                borderBottom: index < timeSlots.length - 1 ? "1px solid #eee" : "none",
                zIndex: 1,
              }}
              onClick={() => handleDateClick(dateStr, time)}
            />
          ))}

 
          {eventsForDayView.map((event) => ( 
            <div
              key={event.uniqueId} 
              onClick={() => handleDateClick(dateStr, event.time)}
              className="bg-white border-x-8 border-blue-500 rounded-none shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              style={{
                position: "absolute",
                left: "2px",
                width: `${eventCardFixedWidth}px`,
                top: `${event.top}px`,
                height: `${event.actualCardHeight}px`,
                zIndex: 10,
                boxSizing: "border-box",
                marginRight: `${eventCardRightMargin}px`,
                padding: eventCardPadding,
              }}
            >
            
              {event.overlapCount > 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-8px", 
                    right: "-10px", 
                    backgroundColor: "#FFEB3B",
                    color: "black",
                    borderRadius: "50%", 
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    zIndex: 12, 
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
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
              {event.time && (
                <div
                  className="text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ fontSize: "0.65rem", lineHeight: "0.9rem" }}
                >
                  Time: {event.time} - {event.end?.time || ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

DayView.propTypes = {
  currentDate: PropTypes.string.isRequired,
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