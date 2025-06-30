import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

export const MonthView = ({ currentDate, groupedEvents, handleDateClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

  const calendarEnd = new Date(lastDayOfMonth);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));

  const dates = [];
  const current = new Date(calendarStart);
  while (current <= calendarEnd) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }
  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <th
                key={day}
                style={{
                  border: "1px solid #ddd",
                  padding: 8,
                  backgroundColor: "#f0f0f0",
                }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                const dateStr = date.toISOString().split("T")[0];
                const dayEvents = Object.entries(groupedEvents)
                  .filter(([key]) => key.startsWith(dateStr))
                  .flatMap(([, val]) => val);
                const isCurrentMonth = date.getMonth() === month;

                return (
                  <td
                    key={di}
                    style={{
                      verticalAlign: "top",
                      border: "1px solid #ddd",
                      padding: 6,
                      backgroundColor: isCurrentMonth ? "white" : "#f9f9f9",
                      minHeight: 70,
                      height: 90,
                      width: 250,
                      cursor: "pointer",
                    }}
                    onClick={() => handleDateClick(dateStr)}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                      {date.getDate()}
                    </div>
                    {dayEvents?.length > 0 && (
                      <div className="relative inline-block bg-white border-x-8 border-blue-500 rounded-none shadow p-3 max-w-xs">
                        {dayEvents.length > 1 && (
                          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow z-10 cursor-pointer">
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
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

MonthView.propTypes = {
  currentDate: PropTypes.string.isRequired,
  groupedEvents: PropTypes.array.isRequired,
  handleDateClick: PropTypes.func.isRequired,
};