import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

const CreateEvent = ({
  openCreateDialog,
  setOpenCreateDialog,
  formData,
  setFormData,
  handleCreateEvent,
}) => {
  function handleClose() {
    setOpenCreateDialog(false);
    setFormData({
      candidateName: "",
      email: "",
      interviewer: "",
      position: "",
      link: "",
      start: "",
      end: "",
    });
  }
  return (
    <Dialog
      open={openCreateDialog}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create Schedule</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="space-y-4 pt-4">
        <div className="mt-2">
          <TextField
            fullWidth
            label="Candidate Name"
            value={formData.candidateName}
            size="small"
            onChange={(e) =>
              setFormData({ ...formData, candidateName: e.target.value })
            }
          />
        </div>
        <TextField
          fullWidth
          label="Email"
          size="small"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          fullWidth
          label="Interviewer Name"
          size="small"
          value={formData.interviewer}
          onChange={(e) =>
            setFormData({ ...formData, interviewer: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Position"
          size="small"
          value={formData.position}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Meeting Link"
          size="small"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
        <TextField
          fullWidth
          type="datetime-local"
          size="small"
          label="Start Time"
          InputLabelProps={{ shrink: true }}
          value={formData.start}
          onChange={(e) => setFormData({ ...formData, start: e.target.value })}
        />
        <TextField
          fullWidth
          type="datetime-local"
          size="small"
          InputLabelProps={{ shrink: true }}
          label="End Time"
          value={formData.end}
          onChange={(e) => setFormData({ ...formData, end: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreateEvent}
          disabled={
            !formData.end ||
            !formData.start ||
            !formData.candidateName ||
            !formData.email
          }
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEvent;

CreateEvent.propTypes = {
  openCreateDialog: PropTypes.bool.isRequired,
  setOpenCreateDialog: PropTypes.func.isRequired,
  formData: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  handleCreateEvent: PropTypes.func.isRequired,
};
