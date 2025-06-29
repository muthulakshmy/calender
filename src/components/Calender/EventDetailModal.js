import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  CircularProgress,
  IconButton,
  DialogActions,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import GoogleMeet from "../../assets/google-meet-icon.png";
const EventDetailModal = ({ selectedEvent, closeEventDetail, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <CircularProgress />
      </div>
    );
  }
  return (
    <Dialog
      open={!!selectedEvent}
      onClose={closeEventDetail}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Event Detail</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeEventDetail}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <div className="flex">
        <DialogContent>
          {selectedEvent ? (
            <div className="space-y-2">
              <div>
                <strong>Candidate:</strong> {selectedEvent.candidate_name}
              </div>
              <div>
                <strong>Email:</strong> {selectedEvent.email}
              </div>
              <div>
                <strong>Interviewer:</strong> {selectedEvent.interviewer}
              </div>
              <strong>Time:</strong>{" "}
              {selectedEvent.actual_time || selectedEvent.time}
              <div>
                <strong>Position:</strong> {selectedEvent.position}
              </div>
            </div>
          ) : null}
        </DialogContent>
        <div className="flex flex-col justify-evenly items-center">
          <img src={GoogleMeet} alt="google meet" width={200} height={200} />
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(selectedEvent?.meeting_link, "_blank")}
            >
              Join Meeting
            </Button>
          </DialogActions>
        </div>
      </div>
    </Dialog>
  );
};

export default EventDetailModal;

EventDetailModal.propTypes = {
  selectedEvent: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  closeEventDetail: PropTypes.func.isRequired,
};
