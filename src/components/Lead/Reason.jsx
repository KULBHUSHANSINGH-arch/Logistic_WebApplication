import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box,IconButton } from "@mui/material";
import { useSelector } from "react-redux";

const ReasonModal = ({ row, fetchNotes,status }) => {
    const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleOpen = async () => {

    if (row.customerId) {
        fetchNotes(row.customerId, user)
          .then((data) => {
            setReason(data.reason|| 'No reason provided');
            // setFollowDate(data.followDate || "");
            // setNoteId(data.id || "");
            setOpen(true);
          })
          .catch((error) => {
            console.error("Error fetching notes:", error);
          });
      }
    // try {
    //   // Log the row data to verify what we're sending
    //   console.log("Row data:", row);
      
    //   const response = await fetchNotes(row.customerId, user);
    //   console.log("API Response:", response);
    
    //   if (!response?.customer) {
    //     console.error("No customer data in response");
    //     setReason('No reason data available');
    //     setOpen(true);
    //     return;
    //   }

    //   // Get the reason from the response
    //   const reasonText = response.customer.reason;
    //   console.log("Reason from response:", reasonText);

    //   setReason(reasonText || 'No reason provided');
    //   setOpen(true);
    // } catch (error) {
    //   console.error('Error fetching reason:', error);
    //   setReason('Error loading reason');
    //   setOpen(true);
    // }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleOpen}
        sx={{ minWidth: "10px" }}  // Using MUI's sx prop instead of className
      >
        Reason
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
         <Box display="flex" justifyContent="space-between" alignItems="center" p={0}>
         <DialogTitle sx={{ 
          fontSize: '1.25rem',
          fontWeight: 600
        }}>
          {status} Reason
        </DialogTitle>
                  <IconButton onClick={handleClose} size="small">✖</IconButton>
                </Box>
        
      
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography>
              {reason}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button 
            onClick={handleClose}
            sx={{
              backgroundColor: '#e2e8f0',
              '&:hover': {
                backgroundColor: '#cbd5e1'
              }
            }}
          >
            Close
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReasonModal;