import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import IconButton from "@mui/material/IconButton";

import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import "../Add_Party/table.css";
import Map from "../Map";
import { FaMapMarkerAlt, FaCopy } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import dayjs from "dayjs"; // For date manipulation
import { Tooltip } from "@mui/material";
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as Buton,
} from "@mui/material";
import { useSelector } from "react-redux";
// import { Button } from "@mui/material";

const formatDateWithMonthNameAndTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return "Invalid Date";
  }

  const day = date.getDate();
  const year = date.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];

  // Check if the date string includes time information
  if (dateString?.includes("T")) {
    // Get time components in 12-hour format and determine AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, display as 12

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  } else {
    // Return only the date if no time is provided
    return `${day} ${month} ${year}`;
  }
};

// Function to format the date
const formatDeliveryDate = (date) => {
  if (!date || !dayjs.isDayjs(date)) {
    return null; // If the date is invalid or not a Day.js object, return null
  }

  // Format the date to DD-MM-YYYY HH:mm
  return date.format("DD-MM-YYYY HH:mm");
};

// console.log(formatDateWithMonthName(date));

const DeliveryProcessListTable = () => {
  const { user } = useSelector((state) => state.user);
  const [vehicleList, setVehicleList] = useState([]);
  const [filteredVehicleList, setFilteredVehicleList] = useState(vehicleList);

  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMap, setMap] = useState(false);
  const [mapData, setMapData] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [selectDeliveryDate, setSelectDeliveryDate] = useState(null);
  const [touched, setTouched] = useState(false);

  // confirmation popup----
  const [openConfirmationPopup, setOpenConfirmationPopup] = useState(false);
  const [confirmationPopupData, setConfirmationPopupData] = useState([]);
  console.log("confirm modal data", confirmationPopupData);
  const handleOpen = () => {
    setOpenConfirmationPopup(true);
  };
  console.log("list", vehicleList);

  const handleClose = () => {
    setSelectDeliveryDate(null); // Clear the date field
    setTouched(false); // Reset the error state
    setOpenConfirmationPopup(false); // Close the popup
  };

  // seaarhc function ------------------------
  const searchInData = (data, inputValue) => {
    // Normalize the input: trim whitespace, convert to lowercase, and remove extra spaces
    const normalizedInputValue = inputValue
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    // If input is empty or only spaces, return all data
    if (!normalizedInputValue) return [...data];

    // Filter through the data
    return [...data].filter((item) => {
      // Check each item and iterate over its keys (properties)
      return Object.keys(item).some((key) => {
        const value = item[key]; // Get the value of the current property

        // Skip null, undefined, or object types (because we can't search them)
        if (value === null || value === undefined || typeof value === "object")
          return false;

        // Normalize the value: convert to string, remove extra spaces, and make lowercase
        const normalizedValue = value
          .toString()
          .replace(/\s+/g, "")
          .trim()
          .toLowerCase();

        // Check if the value contains the normalized input anywhere
        return normalizedValue.includes(normalizedInputValue);
      });
    });
  };

  const handleGloBalSearchInput = (e) => {
    const inputValue = e.target.value;
    setGlobalFilter(inputValue); // Update global filter

    if (inputValue) {
      const filteredData = searchInData(vehicleList, inputValue);
      setFilteredVehicleList(filteredData); // Set filtered list separately
    } else {
      setFilteredVehicleList(vehicleList); // If input is cleared, show the full list
    }
  };

  // function to end trip--------
  const tripEnd = async () => {
    try {
      setLoading(true);
      const username = "Gautamsolar"; // Replace with your actual username
      const password = "Gautamsolar@123"; // Replace with your actual password
  
      // Encode the credentials in Base64 for Basic Authentication
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);
  
      const resp = await fetch(`https://dashboard.traqo.in/api/v3/trip/end/`, {
        method: "POST",
        body: JSON.stringify({
          id: confirmationPopupData.tripId,
        }),
        headers: {
          "content-type": "application/json",
          "Authorization": authHeader, // Use the encoded credentials here
        },
      });
  
      const data = await resp.json();
      console.log("trip end res", data);
      
      if (!resp.ok) {
        setLoading(false);
        toast.error(data.status || "Trip Ending Failed");
        return;
      }
  
      toast.success(data.status || "Trip Ended Successfully!");
      handleClose();
    } catch (error) {
      console.log("trip end", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirm = async () => {
    try {
      if (!selectDeliveryDate) {
        setTouched(true); // Trigger the error state for the date field
        return; // Show error toast
      }

      setLoading(true);

      const resp = await fetch(`${dev}/vehicleIN/updateTransportStatus`, {
        method: "POST",
        body: JSON.stringify({
          status: "DELIVERED",
          vehicleId: confirmationPopupData.vehicleId,
          personId: user.personId,
          deliveryTime: formatDeliveryDate(selectDeliveryDate),
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await resp.json();
      if (!resp.ok) {
        setLoading(false);

        toast.error(data.message || "Failed");
        return;
      }

      toast.success(data.message || "Delivered Successfully!");
      
      setOpenConfirmationPopup(false);
      handleClose();
      tripEnd();
      await getDataByStatus(); // Fetch the updated data

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getDataByStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${dev}/vehicleIN/getvehicleListStatus`, {
        method: "POST",
        body: JSON.stringify({
          status: "OUT",
          workLocation: "ALL",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      console.log("data for delivery", result);
      if (!response.ok) {
        setError(result.message);
        setLoading(false);
        toast.error(result.message);
        return;
      }
      setLoading(false);

      // deliveryId"[]"
      // tripId
      // outTime

      let filterDataWithoutNull = result.data?.filter((d) => d !== null);
      const filteredData = filterDataWithoutNull.filter(
        (d) =>
          d?.tripId !== null &&
          d?.tripId !== "" &&
          d?.outTime !== null &&
          d?.outTime !== ""
        //  d?.deliveryId !== null &&
        // d?.deliveryId !== "" &&
        // d?.deliveryId !== "[]"
      );

      setVehicleList(filteredData);

      setFilteredVehicleList(
        globalFilter ? searchInData(filteredData, globalFilter) : filteredData
      );
    } catch (error) {
      console.log("error in stuats", error);
      setError("error ocuuring", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataByStatus();
  }, []);

  const exportExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Vehicle Details");

    // Add column headers
    worksheet.columns = [
      { header: "Vehicle Number", key: "vehicleNo", width: 20 },
      { header: "Party Name", key: "PartyName", width: 30 },
      { header: "Transporter Name", key: "TransporterName", width: 30 },
      { header: "Delivery Address", key: "Address", width: 40 },
      { header: "Out From", key: "workLocationName", width: 30 },
      { header: "Delivery Status", key: "deliveryStatus", width: 20 },
      { header: "Out Date And Time", key: "resultDate", width: 30 },
      { header: "Expected Date", key: "expectedDeliveryDate", width: 30 },
      { header: "Total Distance", key: "roadDistance", width: 20 },
      { header: "Remaining Distance", key: "remainingDistance", width: 20 },
    ];

    // Add rows from vehicleList
    vehicleList.forEach((vehicle) => {
      worksheet.addRow({
        vehicleNo: vehicle.vehicleNo,
        PartyName: vehicle.PartyName,
        TransporterName: vehicle.TransporterName,
        Address: vehicle.Address,
        workLocationName: vehicle.workLocationName,
        deliveryStatus: vehicle.deliveryStatus,
        resultDate: convertToIST(vehicle.resultDate),
        expectedDeliveryDate: vehicle.expectedDeliveryDate,
        roadDistance: vehicle.roadDistance,
        remainingDistance: vehicle.remainingDistance,
      });
    });

    // Style the header row
    worksheet.getRow(1).font = {
      bold: true,
      size: 14,
      color: { argb: "FFFFFFFF" },
    };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getRow(1).height = 35;
    // Export the workbook as Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Delivery_Status_Tracking.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const renderHeader = () => {
    return (
      <div className="  w-full " style={{ width: "100%", padding: "10px" }}>
        <div
          className="row align-items-center"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            className="col-md-7"
            style={{ display: "flex", alignItems: "center" }}
          >
            <span
              className="p-input-icon-left"
              style={{ display: "flex", alignItems: "center" }}
            >
              <InputText
                style={{
                  border: "1px solid black",
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                }}
                type="search"
                value={globalFilter} // Bind input value to globalFilter
                onInput={handleGloBalSearchInput} // Update globalFilter on input change
                placeholder="Search...."
              />
            </span>
          </div>
          <div
            className="col-md-5 "
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              label="Export"
              icon="pi pi-file-excel"
              className="p-button-success export-button custom-button"
              onClick={exportExcel}
            />
            {/* <Tooltip target=".plus" content="Add New Party" position="top" className="custom-tooltip" /> */}
          </div>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  function handleAction(rowData) {
    // console.log("Action clicked for:", rowData);
    setMapData(rowData);
    setConfirmationPopupData(rowData);
    setMap(true);
  }
  // Function to copy text to clipboard
  const copyToClipboard = (address) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          setOpenSnackbar(true); // Show snackbar on success
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          // Optional: Notify user that copying failed
          toast.error("Copying failed. Please try again.");
        });
    } else {
      console.error("Clipboard API not supported or secure context required");
      // Optional: Provide a fallback
      toast.error("Clipboard functionality is not supported in this browser.");
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="datatable-filter-demo w-full">
      {loading && (
        <div className="w-full flex justify-center items-center">
          <ClipLoader color="#e04816" loading={loading} size={50} />
        </div>
      )}

      {!loading && (
        <div className="card w-full ">
          <DataTable
            value={filteredVehicleList}
            paginator
            rows={50}
            rowsPerPageOptions={[5, 10, 15, 20, 50]}
            scrollable
            scrollHeight="60vh"
            header={header}
            emptyMessage="No items found."
          >
            <Column
              field="vehicleNo"
              header="Vehicle Number"
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              field="PartyName"
              header="Party Name"
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              field="TransporterName"
              header="Transporter Name"
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              field="Address"
              header="Delivery Address"
              body={(rowData) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span>{rowData.Address}</span>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent tooltip from closing
                            copyToClipboard(rowData.Address);
                          }}
                          style={{ marginLeft: "8px" }}
                        >
                          <FaCopy size={16} color="white" />
                        </IconButton>
                      </div>
                    }
                    arrow
                  >
                    <span
                      style={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "12px",
                        padding: "4px 8px",
                      }}
                    >
                      {rowData?.Address?.substring(0, 20)}...
                    </span>
                  </Tooltip>
                </div>
              )}
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              field="workLocationName"
              header="Out From"
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              field="deliveryStatus"
              header="Delivery Status"
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              field="resultDate"
              header="Out Date And Time"
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
              body={(rowData) =>
                formatDateWithMonthNameAndTime(rowData.resultDate)
              }
            />
            <Column
              field="expectedDeliveryDate"
              header="Expected Delivery Date"
              body={(rowData) =>
                formatDateWithMonthNameAndTime(rowData.expectedDeliveryDate)
              }
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              field="roadDistance"
              header="Total Distance"
              body={(rowData) => `${Math.floor(rowData.roadDistance)} km`}
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              field="remainingDistance"
              header="Remaining Distance"
              body={(rowData) => `${Math.floor(rowData.remainingDistance)} km`}
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              header="Location"
              body={(rowData) => (
                <Tooltip title="See map">
                  <button
                    onClick={() => {
                      handleAction(rowData);
                    }}
                    style={{ background: "none", border: "none" }}
                  >
                    <FaMapMarkerAlt
                      size={20}
                      color="blue"
                      className="text-center"
                    />
                  </button>
                </Tooltip>
              )}
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
            <Column
              header="Action"
              body={(rowData) => (
                <Buton
                  onClick={() => {
                    handleOpen(rowData);
                    setConfirmationPopupData(rowData);
                  }}
                  variant="contained" // Makes the button have a filled background
                  color="error" // Red color to signify action (danger/delivered)
                  size="small" // Make the button small
                  sx={{
                    fontSize: "12px", // Slightly smaller text for a small button
                    color: "#fff", // White text to contrast the red background
                    backgroundColor: "#f73a3a", // Soft red background
                    fontWeight: "bold", // Make the text bold
                    textTransform: "none", // Keep the text as-is (no uppercase)
                    borderRadius: "8px", // Round the corners slightly
                    padding: "4px 10px", // Compact padding to keep the button small
                    "&:hover": {
                      backgroundColor: "#d32f2f", // Darker red on hover
                    },
                  }}
                >
                  Delivered
                </Buton>
              )}
              style={{
                border: "0.5px dotted black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                padding: "4px 8px",
              }}
            />
          </DataTable>

          {/* Snackbar for copy confirmation */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity="success"
              elevation={6}
              variant="filled"
            >
              Address copied to clipboard!
            </MuiAlert>
          </Snackbar>
        </div>
      )}
      {isMap && (
        <Map
          handleClose={() => setMap(false)}
          open={isMap}
          vehicleList={mapData}
        />
      )}
      {openConfirmationPopup && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {openConfirmationPopup && (
            <Dialog
              open={openConfirmationPopup}
              onClose={handleClose}
              PaperProps={{
                style: {
                  padding: "20px",
                  maxWidth: "450px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#333",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {confirmationPopupData && confirmationPopupData.vehicleNo}
              </DialogTitle>

              <DialogContent>
                <DialogContentText
                  sx={{
                    fontSize: "1.1rem",
                    color: "#e29090",
                    textAlign: "center",
                    marginBottom: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Is This Vehicle Delivered?
                </DialogContentText>

                {/* Date Picker */}
                <DatePicker
                  label="Delivery Date"
                  value={selectDeliveryDate}
                  onChange={(date) => {
                    setSelectDeliveryDate(date);
                    setTouched(true); // Mark as touched once a date is selected
                  }}
                  maxDate={dayjs()} // Restrict future dates
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={touched && !selectDeliveryDate} // Show red border if no date is selected and touched
                      onBlur={() => setTouched(true)} // Mark as touched when the field loses focus
                      helperText={
                        touched && !selectDeliveryDate
                          ? "Delivery date is required"
                          : ""
                      } // Display error message
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                            borderColor: "red", // Set the border color to red when error
                          },
                        },
                      }}
                    />
                  )}
                />

                {/* Error message container with fixed height */}
                <div style={{ height: "20px" }}>
                  {touched && !selectDeliveryDate && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "14px",
                        textTransform: "capitalize",
                        textAlign: "center",
                      }}
                    >
                      Delivery date is required
                    </span>
                  )}
                </div>
              </DialogContent>

              <DialogActions
                sx={{
                  justifyContent: "between",
                }}
              >
                <Buton
                  onClick={handleClose}
                  variant="outlined"
                  sx={{
                    color: "#555",
                    borderColor: "#ff0000",
                    fontSize: "1rem",
                    fontWeight: "500",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#888",
                      backgroundColor: "#f0f0f0",
                    },
                    marginRight: "10px",
                  }}
                >
                  Cancel
                </Buton>

                <Buton
                  onClick={handleConfirm}
                  variant="contained"
                  color="error"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#c62828",
                    },
                  }}
                  autoFocus
                  disabled={error} // Disable the button if there's an error
                >
                  Delivered
                </Buton>
              </DialogActions>
            </Dialog>
          )}
        </LocalizationProvider>
      )}
    </div>
  );
};

export default DeliveryProcessListTable;
