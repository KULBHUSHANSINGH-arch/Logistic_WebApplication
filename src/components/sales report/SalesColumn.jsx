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
import rank1 from '../../assets/Icons/rank1.png';
import rank2 from '../../assets/Icons/rank2.png';
import rank3 from '../../assets/Icons/rank3.png';

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

// totalMegaWatt

export const createColumnsForSalesReport = (data, formData, showTopSalesPerson, handleOpen) => {
  // console.log('data', data);
  // console.log('designation',userDesignation,'vehcile status',vehicleStatus)
  const { partyName, salesPerson, fromDate, toDate, type, panelType, wattage, piNo } = formData
  const rankShow = localStorage.getItem('rankShow')
  // totalQuantity
  const columns = [
    {
      field: "salesPersonName",
      headerName: "Sales Executive",
      minWidth: 220,
      flex: 1,
      sortable: true,

      renderCell: (params) => {
        // console.log('params', params);
        const value = params?.value ?? "N/A"; // Fallback to 'N/A' if value is null/undefined
        const rowIndex = params.id; // Assuming `params.id` is the row index
        // console.log('params.id',params)
        // Function to get rank image, size, and background color
        const getRankDetails = (index) => {
          if (index === 0) return { image: rank1, size: 40, bgColor: "#276c53" }; // Darker green
          if (index === 1) return { image: rank2, size: 35, bgColor: "#3ea376" }; // Medium green
          if (index === 2) return { image: rank3, size: 30, bgColor: "#6ead97" }; // Light green
          return { image: null, size: 0, bgColor: "transparent" }; // No image or color for other ranks
        };

        const rankDetails = getRankDetails(rowIndex);
        let check = data?.length > 1 && rankDetails.bgColor
        // console.log('checking',check);

        return (
          <Box
            onClick={() => {
              console.log('clicking', params)
              handleOpen(params?.row)
            }}
            sx={{
              display: "flex",
              fontSize: '17px',
              alignItems: "center",
              gap: "8px", // Gap between image and name
              backgroundColor: data?.length > 1 ? rankDetails.bgColor : 'transparent', // Dynamic background color
              padding: "4px 8px",
              borderRadius: "4px", // Optional corner rounding
              cursor: "pointer", // Cursor pointer when hovering over the row
            }}
          >
            {data?.length > 1 && rankDetails.image && (
              <img
                src={rankDetails.image}
                alt={`Rank ${rowIndex + 1}`}
                style={{
                  width: rankDetails.size,
                  height: rankDetails.size,
                  borderRadius: "50%", // Makes the image circular
                  objectFit: "cover", // Ensures the image fits the circle
                }}
              />
            )}
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap", // Prevent wrapping
                fontWeight: "bold",
                color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color for top 3 rows
              }}
            >
              {value}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "totalAmount",
      headerName: "Sales Amount",
      minWidth: 120,
      flex: 1,
      sortable: true,
      sortDirection: 'desc', // Sorting the column in descending order by default
      renderCell: (params) => {
        const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

        // Format the number as comma-separated with a rupee symbol
        const formattedValue =
          value
            ? `₹ ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`
            : "₹ 0";
        // Use the index of the row to identify the top 3
        const rowIndex = params.id;
        // 276c53--dark
        // 3ea376-- light dark
        //  6ead97
        const getBackgroundColor = (index) => {
          if (index === 0) return "#276c53"; // Darker green
          if (index === 1) return "#3ea376"; // Medium green
          if (index === 2) return "#6ead97"; // Light green
          return "transparent"; // Default color for other rows
        };
        // Style object for the cell
        const cellStyle = {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping
          backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
          color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
          fontWeight: "bold",
          padding: "8px",
          fontSize: '17px'
        };
        return (
          <Box
            sx={cellStyle}
          >
            <span
              style={{ userSelect: "text" }} // Allow text selection for copying
            >
              {formattedValue ? formattedValue : "N/A"}
            </span>
          </Box>
        );
      },
    },
    {
      field: "totalMegaWatt",
      headerName: " Mega Watt",
      minWidth: 120,
      flex: 1,
      sortable: true,
      sortDirection: 'desc', // Sorting the column in descending order by default
      renderCell: (params) => {
        const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

        // Format the number as comma-separated with a rupee symbol
        const formattedValue =
          value
            ? ` ${new Intl.NumberFormat('en-IN', {
              minimumFractionDigits: 5,
              maximumFractionDigits: 5
            }).format(value)} MW`
            : "0 Mega Watt";

        // console.log(formattedValue);

        // Use the index of the row to identify the top 3
        const rowIndex = params.id;
        // 276c53--dark
        // 3ea376-- light dark
        //  6ead97
        const getBackgroundColor = (index) => {
          if (index === 0) return "#276c53"; // Darker green
          if (index === 1) return "#3ea376"; // Medium green
          if (index === 2) return "#6ead97"; // Light green
          return "transparent"; // Default color for other rows
        };
        // Style object for the cell
        const cellStyle = {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping
          backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
          color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
          fontWeight: "bold",
          padding: "8px",
          fontSize: '17px'

        };
        return (
          <Box
            sx={cellStyle}
          >
            <span
              style={{ userSelect: "text" }} // Allow text selection for copying
            >
              {formattedValue ? formattedValue : "N/A"}
            </span>
          </Box>
        );
      },
    },


  ]


  if (partyName || piNo) {
    columns.push({
      field: 'partyName',
      headerName: 'Party Name',
      minWidth: 450,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

        // Use the index of the row to identify the top 3
        const rowIndex = params.id;
        const getBackgroundColor = (index) => {
          if (index === 0) return "#276c53"; // Darker green
          if (index === 1) return "#3ea376"; // Medium green
          if (index === 2) return "#6ead97"; // Light green
          return "transparent"; // Default color for other rows
        };
        // Style object for the cell
        const cellStyle = {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping
          backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparanet', // Dynamic background color
          color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
          fontWeight: "bold",
          padding: "8px",
          fontSize: '17px'
        };
        return (<Box
          sx={cellStyle}
        >
          {params.value ? params.value : 'N/A'}
        </Box>)
      },
    })
  }

  if (panelType?.moduleType && panelType?.monobi) {
    // console.log('params in panel type',)
    columns.push({
      field: 'panelType',
      headerName: 'Panel Type',
      minWidth: 350,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

        // Use the index of the row to identify the top 3
        const rowIndex = params.id;
        const getBackgroundColor = (index) => {
          if (index === 0) return "#276c53"; // Darker green
          if (index === 1) return "#3ea376"; // Medium green
          if (index === 2) return "#6ead97"; // Light green
          return "transparent"; // Default color for other rows
        };
        // Style object for the cell
        const cellStyle = {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping
          backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
          color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
          fontWeight: "bold",
          padding: "8px",
          fontSize: '17px'
        };
        const { moduleType, monobi, wattage, type } = formData?.panelType

        let PanelType = wattage + "-" + type + "-" + moduleType + "-" + monobi
        return <Box
          sx={cellStyle}
        >
          {params.value ? params.value : 'N/A'}
        </Box>
      },
    })
  }
  if (wattage) {
    columns.push({
      field: 'watage',
      headerName: 'Wattage',
      minWidth: 120,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

        // Use the index of the row to identify the top 3
        const rowIndex = params.id;
        const getBackgroundColor = (index) => {
          if (index === 0) return "#276c53"; // Darker green
          if (index === 1) return "#3ea376"; // Medium green
          if (index === 2) return "#6ead97"; // Light green
          return "transparent"; // Default color for other rows
        };
        // Style object for the cell
        const cellStyle = {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping
          backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
          color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
          fontWeight: "bold",
          padding: "8px",
          fontSize: '17px'
        };
        return (<Box
          sx={cellStyle}
        >
          {params.value ? params.value : 'N/A'}
        </Box>)
      },
    })
  }

  if (type) {
    columns.push({
      field: 'dcr_nondcr',
      headerName: 'Type',
      minWidth: 120,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

        // Use the index of the row to identify the top 3
        const rowIndex = params.id;
        const getBackgroundColor = (index) => {
          if (index === 0) return "#276c53"; // Darker green
          if (index === 1) return "#3ea376"; // Medium green
          if (index === 2) return "#6ead97"; // Light green
          return "transparent"; // Default color for other rows
        };
        // Style object for the cell
        const cellStyle = {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping
          backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
          color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
          fontWeight: "bold",
          padding: "8px",
          fontSize: '17px'
        };

        return (<Box
          sx={cellStyle}
        >
          {params?.value ? params?.value : 'N/A'}
        </Box>)
      },
    })
  }
  if (piNo) {
    columns.push(
      {
        field: 'piNo',
        headerName: 'PI No.',
        minWidth: 150,
        flex: 1,
        sortable: true,
        renderCell: (params) => {
          const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

          // Use the index of the row to identify the top 3
          const rowIndex = params.id;
          const getBackgroundColor = (index) => {
            if (index === 0) return "#276c53"; // Darker green
            if (index === 1) return "#3ea376"; // Medium green
            if (index === 2) return "#6ead97"; // Light green
            return "transparent"; // Default color for other rows
          };
          // Style object for the cell
          const cellStyle = {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal", // Allow wrapping
            backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
            color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
            fontWeight: "bold",
            padding: "8px",
            fontSize: '17px'
          };
          return <Box
            sx={cellStyle}
          >
            {params?.value ? params?.value : 'N/A'}
          </Box>
        },
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        minWidth: 100,
        flex: 1,
        sortable: true,
        renderCell: (params) => {
          const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

          // Use the index of the row to identify the top 3
          const rowIndex = params.id;

          const getBackgroundColor = (index) => {
            if (index === 0) return "#276c53"; // Darker green
            if (index === 1) return "#3ea376"; // Medium green
            if (index === 2) return "#6ead97"; // Light green
            return "transparent"; // Default color for other rows
          };
          // Style object for the cell
          const cellStyle = {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal", // Allow wrapping
            backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
            color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
            fontWeight: "bold",
            padding: "8px",
            fontSize: '17px'
          };
          return <Box
            sx={cellStyle}
          >
            {params.value ? params.value : 'N/A'}
          </Box>
        },
      },
      {
        field: 'remainingQuantity',
        headerName: 'Remaining Quantity',
        minWidth: 100,
        flex: 1,
        sortable: true,
        renderCell: (params) => {
          const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

          // Use the index of the row to identify the top 3
          const rowIndex = params.id;
          const getBackgroundColor = (index) => {
            if (index === 0) return "#276c53"; // Darker green
            if (index === 1) return "#3ea376"; // Medium green
            if (index === 2) return "#6ead97"; // Light green
            return "transparent"; // Default color for other rows
          };
          // Style object for the cell
          const cellStyle = {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal", // Allow wrapping
            backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : "transparent", // Dynamic background color
            color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
            fontWeight: "bold",
            padding: "8px",
            fontSize: '17px'
          };
          const { remainingQuantity, quantity, totalAmount, } = params.row
          let remain = remainingQuantity
            ? Number(remainingQuantity)
            : Number(quantity);

          return (<Box
            sx={cellStyle}
          >
            {value}
          </Box>)
        },
      },
      {
        field: 'dispatchQuantity',
        headerName: 'Dispatch Quantity',
        minWidth: 100,
        flex: 1,
        sortable: true,
        renderCell: (params) => {
          const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

          // Use the index of the row to identify the top 3
          const rowIndex = params.id;
          const getBackgroundColor = (index) => {
            if (index === 0) return "#276c53"; // Darker green
            if (index === 1) return "#3ea376"; // Medium green
            if (index === 2) return "#6ead97"; // Light green
            return "transparent"; // Default color for other rows
          };
          // Style object for the cell
          const cellStyle = {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal", // Allow wrapping
            backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
            color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
            fontWeight: "bold",
            padding: "8px",
            fontSize: '17px'
          };
          const { remainingQuantity, quantity, totalAmount, } = params.row
          let remain =

            Number(quantity) - Number(remainingQuantity);

          return (<Box
            sx={cellStyle}
          >
            {params?.value ? params?.value : '0'}
          </Box>)
        },
      },
      // {
      //   field: 'partyName',
      //   headerName: 'Party Name',
      //   minWidth: 400,
      //   flex: 1,
      //   sortable: true,
      //   renderCell: (params) => {
      //     const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

      //     // Use the index of the row to identify the top 3
      //     const rowIndex = params.id;
      //     const getBackgroundColor = (index) => {
      //       if (index === 0) return "#276c53"; // Darker green
      //       if (index === 1) return "#3ea376"; // Medium green
      //       if (index === 2) return "#6ead97"; // Light green
      //       return "transparent"; // Default color for other rows
      //     };
      //     // Style object for the cell
      //     const cellStyle = {
      //       overflow: "hidden",
      //       textOverflow: "ellipsis",
      //       whiteSpace: "normal", // Allow wrapping
      //       backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
      //       color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
      //       fontWeight: "bold",
      //       padding: "8px",
      //     };

      //     return <Box
      //       sx={cellStyle}
      //     >
      //       {params.value ? params.value : 'N/A'}
      //     </Box>
      //   },
      // },



    )
  }
  if (piNo) {
    columns.splice(2, 0, {
      field: 'panelType',
      headerName: 'Panel Type',
      minWidth: 360,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

        // Use the index of the row to identify the top 3
        const rowIndex = params.id;
        const getBackgroundColor = (index) => {
          if (index === 0) return "#276c53"; // Darker green
          if (index === 1) return "#3ea376"; // Medium green
          if (index === 2) return "#6ead97"; // Light green
          return "transparent"; // Default color for other rows
        };
        // Style object for the cell
        const cellStyle = {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping
          backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
          color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
          fontWeight: "bold",
          padding: "8px",
          fontSize: '17px'
        };
        const { MonofacialBifacial, dcr_nondcr, remainingQuantity, quantity, totalAmount, watage } = params.row

        let panelType = watage + "-" + dcr_nondcr + "-" + MonofacialBifacial
        return (<Box
          sx={cellStyle}
        >
          {panelType ? panelType : 'N/A'}
        </Box>)
      },
    },)
  }
  if ((panelType?.moduleType && panelType?.monobi) || wattage) {
    columns.push({
      field: "totalQuantity",
      headerName: "Total Panel Quantity",
      minWidth: 120,
      flex: 1,
      sortable: true,
      sortDirection: 'desc', // Sorting the column in descending order by default
      renderCell: (params) => {
        const value = params?.value ?? 0; // Fallback to 0 if value is null/undefined

        // Format the number as comma-separated with a rupee symbol
        const formattedValue =
          value
            ? ` ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`
            : " 0";
        // Use the index of the row to identify the top 3
        const rowIndex = params.id;
        // 276c53--dark
        // 3ea376-- light dark
        //  6ead97
        const getBackgroundColor = (index) => {
          if (index === 0) return "#276c53"; // Darker green
          if (index === 1) return "#3ea376"; // Medium green
          if (index === 2) return "#6ead97"; // Light green
          return "transparent"; // Default color for other rows
        };
        // Style object for the cell
        const cellStyle = {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping
          backgroundColor: data?.length > 1 ? getBackgroundColor(rowIndex) : 'transparent', // Dynamic background color
          color: data?.length > 1 && rowIndex < 3 ? "white" : "black", // Text color based on top 3
          fontWeight: "bold",
          padding: "8px",
          fontSize: '17px'
        };
        return (
          <Box
            sx={cellStyle}
          >
            <span
              style={{ userSelect: "text" }} // Allow text selection for copying
            >
              {formattedValue ? formattedValue : "N/A"}
            </span>
          </Box>
        );
      },
    },)
  }

  return columns;
};


