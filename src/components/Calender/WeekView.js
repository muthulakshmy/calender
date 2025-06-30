import React from "react";
import { timeSlots } from "../../utils.js/TimeSlots";
import PropTypes from "prop-types";

export const WeekView = ({ daysOfWeek, groupedEvents, handleDateClick }) => (
  <div className="grid grid-cols-8 border-t border-l">
    <div className="col-span-1 border-b border-r bg-gray-50 text-center font-medium">
      Time
    </div>
    {daysOfWeek.map((d) => (
      <div
        key={d}
        className="border-b border-r bg-gray-50 text-center font-medium"
      >
        <div>
          {d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
        </div>
        <div>{d.toLocaleDateString("en-GB", { weekday: "long" })}</div>
      </div>
    ))}
    {timeSlots.map((time) => (
      <React.Fragment key={time}>
        <div className="border-r border-b text-center py-4 font-bold text-blue-700">
          {time}
        </div>
        {daysOfWeek.map((day) => {
          const dateStr = day.toISOString().split("T")[0];
          const key = `${dateStr}_${time}`;
          const dayEvents = groupedEvents[key];

          return (
            <div
              key={dateStr + time}
              className="border-r border-b relative hover:bg-blue-50 transition duration-200"
              onClick={() => handleDateClick(dateStr, time)}
            >
              {dayEvents?.length > 0 && (
                <div className="relative inline-block bg-white border-l-8 border-blue-500 rounded-none shadow p-3 max-w-xs">
                  {dayEvents.length > 1 && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow cursor-pointer z-10">
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
      </React.Fragment>
    ))}
  </div>
);


WeekView.propTypes = {
  daysOfWeek: PropTypes.array.isRequired,
  groupedEvents: PropTypes.array.isRequired,
  handleDateClick: PropTypes.func.isRequired,
};