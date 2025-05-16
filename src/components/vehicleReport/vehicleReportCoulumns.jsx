import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaCheckCircle, FaCheck } from "react-icons/fa"; // Adjust based on your chosen icon
import { Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy"; // Copy Icon

import EditIcon from "@mui/icons-material/Edit";
// import DownloadIcon from '@mui/icons-material/Download';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Edit, MoreVert, Delete } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  Icon,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { IoCheckmarkDone } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";

 export function convertToIndianTime(utcTime) {
  if (!utcTime) return "Invalid Date";

  try {
    // Create a Date object from the UTC time
    const date = new Date(utcTime);

    // Get the IST offset in minutes (IST is UTC + 5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;

    // Convert the date to IST
    const istDate = new Date(date.getTime() + istOffset);

    // Extract hours, minutes, and determine AM/PM
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Adjust for 12-hour format

    // Format minutes with leading zeros
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Create the formatted time string
    const timeString = `${hours}:${formattedMinutes} ${ampm}`;

    // Get day, month name, and year
    const day = istDate.getUTCDate();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthName = monthNames[istDate.getUTCMonth()];
    const year = istDate.getUTCFullYear();

    // Combine date and time with month name
    return `${day} ${monthName} ${year}, ${timeString}`;
  } catch (error) {
    return "Error converting time";
  }
}

// Example usage
const utcTime = "2024-12-05T19:28:13.000Z";



// Example usage
// const utcTime = "2024-12-05T19:28:13.000Z";
// console.log(convertToIndianTime(utcTime)); // Output: "06-12-2024, 12:58 AM"



export const createColumnsForReport = () => {
    // console.log('designation',userDesignation,'vehcile status',vehicleStatus)
    const columns = [
      {
        field: "piNo",
        headerName: "PI Number",
        minWidth: 120,
        flex: 1,
        sortable: true,
        renderCell: (params) => {
          const piNo = params.value;
      
          // Handle cases for empty string, null, or empty array
          if (!piNo || (Array.isArray(piNo) && piNo.length === 0)) {
            return (
              <Box
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "gray",
                  fontStyle: "italic",
                }}
              >
                N/A
              </Box>
            );
          }
      
          // If piNo is an array, extract the first value and prepare the tooltip
          const isArray = Array.isArray(piNo);
          const piNumbers = isArray ? piNo : [piNo];
          const firstPiNo = piNumbers[0];
      
          return (
            <Tooltip title={piNumbers.join(", ") || "No PI Numbers"} arrow>
              <Box
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "black",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{ userSelect: "text" }} // Allow text selection for copying
                >
                  {firstPiNo}
                </span>
              </Box>
            </Tooltip>
          );
        },
      },
      
      
    
  
      {
        field: "vehicleNo",
        headerName: "Vehicle No",
        minWidth: 100,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
              color: "black",
              fontWeight: "bold",
            }}
          >
            {params.value}
          </Box>
        ),
      },

      {
        field: "lrNumber",
        headerName: "LR Number",
        minWidth: 150,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
              color: "black",
            }}
          >
            {params.value || "N/A"}
          </Box>
        ),
      },
      {
        field: "invoiceNo",
        headerName: "Invoice No",
        minWidth: 150,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
              color: "black",
            }}
          >
            {params.value || "N/A"}
          </Box>
        ),
      },
      
  
      {
        field: "vehicleTypeName",
        headerName: "Vehicle Type",
        minWidth: 120,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value}
          </Box>
        ),
      },
   
      {
        field: "partyName",
        headerName: "Party Name",
        minWidth: 150,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value}
          </Box>
        ),
      },
     
      {
        field: "transporterName",
        headerName: "Transporter Name",
        minWidth: 120,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value}
          </Box>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 100,
        flex: 1,
        sortable: true,
        renderCell: (params) => {
          
          let color=params.value?.toLowerCase()=='out'?'red':'green';
  
          return (
            <Box
              sx={{
             
                color:color,
                fontStyle:'serif',
                fontWeight:'bold',
                cursor: "pointer",
                padding: "0px 3px",
                borderRadius: "2px",
                textAlign: "center",
                whiteSpace: "normal", // Allow wrapping
                fontSize: "12px",
              }}
            >
              {params.value ? params.value : 'N/A'}
            </Box>
          );
        },
      },
      {
        field: "price",
        headerName: "Price",
        minWidth: 120,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? `₹ ${new Intl.NumberFormat('en-IN').format(params.value)}` : 'N/A'}
          </Box>
        ),
      },
      {
        field: "oldPrice",
        headerName: "Old Price",
        minWidth: 120,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? `₹ ${new Intl.NumberFormat('en-IN').format(params.value)}` : 'N/A'}
          </Box>
        ),
      },
      {
        field: "detension",
        headerName: "Detension",
        minWidth: 160,
        flex: 1,
        sortable: true,
        renderCell: (params) => {
          const price = params.row.price;
          const oldPrice = params.row.oldPrice;
          let detensionValue = 'N/A';
          let increaseOrDecrease = '';
          let color = 'black'; // Default color for amount
        
          if (price && oldPrice) {
            // Convert to numbers and subtract
            const priceNumber = parseFloat(price);
            const oldPriceNumber = parseFloat(oldPrice);
        
            if (!isNaN(priceNumber) && !isNaN(oldPriceNumber)) {
              const difference = priceNumber - oldPriceNumber;
              detensionValue = `₹ ${new Intl.NumberFormat('en-IN').format(difference)}` ; // Format to 2 decimal places
              
              // Determine Increase/Decrease and color
              if (difference > 0) {
                increaseOrDecrease = ` (Increase)`;
                color = 'green'; // Color for increase
              } else if (difference < 0) {
                increaseOrDecrease = ` (Decrease)`;
                color = 'red'; // Color for decrease
              }
            }
          }
      
          return (
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal", // Allow wrapping
              }}
            >
              {detensionValue} 
              <span style={{ color: color }}>
                {increaseOrDecrease}
              </span>
            </Box>
          );
        },
      },
      
      
      {
        field: "reason",
        headerName: "Reason",
        minWidth: 120,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? params.value : 'N/A'}
          </Box>
        ),
      },
      {
        field: "vehicleInTime",
        headerName: " Entry Date",
        minWidth: 150,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? convertToIndianTime(params.value) : 'N/A'}
          </Box>
        ),
      },
      {
        field: "outTime",
        headerName: "Shipment Date",
        minWidth: 150,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? convertToIndianTime(params.value) : 'N/A'}
          </Box>
        ),
      },
      {
        field: "deliveryStatus",
        headerName: "Delivery Status",
        minWidth: 180,
        flex: 1,
        sortable: true,
        sortComparator: (v1, v2) => {
          // Extract numbers from the text using a regex
          const num1 = parseInt(v1.match(/\d+/)?.[0] || "0", 10); // Extract number or default to 0
          const num2 = parseInt(v2.match(/\d+/)?.[0] || "0", 10);
          return num1 - num2; // Ascending order
        },
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? params.value : 'N/A'}
          </Box>
        ),
      }
