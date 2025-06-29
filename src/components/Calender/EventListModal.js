import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const EventListModal = ({ eventOpen, closeEventList, selectedDateEvents ,handleEventClick}) => {
  
  return (
     <Dialog open={eventOpen} onClose={closeEventList} fullWidth maxWidth="sm">
           <DialogTitle>Events</DialogTitle>
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
           <DialogContent>
             <div>
               {selectedDateEvents?.length > 0 ? (
                 selectedDateEvents.map((e) => (
                   <div
                     key={e.id}
                     className="p-2 mb-2 bg-blue-100 rounded shadow cursor-pointer"
                     onClick={() => handleEventClick(e.id)}
                   >
                     <div className="font-semibold">{e.description}</div>
                     <div>Interviewer: {e.interviewer}</div>
                     <div>Time: {e.time}</div>
                   </div>
                 ))
               ) : (
                 <p>No events</p>
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