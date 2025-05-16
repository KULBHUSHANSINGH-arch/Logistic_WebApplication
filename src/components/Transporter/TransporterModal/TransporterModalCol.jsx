// import React from 'react'

// const TransporterModalCol = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default TransporterModalCol


import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaCheckCircle, FaCheck } from "react-icons/fa"; // Adjust based on your chosen icon
import { Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy"; // Copy Icon

import EditIcon from "@mui/icons-material/Edit";
// import DownloadIcon from '@mui/icons-material/Download';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Edit, MoreVert, Delete } from "@mui/icons-material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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

import DownloadIcon from '@mui/icons-material/Download';
import { DatePicker } from "@mui/x-date-pickers";



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
        return `${day} ${monthName} ${year}`;
    } catch (error) {
        return "Error converting time";
    }
}

// Example usage
const utcTime = "2024-12-05T19:28:13.000Z";



// Example usage
// const utcTime = "2024-12-05T19:28:13.000Z";
// console.log(convertToIndianTime(utcTime)); // Output: "06-12-2024, 12:58 AM"



export  const TransporterModalCol = (data) => {
    const handleDownloadPi = (piNo) => {
        // Logic to download the PI
        if (!piNo) {
            console.error("Invoice Number is not available");
            return;
        }

        // Assuming `piNo` is a file URL or path
        const link = document.createElement('a');
        link.href = piNo; // Ensure this is a direct link to the file
        link.target = '_blank'; // Opens in a new tab
        link.download = `PI-${piNo.split('/').pop() || 'file'}`; // Suggests a filename for the download
        document.body.appendChild(link); // Append to the DOM
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
    };


    // totalQuantity
    const columns = [
        {
            field: "BookedDate",
            headerName: "Booked Date",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? convertToIndianTime(params?.value) : "N/A"; // Fallback to 'N/A' if value is null/undefined


                return (
                    <Box

                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px", // Gap between image and name
                            backgroundColor: 'transparent', // Dynamic background color
                            padding: "4px 8px",
                            borderRadius: "4px", // Optional corner rounding
                        }}
                    >

                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap", // Prevent wrapping
                                fontWeight: "bold",
                                color: "black", // Text color for top 3 rows
                            }}
                        >
                            {value}
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: "vehicleNo",
            headerName: "Vechile No",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ?? "N/A"; // Fallback to 'N/A' if value is null/undefined


                return (
                    <Box

                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px", // Gap between image and name
                            backgroundColor: 'transparent', // Dynamic background color
                            padding: "4px 8px",
                            borderRadius: "4px", // Optional corner rounding
                        }}
                    >

                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap", // Prevent wrapping
                                fontWeight: "bold",
                                color: "black", // Text color for top 3 rows
                            }}
                        >
                            {value}
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: "price",
            headerName: "Fright Cost",
            minWidth: 350,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ?? "N/A"; // Fallback to 'N/A' if value is null/undefined


                return (
                    <Box

                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px", // Gap between image and name
                            backgroundColor: 'transparent', // Dynamic background color
                            padding: "4px 8px",
                            borderRadius: "4px", // Optional corner rounding
                        }}
                    >

                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap", // Prevent wrapping
                                fontWeight: "bold",
                                color: "black", // Text color for top 3 rows
                            }}
                        >
                            {value}
                        </Box>
                    </Box>
                );
            },
        },
        {
            field: "lrNumber",
            headerName: "LR Number",
            minWidth: 350,
            flex: 1,
            // editable:true,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ?? "N/A"; // Fallback to 'N/A' if value is null/undefined


                return (
                    <Box

                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px", // Gap between image and name
                            backgroundColor: 'transparent', // Dynamic background color
                            padding: "4px 8px",
                            borderRadius: "4px", // Optional corner rounding
                        }}
                    >

                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap", // Prevent wrapping
                                fontWeight: "bold",
                                color: "black", // Text color for top 3 rows
                            }}
                        >
                            {value}
                        </Box>
                    </Box>
                );
            },
        },
        // Invoice Date column 

        // {
        //     field: "invoiceDate",
        //     headerName: "Invoice Date",
        //     minWidth: 180,
        //     flex: 1,
        //     editable: true,
        //     sortable: true,
        
        //     renderCell: (params) => {
        //         const value = params?.value ? dayjs(params.value).format("DD-MM-YYYY") : "N/A";
        //         return (
        //             <Box
        //                 sx={{
        //                     fontWeight: "bold",
        //                     color: "black",
        //                     whiteSpace: "nowrap",
        //                     textOverflow: "ellipsis",
        //                     overflow: "hidden",
        //                 }}
        //             >
        //                 {value}
        //             </Box>
        //         );
        //     },
        
        //     renderEditCell: (params) => (
        //         <LocalizationProvider dateAdapter={AdapterDayjs}>
        //             <DatePicker
        //                 value={params?.value ? dayjs(params.value) : null}
        //                 onChange={(newValue) => {
        //                     params.api.setEditCellValue({
        //                         id: params.id,
        //                         field: params.field,
        //                         value: newValue ? newValue.format("YYYY-MM-DD") : null,
        //                     });
        //                 }}
        //                 slotProps={{ textField: { fullWidth: true } }}
        //             />
        //         </LocalizationProvider>
        //     ),
        
        //     valueGetter: (params) => params.value ? dayjs(params.value).format("YYYY-MM-DD") : "",
        //     valueSetter: (params) => ({
        //         ...params.row,
        //         invoiceDate: params.value,
        //     }),
        // },
        {
            field: "invoiceNo",
            headerName: "Company Invoice Number",
            // editable:true,
            minWidth: 350,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ?? "N/A"; // Fallback to 'N/A' if value is null/undefined


                return (
                    <Box

                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px", // Gap between image and name
                            backgroundColor: 'transparent', // Dynamic background color
                            padding: "4px 8px",
                            borderRadius: "4px", // Optional corner rounding
                        }}
                    >

                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap", // Prevent wrapping
                                fontWeight: "bold",
                                color: "black", // Text color for top 3 rows
                            }}
                        >
                            {value}
                        </Box>
                    </Box>
                );
            },
        },

        {
            field: "transporterInvoice",
            headerName: "Transporter Invoice Number",
            // editable:true,
            minWidth: 350,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ?? "N/A"; // Fallback to 'N/A' if value is null/undefined


                return (
                    <Box

                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px", // Gap between image and name
                            backgroundColor: 'transparent', // Dynamic background color
                            padding: "4px 8px",
                            borderRadius: "4px", // Optional corner rounding
                        }}
                    >

                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap", // Prevent wrapping
                                fontWeight: "bold",
                                color: "black", // Text color for top 3 rows
                            }}
                        >
                            {value}
                        </Box>
                    </Box>
                );
            },
        },

        // {
        //     field: "invoiceNo",
        //     headerName: "Invoice Details",
        //     editable: true,
        //     minWidth: 550,
        //     flex: 1,
        //     sortable: true,
        //     renderCell: (params) => {
               
        //         const invoices = Array.isArray(params.value) ? params.value : []; // Ensure it's an array
        
        //         return (
        //             <Box
        //                 sx={{
        //                     display: "flex",
        //                     flexDirection: "column",
        //                     gap: "2px", // Minimal gap to avoid extra space
        //                     padding: "4px 8px",
        //                     whiteSpace: "nowrap", // Prevents line breaks
        //                     overflow: "hidden", // Ensures content does not overflow
        //                     textOverflow: "ellipsis", // Adds "..." if the content is too long
        //                 }}
        //             >
        //                 {invoices.length > 0 ? (
        //                     invoices.map((invoice, index) => (
        //                         <Box key={index} sx={{ fontWeight: "bold", color: "black" }}>
        //                             {`LR No: ${invoice.lrNumber}, Invoice No: ${invoice.invoiceNo}`}
        //                         </Box>
        //                     ))
        //                 ) : (
        //                     <Box sx={{ color: "black" }}>N/A</Box>
        //                 )}
        //             </Box>
        //         );
        //     },
        // },
        {
            field: "status",
            headerName: "Status",
            minWidth: 80,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ?? "N/A";



                return (
                    <Box

                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px", // Gap between image and name
                            backgroundColor: 'transparent', // Dynamic background color
                            padding: "4px 8px",
                            borderRadius: "4px", // Optional corner rounding
                        }}
                    >

                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap", // Prevent wrapping
                                fontWeight: "bold",
                                color: "black", // Text color for top 3 rows
                            }}
                        >
                            {value}
                        </Box>
                    </Box>
                );
            },
        },
       
        {
            field: "action",
            headerName: "Invoice",
            minWidth: 100,
            flex: 0.5,
            sortable: false,

            renderCell: (params) => {
                const invoiceUrl = params?.row?.chalanDis;

                return (
                    <Tooltip title="Download Transporter Report" placement="top">
                        <IconButton
                            onClick={() => handleDownloadPi(invoiceUrl)}
                            color="primary"
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                );
            },
        },


    ]








    return columns;
};


