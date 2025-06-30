import axios from "axios";
import { useEffect, useState } from "react";

const defaultEvents = [
  {
    id: 1,
    summary: "1st Round",
    desc: "1st Round",
    start: "2024-08-29T18:00:00+05:30",
    end: "2024-08-29T18:40:00+05:30",
    attendees: null,
    status: null,
    comment: null,
    score: {
      P: 8,
    },
    link: "http://www.hhh.com",
    user_det: {
      id: 1,
      question_score: null,
      status: null,
      candidate: {
        id: 1,
        candidate_firstName: "mohan",
        candidate_lastName: "raj",
        candidateGender: "male",
        candidateComment: "",
        candidate_email: "mohanrajk@dataterrain.com",
      },
      handled_by: {
        id: 3,
        last_login: null,
        userEmail: "vinodhini_hr@dataterrain.com",
        username: "vinodhini_hr",
        firstName: "Vinodhini",
        lastName: "HR",
        userRole: "hr_employee",
      },
      job_id: {
        id: 11,
        jobRequest_Title: "django developer",
        jobRequest_Role: "software engineer",
        jobRequest_KeySkills: "django",
        jobRequest_Description: "asfffasf",
      },
    },
    job_id: {
      id: 11,
      jobRequest_Title: "django developer",
      jobRequest_Role: "software engineer",
      jobRequest_KeySkills: "django",
      jobRequest_Description: "asfffasf",
    },
  },
  {
    id: 2,
    summary: "Test",
    desc: "Test",
    start: "2024-08-29T18:00:00+05:30",
    end: "2024-08-29T18:40:00+05:30",
    attendees: null,
    status: null,
    comment: null,
    score: {
      p: 7,
    },
    link: "http://www.hhh.com",
    user_det: {
      id: 1,
      question_score: null,
      status: null,
      candidate: {
        id: 1,
        candidate_firstName: "mohan",
        candidate_lastName: "raj",
        candidateGender: "male",
        candidateComment: "",
        candidate_email: "mohanrajk@dataterrain.com",
      },
      handled_by: {
        id: 3,
        last_login: null,
        userEmail: "vinodhini_hr@dataterrain.com",
        username: "vinodhini_hr",
        firstName: "Vinodhini",
        lastName: "HR",
        userRole: "hr_employee",
      },
      job_id: {
        id: 11,
        jobRequest_Title: "django developer",
        jobRequest_Role: "software engineer",
        jobRequest_KeySkills: "django",
        jobRequest_Description: "asfffasf",
      },
    },
    job_id: {
      id: 11,
      jobRequest_Title: "django developer",
      jobRequest_Role: "software engineer",
      jobRequest_KeySkills: "django",
      jobRequest_Description: "asfffasf",
    },
  },
  {
    id: 3,
    summary: "2nd Round",
    desc: "2nd Round",
    start: "2024-08-29T20:00:00+05:30",
    end: "2024-08-29T21:00:00+05:30",
    attendees: null,
    status: null,
    comment: null,
    score: {
      o: 6,
    },
    link: "http://www.hhh.com",
    user_det: {
      id: 1,
      question_score: null,
      status: null,
      candidate: {
        id: 1,
        candidate_firstName: "mohan",
        candidate_lastName: "raj",
        candidateGender: "male",
        candidateComment: "",
        candidate_email: "mohanrajk@dataterrain.com",
      },
      handled_by: {
        id: 3,
        last_login: null,
        userEmail: "vinodhini_hr@dataterrain.com",
        username: "vinodhini_hr",
        firstName: "Vinodhini",
        lastName: "HR",
        userRole: "hr_employee",
      },
      job_id: {
        id: 11,
        jobRequest_Title: "django developer",
        jobRequest_Role: "software engineer",
        jobRequest_KeySkills: "django",
        jobRequest_Description: "asfffasf",
      },
    },
    job_id: {
      id: 11,
      jobRequest_Title: "django developer",
      jobRequest_Role: "software engineer",
      jobRequest_KeySkills: "django",
      jobRequest_Description: "asfffasf",
    },
  },
];

function formatDateTime(datetimeStr) {
  const dateObj = new Date(datetimeStr);
  const date = dateObj.toISOString().split("T")[0];

  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const [rawTime, meridian] = time.split(" ");
  const [h, m] = rawTime.split(":");
  const formattedTime = `${h.padStart(2, "0")}:${m} ${meridian}`;

  return { date, time: formattedTime };
}

const useCalendarData = () => {
  const [currentDate, setCurrentDate] = useState(new Date("2024-08-29"));
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/calenderfromtoenddate.json");
      const data = response.data;

      const transformed = data.map((e) => {
        const { date, time } = formatDateTime(e.start);

        return {
          id: e.id,
          date,
          time,
          description: e.job_id.jobRequest_Title,
          interviewer: e.user_det.handled_by.firstName,
          candidate_name: `${e.user_det.candidate.candidate_firstName} ${e.user_det.candidate.candidate_lastName}`,
          email: e.user_det.candidate.candidate_email,
          position: e.job_id.jobRequest_Role,
          meeting_link: e.link,
          end:formatDateTime(e.end)

        };
      });
      setEvents(transformed);
    } catch (error) {
      console.error("Failed to load calendar events:", error);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (dateStr, timeStr = null) => {
    setEventOpen(true);
    const filtered = events.filter((e) =>
      timeStr ? e.date === dateStr && e.time === timeStr : e.date === dateStr
    );
    setSelectedDateEvents(filtered);
  };


   const handleEventClick = (eventId) => {
    setLoading(true);
    const event = events.find((e) => e.id === eventId);
    setTimeout(() => {
      setSelectedEvent(event);
      setLoading(false);
      setEventOpen(false); 
    }, 200);
  };
  const closeEventList = () => {
    setEventOpen(false);
    setSelectedDateEvents([]);
  };

  const closeEventDetail = () => {
  setSelectedEvent(null);
  closeEventList(); 
};


  return {
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
  };
};

export default useCalendarData;
