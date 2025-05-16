// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import {
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   CircularProgress,
//   IconButton,
//   Box,
//   Typography,
//   Divider,
// } from "@mui/material";

// import logo from "../../assets/logo.png";
// import { dev } from "../../utils/ApiUrl";

// function VechileER({ isOpen, setOpenEditsPopup, data,getDataByStatus }) {
//   console.log("single data", data);
//   const { user } = useSelector((state) => state.user);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   // State for dynamic invoice and lrNumber fields
//   const [invoiceRows, setInvoiceRows] = useState([
//     { invoiceNo: "", lrNumber: "" }
//   ]);

//   // Basic form data
//   const [formData, setFormData] = useState({
//     vehicleId: "",
//     vehicleNo: "",
//     currentUser: "",
//     workLocation: user?.workLocation,
//   });

//   useEffect(() => {
//     console.log(data,"dataaaaaaa");

//     // Set initial form data
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       vehicleId: prevFormData.vehicleId || data.id || "",
//       vehicleNo: prevFormData.vehicleNo || data.vehicleNo || "",
//       currentUser: prevFormData.currentUser || localStorage.getItem("currentUser"),
//     }));

//     // If data already has invoice rows, initialize with them
//     if (data.invoiceRows && data.invoiceRows.length > 0) {
//       setInvoiceRows(data.invoiceRows);
//     }
//   }, [data]);

//   // Handle adding a new row
//   const handleAddRow = () => {
//     setInvoiceRows([...invoiceRows, { invoiceNo: "", lrNumber: "" }]);
//   };

//   // Handle removing a row
//   const handleRemoveRow = (index) => {
//     const updatedRows = [...invoiceRows];
//     updatedRows.splice(index, 1);
//     setInvoiceRows(updatedRows);
//   };

//   // Handle change for invoice rows
//   const handleInvoiceRowChange = (index, field, value) => {
//     const updatedRows = [...invoiceRows];
//     updatedRows[index][field] = value;
//     setInvoiceRows(updatedRows);

//     // Clear errors for this field if it has a value
//     if (value) {
//       const newErrors = { ...errors };
//       delete newErrors[`${field}_${index}`];
//       setErrors(newErrors);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let newErrors = {};

//     // Validate required fields
//     if (!formData.vehicleNo) {
//       newErrors.vehicleNo = "Vehicle number is required";
//     }

//     // Validate each invoice row
//     invoiceRows.forEach((row, index) => {
//       if (!row.invoiceNo) {
//         newErrors[`invoiceNo_${index}`] = "Invoice number is required";
//       }
//       if (!row.lrNumber) {
//         newErrors[`lrNumber${index}`] = "ER number is required";
//       }
//     });

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length !== 0) {
//       return; // Prevent form submission if there are errors
//     }

//     try {
//       setLoading(true);
//       let payload = {
//         vehicleId: formData.vehicleId,
//         // vehicleNo: formData.vehicleNo,
//         currentUser: formData.currentUser,
//         // workLocation: user?.workLocation,
//         invoiceNo: invoiceRows, // Send the invoice rows to the backend
//       };

//       console.log('payload: ' + JSON.stringify(payload));

//       const response = await fetch(`${dev}/vehicleIN/vehicle-entry`, {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();
//       if (!response.ok) {
//         toast.error(result.message || "Updating failed");
//         setLoading(false);
//         return;
//       }
//       setLoading(false);
//       toast.success(result.message || "Updated successfully");
//       setOpenEditsPopup(false);
//       getDataByStatus();
//     } catch (error) {
//       setLoading(false);
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={() => setOpenEditsPopup(false)}
//       fullWidth
//       maxWidth="sm"
//     >
//       <DialogTitle>
//         <img
//           src={logo}
//           alt="Logo"
//           style={{ display: "block", margin: "0 auto", maxWidth: "150px" }}
//         />

//         <FaTimes
//           className="close-icon text-red-500"
//           onClick={() => setOpenEditsPopup(false)}
//           style={{ float: "right", cursor: "pointer" }}
//         />
//       </DialogTitle>
//       <DialogContent>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             {/* <Grid item xs={12}>
//               <TextField
//                 label="Vehicle Number"
//                 name="vehicleNo"
//                 value={formData.vehicleNo}
//                 onChange={(e) => setFormData({...formData, vehicleNo: e.target.value})}
//                 fullWidth
//                 margin="dense"
//                 required
//                 disabled
//                 error={!!errors.vehicleNo}
//                 helperText={errors.vehicleNo}
//               />
//             </Grid> */}

//             <Grid item xs={12}>
//               <Box mb={2}>
//                 <Typography variant="h6">Invoice Details</Typography>
//                 <Divider />
//               </Box>

//               {invoiceRows.map((row, index) => (
//                 <Box key={index} mb={2}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid item xs={5}>
//                       <TextField
//                         label="Invoice No"
//                         value={row.invoiceNo}
//                         onChange={(e) => handleInvoiceRowChange(index, "invoiceNo", e.target.value)}
//                         fullWidth
//                         margin="dense"
//                         required
//                         error={!!errors[`invoiceNo_${index}`]}
//                         helperText={errors[`invoiceNo_${index}`]}
//                       />
//                     </Grid>
//                     <Grid item xs={5}>
//                       <TextField
//                         label="LR Number"
//                         value={row.lrNumber}
//                         onChange={(e) => handleInvoiceRowChange(index, "lrNumber", e.target.value)}
//                         fullWidth
//                         margin="dense"
//                         required
//                         error={!!errors[`lrNumber${index}`]}
//                         helperText={errors[`lrNumber${index}`]}
//                       />
//                     </Grid>
//                     <Grid item xs={2}>
//                       <IconButton 
//                         color="error" 
//                         onClick={() => handleRemoveRow(index)}
//                         disabled={invoiceRows.length === 1}
//                       >
//                         <FaTrash />
//                       </IconButton>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               ))}

//               <Button
//                 variant="outlined"
//                 color="primary"
//                 startIcon={<FaPlus />}
//                 onClick={handleAddRow}
//                 fullWidth
//                 style={{ marginTop: '10px' }}
//               >
//                 Add Row
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={() => setOpenEditPopup(false)} color="secondary">
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} /> : "Update"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default VechileER;

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import logo from "../../assets/logo.png";
import { dev } from "../../utils/ApiUrl";

