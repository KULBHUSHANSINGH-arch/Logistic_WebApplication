import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import PartyDropdown from "../Add_Party/PartyDropdown";
import TranspoterDropdown from "../Transporter/TranspoterDropdown";
import { useSelector } from "react-redux";

function DateFilterPopup({
  handleClose,
  setFilteredData,
  setVehicleList,
  setDateRange,
  setStatus,
  selectedLocationId,
  changeStatusWithoutApiCall,
}) {
  const { user } = useSelector((state) => state.user);




  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    status: "ALL", // Default status
    partyName: "",
    transpotterName: "",
    workLocation: selectedLocationId,
  });
  console.log('form data', formData)

  const [errors, setErrors] = useState({
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(false);


  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');


  useEffect(() => {
    const department = localStorage.getItem('department');
    const designation = localStorage.getItem('designation');

    setDesignation(designation);
    setDepartment(department);

    console.log('Designation Not Working', designation);
    console.log('Department Not Working', department);

  }, []);








  // Format form data to be sent to the server
  const formatFormData = (data) => ({
    fromDate: data.fromDate ? dayjs(data.fromDate).format("YYYY-MM-DD") : null,
    toDate: data.toDate ? dayjs(data.toDate).format("YYYY-MM-DD") : null,
    status: data.status,
    partyName: data.partyName,
    transpotterName: data.transpotterName,
    workLocation: selectedLocationId,
  });

  const vehicleStatus = [
    { label: "All", value: "ALL" },
    { label: "In", value: "IN" },
    { label: "Transferred", value: "TRANSFERRED" },
    { label: "Loading", value: "LOADING" },
    { label: "Out", value: "OUT" },
    { label: "Pending", value: "PENDING" },
    { label: "Canceled", value: "CANCELED" },
  ];

  const today = dayjs().startOf("day");

  // Disable future dates
  const isDateDisabled = (date) => dayjs(date).isAfter(today, "day");

  // Disable "To Date" before "From Date" and future dates
  const isToDateDisabled = (date) =>
    (formData.fromDate && dayjs(date).isBefore(dayjs(formData.fromDate), "day")) ||
    isDateDisabled(date);

  // Disable "From Date" after "To Date" and future dates
  const isFromDateDisabled = (date) =>
    (formData.toDate && dayjs(date).isAfter(dayjs(formData.toDate), "day")) ||
    isDateDisabled(date);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.fromDate && formData.toDate) {
      newErrors.fromDate = "Select From Date";
      valid = false;
    }

    if (!formData.toDate && formData.fromDate) {
      newErrors.toDate = "Select To Date";
      valid = false;
    }

    if (formData.fromDate && formData.toDate && dayjs(formData.toDate).isBefore(dayjs(formData.fromDate), "day")) {
      newErrors.toDate = "To Date cannot be before From Date";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const formattedData = formatFormData(formData);

    try {
      setLoading(true);
      const response = await fetch(`${dev}/vehicleIN/getVehicleListByDate`, {
        method: "POST",
        body: JSON.stringify(formattedData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }
      console.log('master filter data', result.data)
      setVehicleList(result.data);
      setFilteredData(result.data);
      changeStatusWithoutApiCall(formData.status?.toLowerCase());
      setDateRange({ ...formattedData });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      handleClose(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={true} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle
          style={{
            backgroundColor: "#f5f5f5",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Master Filter Form
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex gap-4">
              <DatePicker
                label="From Date"
                value={formData.fromDate ? dayjs(formData.fromDate) : null}
                onChange={(newDate) => handleChange("fromDate", newDate)}
                shouldDisableDate={isFromDateDisabled}
                inputFormat="DD-MM-YYYY"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.fromDate}
                    helperText={errors.fromDate}
                    InputProps={{ style: { fontSize: 16 } }}
                  />
                )}
              />

              <DatePicker
                label="To Date"
                value={formData.toDate ? dayjs(formData.toDate) : null}
                onChange={(newDate) => handleChange("toDate", newDate)}
                shouldDisableDate={isToDateDisabled}
                inputFormat="DD-MM-YYYY"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.toDate}
                    helperText={errors.toDate}
                    InputProps={{ style: { fontSize: 16 } }}
                  />
                )}
              />
            </div>

            {(designation !== 'Sales Executive' && <PartyDropdown formData={formData} setFormData={setFormData} errors={errors} />)}
            {(designation !== 'Sales Executive' && <TranspoterDropdown formData={formData} setFormData={setFormData} errors={errors} />)}

            <TextField
              select
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
              margin="normal"
              required
              error={!!errors.status}
              helperText={errors.status}
              InputProps={{ style: { fontSize: 16 } }}
            >
              {vehicleStatus.map((status, index) => (
                <MenuItem key={index} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default DateFilterPopup;
