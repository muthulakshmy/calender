import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from "@mui/material";
import moment from 'moment';
import PropTypes from "prop-types";

const EventListModal = ({
  eventOpen,
  closeEventList,
  selectedDateEvents,
  handleEventClick, 
}) => {

  const formatDate = (dateString) => {
    return moment(dateString).format("DD MMM YYYY");
  };

  return (
    <Dialog
      open={eventOpen}
      onClose={closeEventList}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Meetings</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeEventList}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <Divider />
      <DialogContent sx={{ paddingTop: '16px' }}>
        <div>
          {selectedDateEvents?.length > 0 ? (
            selectedDateEvents.map((e) => (
              <Box
                key={e.id}
                sx={{
                  position: "relative",
                  backgroundColor: "white",
                  borderLeft: "8px solid",
                  borderColor: "info.main",
                  borderRadius: "0px",
                  boxShadow: 1,
                  p: 2,
                  pb: 1.5,
                  mb: 2,
                  cursor: "pointer",
                }}
                onClick={() => handleEventClick(e.id)}
              >
            
                <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    sx={{ padding: '2px' }}
                  >
                    <EditIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} className="cursor-not-allowed" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation(); 
                      console.log("Delete", e.id);
                    }}
                    sx={{ padding: '2px' }}
                  >
                    <DeleteIcon sx={{ fontSize: '0.9rem', color: 'error.main' }}  className="cursor-not-allowed"  />
                  </IconButton>
                </Box>

                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                  {e.position}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1, whiteSpace: 'nowrap' }}>
                    {e.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>
                    |
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Interviewer: {e.interviewer}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Date: {formatDate(e.date)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Time: {e.time} - {e.end?.time || "End time missing"}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No events</Typography>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventListModal;

EventListModal.propTypes = {
  eventOpen: PropTypes.bool.isRequired,
  selectedDateEvents: PropTypes.array.isRequired,
  closeEventList: PropTypes.func.isRequired,
  handleEventClick: PropTypes.func.isRequired,
};