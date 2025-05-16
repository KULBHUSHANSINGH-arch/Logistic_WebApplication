import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Menu,
  CircularProgress,
  IconButton,
  Checkbox,
  ListItemText,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/logo.png";
import { dev } from "../../utils/ApiUrl";

function EditVehicle({ isOpen, setOpenEditPopup, data, getDataByStatus }) {
  console.log("single data", data);
  const { user } = useSelector((state) => state.user);
  const [vehicleTypes, setVehicleType] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [salesPersonList, setSalesPersonList] = useState([]);
  const [piList, setPiList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // Control dropdown open/close state // Control dropdown open/close state
  // Handle opening and closing the dropdown manually
  // Handle opening the dropdown manually

  const [transpotterList, setTranspotterList] = useState([]);
  const [hasMounted, setHasMounted] = useState(false); // New state to track mounting
  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleNo: "",
    vehicleType: "",
    PinCode: "",
    transpotterName: "",
    partyName: "",
    driverNumber: "",
    currentUser: "",
    image: "",
    workLocation: user?.workLocation,
    // deliveryId: "",
    deliveryId: [], // Change this to an array
    salesPerson: "",
    salesOrderId: [],
  
  });
  const [tempSelectedPi, setTempSelectedPi] = useState(formData.pi || []); // Temporary state for selection

  // console.log("salesPersonList", salesPersonList);
  // console.log("piList", piList);

  console.log("formData", formData);



  

  const fetchPartyList = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/party/getParty`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!resp.ok) {
        toast.error("Party list fetching failed");
        return;
      }
      const data = await resp.json();
      setPartyList(data.data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchTranspotterList = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/transporter/getTransporter`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!resp.ok) {
        toast.error("Transporter list fetching failed");
        return;
      }
      const data = await resp.json();
      setTranspotterList(data.data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const resp = await fetch(`${dev}/vehicle/vehicle-types`, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (!resp.ok) {
        return;
      }
      setVehicleType(data.vehicleTypes);
    } catch (error) {
      toast.error("Fetching vehicle types failed");
    }
  };

  const deliveryAddressOfParty = async () => {
    if (!formData.partyName) return;
    try {
      const resp = await fetch(`${dev}/party/getDeliveryAddByPartyName`, {
        method: "POST",
        body: JSON.stringify({ PartyNameId: formData.partyName }),
        headers: {
          "content-type": "application/json",
        },
      });
      const result = await resp.json();
      if (!resp.ok) {
        setDeliveryList([]);
        return toast.error("delivery address not found");
      }
      setDeliveryList(result.data);
    } catch (error) {
      toast.error("Fetching delivery address failed");
    }
  };
  const fetchSalesPersnLists = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/user/getSalesPersons`, {
        method: "POST",
        // body: JSON.stringify({ personId: user.personId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        toast.error("Sales Person list fetching failed");
        return;
      }
      const data = await resp.json();
      setSalesPersonList(data.allList);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const getPiListForSalesPerson = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/sales/getPiNumbersBySalesPerson`, {
        method: "POST",
        body: JSON.stringify({
          salesPerson: formData.salesPerson,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        toast.error("PI list fetching failed");
        return;
      }
      const data = await resp.json();
      setPiList(data.piNumbers);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesPersnLists();
    fetchVehicleTypes();
    fetchPartyList();
    fetchTranspotterList();
  }, []);

  // callimng delivery address for aprty and also pi for sales person after select both values--------
  useEffect(() => {
    if (formData.partyName) {
      deliveryAddressOfParty();
    }
    if (formData.salesPerson) {
      getPiListForSalesPerson();
    }
  }, [formData.partyName, formData.salesPerson]);

  useEffect(() => {
    // console.log('piList',piList)
    // Set form data only if the fields are initially empty
    setFormData((prevFormData) => ({
      ...prevFormData,
    
      vehicleId: prevFormData.vehicleId || data.id || "",
      PinCode: prevFormData.PinCode || data.PinCode || "",
      vehicleNo: prevFormData.vehicleNo || data.vehicleNo || "",
      vehicleType: prevFormData.vehicleType || data.vehicleTypeName || "",
      salesPerson: prevFormData.salesPerson || data.salesPerson || "",
      location: prevFormData.location || data.location || "",
      transpotterName:
        prevFormData.transpotterName ||
        transpotterList?.find(
          (t) => t.TransporterNameId === data.transpotterName
        )?.TransporterNameId ||
        "",
      partyName:
        prevFormData.partyName ||
        partyList?.find((p) => p.PartyNameId === data.partyName)?.PartyNameId ||
        "",
      transferFrom: prevFormData.transferFrom || data.transferFrom || "",
      driverNumber: prevFormData.driverNumber || data.driverNumber || "",
      currentUser:
        prevFormData.currentUser || localStorage.getItem("currentUser"),
      image: prevFormData.image || data.vehicleImg || null,
      salesOrderId: piList
        .filter(
          (pi) =>
            data.salesOrderId?.length !== 0 &&
            data.salesOrderId.includes(pi.salesOrderId)
        )
        .map((pi) => pi.salesOrderId),

      // deliveryId:
      //   deliveryList?.find((d) => d.deliveryId === data.deliveryId)
      //     ?.deliveryId || "",
      deliveryId: deliveryList
        .filter((delivery) =>
          data.deliveryId?.length !== 0 && data?.deliveryId?.includes(delivery.deliveryId)
        )
        .map((delivery) => delivery.deliveryId),
    }));
    setTempSelectedPi(
      piList
        .filter(
          (pi) =>
            data.salesOrderId?.length !== 0 &&
            data.salesOrderId.includes(pi.salesOrderId)
        )
        .map((pi) => pi.salesOrderId)
    );
  }, [data, transpotterList, piList, partyList, deliveryList, salesPersonList]);

  // handle change for edit -------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "deliveryId") {
      // Handle multi-select for deliveryId
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Create a new error object based on current form data
    const newErrors = { ...errors };

    // Clear specific errors if their corresponding fields have values
    if (name === "vehicleNo" && value) {
      delete newErrors.vehicleNo;
    }
    if (name === "salesPerson" && value) {
      delete newErrors.salesPerson;
    }
    if (name === "PinCode" && value) {
      // Check if PinCode is numeric and 6 digits long
      if (!/^\d{6}$/.test(value)) {
        newErrors.PinCode = "Pin Code must be exactly 6 digits";
      } else {
        delete newErrors.PinCode;
      }
    }
    if (name === "driverNumber") {
      // Check if the driver number is numeric and 10 digits long
      if (!/^\d{10}$/.test(value)) {
        newErrors.driverNumber = "Driver Number must be exactly 10 digits";
      } else {
        delete newErrors.driverNumber;
      }
    }
    if (name === "vehicleType" && value) {
      delete newErrors.vehicleType;
    }
    if (name === "partyName" && value) {
      delete newErrors.partyName;
    }
    if (name === "location" && value) {
      delete newErrors.location;
    }
    if (name === "transpotterName" && value) {
      delete newErrors.transpotterName;
    }
    if (name === "deliveryId" && value) {
      delete newErrors.deliveryId; // Clear error when a value is selected
    }

    // Update error state
    setErrors(newErrors);
  };

  // handle sumbit fopr edit--------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Check for required fields and populate newErrors
    if (!formData.vehicleNo) {
      newErrors.vehicleNo = "Vehicle number is required";
    }
    // if (formData.salesOrderId?.length === 0) {
    //   newErrors.salesOrderId = "PI  Number is required";
    // }
    // if (!formData.salesPerson) {
    //   newErrors.salesPerson = "Sales Person is required";
    // }
    if (!formData.PinCode) {
      newErrors.PinCode = "Pin Code is required";
    } else if (!/^\d{6}$/.test(formData.PinCode)) {
      newErrors.PinCode = "Pin Code must be exactly 6 digits and numeric";
    }
    if (!formData.driverNumber) {
      newErrors.driverNumber = "Driver Number is required";
    } else if (!/^\d{10}$/.test(formData.driverNumber)) {
      newErrors.driverNumber =
        "Driver Number must be exactly 10 digits and numeric";
    }
    if (!formData.vehicleType) {
      newErrors.vehicleType = "Vehicle type is required";
    }
    if (!formData.partyName) {
      newErrors.partyName = "Party name is required";
    }
    if (!formData.transpotterName) {
      newErrors.transpotterName = "Transporter name is required";
    }
    if (formData.partyName && formData.deliveryId?.length == 0) {
      newErrors.deliveryId = "Delivery address is required";
    }


    const typeId = vehicleTypes.find(
      (type) => type.vehicleTypeName === formData.vehicleType
    );

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      return; // Prevent form submission if there are errors
    }

    // console.log("submitting form data", formData);
    try {
      setLoading(true);
      let payload ={
        vehicleId: formData.vehicleId,
        vehicleNo: formData.vehicleNo,
        vehicleType: typeId.vehicleTypeId,
        location: formData.location,
        transpotterName: formData.transpotterName,
        partyName: formData.partyName,
        driverNumber: formData.driverNumber,
        currentUser: formData.currentUser,
        workLocation: user?.workLocation,
        deliveryId: formData.deliveryId,
        salesOrderId: data && data.piNo ? data?.salesOrderId : formData.salesOrderId,
        PinCode: formData.PinCode,
        salesPerson: formData.salesPerson,
      }
      // console.log('payload: ' + JSON.stringify(payload))
      
      const response = await fetch(`${dev}/vehicleIN/vehicle-entry`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Updating failed");
        setLoading(false);
        return;
      }
      setLoading(false);
      toast.success(result.message || "Updated successfully");
      setOpenEditPopup(false);
      getDataByStatus();
      // Reset form fields after successful submission
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  // Handle selection change
  const handleTempChange = (event) => {
    const {
      target: { value },
    } = event;

    const newSelectedIds = typeof value === "string" ? value.split(",") : value; // Update temporary selection

    // Update formData and remove error if there's a selection
    setTempSelectedPi(newSelectedIds); // Update temporary selection
    setFormData((prevFormData) => ({
      ...prevFormData,
      salesOrderId: newSelectedIds, // Update formData.salesOrderId
    }));

    // Remove error if any salesOrderId is selected
    if (newSelectedIds.length > 0) {
      setErrors((prevErrors) => {
        const { salesOrderId, ...rest } = prevErrors; // Destructure to remove salesOrderId
        return rest; // Return new errors without salesOrderId
      });
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpenEditPopup(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <img
          src={logo}
          alt="Logo"
          style={{ display: "block", margin: "0 auto", maxWidth: "150px" }}
        />

        <FaTimes
          className="close-icon text-red-500"
          onClick={() => setOpenEditPopup(false)}
          style={{ float: "right", cursor: "pointer" }}
        />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vehicle Number"
                name="vehicleNo"
                value={formData.vehicleNo}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                disabled
                error={!!errors.vehicleNo}
                helperText={errors.vehicleNo}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vehicle Type"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                select
                error={!!errors.vehicleType}
                helperText={errors.vehicleType}
              >
                <MenuItem value="" disabled>
                  Select Vehicle Type
                </MenuItem>
                {vehicleTypes.map((type) => (
                  <MenuItem
                    key={type.vehicleTypeId}
                    value={type.vehicleTypeName}
                  >
                    {type.vehicleTypeName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pin Code"
                name="PinCode"
                value={formData.PinCode}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                error={!!errors.PinCode}
                helperText={errors.PinCode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Driver Number"
                name="driverNumber"
                value={formData.driverNumber}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                error={!!errors.driverNumber}
                helperText={errors.driverNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Party Name"
                name="partyName"
                value={formData.partyName}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                select
                error={!!errors.partyName}
                helperText={errors.partyName}
              >
                <MenuItem value="" disabled>
                  Select Party
                </MenuItem>
                {partyList.map((party) => (
                  <MenuItem key={party.PartyNameId} value={party.PartyNameId}>
                    {party.PartyName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* SalesPerson Dropdown */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sales Person"
                name="salesPerson"
                value={formData.salesPerson}
                onChange={handleChange}
                fullWidth
                margin="dense"
                disabled={data.salesPerson}
                required
                select
                error={!!errors.salesPerson}
                helperText={errors.salesPerson}
              >
                <MenuItem value="" disabled>
                  Select Sales Person
                </MenuItem>
                {salesPersonList.map((person) => (
                  <MenuItem key={person.personId} value={person.personId}>
                    {person.userName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Multi-Select Pi List Dropdown */}
            {formData.salesPerson && data && !data.piNo && (
              <Grid item xs={12} sm={6}>
                {/* Simple Multiple Select Dropdown */}
                <TextField
                  label="Select PI Number"
                  name="salesOrderId"
                  select
                  value={tempSelectedPi}
                  fullWidth
                  margin="dense"
                  error={!!errors.salesOrderId}
                  helperText={errors.salesOrderId}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      selected
                        .map(
                          (piId) =>
                            piList.find((pi) => pi.salesOrderId === piId)?.piNo
                        )
                        .join(", "), // Display selected values as comma-separated
                  }}
                  onChange={handleTempChange} // Handle selection change
                >
                  {/* Render available PI options */}
                  {piList.map((pi) => (
                    <MenuItem key={pi.salesOrderId} value={pi.salesOrderId}>
                      <Checkbox
                        checked={tempSelectedPi.indexOf(pi.salesOrderId) > -1}
                      />
                      <ListItemText primary={pi.piNo} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {formData.salesPerson && data && data.piNo && (
              <Grid item xs={12} sm={6}>

                <TextField
                  label="Enter PI Numbers"
                  name="salesOrderId"
                  value={data.piNo}
                  fullWidth
                  margin="dense"
                  disabled
                />
              </Grid>
            )}

            {/* {formData.partyName && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Delivery Address"
                  name="deliveryId"
                  value={formData.deliveryId}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  required
                  select
                  error={!!errors.deliveryId}
                  helperText={errors.deliveryId}
                >
                  <MenuItem value="" disabled>
                    Select Delivery Address
                  </MenuItem>
                  {deliveryList.map((delivery) => (
                    <MenuItem
                      key={delivery.deliveryId}
                      value={delivery.deliveryId}
                    >
                      {${delivery.Address}}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )} */}
            {formData.partyName && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Delivery Address"
                  name="deliveryId"
                  value={formData.deliveryId} // This should be an array of selected delivery IDs
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  required
                  select
                  error={!!errors.deliveryId}
                  helperText={errors.deliveryId}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => {
                      // Render all selected addresses
                      return (
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {selected.map((value) => {
                            const delivery = deliveryList.find(
                              (del) => del.deliveryId === value
                            );
                            return (
                              <div
                                key={value}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  margin: "2px",
                                  padding: "2px 4px",
                                  backgroundColor: "#e0e0e0",
                                  borderRadius: "4px",
                                }}
                              >
                                {delivery ? delivery.Address : value}
                                <IconButton
                                  size="small"
                                  onClick={(event) => {
                                    event.stopPropagation(); // Prevent closing the select menu
                                    setFormData((prev) => ({
                                      ...prev,
                                      deliveryId: prev.deliveryId.filter(
                                        (id) => id !== value
                                      ),
                                    }));
                                  }}
                                  style={{ marginLeft: "4px" }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </div>
                            );
                          })}
                        </div>
                      );
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Delivery Address
                  </MenuItem>
                  {deliveryList.map((delivery) => (
                    <MenuItem
                      key={delivery.deliveryId}
                      value={delivery.deliveryId}
                    >
                      {`${delivery.Address}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}


            <Grid item xs={12} sm={6}>
              <TextField
                label="Transporter Name"
                name="transpotterName"
                value={formData.transpotterName}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                select
                error={!!errors.transpotterName}
                helperText={errors.transpotterName}
              >
                <MenuItem value="" disabled>
                  Select Transporter
                </MenuItem>
                {transpotterList.map((transporter) => (
                  <MenuItem
                    key={transporter.TransporterNameId}
                    value={transporter.TransporterNameId}
                  >
                    {transporter.TransporterName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          


          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenEditPopup(false)} color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditVehicle;