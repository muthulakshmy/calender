
import { timeSlots } from "../../utils.js/TimeSlots"; // Ensure this path is correct
import PropTypes from "prop-types";

export const DayView = ({ currentDate, groupedEvents, handleDateClick }) => {
  const today = new Date(currentDate);
  const dateStr = today.toISOString().split("T")[0];

  // =========================================================================
  // CRITICAL CONFIGURATION VALUES - ADJUST THESE BASED ON YOUR ACTUAL CSS!
  // =========================================================================

  // 1. Height of one hour slot in pixels.
  //    ***VERY IMPORTANT: MEASURE THIS PRECISELY*** from your rendered component
  //    using browser developer tools. Inspect the div containing "06:00 PM"
  //    in the time axis column and check its 'computed height'.
  //    If it's 65px, set it to 65. If it's 72px, set it to 72.
  const hourSlotHeight = 70; // <<-- CONFIRM THIS EXACTLY!

  // 2. Minimum height for an event card to ensure all content (3 lines of text) is visible.
  //    To make the 6:00-6:40 card shorter, this value needs to be closer to its
  //    actual duration's pixel height (40 min / 60 min * hourSlotHeight).
  //    If hourSlotHeight is 70, then 40 minutes is ~46.6px.
  //    So, minEventCardContentHeight should be around 45-50px for the 6:40 event
  //    to appear shorter. You'll need to ensure your content fits!
  const minEventCardContentHeight = 50; // <<-- REDUCED FOR SHORTER CARDS. ADJUST CAREFULLY!

  // 3. Width of the time label column (e.g., "05:00 PM").
  //    Measure this from your rendered time label <div>.
  const timeLabelWidth = 70; // <<-- CONFIRM THIS EXACTLY

  // 4. Fixed width for the event cards (in pixels).
  const eventCardFixedWidth = 300; // As requested, fixed width of 300px

  // 5. Margin on the right side of the event cards (for spacing).
  //    This creates a gap between the card and the right edge of the grid.
  const eventCardRightMargin = 10; // Adjust as needed for visual spacing

  // 6. Explicit padding inside the event card (vertical and horizontal).
  //    Reduced to help content fit in smaller cards.
  const eventCardPadding = '2px 4px'; // Top/Bottom 2px, Left/Right 4px

  // =========================================================================

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
    // Added optional chaining (?) to prevent errors if timeStr is undefined
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
          border: "1px solid #ddd", // Main outer border
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        {/* Time Axis (Left Column) */}
        <div
          style={{
            width: `${timeLabelWidth}px`,
            flexShrink: 0,
            borderRight: "1px solid #ddd", // Vertical separator
          }}
        >
          {timeSlots.map((time, index) => (
            <div
              key={time}
              style={{
                height: `${hourSlotHeight}px`,
                display: "flex",
                alignItems: "flex-start", // Aligns time text to top of its slot
                justifyContent: "center",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#666",
                paddingTop: '4px', // Small padding to push text down from very top edge
                borderBottom: index < timeSlots.length - 1 ? "1px solid #eee" : "none", // Horizontal grid lines
              }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Events Grid (Right Column) */}
        <div
          style={{
            flexGrow: 1,
            position: "relative",
            minHeight: `${timeSlots.length * hourSlotHeight}px`,
          }}
        >
          {/* Background Grid Lines (Horizontal) */}
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

          {/* Render All Events as Absolutely Positioned Cards */}
          {allDayEvents.map((event, index) => {
            const eventStartMinutesFromMidnight = getTimeInMinutesFromMidnight(event.time);
            const eventEndMinutesFromMidnight = getTimeInMinutesFromMidnight(event.end.time);

            let durationMinutes = eventEndMinutesFromMidnight - eventStartMinutesFromMidnight;
            if (durationMinutes < 0) {
              durationMinutes += 1440; // For events crossing midnight
            }

            const topOffsetMinutes = eventStartMinutesFromMidnight - firstSlotMinutesFromMidnight;
            const top = topOffsetMinutes * pixelsPerMinute;

            const calculatedHeight = durationMinutes * pixelsPerMinute;
            // The actual height of the card will be the greater of its calculated duration height
            // OR the minimum height required for its content.
            const actualCardHeight = Math.max(calculatedHeight, minEventCardContentHeight);

            return (
              <div
                key={`${event.description}-${event.time}-${event.interviewer}-${index}`}
                onClick={() => handleDateClick(dateStr, event.time)}
                // Removed all Tailwind padding classes to control padding explicitly
                className="bg-white border-x-8 border-blue-500 rounded-none shadow"
                style={{
                  position: "absolute",
                  left: "2px", // Small left offset from the grid line
                  width: `${eventCardFixedWidth}px`, // Fixed width as requested (e.g., 300px)
                  top: `${top}px`,
                  height: `${actualCardHeight}px`,
                  overflow: "hidden", // Important: will hide content if it overflows
                  zIndex: 10,
                  boxSizing: "border-box", // Ensures padding/border don't add to total width/height
                  marginRight: `${eventCardRightMargin}px`, // Add margin to the right side
                  padding: eventCardPadding, // Explicitly set smaller padding for content
                }}
              >
                {/* Apply text-overflow classes to ensure text handles reduced width */}
                {/* Added conditional rendering for time if it's the 6:00-6:40 event to show it */}
                <div className="text-sm text-blue-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {event.description}
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                  Interviewer: {event.interviewer}
                </div>
                {/* This div only renders if the time property is available */}
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