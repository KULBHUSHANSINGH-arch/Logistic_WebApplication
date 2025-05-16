import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import useApi from "../../hooks/apiRequest";
import { dev } from "../../utils/ApiUrl";
import { toast } from "react-toastify";
import { styled } from '@mui/system';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '80%',
    maxWidth: '600px',
    height: 'auto',
    maxHeight: '80vh',
    padding: '20px',
    // Add more styles here
  },
}));

const fetchWorkLocationLists = async () => {
    const resp = await fetch(`${dev}/workLocation/work-location-list`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    
    const result = await resp.json();
    
    if (!resp.ok) {
      // Throw an error with a message to be caught in the calling code
      throw new Error(result.message || "Unit fetch failed");
    }
    
    return result; // Return result if everything is okay
  };
  

function VehicleTransferredPopup({ setOpenTransferModal, openTransferModal }) {
  const { loading, error, data, callApi } = useApi(fetchWorkLocationLists);
  const predefinedOptions = [
    { value: "firstValue", label: "Half" },
    { value: "secondValue", label: "" }, // Empty label
  ];
  const[selectedOption,setSelectedOption]=useState('')

  const [workLocationId, setWorkLocationId] = useState("");

  useEffect(() => {
    // Call the API when the component mounts
    callApi();
  }, []);



  // Assuming `data` contains the work locations
  const workLocations = data?.workLocations || [];

  return (
    <div>
      <Dialog
        open={openTransferModal}
        onClose={() => setOpenTransferModal(false)}
        aria-labelledby="form-dialog-title"
        sx={{
            '& .MuiDialog-paper': {
              width: '50%', // Set width
              maxWidth: '600px', // Max width
              height: 'auto', // Height
              maxHeight: '80vh', // Max height
              padding: '20px 30px', // Padding
            }
          }}
      >
        <DialogTitle id="form-dialog-title" sx={{textAlign:'center', color:'#000',fontSize:'20px', fontWeight:'bold',fontFamily:'sans-serif'}}>Transfer To</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: "20px", marginTop:'20px' }}>
            <InputLabel id="work-location-label">Work Location</InputLabel>
            <Select
              labelId="work-location-label"
              id="work-location"
              value={workLocationId}
              label="Work Location"
              name="workLocation"
              onChange={(e) => setWorkLocationId(e.target.value)}
              sx={{
                // border:'2px solid green'
              }}
            >
              <MenuItem value="">
                <em>Select Work Location</em>
              </MenuItem>
              {workLocations &&
                workLocations.map((location) => (
                  <MenuItem
                    key={location.WorkLocationId}
                    value={location.WorkLocationId}
                    sx={{
                      backgroundColor: "#ffffff", // Background color
                      color: "#333333", // Font color
                      fontSize: "16px", // Font size
                      textTransform: "capitalize",
                      "&:hover": {
                        backgroundColor: "#e0e0e0", // Background color on hover
                        color: "#000000", // Font color on hover
                      },
                    }}
                  >
                    {location.workLocationName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel id="predefined-options-label">
              Predefined Options
            </InputLabel>
            <Select
              labelId="predefined-options-label"
              id="predefined-options"
              value={selectedOption}
              label="Predefined Options"
              name="predefinedOptions"
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <MenuItem value="">
                <em>Select Option</em>
              </MenuItem>
              {predefinedOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    backgroundColor: "#ffffff", // Background color
                    color: "#333333", // Font color
                    fontSize: "16px", // Font size
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#e0e0e0", // Background color on hover
                      color: "#000000", // Font color on hover
                    },
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransferModal(false)} color="primary">
            Cancel
          </Button>
          <Button color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      {
        error && <div>Error: {error}</div>
      }
      {
        loading && <div>Loading...</div>
      }
    </div>
  );
}

export default VehicleTransferredPopup;
