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

import DownloadIcon from '@mui/icons-material/Download';



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



export const createColumnForSalesModal = (data) => {
    const handleDownloadPi = (piNo) => {
        // Logic to download the PI
        if (!piNo) {
            console.error("PI Number is not available");
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
            field: "date",
            headerName: "Sales Date",
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
            field: "piNo",
            headerName: "PI No",
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
            field: "partyName",
            headerName: "Party Name",
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
            field: "panelTypes",
            headerName: "Panel Type",
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
            field: "finalQuantity",
            headerName: "Quantity",
            minWidth: 80,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = Number(params?.value) ?? "N/A";
                let quantity = params?.row?.status === 'Out' ? params?.row?.quantity : 'N/A';



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
        //     field: "dispatchQuantity",
        //     headerName: "Dispatch Quantity",
        //     minWidth: 140,
        //     flex: 1,
        //     sortable: true,

        //     renderCell: (params) => {
        //         // console.log('params', params);
        //         const value = params?.value ?? "N/A";
        //         let dispatchQuantity = params?.row?.status === 'InDispatch' ? params?.row?.dispatchQuantity : 'N/A';



        //         return (
        //             <Box

        //                 sx={{
        //                     display: "flex",
        //                     alignItems: "center",
        //                     gap: "8px", // Gap between image and name
        //                     backgroundColor: 'transparent', // Dynamic background color
        //                     padding: "4px 8px",
        //                     borderRadius: "4px", // Optional corner rounding
        //                 }}
        //             >

        //                 <Box
        //                     sx={{
        //                         overflow: "hidden",
        //                         textOverflow: "ellipsis",
        //                         whiteSpace: "nowrap", // Prevent wrapping
        //                         fontWeight: "bold",
        //                         color: "black", // Text color for top 3 rows
        //                     }}
        //                 >
        //                     {value}
        //                 </Box>
        //             </Box>
        //         );
        //     },
        // },
        {
            field: "salesAmount",
            headerName: "Sales Amount",
            minWidth: 120,
            flex: 1,
            sortable: true,
            sortDirection: 'desc',  // Set default sorting to descending

            renderCell: (params) => {
                // console.log('params', params);
                const value =Number( params?.value) ?? "N/A";
                



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
                            ₹ {new Intl.NumberFormat('en-IN').format(value)}
                        </Box>
                    </Box>
                );
            },
        },
        // {
        //     field: "dispatchAmount",
        //     headerName: "Dispatch Amount",
        //     minWidth: 120,
        //     flex: 1,
        //     sortable: true,

        //     renderCell: (params) => {
        //         // console.log('params', params);
        //         const value = params?.value ?? "N/A";
        //         let dispatchAmount = params?.row?.status === 'InDispatch' ? params?.row?.dispatchAmount : 'N/A';



        //         return (
        //             <Box

        //                 sx={{
        //                     display: "flex",
        //                     alignItems: "center",
        //                     gap: "8px", // Gap between image and name
        //                     backgroundColor: 'transparent', // Dynamic background color
        //                     padding: "4px 8px",
        //                     borderRadius: "4px", // Optional corner rounding
        //                 }}
        //             >

        //                 <Box
        //                     sx={{
        //                         overflow: "hidden",
        //                         textOverflow: "ellipsis",
        //                         whiteSpace: "nowrap", // Prevent wrapping
        //                         fontWeight: "bold",
        //                         color: "black", // Text color for top 3 rows
        //                     }}
        //                 >
        //                     { value == 'N/A' ? value :new Intl.NumberFormat('en-IN').format(value)}
        //                 </Box>
        //             </Box>
        //         );
        //     },
        // },

        {
            field: "action",
            headerName: "Action",
            minWidth: 100,
            flex: 0.5,
            sortable: false,

            renderCell: (params) => {
                const piNo = params?.row?.pdfPath;

                return (
                    <Tooltip title="Download PI" placement="top">
                        <IconButton
                            onClick={() => handleDownloadPi(piNo)}
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