,      
      {
        field: "deliveryTime",
        headerName: "Delivery Time",
        minWidth: 150,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? convertToIndianTime(params.value) : 'Not Delivered'}
          </Box>
        ),
      },
      {
        field: "workLocationName",
        headerName: "Unit",
        minWidth: 120,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? params.value : 'N/A'}
          </Box>
        ),
      },
      {
        field: "SalesMan",
        headerName: "Sales Executive",
        minWidth: 120,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {params.value ? params.value : 'N/A'}
          </Box>
        ),
      },
      // {
      //   field: "SalesMan",
      //   headerName: "Sales Executive",
      //   minWidth: 120,
      //   flex: 1,
      //   sortable: true,
      //   renderCell: (params) => (
      //     <Box
      //       sx={{
      //         overflow: "hidden",
      //         textOverflow: "ellipsis",
      //         whiteSpace: "normal", // Allow wrapping
      //       }}
      //     >
      //       {params.value ? params.value : 'N/A'}
      //     </Box>
      //   ),
      // },
  
    
   
     

    
    ];
  
 
  
    return columns;
  };



//   {
//     handleClick = () => {},
//     handleEdit = () => {},
//     handleImageClick = () => {},
//     userDesignation,
//     userDepartment,
//     vehicleStatus,
//     setOpenUploadModal = () => {},
//     setUploadType = () => {},
//     setUploadData = () => {},
//     handlePdfClick = () => {},
//     handleExcelClick = () => {},
//     handleMaplick = () => {},
//     handleDeliveredClick = () => {},
//   } = {}