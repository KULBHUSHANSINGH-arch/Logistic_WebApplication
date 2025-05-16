import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  InputAdornment,
  TextareaAutosize,
  Grid,
} from "@mui/material";
import { CurrencyRupee } from "@mui/icons-material";
import { dev } from "../../utils/ApiUrl";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function AddPricing({ vehicleData, handleClose, open, getDataByStatus }) {
  // Extract necessary data from the vehicleData prop
  const { user } = useSelector((state) => state.user);
  const { id, price, reason, vehicleNo, detension } = vehicleData;
  console.log("vehicle data", vehicleData);
  const [addPriceFormData, setAddPriceFormData] = useState({
    vehicleNo: vehicleNo,
    vehicleId: id,
    price: "",
    workLocation: user.workLocation,
    oldPrice: price ? price : "",
    reason: reason ? reason : "",
    detension: detension ? detension : "",
    newPrice: "",
  });

  console.log("add price data", addPriceFormData);

  const [newPrice, setNewPrice] = useState(price);
  const [updateMode, setUpdateMode] = useState(price);
  const [adjustmentType, setAdjustmentType] = useState("increase");
  const [adjustedPrice, setAdjustedPrice] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (e) =>
    setAddPriceFormData({
      ...addPriceFormData,
      [e.target.name]: e.target.value,
    });

  const addPricing = async () => {

    if(!addPriceFormData.price){
        return toast.error('Please Add price')
    }
    try {
      setLoading(true);

      // Extract only the required fields from addPriceFormData
      const payload = {
        vehicleNo: addPriceFormData.vehicleNo,
        vehicleId: addPriceFormData.vehicleId,
        workLocation: addPriceFormData.workLocation,
        price: addPriceFormData.price, // Use newPrice if it exists, otherwise price
      };

      const resp = await fetch(
        `${dev}/vehicleIN/vehicle-entry`, // API endpoint for vehicle entry
        {
          method: "POST",
          body: JSON.stringify(payload), // Send only the required fields
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );

      const result = await resp.json(); // Parse the response JSON

      // Check if response is not OK (status code other than 200-299)
      if (!resp.ok) {
        toast.error(result.message || "Failed, please re-check data"); // Show error message in toast
        return; // Exit if vehicle entry creation failed
      }

      toast.success("Price added successfully");
      handleClose();
      getDataByStatus();
    } catch (error) {
      console.log("add pricing failed", error.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const updatePricing = async () => {
    if(!addPriceFormData.newPrice){
        return toast.error('Please Add New Price ')
    }
    if(!addPriceFormData.detension){
      return toast.error('Please Select Detension')
    }
    const newPrice = parseFloat(addPriceFormData.newPrice);
    const oldPrice = parseFloat(addPriceFormData.oldPrice);
    
    if (addPriceFormData.detension === 'true') {  // Increase scenario
        // Check if the new price is less than or equal to the old price
        if (newPrice <= oldPrice) {
            return toast.error('You cannot set a new price less than or equal to the old price. Please enter a higher amount.');
        }
    } else {  // Decrease scenario
        // Check if the new price is greater than or equal to the old price
        if (newPrice >= oldPrice) {
            return toast.error('You cannot set a new price greater than or equal to the old price. Please enter a lower amount.');
        }
    }

    if(addPriceFormData.newPrice && !addPriceFormData.reason){
      return toast.error('Please Add Reason')
    }
    
    
    // Create a new object to send to the server
    const dataToSend = {
      ...addPriceFormData, // Spread the existing data
      price: addPriceFormData.newPrice, // Set price to newPrice or fallback to original price
    };

    // Remove the newPrice key
    delete dataToSend.newPrice;

    // Optionally, log the modified data object
    //   console.log("Data to send:", dataToSend);

    try {
      setLoading(true);
      const resp = await fetch(
        `${dev}/vehicleIN/vehicle-entry`, // API endpoint for vehicle entry
        {
          method: "POST",
          body: JSON.stringify(dataToSend), // Send form data as JSON
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );

      const result = await resp.json(); // Parse the response JSON

      console.log("update pricing reuslt", result);
      // Check if response is not OK (status code other than 200-299)
      if (!resp.ok) {
        toast.error(result.message || "Failed, update price"); // Show error message in toast
        return; // Exit if vehicle entry creation failed
      }
      toast.success("price updated sucessfully");
      handleClose();
      getDataByStatus();
    } catch (error) {
      console.log("update pricing failed", error.message);
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs" // Set a smaller max-width for the popup
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "5px", // Add border-radius to the Dialog
        //   border: "2px solid green",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center", // Center the title
          fontSize: "24px",
          fontWeight: "bold",
          fontFamily: "sans-serif",
          color: "#e20000",
        }}
      >
        {updateMode ? "Update Pricing" : "Add Pricing"}
      </DialogTitle>

      <DialogContent>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2} direction="column">
            {/* Read-only field for displaying the vehicle number */}
            <Grid item sx={{ marginBottom: "16px", marginTop: "10px" }}>
              <TextField
                label="Vehicle Number"
                value={addPriceFormData.vehicleNo}
                readOnly:true
                // InputProps={{ readOnly: true }}
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "4px", // Input border-radius
                    backgroundColor: "#ececec", // Background color for inputs
                    marginTop: "0px",
                  },
                  "& .MuiFormLabel-root": {
                    // Label styling
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#5c6bc0",
                  },
                  marginBottom: "12px",
                }}
              />
            </Grid>

            {/* Input field for adding a new price */}
            <Grid item sx={{ marginBottom: "16px" }}>
              <TextField
                label={vehicleData.price ? "Previous Price" : "Price"} // Change label based on vehicleData.price
                name="price"
                disabled={!!vehicleData.price} // Make the field read-only if price exists
                placeholder="Enter price" // Add placeholder text for new price
                value={addPriceFormData.price || vehicleData.price || ""} // Display the existing price if available
                onChange={handlePriceChange}
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupee />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-input::placeholder": {
                    // Placeholder styling
                    color: "#9e9e9e",
                    fontSize: "14px",
                    fontWeight: "400",
                  },
                }}
              />
            </Grid>

            {/* Conditionally render additional fields if pricing is available */}
            {updateMode && (
              <>
                <Grid item sx={{ marginBottom: "16px" }}>
                  <RadioGroup
                    row
                    value={addPriceFormData.detension}
                    onChange={handlePriceChange}
                  >
                    <FormControlLabel
                      name="detension"
                      value="true"
                      control={<Radio />}
                      label="Increase"
                      sx={{
                        "& .MuiTypography-root": {
                          fontSize: "14px",
                          fontWeight: "500",
                        },
                      }}
                    />
                    <FormControlLabel
                      name="detension"
                      value="false"
                      control={<Radio />}
                      label="Decrease"
                      sx={{
                        "& .MuiTypography-root": {
                          fontSize: "14px",
                          fontWeight: "500",
                        },
                      }}
                    />
                  </RadioGroup>
                </Grid>

                <Grid item sx={{ marginBottom: "16px" }}>
                  <TextField
                    label="New Price"
                    name="newPrice"
                    placeholder="Enter New Price"
                    value={addPriceFormData.newPrice}
                    onChange={handlePriceChange}
                    type="number"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "4px",
                        backgroundColor: "#f0f0f0",
                      },
                      "& .MuiFormLabel-root": {
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#5c6bc0",
                      },
                      marginBottom: "12px",
                    }}
                  />
                </Grid>

                <Grid item sx={{ marginBottom: "16px" }}>
                  <TextareaAutosize
                    name="reason"
                    label="reason for adjustment"
                    minRows={3}
                    disabled={!addPriceFormData.newPrice}
                    placeholder="Reason for adjustment"
                    value={addPriceFormData.reason}
                    onChange={handlePriceChange}
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      padding: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #ccc",
                      marginBottom: "12px",
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        // border:'2px solid red',
        display:'flex',
        justifyContent:'center',
        alignItems:'center  '
      }}>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "#d32f2f", // Red color for cancel
            color: "#fff",
            "&:hover": {
              backgroundColor: "#7c4343", // Darker red on hover
            },
            borderRadius: "4px",
            padding: "6px 24px",
            fontSize: "15px",
            textTransform: "capitalize",
            fontFamily: "serif",
            fontWeight: "600",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={updateMode ? updatePricing : addPricing}
          disabled={loading} // Disable button when loading is true
          sx={{
            backgroundColor: "#050505", // Green color for add/update
            color: "#fff",
            "&:hover": {
              backgroundColor: "#494b49", // Darker green on hover
            },
            borderRadius: "4px",
            padding: "6px 24px",
            fontSize: "15px",
            textTransform: "capitalize",
            fontFamily: "serif",
            fontWeight: "600",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" /> // Show spinner when loading
          ) : updateMode ? (
            "Update Price"
          ) : (
            "Add Price"
          ) // Show button text when not loading
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPricing;
