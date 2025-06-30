import {
  AddOutlined,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import CreateEvent from "../components/Calender/CreateEvent";
import { DayView } from "../components/Calender/DayView";
import EventDetailModal from "../components/Calender/EventDetailModal";
import EventListModal from "../components/Calender/EventListModal";
import { MonthView } from "../components/Calender/MonthView";
import useCalendarData from "../components/Calender/useCalanderData";
import { WeekView } from "../components/Calender/WeekView";
import { YearView } from "../components/Calender/YearView";
import { timeSlots } from "../utils/TimeSlots";

const CalendarView = () => {
  const [view, setView] = useState("week");
  const {
    currentDate,
    setCurrentDate,
    events,
    selectedDateEvents,
    selectedEvent,
    loading,
    handleDateClick,
    handleEventClick,
    closeEventList,
    closeEventDetail,
    setEvents,
    eventOpen,
  } = useCalendarData();

  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    interviewer: "",
    position: "",
    link: "",
    start: "",
    end: "",
  });
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  function roundToNearestSlot(dateObj) {
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const timeStr = dateObj.toLocaleTimeString("en-US", options);

    const toMinutes = (t) => {
      const [time, period] = t.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return h * 60 + m;
    };

    const eventTimeMin = toMinutes(timeStr);
    let closest = timeSlots[0];
    let closestDiff = Math.abs(toMinutes(closest) - eventTimeMin);

    for (let slot of timeSlots) {
      const diff = Math.abs(toMinutes(slot) - eventTimeMin);
      if (diff < closestDiff) {
        closest = slot;
        closestDiff = diff;
      }
    }

    return closest;
  }

  const getValidDateString = (input) => {
    if (!input) return null;
    if (input.match(/^\d{4}$/)) {
      return `${input}-01-01T00:00:00`;
    }
    return input;
  };

  const handleCreateEvent = () => {
    const startDateStr = getValidDateString(formData.start);
    const endDateStr = getValidDateString(formData.end);

    const startDateObj = startDateStr ? new Date(startDateStr) : null;
    const endDateObj = endDateStr ? new Date(endDateStr) : null;

    if (
      !startDateObj ||
      isNaN(startDateObj.getTime()) ||
      !endDateObj ||
      isNaN(endDateObj.getTime())
    ) {
      setAlertInfo({
        open: true,
        message:
          "Please enter valid start and end dates (e.g., YYYY-MM-DD or YYYY).",
        severity: "error",
      });
      return;
    }

    const newId = events.length + 1;

    const actualDateStr = startDateObj.toISOString().split("T")[0];
    const actualTimeStr = startDateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const roundedTimeStr = roundToNearestSlot(startDateObj);

    const newEvent = {
      id: newId,
      summary: formData.position,
      desc: formData.position,
      start: startDateObj.toISOString(),
      end: endDateObj.toISOString(),
      attendees: null,
      status: null,
      comment: null,
      score: {},
      link: formData.link,
      user_det: {
        id: newId,
        question_score: null,
        status: null,
        candidate: {
          id: newId,
          candidate_firstName: formData.candidateName.split(" ")[0],
          candidate_lastName: formData.candidateName.split(" ")[1] || "",
          candidateGender: "",
          candidateComment: "",
          candidate_email: formData.email,
        },
        handled_by: {
          id: 0,
          last_login: null,
          userEmail: "",
          username: "",
          firstName: formData.interviewer,
          lastName: "",
          userRole: "hr_employee",
        },
        job_id: {
          id: newId,
          jobRequest_Title: formData.position,
          jobRequest_Role: formData.position,
          jobRequest_KeySkills: "",
          jobRequest_Description: "",
        },
      },
      job_id: {
        id: newId,
        jobRequest_Title: formData.position,
        jobRequest_Role: formData.position,
        jobRequest_KeySkills: "",
        jobRequest_Description: "",
      },
    };

    setEvents((prev) => [
      ...prev,
      {
        id: newEvent.id,
        date: actualDateStr,
        time: roundedTimeStr,
        actual_time: actualTimeStr,
        description: newEvent.job_id.jobRequest_Title,
        interviewer: newEvent.user_det.handled_by.firstName,
        candidate_name: `${newEvent.user_det.candidate.candidate_firstName} ${newEvent.user_det.candidate.candidate_lastName}`,
        email: newEvent.user_det.candidate.candidate_email,
        position: newEvent.job_id.jobRequest_Role,
        meeting_link: newEvent.link,
        end: newEvent.end,
      },
    ]);
    console.log(events, "poiuytrewasdftyghuijokpl");
    setOpenCreateDialog(false);
    setAlertInfo({
      open: true,
      message: "Event created successfully!",
      severity: "success",
    });
    setFormData({
      candidateName: "",
      email: "",
      interviewer: "",
      position: "",
      link: "",
      start: "",
      end: "",
    });
  };

  const startOfWeek = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }, [currentDate]);

  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [startOfWeek]);

  const groupedEvents = useMemo(() => {
    const grouped = {};
    events.forEach((e) => {
      const key = `${e.date}_${e.time}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(e);
    });
    return grouped;
  }, [events]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "day") newDate.setDate(newDate.getDate() - 1);
    else if (view === "week") newDate.setDate(newDate.getDate() - 7);
    else if (view === "month") newDate.setMonth(newDate.getMonth() - 1);
    else if (view === "year") newDate.setFullYear(newDate.getFullYear() - 1);
    setCurrentDate(new Date(newDate));
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "day") newDate.setDate(newDate.getDate() + 1);
    else if (view === "week") newDate.setDate(newDate.getDate() + 7);
    else if (view === "month") newDate.setMonth(newDate.getMonth() + 1);
    else if (view === "year") newDate.setFullYear(newDate.getFullYear() + 1);
    setCurrentDate(new Date(newDate));
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertInfo({ ...alertInfo, open: false });
  };
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between">
        <div>
          <Typography>Your Todo's</Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<AddOutlined />}
          size="small"
          onClick={() => setOpenCreateDialog(true)}
        >
          Create Schedule
        </Button>
      </div>

      <div className="flex justify-between mb-4 items-center">
        <div className="flex gap-2 items-center">
          <IconButton onClick={handlePrev}>
            <ArrowBackIos />
          </IconButton>
          <Typography variant="h6">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
          <IconButton onClick={handleNext}>
            <ArrowForwardIos />
          </IconButton>
        </div>

        <Tabs
          value={view}
          onChange={(e, newValue) => setView(newValue)}
          textColor="primary"
          indicatorColor="primary"
          className="my-2"
        >
          <Tab label="Day" value="day" />
          <Tab label="Week" value="week" />
          <Tab label="Month" value="month" />
          <Tab label="Year" value="year" />
        </Tabs>
      </div>

      {view === "day" && (
        <DayView
          currentDate={currentDate}
          groupedEvents={groupedEvents}
          handleDateClick={handleDateClick}
        />
      )}
      {view === "week" && (
        <WeekView
          daysOfWeek={daysOfWeek}
          groupedEvents={groupedEvents}
          handleDateClick={handleDateClick}
        />
      )}

      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          groupedEvents={groupedEvents}
          handleDateClick={handleDateClick}
        />
      )}

      {view === "year" && (
        <YearView
          currentDate={currentDate}
          events={events}
          handleDateClick={handleDateClick}
        />
      )}

      <EventListModal
        eventOpen={eventOpen}
        closeEventList={closeEventList}
        selectedDateEvents={selectedDateEvents}
        handleEventClick={handleEventClick}
      />

      <EventDetailModal
        loading={loading}
        selectedEvent={selectedEvent}
        closeEventDetail={closeEventDetail}
      />
      <CreateEvent
        openCreateDialog={openCreateDialog}
        setOpenCreateDialog={setOpenCreateDialog}
        formData={formData}
        setFormData={setFormData}
        handleCreateEvent={handleCreateEvent}
      />
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertInfo.severity}
          sx={{ width: "100%" }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CalendarView;
