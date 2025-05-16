import React, { useState, useEffect, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ImageSlider from "./ImageSlider";
import EditVehicle from "./EditVehicle";
import DownloadIcon from "@mui/icons-material/Download"; // Import the download icon
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  Icon,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography,
  TextField
} from "@mui/material";
import VehicleTransferredPopup from "./vehicleTransferredPopup";
import ConfirmationPopup from "../ConfirmPopup";
import "../../styles/vehicle/vehicle.css";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
// import "../../styles/vehicle/displayvehicle.css";
import { dev } from "../../utils/ApiUrl";
import { createColumns } from "../../utils/column";
import { transformVehicleDataToRows } from "../../utils/row";
import downloadImage from "../../utils/downloadFile";
import "../../styles/vehicle/displayvehicle.css";
import { useSelector, useDispatch } from "react-redux";
import { addSingleVehicleData } from "../../feauters/data.slice";
import AddPricing from "./AddPricing";
import FileUploadModal from "./FileUpload";
import MapComponent from "../Map";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"; // For date manipulation
import VechileER from "./VechileER";
import generateExcelReportOfInvoice from "../../utils/invoiceExcelReport";
import InvoiceModal from "./InvoiceModal";

// Function to format the date
const formatDeliveryDate = (date) => {
  if (!date || !dayjs.isDayjs(date)) {
    return null; // If the date is invalid or not a Day.js object, return null
  }

  // Format the date to DD-MM-YYYY HH:mm
  return date.format("DD-MM-YYYY HH:mm");
};

