
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import GoogleMeet from "../../assets/google-meet-icon.png";

const EventDetailModal = ({ selectedEvent, closeEventDetail, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderAttachment = (fileName) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #3f51b5',
        color: '#3f51b5',
        px: 2,
        py: 1,
        borderRadius: '4px',
        width: '100%',
        fontSize: '0.875rem',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }}>
        {fileName}
      </Typography>
      <Box sx={{ display: 'flex', gap: '4px' }}>
        <IconButton size="small" sx={{ color: 'inherit', p: 0.5 }}>
          <VisibilityIcon sx={{ fontSize: '1.0rem' }} />
        </IconButton>
        <IconButton size="small" sx={{ color: 'inherit', p: 0.5 }}>
          <DownloadIcon sx={{ fontSize: '1.0rem' }} />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={!!selectedEvent}
      onClose={closeEventDetail}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '4px',
          border: '1px solid #e0e0e0',
          boxShadow: 3,
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pb: 1,
          pl: 3, 
          pr: '16px', 
          position: 'relative', 
        }}
      >
       
        <IconButton
          aria-label="close"
          onClick={closeEventDetail}
          sx={{
            position: 'absolute', 
            right: 8, 
            top: 8,  
            backgroundColor: 'primary.main', 
            color: 'white', 
            borderRadius: '50%', 
            padding: '4px',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: '0',
        }}
      >
        <Box
          sx={{
            border: '1px solid #e0e0e0', 
            margin: '16px', 
            borderRadius: '4px',
            padding: '16px', 
            display: 'flex',
            position: 'relative',
          }}
        >
          <Box sx={{ flex: 1, pr: 2, fontSize: '0.875rem' }}>
            <Typography variant="body2" sx={{ mb: 1.2 }}>
              <Typography component="span" fontWeight="bold">Interview With:</Typography> {selectedEvent?.interviewer}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.2 }}>
              <Typography component="span" fontWeight="bold">Position:</Typography> {selectedEvent?.position}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.2 }}>
               <Typography component="span" fontWeight="bold">Created By:</Typography> -
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.2 }}>
              <Typography component="span" fontWeight="bold">Interview Date:</Typography> {selectedEvent?.date}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.2 }}>
              <Typography component="span" fontWeight="bold">Interview Time:</Typography>{" "}
              {selectedEvent?.actual_time || selectedEvent?.time}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2.5 }}>
              <Typography component="span" fontWeight="bold">Interview Via:</Typography> Google Meet
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
              {renderAttachment("Resume.docx")}
              {renderAttachment("Aadharcard")}
            </Box>
          </Box>

  
          <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 0, borderColor: '#e0e0e0' }} />

       
          <Box sx={{ flex: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pl: 2 }}>
            <Box
              component="img"
              src={GoogleMeet}
              alt="google meet"
              sx={{ width: 100, height: 100, mb: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(selectedEvent?.meeting_link, "_blank")}
              sx={{
                fontWeight: 'bold',
                px: 4,
                py: 1,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                }
              }}
            >
              JOIN
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;

EventDetailModal.propTypes = {
  selectedEvent: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  closeEventDetail: PropTypes.func.isRequired,
};