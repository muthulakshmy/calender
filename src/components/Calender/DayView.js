import React from "react";
import { timeSlots } from "../../utils.js/TimeSlots";
import PropTypes from "prop-types";

export const DayView = ({ currentDate, groupedEvents, handleDateClick }) => {
  const today = new Date(currentDate);
  const dateStr = today.toISOString().split("T")[0];

  return (
    <div>
      <h3 style={{ fontWeight: "600", marginBottom: "1rem" }}>
        {today.toDateString()}
      </h3>

      {timeSlots.map((time) => {
        const key = `${dateStr}_${time}`;
        const dayEvents = groupedEvents[key];

        return (
          <div
            key={time}
            onClick={() => handleDateClick(dateStr, time)}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "12px 0",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#666",
                minWidth: 60,
              }}
            >
              {time}
            </div>

            {dayEvents?.length > 0 && (
              <div className="relative inline-block bg-white border-l-8 border-blue-500 rounded-none shadow p-3 max-w-xs">
                {dayEvents.length > 1 && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                    {dayEvents.length}
                  </div>
                )}
                <div className="text-sm text-blue-700 font-medium">
                  {dayEvents[0].description}
                </div>
                <div className="text-xs text-gray-600">
                  Interviewer: {dayEvents[0].interviewer}
                </div>
                <div className="text-xs text-gray-600">
                  Time: {dayEvents[0].time} - {dayEvents[0].end.time}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};


DayView.propTypes = {
  currentDate: PropTypes.string.isRequired,
  groupedEvents: PropTypes.array.isRequired,
  handleDateClick: PropTypes.func.isRequired,
};