// "deliveryStatus": "Arrived (105 Hours Delay)",
const DisplayVehicleList = ({
  vehicleData,
  updateStatus,
  getDataByStatus,
  status,
}) => {
  // console.log("rendering........");
  // Example usage with your vehicleData array

  // console.log('vehicle data',vehicleData)
  // Define columns with styles and specific rendering
  const [anchorEl, setAnchorEl] = useState(null); // State to track the anchor element for the menu (3-dot menu)
  const [selectedRow, setSelectedRow] = useState(null); // State to store the currently selected row for actions
  const [open, setOpen] = useState(false); // State to manage if a popover or modal is open
  const [selectedImage, setSelectedImage] = useState(""); // State to store the image URL that was clicked for full preview
  const [imageSliderOpen, setImageSliderOpen] = useState(false); // State to handle if the image slider is open
  const [imageArray, setImageArray] = useState([]); // State to store the array of images related to a vehicle
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openEditsPopup, setOpenEditsPopup] = useState(false);// State to control whether the edit popup is open
  const [editVehicleData, setEditVehicleData] = useState(null); // State to hold the data of the vehicle being edited

  const [openTransferModal, setOpenTransferModal] = useState(false); // State for dialog visibility
  const [isConfirmPopup, setConfirmPopup] = useState(false);
  const [canceled, setCanceled] = useState(null);

  const [rowsData, setRows] = useState([]);
  const [columnsData, setColumns] = useState([]);
  const [openEbill, setEbill] = useState(false);
  const [openInvoice, setInvoice] = useState(false);
  const [billOrInvoiceImg, setBillOrInvoiceImg] = useState(null);
  const openBill = openEbill || openInvoice;
  const { user } = useSelector((state) => state.user);
  const [isOPenPricingModal, setOpenPricingModal] = useState(false);
  const [vehicleDataForAddPricing, setVehicleDataForAddPricing] =
    useState(null);
  const dispatch = useDispatch();

  // open modal for delivered ---
  const [openConfirmationPopup, setOpenConfirmationPopup] = useState(false);
  const [selectDeliveryDate, setSelectDeliveryDate] = useState(null);
  const [touched, setTouched] = useState(false);
  const [confirmationPopupData, setConfirmationPopupData] = useState({});
  const [isEmptyDateField, setEmptyDateField] = useState(false)

  // states for map----------------------------

  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");
  const [mapData, setMapData] = useState({});
  const [isMap, setMap] = useState(false);

  // file upload section-----
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [uploadData, setUploadData] = useState(null);

  // watage work section-----
  const [openWatageWorkModal, setOpenWatageWorkModal] = useState(false);
  const [watageData, setWatageData] = useState([]);
  const [idOfVehicle, setIdOfVehicle] = useState('');
  const [watageError, setWatageError] = useState({});
  const [loading, setLoading] = useState(false);
  // console.log("idOfVehicle",idOfVehicle);

  // show invoice modal and state----
  const [loadingForinvoiceApiCall, setLoadingForinvoiceApiCall] = useState(false)
  const [showInvoiceModalPhp, setShowInvoiceModalPhp] = useState(false)
  const [InvoiceNoPhp, setInvoiceNoPhp] = useState('')


  const handleInvoiceModalPHP = (no) => {
    setInvoiceNoPhp(no)
    setShowInvoiceModalPhp(true)
  }

  // handle chnage for panel edit details-----
  const handleInputChange = (index, field, value) => {
    // Create a copy of the panel data to update
    const updatedPanelDetails = [...watageData];
    updatedPanelDetails[index] = {
      ...updatedPanelDetails[index],
      [field]: value,
    };
    setWatageData(updatedPanelDetails);

    // Create a copy of the error state
    const updatedErrors = { ...watageError };

    // Remove the error if the field is not empty
    if (value) {
      delete updatedErrors[`row-${index}-${field}`]; // Clear error for this field
    }

    // Update the error state
    setWatageError(updatedErrors);
  };



  // open watage edit modal section-----
  const handleWatageOpen = (data, id) => {
    setOpenWatageWorkModal(true)
    setWatageData(data)
    setIdOfVehicle(id)
  }

  const handleAddRow = () => {
    setWatageData([...watageData, { quantity: '', watage: '' }]);
  };
  const handleRemoveRow = (index) => {
    const updatedData = [...watageData];
    updatedData.splice(index, 1);
    setWatageData(updatedData);
  };


  // handle submit of watage edit -----
  const handleEditWatage = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Validation logic
    watageData.forEach((item, index) => {
      if (!item.watage) {
        newErrors[`row-${index}-watage`] = `Wattage is required .`;
      }
      if (!item.quantity) {
        newErrors[`row-${index}-quantity`] = `Quantity is required .`;
      }
    });
    setWatageError(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      return; // Prevent form submission if there are errors
    }

    console.log("submitting form data", watageData);
    console.log("idOfVehicle", idOfVehicle);
    try {
      setLoading(true);
      const response = await fetch(`${dev}/vehicleIN/updatePanelDetails`, {
        method: "POST",
        body: JSON.stringify({
          vehicleId: idOfVehicle,
          panelDetails: watageData
        }),
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
      setOpenWatageWorkModal(false);
      getDataByStatus();
      // Reset form fields after successful submission
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };



  const handlePdfClick = (pdfUrl) => {
    // Logic to open PDF in a modal or a new tab
    window.open(pdfUrl, "_blank");
  };

  const handleExcelClick = (excelUrl) => {
    // Logic to open or download the Excel file
    window.open(excelUrl, "_blank");
  };

  useEffect(() => {
    dispatch(addSingleVehicleData(uploadData));
  }, [uploadData]);

  // image zoom functionality-------------------------------------
  const imageRef = useRef(null);
  const [zoomStyle, setZoomStyle] = useState({
    transform: "scale(1)",
    transformOrigin: "center center",
  });
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = e.pageX - left;
    const y = e.pageY - top;

    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setZoomStyle({
      transform: "scale(2)", // 2x zoom
      transformOrigin: `${xPercent}% ${yPercent}%`, // Zoom follows the mouse position
    });
  };
  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)", // Reset zoom when the mouse leaves the image
      transformOrigin: "center center",
    });
  };

  // console.log('vehcil data',vehicleData)

  function closeBilModal() {
    setEbill(false);
    setInvoice(false);
  }

  // implement map logic here-------
  const openMap = () => {
    setMap(true);
  };
  const handleMaplick = async (id) => {
    // console.log('map id',id)
    try {
      setMapLoading(true);
      setMapError(null);

      const response = await fetch(`${dev}/vehicleIN/getvehicleListStatus`, {
        method: "POST",
        body: JSON.stringify({
          status:
            status === "delay" ? "out".toUpperCase() : status.toUpperCase(),
          workLocation: "ALL",
          mapId: id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      console.log("data for delivery", result);
      if (!response.ok) {
        setMapError(result.message);
        setMapLoading(false);
        toast.error(result.message);
        return;
      }
      setMapLoading(false);

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

      setMapData(filteredData[0]);
      openMap();
    } catch (error) {
      console.log("error in stuats", error);
      setMapError("error ocuuring", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setMapLoading(false);
    }
  };

  // handle delivered map and api-----
  const handleDeliveredClick = async (data) => {
    // console.log("row data clicke on delievred button", data);
    setConfirmationPopupData(data);

    setOpenConfirmationPopup(true);

  };

  const handleCloseDeliveredModal = () => {
    setSelectDeliveryDate(null); // Clear the date field
    setTouched(false); // Reset the error state
    setOpenConfirmationPopup(false); // Close the popup
  };

  // function to end trip--------
  const tripEnd = async () => {
    // console.log('data of delivered vehicle in trip id',confirmationPopupData)

    try {
      // setLoading(true);
      const username = "Gautamsolar"; // Replace with your actual username
      const password = "Gautamsolar@123"; // Replace with your actual password

      // Encode the credentials in Base64 for Basic Authentication
      const authHeader = "Basic " + btoa(`${username}:${password}`);

      const resp = await fetch(`https://dashboard.traqo.in/api/v3/trip/end/`, {
        method: "POST",
        body: JSON.stringify({
          id: confirmationPopupData.tripId,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: authHeader, // Use the encoded credentials here
        },
      });

      const data = await resp.json();
      // console.log("trip end res", data);

      if (!resp.ok) {
        // setLoading(false);
        toast.error(data.status || "Trip Ending Failed");
        return;
      }

      toast.success(data.status || "Trip Ended Successfully!");
      handleClose();
      getDataByStatus()
    } catch (error) {
      console.log("trip end", error);
      toast.error("Something went wrong");
    } finally {
      // setLoading(false);
    }
  };
  // console.log('select delivery date',selectDeliveryDate)
  const handleConfirm = async (ID) => {
    // console.log("calling");

    // Set touched only when the user clicks "Delivered"
    if (!selectDeliveryDate) {
      setTouched(true); // Trigger the error state for the date field
      toast.error('Select Delivery Date')
      setEmptyDateField(true)
      return; // Prevent further processing if no date is selected
    }

    // console.log("data", {
    //   status: "DELIVERED",
    //   vehicleId: confirmationPopupData.id,
    //   personId: user.personId,
    //   deliveryTime: formatDeliveryDate(selectDeliveryDate),
    // });



    try {
      const resp = await fetch(`${dev}/vehicleIN/updateTransportStatus`, {
        method: "POST",
        body: JSON.stringify({
          status: "DELIVERED",
          vehicleId: confirmationPopupData.id,
          personId: user.personId,
          deliveryTime: formatDeliveryDate(selectDeliveryDate),
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await resp.json();
      if (!resp.ok) {
        setEmptyDateField(false)
        toast.error(data.message || "Failed");
        return;
      }

      toast.success(data.message || "Delivered Successfully!");

      setOpenConfirmationPopup(false);
      handleClose();
      tripEnd()
    } catch (error) {
      console.log("error in delivered", error);
      toast.error("Something went wrong");
    }
  };

  // creating table column and row here------------------------------
  useEffect(() => {
    const transformedRows = transformVehicleDataToRows(vehicleData);
    setRows(transformedRows);

    const columnsConfig = createColumns({
      handleClick,
      handleEdit,
      handleEdits,
      handleInvoiceModalPHP,
      handleImageClick,
      userDesignation: user.designation, // Make sure to pass designation like this
      userDepartment: user.department, // Make sure to pass designation like this
      vehicleStatus: status,
      setOpenUploadModal,
      setUploadType,
      setUploadData,
      handlePdfClick,
      handleExcelClick,
      handleMaplick,
      handleDeliveredClick,
      handleWatageOpen,
    });
    setColumns(columnsConfig);
  }, [vehicleData]);

  // console.log("data", canceled);
  const handleCancelClick = (row) => {
    setCanceled(row); // selectedRow ko set karte hain
    setConfirmPopup(true); // Popup ko open karte hain
  };
  const handleCloseConfirmPopup = () => {
    setConfirmPopup(false);
  };
  const handlePopupYesClick = () => {
    if (canceled) {
      updateVehicleStatus(canceled.id, "canceled"); // Function call with selected row id
    }
    setConfirmPopup(false); // Popup ko close karte hain
  };

  // Function to handle image click event
  const handleImageClick = (imageUrl) => {
    // Set the selected image URL and open the modal
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  // Function to handle closing the image modal
  const handleCloseImageModal = () => {
    // Close the modal and reset the selected image
    setOpen(false);
    setSelectedImage("");
  };

  // Function to handle the edit button click event
  const handleEdit = (row) => {
    // Open the edit popup and set the vehicle data for editing
    setOpenEditPopup(true);
    setEditVehicleData(row);
  };

  // call api for invoice php api-----



  const handleEdits = (row) => {
    // Open the edit popup and set the vehicle data for editing
    setOpenEditsPopup(true);
    setEditVehicleData(row);
  };

  // Function to handle menu button click event
  const handleClick = (event, row) => {
    // Set the anchor element for the menu and the selected row
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    dispatch(addSingleVehicleData(row));
    // console.log('row',row)
  };

  // Function to close the menu
  const handleClose = () => {
    // Reset the anchor element and selected row
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleMenuAction = (action, row) => {
    setSelectedRow(row); // Save the selected row

    switch (action) {
      // case "edit":
      //   setOpenEditPopup(true);
      //   setEditVehicleData(row);
      //   break;
      case "view":
        handleView(selectedRow);
        break;
      case "cancel":
        handleCancelClick(selectedRow, "cancel");
        handleClose();
        break;
      case "approve":
        updateVehicleStatus(selectedRow.id, "approved");
        break;
      case "out":
        updateVehicleStatus(selectedRow.id, "out");
        break;
      case "transferred":
        setOpenTransferModal(true);
        break;
      case "e-bill":
        setEbill(true);
        console.log("e bill row", selectedRow);
        setBillOrInvoiceImg(selectedRow.ewayBill);
        // console.log("open ebil");
        break;
      case "invoice":
        // console.log("invoce");
        console.log("invoice row", selectedRow);
        setInvoice(true);
        setBillOrInvoiceImg(selectedRow.invoiceImg);
        break;
      case "add-pricing":
        setOpenPricingModal(true);
        setVehicleDataForAddPricing(selectedRow);
        console.log("add pricing", selectedRow);
        break;
      case "upload-e-bill":
      case "upload-invoice":
      case "upload-material-list":
        setSelectedRow(row);
        setUploadType(action);
        setOpenUploadModal(true);
        break;
      default:
        break;
    }
    handleClose();
  };

  // Function to handle viewing vehicle images
  const handleView = (row) => {
    // Collect all vehicle images into an array
    let vehicleImagesArray = [];
    if (row.vehicleImg1) vehicleImagesArray.push(row.vehicleImg1);
    if (row.vehicleImg2) vehicleImagesArray.push(row.vehicleImg2);
    if (row.vehicleImg3) vehicleImagesArray.push(row.vehicleImg3);
    if (row.vehicleImg4) vehicleImagesArray.push(row.vehicleImg4);

    // Set the image array and open the image slider
    setImageArray(vehicleImagesArray);
    setImageSliderOpen(true);
  };

  // Function to handle closing the image slider
  const handleCloseImageSlider = () => {
    // Close the image slider and clear the image array
    setImageSliderOpen(false);
    setImageArray([]);
  };

  // Function to update vehicle status via API
  const updateVehicleStatus = async (vehicleId, vehicleStatus) => {
    try {
      // Send a POST request to update the vehicle status
      const resp = await fetch(`${dev}/vehicleIN/updateTransportStatus`, {
        method: "POST",
        body: JSON.stringify({
          vehicleId: vehicleId,
          status: vehicleStatus.toUpperCase(),
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      const result = await resp.json();

      if (!resp.ok) {
        // Show error message if the response is not OK
        toast.error(result.message || "Status updating failed!");
        return;
      }

      // Show success message and update the status in the UI
      toast.success(result.message || "Status updated successfully!");
      updateStatus(vehicleStatus);
      setCanceled(false);
      setConfirmPopup(false);
    } catch (error) {
      // Show error message if an exception occurs
      toast.error("Something went wrong");
      console.log("Updating status failed", error.message);
    }
  };

  return (
    <Box className="display-vehicle-box   h-[74vh]">
      {/* DataGrid component to display vehicle data in a table */}
      <DataGrid
        rows={rowsData}
        columns={columnsData}
        pageSize={50} // Show 5 rows per page
        rowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200.250]}
        sortingOrder={["asc", "desc"]}
        filterMode="client"
        getRowHeight={() => "100px"}
        // components={{
        //   Toolbar: GridToolbar,
        // }}
        // componentsProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //   },
        // }}
        sx={{
          height: "100%",
          width: "100%",
          // border:'2px solid blue',
          overflowX: "auto",
          "& .MuiDataGrid-root": {
            height: "100%",
            // border:'2px solid green'
            // width:'100%',
          },
          "& .MuiDataGrid-columnHeader": {
            width: "100%",
            backgroundColor: "#f97474",
            color: "#fff",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            padding: "8px 10px",
            fontSize: "14px", // Reduce the font size for column headers
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            whiteSpace: "normal", // Allow text wrapping
            wordWrap: "break-word", // Wrap long text
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            width: "100%",
            color: "#fff",
            fontWeight: "bold",
            textOverflow: "ellipsis",
          },
          "& .MuiDataGrid-cell": {
            padding: "5px 6px",
            fontSize: "13px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal", // Allow cell content to wrap
            wordWrap: "break-word", // Wrap long text in cells
            color: "#343333",
            border: "1px solid #ddd",
          },
          "& .MuiDataGrid-row": {
            fontSize: "13px",
            border: "1px solid #ddd",
          },
        }}
      />

      {/* Menu component for displaying context menu options */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {/* {selectedRow && selectedRow.status.toLowerCase() === "in" && (
          <>
            <MenuItem onClick={() => handleMenuAction("cancel")}>
              Cancel
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction("transferred")}>
              Transferred
            </MenuItem>
          </>
        )} */}

        {/* {selectedRow && selectedRow.status.toLowerCase() === "loading" && (
          <MenuItem onClick={() => handleMenuAction("approve")}>
            Approve
          </MenuItem>
        )} */}

        {/* {selectedRow && selectedRow.status.toLowerCase() === "transferred" && (
          <MenuItem onClick={() => handleMenuAction("out")}>Out</MenuItem>
        )} */}

        {selectedRow &&
          selectedRow.vehicleImg1 &&
          selectedRow.vehicleImg2 &&
          selectedRow.vehicleImg3 &&
          selectedRow.vehicleImg4 && (
            <MenuItem onClick={() => handleMenuAction("view")}>
              Loading Images
            </MenuItem>
          )}
        {selectedRow &&
          selectedRow.invoiceImg &&
          user.designation !== "Dispatcher" && (
            <MenuItem onClick={() => handleMenuAction("invoice")}>
              Invoice
            </MenuItem>
          )}
        {selectedRow &&
          selectedRow.ewayBill &&
          user.designation !== "Dispatcher" && (
            <MenuItem onClick={() => handleMenuAction("e-bill")}>
              {" "}
              E-wayBill
            </MenuItem>
          )}
        {(user.designation === "Dispatcher" ||
          user.designation === "Super Admin") && (
            <div>
              {/* <MenuItem onClick={() => handleMenuAction("upload-e-bill")}>
              Upload E-wayBill
            </MenuItem> */}
              <MenuItem onClick={() => handleMenuAction("upload-invoice")}>
                Upload Invoice
              </MenuItem>
              <MenuItem onClick={() => handleMenuAction("upload-material-list")}>
                Upload Material List
              </MenuItem>
            </div>
          )}

        {selectedRow &&
          (selectedRow.status?.trim().toLowerCase() === "out" || selectedRow.status?.trim().toLowerCase() === "delivered" ||
            selectedRow.status?.trim().toLowerCase() === "pending") &&
          user.designation.toLowerCase() == "super admin" && (
            <MenuItem onClick={() => handleMenuAction("add-pricing")}>
              {" "}
              Pricing
            </MenuItem>
          )}
      </Menu>

      {/* Dialog component for displaying a selected image */}
      {/* Dialog component for displaying a selected image */}
      <Dialog
        open={open}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            border: "2px solid red",
            width: "100%",
            height: "80vh",
            overflow: "hidden",
          }}
        >
          {selectedImage ? (
            <img
              ref={imageRef}
              src={selectedImage}
              alt="Large Vehicle"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform 0.2s ease", // Smooth zoom transition
                ...zoomStyle,
              }}
            />
          ) : (
            <h1 className="p-10 text-red-500 font-sans font-bold capitalize">
              Image not available
            </h1>
          )}

          {/* Close icon to close the image modal */}
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              top: "3%",
              right: "2%",
              color: "white",
              backgroundColor: "red",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Button
              variant="contained"
              sx={{
                position: "absolute",
                bottom: "1%",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "red",
                color: "white",
                "&:hover": {
                  backgroundColor: "darkred",
                },
              }}
              onClick={() => downloadImage(selectedImage)}
              onMouseEnter={(e) => e.stopPropagation()} // Stop zoom when mouse enters button
              startIcon={<DownloadIcon />} // Add the download icon
            >
              {/* You can optionally leave the button text empty or keep it */}
              {/* If you want no text at all, just leave it empty */}
              {/* Download */}
            </Button>
          )}
        </Box>
      </Dialog>

      {/* for invoice bill and and e bill */}
      <Dialog
        open={openBill} // Show dialog when either openEbill or openInvoice is true
        onClose={closeBilModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            border: "2px solid red",
            width: "100%",
            height: "80vh",
            overflow: "hidden", // Prevents the image from overflowing the container
          }}
        >
          {billOrInvoiceImg && (
            <img
              src={billOrInvoiceImg}
              alt="Large Vehicle"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={imageRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform 0.2s ease", // Smooth zoom transition
                ...zoomStyle, // Apply the dynamic zoom style
              }}
            />
          )}

          {/* Close icon to close the image modal */}
          { }
          <IconButton
            onClick={closeBilModal}
            sx={{
              position: "absolute",
              top: "3%",
              right: "2%",
              color: "white",
              backgroundColor: "red",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Download button at the bottom */}
          {billOrInvoiceImg && (
            <Button
              variant="contained"
              sx={{
                position: "absolute",
                bottom: "1%",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "red",
                color: "white",
                "&:hover": {
                  backgroundColor: "darkred",
                },
              }}
              onClick={() => downloadImage(billOrInvoiceImg)}
              onMouseEnter={(e) => e.stopPropagation()} // Stop zoom when mouse enters button
            >
              Download
            </Button>
          )}
        </Box>
      </Dialog>

      {/* ImageSlider component for displaying multiple vehicle images */}
      <ImageSlider
        open={imageSliderOpen}
        onClose={handleCloseImageSlider}
        images={imageArray}
      />

      {/* EditVehicle component for editing vehicle details */}
      {openEditPopup && (
        <EditVehicle
          getDataByStatus={getDataByStatus}
          data={editVehicleData}
          setOpenEditPopup={setOpenEditPopup}
          isOpen={openEditPopup}
        />
      )}
      {openEditsPopup && (
        <VechileER
          getDataByStatus={getDataByStatus}
          data={editVehicleData}
          setOpenEditsPopup={setOpenEditsPopup}
          isOpen={openEditsPopup}
          vehicleStatus={status}
        />
      )}
      {/* Transfer Modal Dialog */}
      {openTransferModal && (
        <VehicleTransferredPopup
          setOpenTransferModal={setOpenTransferModal}
          openTransferModal={openTransferModal}
        />
      )}
      {isConfirmPopup && (
        <ConfirmationPopup
          onClose={handleCloseConfirmPopup}
          onConfirm={handlePopupYesClick}
          title="Delete Item"
          message="Are you sure you want to delete this item?"
        />
      )}
      {isMap && (
        <MapComponent
          handleClose={() => setMap(false)}
          open={isMap}
          vehicleList={mapData}
        />
      )}

      {isOPenPricingModal && (
        <AddPricing
          getDataByStatus={getDataByStatus}
          open={isOPenPricingModal}
          handleClose={() => setOpenPricingModal(false)}
          vehicleData={vehicleDataForAddPricing}
        />
      )}
      {openUploadModal && (
        <FileUploadModal
          getDataByStatus={getDataByStatus}
          open={openUploadModal}
          onClose={() => setOpenUploadModal(false)}
          type={uploadType} // Pass the type of file to upload
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
                <Button
                  onClick={handleCloseDeliveredModal}
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
                </Button>

                <Button
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
                // disabled={error} // Disable the button if there's an error
                >
                  Delivered
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </LocalizationProvider>
      )}

      {
        openWatageWorkModal && (
          <Dialog open={openWatageWorkModal} onClose={() => setOpenWatageWorkModal(false)} fullWidth maxWidth="sm">
            <DialogTitle sx={{
              textAlign: 'center',
              color: 'red',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: 'serif'
            }}>Panel Details</DialogTitle>
            <DialogContent style={{ maxHeight: "60vh", overflowY: "scroll", padding: "24px" }}>
              {watageData?.length > 0 &&
                watageData.map((panel, index) => (
                  <div key={index} class='flex justify-between items-center' style={{ marginBottom: "24px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <TextField
                          label="Wattage"
                          placeholder="Enter wattage"
                          variant="outlined"
                          fullWidth
                          value={panel.watage || ""}
                          onChange={(e) => handleInputChange(index, "watage", e.target.value)}
                          helperText={watageError[`row-${index}-watage`] || ""}
                          error={!!watageError[`row-${index}-watage`]}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          label="Quantity"
                          placeholder="Enter quantity"
                          variant="outlined"
                          fullWidth
                          value={panel.quantity || ""}
                          onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                          helperText={watageError[`row-${index}-quantity`] || ""}
                          error={!!watageError[`row-${index}-quantity`]}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleRemoveRow(index)}
                          style={{ width: "100%", }}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              {/* Add Button */}
              <div className=" justify-end flex items-center">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddRow}
                  style={{ marginTop: "16px" }}
                >
                  Add Row
                </Button>
              </div>
            </DialogContent>
            <DialogActions style={{ padding: "16px 24px" }}>
              <Button
                onClick={() => setOpenWatageWorkModal(false)}
                color="secondary"
                variant="outlined"
                style={{ marginRight: "8px" }}
              >
                Cancel
              </Button>
              <Button disabled={loading} color="primary" variant="contained" onClick={handleEditWatage}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )
      }

      {
        showInvoiceModalPhp && (<InvoiceModal openn={showInvoiceModalPhp} InvoiceNo={InvoiceNoPhp} onClosee={() => setShowInvoiceModalPhp(false)} />)
      }

    </Box>
  );
};

export default DisplayVehicleList;

{
  /*  */
}
