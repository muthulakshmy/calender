
import { timeSlots } from "../../utils/TimeSlots"; 
import PropTypes from "prop-types";

export const DayView = ({ currentDate, groupedEvents, handleDateClick }) => {
  const today = new Date(currentDate);
  const dateStr = today.toISOString().split("T")[0];

 
  const hourSlotHeight = 70; 

  const minEventCardContentHeight = 50; 

 
  const timeLabelWidth = 70; 

  const eventCardFixedWidth = 300; 

  const eventCardRightMargin = 10; 

  const eventCardPadding = '2px 4px';


  const pixelsPerMinute = hourSlotHeight / 60;

  const allDayEvents = [];
  for (const key in groupedEvents) {
    if (Object.prototype.hasOwnProperty.call(groupedEvents, key)) {
      if (key.startsWith(dateStr)) {
        allDayEvents.push(...groupedEvents[key]);
      }
    }
  }

  const getTimeInMinutesFromMidnight = (timeStr) => {
    const [time, period] = timeStr?.split(" ") || [];
    let [hour, minute] = time?.split(":").map(Number) || [0, 0];

    if (period === "PM" && hour !== 12) {
      hour += 12;
    }
    if (period === "AM" && hour === 12) {
      hour = 0;
    }
    return hour * 60 + minute;
  };

  const firstSlotMinutesFromMidnight = getTimeInMinutesFromMidnight(timeSlots[0]);

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

          {allDayEvents.map((event, index) => {
            const eventStartMinutesFromMidnight = getTimeInMinutesFromMidnight(event.time);
            const eventEndMinutesFromMidnight = getTimeInMinutesFromMidnight(event.end.time);

            let durationMinutes = eventEndMinutesFromMidnight - eventStartMinutesFromMidnight;
            if (durationMinutes < 0) {
              durationMinutes += 1440; 
            }

            const topOffsetMinutes = eventStartMinutesFromMidnight - firstSlotMinutesFromMidnight;
            const top = topOffsetMinutes * pixelsPerMinute;

            const calculatedHeight = durationMinutes * pixelsPerMinute;
           
            const actualCardHeight = Math.max(calculatedHeight, minEventCardContentHeight);

            return (
              <div
                key={`${event.description}-${event.time}-${event.interviewer}-${index}`}
                onClick={() => handleDateClick(dateStr, event.time)}
                className="bg-white border-x-8 border-blue-500 rounded-none shadow"
                style={{
                  position: "absolute",
                  left: "2px", 
                  width: `${eventCardFixedWidth}px`, 
                  top: `${top}px`,
                  height: `${actualCardHeight}px`,
                  overflow: "hidden", 
                  zIndex: 10,
                  boxSizing: "border-box",
                  marginRight: `${eventCardRightMargin}px`, 
                  padding: eventCardPadding, 
                }}
              >
                <div className="text-sm text-blue-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {event.description}
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                  Interviewer: {event.interviewer}
                </div>
                {event.time && (
                  <div className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                    Time: {event.time} - {event.end?.time || ''}
                  </div>
                )}
              </div>
            );
          })}
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