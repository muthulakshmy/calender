import { Box, Typography, Grid, Paper } from "@mui/material";
import PropTypes from "prop-types";

export const renderMonthGridView = (
  year,
  month,
  groupedEvents,
  handleDateClick
) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const calendarStart = new Date(firstDay);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

  const calendarEnd = new Date(lastDay);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));

  const days = [];
  const current = new Date(calendarStart);

  while (current <= calendarEnd) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const dayCellHeightWithPadding = 25 + 0.5 * 2 * 8;

  const gapSize = 0.5 * 8;

  const minDaysGridHeight = 6 * dayCellHeightWithPadding + 5 * gapSize;

  return (
    <Box>
      <Typography variant="subtitle2" textAlign="center" fontWeight={600}>
        {new Date(year, month).toLocaleString("default", { month: "long" })}
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={0.5}
        mt={1}
        sx={{
          fontSize: "0.65rem",
          minHeight: `${minDaysGridHeight}px`,
        }}
      >
        {"SMTWTFS".split("").map((d) => (
          <Box key={d} textAlign="center" color="gray">
            {d}
          </Box>
        ))}

        {days.map((date, idx) => {
          const dateStr = date.toISOString().split("T")[0];
          const dayEvents = groupedEvents[dateStr] || [];
          const isCurrentMonth = date.getMonth() === month;
          const isToday = dateStr === new Date().toISOString().split("T")[0];
          const hasEvents = dayEvents.length > 0; 

          return (
            <Box
              key={idx}
              p={0.5}
              height={25}
              bgcolor={
                isToday
                  ? "#e0f7fa"
                  : hasEvents
                  ? "#bbdefb"
                  : isCurrentMonth
                  ? "white"
                  : "#f5f5f5"
              }
              borderRadius={1}
              overflow="hidden"
              sx={{ cursor: "pointer", position: "relative" }}
              onClick={() => handleDateClick(dateStr)}
            >
              <Box fontWeight={600} fontSize="0.75rem">
                {date.getDate()}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export const YearView = ({ currentDate, events, handleDateClick }) => {
  const year = currentDate.getFullYear();

  const groupedEvents = events.reduce((acc, event) => {
    const key = event.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <Grid container spacing={2}>
      {Array.from({ length: 12 }, (_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Paper elevation={2} sx={{ p: 1 }}>
            {renderMonthGridView(year, i, groupedEvents, handleDateClick)}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

YearView.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired, 
  events: PropTypes.array.isRequired,
  handleDateClick: PropTypes.func.isRequired,
};