function VechileER({ isOpen, setOpenEditsPopup, data, getDataByStatus, vehicleStatus }) {
  console.log("Single Data:", data);
  const { user } = useSelector((state) => state.user);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize invoiceRows with existing invoices if available
  const [invoiceRows, setInvoiceRows] = useState([]);

  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleNo: "",
    currentUser: "",
    workLocation: user?.workLocation,
  });

  useEffect(() => {
    console.log(data, "dataaaaaaa");

    setFormData((prevFormData) => ({
      ...prevFormData,
      vehicleId: prevFormData.vehicleId || data.id || "",
      vehicleNo: prevFormData.vehicleNo || data.vehicleNo || "",
      currentUser: prevFormData.currentUser || localStorage.getItem("currentUser"),
      // price: data.price || "",
    }));

    // If data has invoice numbers, set them; otherwise, keep empty array
    if (data.invoiceNo && Array.isArray(data.invoiceNo) && data.invoiceNo.length > 0) {
      setInvoiceRows(
        data.invoiceNo.map((item) => ({
          lrNumber: item.lrNumber || "",
          price: data.price || "", // Pre-filled price
          invoiceNo: vehicleStatus === "transporter billing pending" ? "" : item.invoiceNo, // Empty invoiceNo for transporter billing pending
        }))
      );
    } else {
      setInvoiceRows([{ invoiceNo: "", lrNumber: "", price: "" }]);
    }

  }, [data, vehicleStatus]);

  // Handle adding a new row
  const handleAddRow = () => {
    setInvoiceRows([...invoiceRows, { invoiceNo: "", lrNumber: "" }]);
  };

  // Handle removing a row
  const handleRemoveRow = (index) => {
    const updatedRows = [...invoiceRows];
    updatedRows.splice(index, 1);
    setInvoiceRows(updatedRows);
  };

  // Handle change for invoice rows
  const handleInvoiceRowChange = (index, field, value) => {
    const updatedRows = [...invoiceRows];
    updatedRows[index][field] = value;
    setInvoiceRows(updatedRows);

    // Clear errors for this field if it has a value
    const newErrors = { ...errors };
    if (value) {
      delete newErrors[`${field}_${index}`];
    }

    // Ensure remark is cleared only when status is "Ok"
    if (field === "status") {
      if (value === "Ok") {
        delete newErrors[`remark_${index}`];
      }
      // else {
      //   newErrors[`remark_${index}`] = "Remark is required ";
      // }
    }

    setErrors(newErrors);
  };


  // Handle form submission
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     let newErrors = {};

  //     // Validate required fields
  //     if (!formData.vehicleNo) {
  //       newErrors.vehicleNo = "Vehicle number is required";
  //     }

  //     // Validate each invoice row
  //     invoiceRows.forEach((row, index) => {
  //       if (!row.invoiceNo) {
  //         newErrors[`invoiceNo_${index}`] = "Invoice number is required";
  //       }
  //       if (!row.lrNumber) {
  //         newErrors[`lrNumber_${index}`] = "LR number is required";
  //       }
  //     });

  //     setErrors(newErrors);

  //     if (Object.keys(newErrors).length !== 0) {
  //       return; // Prevent form submission if there are errors
  //     }

  //     try {
  //       setLoading(true);
  //       let payload = {
  //         vehicleId: formData.vehicleId,
  //         currentUser: formData.currentUser,
  //         invoiceNo: invoiceRows, // Send the invoice rows to the backend
  //       };

  //       console.log("Payload:", JSON.stringify(payload));

  //       const response = await fetch(`${dev}/vehicleIN/vehicle-entry`, {
  //         method: "POST",
  //         body: JSON.stringify(payload),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const result = await response.json();
  //       if (!response.ok) {
  //         toast.error(result.message || "Updating failed");
  //         setLoading(false);
  //         return;
  //       }
  //       setLoading(false);
  //       toast.success(result.message || "Updated successfully");
  //       setOpenEditsPopup(false);
  //       getDataByStatus();
  //     } catch (error) {
  //       setLoading(false);
  //       toast.error("Something went wrong");
  //     }
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();


    let newErrors = {};

    // Validate required fields
    if (!formData.vehicleNo) {
      newErrors.vehicleNo = "Vehicle number is required";
    }

    // Validate each invoice row and check for duplicate LR numbers
    let lrNumbersSet = new Set();
    invoiceRows.forEach((row, index) => {
      if (!row.invoiceNo) {
        newErrors[`invoiceNo_${index}`] = "Invoice number is required";
      }
      if (!row.lrNumber) {
        newErrors[`lrNumber_${index}`] = "LR number is required";
      } else {
        // Check for duplicates
        if (lrNumbersSet.has(row.lrNumber)) {
          newErrors[`lrNumber_${index}`] = "LR number must be unique";
        } else {
          lrNumbersSet.add(row.lrNumber);
        }
      }

      // Validate fields only for "transporter billing pending"
      if (vehicleStatus === "transporter billing pending") {
        if (!row.status) {
          newErrors[`status_${index}`] = "Status is required";
        }
        if (!row.invoiceDate) {
          newErrors[`invoiceDate_${index}`] = "Invoice date is required";
        }
        if (!row.price) {
          newErrors[`price_${index}`] = "Price is required";
        }
        if (invoiceRows[0].status === "Not Ok" && !row.remark) {
          newErrors[`remark_${index}`] = "Remark is required";
        }
      }
    });

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      return; // Prevent form submission if there are errors
    }

    try {
      setLoading(true);
      let payload = {
        vehicleId: formData.vehicleId,
        currentUser: formData.currentUser,
        [vehicleStatus === "transporter billing pending" ? "transporterBillingDetails" : "invoiceNo"]: invoiceRows.map((row) => ({
          invoiceNo: row.invoiceNo,
          lrNumber: row.lrNumber,
          ...(vehicleStatus === "transporter billing pending" && {
            status: row.status,
            invoiceDate: row.invoiceDate,
            remark: row.remark || "",
            price: row.price,
          }),
        })), // Send the invoice rows to the backend
      };

      console.log("Payload:", payload);

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
      setOpenEditsPopup(false);
      getDataByStatus();
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const StatusList = [
    { label: "Select Status", value: "" },
    { label: "Ok", value: "Ok" },
    { label: "Not Ok", value: "Not Ok" },
  ];


  return (
    <Dialog open={isOpen} onClose={() => setOpenEditsPopup(false)} fullWidth maxWidth="sm">
      <DialogTitle>
        <img src={logo} alt="Logo" style={{ display: "block", margin: "0 auto", maxWidth: "150px" }} />

        <FaTimes
          className="close-icon text-red-500"
          onClick={() => setOpenEditsPopup(false)}
          style={{ float: "right", cursor: "pointer" }}
        />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="h6">
                  {vehicleStatus === "transporter billing pending" ? "Transporter Billing Details" : "Billing Details"}
                </Typography>
                <Divider />
              </Box>

              {vehicleStatus === "transporter billing pending" && (
                <Box>
                  {/* Price and Status Fields (Top Section) */}
                  <Grid container spacing={2} alignItems="center">
                    {/* Pre-filled Price */}
                    {/* <Grid item xs={6}>
                      <TextField
                        label="Price"
                        value={invoiceRows.length > 0 ? invoiceRows[0].price : ""}
                        fullWidth
                        margin="dense"
                        InputProps={{ readOnly: true }}
                        error="newErrors"
                      />

                  
                    </Grid> */}
                    <Grid item xs={6}>
                      <TextField
                        label="Price"
                        value={invoiceRows.length > 0 ? invoiceRows[0].price : ""}
                        fullWidth
                        margin="dense"
                        required
                        error={!!errors[`price_0`]}
                        helperText={errors[`price_0`] || ""}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Select Input for Status */}
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="Status"
                        value={invoiceRows.length > 0 ? invoiceRows[0].status : ""}
                        onChange={(e) => handleInvoiceRowChange(0, "status", e.target.value)}
                        fullWidth
                        margin="dense"
                        required
                        error={!!errors[`status_0`]}
                        helperText={errors[`status_0`] || ""}
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                      >
                        <option value="">Select Status</option>
                        <option value="Ok">Ok</option>
                        <option value="Not Ok">Not Ok</option>
                      </TextField>
                    </Grid>

                    {/* <Grid item xs={6}>
                      <TextField
                        select
                        label="Status"
                        value={invoiceRows.length > 0 ? invoiceRows[0].status : ""}
                        onChange={(e) => handleInvoiceRowChange(0, "status", e.target.value)}
                        fullWidth
                        margin="dense"
                        SelectProps={{ native: true }}
                        InputLabelProps={{ shrink: true }}
                      >
                        {StatusList.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                      {errors[`status_0`] && (
                        <Typography variant="caption" color="error">
                          {errors[`status_0`]}
                        </Typography>
                      )}
                    </Grid> */}

                  </Grid>

                  {/* Horizontal Line */}
                  <Box mt={2} mb={2}>
                    <Divider />
                  </Box>
                </Box>
              )}

              {/* Invoice Rows (Other Fields) */}
              {invoiceRows.map((row, index) => (
                <Box key={index} mb={2}>
                  <Grid container spacing={2} alignItems="center">
                    {vehicleStatus === "transporter billing pending" ? (
                      <>
                        {/* Pre-filled LR Number */}
                        <Grid item xs={4}>
                          <TextField
                            label="LR Number"
                            value={row.lrNumber}
                            fullWidth
                            margin="dense"
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>

                        {/* Invoice Number */}
                        <Grid item xs={4}>
                          <TextField
                            label="Invoice No"
                            value={row.invoiceNo}
                            onChange={(e) => handleInvoiceRowChange(index, "invoiceNo", e.target.value)}
                            fullWidth
                            margin="dense"
                            required
                            error={!!errors[`invoiceNo_${index}`]}
                            helperText={errors[`invoiceNo_${index}`]}
                          />
                        </Grid>

                        {/* Invoice Date */}
                        <Grid item xs={4}>
                          <TextField
                            label="Invoice Date"
                            type="date"
                            value={row.invoiceDate || ""}
                            onChange={(e) => handleInvoiceRowChange(index, "invoiceDate", e.target.value)}
                            fullWidth
                            margin="dense"
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors[`invoiceDate_${index}`]}
                            helperText={errors[`invoiceDate_${index}`] || ""}
                          />
                        </Grid>

                        {/* Remark */}
                        <Grid item xs={4}>
                          <TextField
                            label="Remark"
                            value={row.remark || ""}
                            onChange={(e) => handleInvoiceRowChange(index, "remark", e.target.value)}
                            fullWidth
                            margin="dense"
                            required={invoiceRows[0].status === "Not Ok"}
                            error={!!errors[`remark_${index}`]}
                            helperText={errors[`remark_${index}`] || ""}
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                        {/* Regular Billing Fields */}
                        <Grid item xs={5}>
                          <TextField
                            label="Invoice No"
                            value={row.invoiceNo}
                            onChange={(e) => handleInvoiceRowChange(index, "invoiceNo", e.target.value)}
                            fullWidth
                            margin="dense"
                            required
                            error={!!errors[`invoiceNo_${index}`]}
                            helperText={errors[`invoiceNo_${index}`]}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            label="LR Number"
                            value={row.lrNumber}
                            onChange={(e) => handleInvoiceRowChange(index, "lrNumber", e.target.value)}
                            fullWidth
                            margin="dense"
                            required
                            error={!!errors[`lrNumber_${index}`]}
                            helperText={errors[`lrNumber_${index}`]}
                          />
                        </Grid>
                      </>
                    )}

                    {/* Remove Button */}
                    <Grid item xs={2}>
                      <IconButton color="error" onClick={() => handleRemoveRow(index)} disabled={invoiceRows.length === 1}>
                        <FaTrash />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              {/* Add Row Button */}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FaPlus />}
                onClick={handleAddRow}
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Add Row
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>


      <DialogActions>
        <Button onClick={() => setOpenEditsPopup(false)} color="secondary">
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VechileER;
