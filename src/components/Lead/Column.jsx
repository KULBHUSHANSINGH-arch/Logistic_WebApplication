import React, { useState } from "react";

import { Tooltip } from "@mui/material";


import EditIcon from "@mui/icons-material/Edit";

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
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; 
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import { IoCheckmarkDone } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";

import DownloadIcon from '@mui/icons-material/Download';
import { DialogActions, DialogContent, DialogTitle, Select, FormControl, InputLabel } from '@mui/material';
import NotesModal from "./Notes";
import ReasonModal from './Reason';







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








export const Column = (data, handleOpen, status, designation, handleEdit,fetchData,setStatus) => {
    
    // const handleSaveNotes = (rowId, updatedNotes, followDate) => {
    //     if (!rowId) {
    //         console.error("No row ID provided");
    //         return;
    //     }

    //     const payload = {
    //         notes: updatedNotes,
    //         followDate,
    //     };
    //     console.log("payload", payload);


    //     // Save to the backend
    //     fetch(`/api/save-notes/${rowId}`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(payload),
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log("Notes saved successfully:", data);
    //         })
    //         .catch((error) => {
    //             console.error("Error saving notes:", error);
    //         });
    // };

    // const fetchNotes = async (rowId) => {
    //     try {
    //         const response = await fetch(`/api/get-notes/${rowId}`);
    //         const data = await response.json();
    //         return {
    //             notes: data.notes || [],
    //             followDate: data.followDate || "",
    //         };
    //     } catch (error) {
    //         console.error("Error fetching notes:", error);
    //         return { notes: [], followDate: "" };
    //     }
    // };
    // const [open, setOpen] = useState(false);
    // const [currentItem, setCurrentItem] = useState(null); // Item being edited
    // const [notes, setNotes] = useState({}); // Object to store notes by item ID
    // const [newNote, setNewNote] = useState('');

    // const handleEdits = (item) => {
    //     setCurrentItem(item);
    //     setOpen(true);
    //   };

    //   // Handle adding a new note
    //   const handleAddNote = () => {
    //     if (newNote.trim()) {
    //       setNotes((prevNotes) => ({
    //         ...prevNotes,
    //         [currentItem.id]: [...(prevNotes[currentItem.id] || []), newNote],
    //       }));
    //       setNewNote(''); // Clear the input field
    //     }
    //   };

    //   // Handle closing the modal
    //   const handleClose = () => {
    //     setOpen(false);
    //     setCurrentItem(null);
    //     setNewNote('');
    //   };



    // totalQuantity
    let columns = [
        // {
        //     field: "userProfile",
        //     headerName: "User Profile",
        //     minWidth: 150,
        //     flex: 1,
        //     sortable: true,

        //     renderCell: (params) => {
        //         // Extract the image URL from params.value or fallback to null
        //         const imageUrl = params?.value || null;

        //         return (
        //             <Box
        //                 sx={{
        //                     display: "flex",
        //                     alignItems: "center",
        //                     gap: "8px", // Gap between image and text
        //                     backgroundColor: "transparent",
        //                     padding: "4px 8px",
        //                     borderRadius: "4px", // Optional corner rounding
        //                 }}
        //             >
        //                 {imageUrl ? (
        //                     <Box
        //                         component="img"
        //                         src={imageUrl}
        //                         alt="User Profile"
        //                         sx={{
        //                             width: "40px", // Set width for circular shape
        //                             height: "40px", // Set height for circular shape
        //                             borderRadius: "50%", // Makes the image circular
        //                             objectFit: "cover", // Ensures the image fits properly
        //                         }}
        //                     />
        //                 ) : (
        //                     <Box
        //                         sx={{
        //                             fontWeight: "bold",
        //                             color: "gray",
        //                         }}
        //                     >
        //                         N/A
        //                     </Box>
        //                 )}
        //  </Box>
        // );
        // },
        // },
        {
            field: "enquiryType",
            headerName: "Enquiry Type",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "source",
            headerName: "Source",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "quantity",
            headerName: "Quantity",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "unit",
            headerName: "Unit",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "moduleType",
            headerName: "Module Type",
            minWidth: 380,
            flex: 1,
            sortable: true,
            renderCell: (params) => {
                const moduleData = params?.value;
                
                if (!moduleData || !Array.isArray(moduleData) || moduleData.length === 0) {
                    return "N/A"; // Fallback in case data is missing or incorrect
                }
        
                // Extract and concatenate values
                const moduleInfo = moduleData.map(item => 
                    `${item.type} | ${item.monobi} | ${item.wattage} | ${item.moduleType}`
                ).join(", "); // If multiple objects exist, join them with commas
        
                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: 'transparent',
                            padding: "4px 8px",
                            borderRadius: "4px",
                        }}
                    >
                        <Box
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontWeight: "bold",
                                color: "black",
                            }}
                        >
                            {moduleInfo}
                        </Box>
                    </Box>
                );
            },
        },



        {
            field: "companyName",
            headerName: "Company Name",
            minWidth: 160,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "customerName",
            headerName: "Customer Name",
            minWidth: 160,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "mobileNumber",
            headerName: "Mobile Number",
            minWidth: 150,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "email",
            headerName: "Email",
            minWidth: 180,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "state",
            headerName: "State",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "city",
            headerName: "City",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "notes",
            headerName: "Notes",
            minWidth: 120,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined
                const truncatedValue = value.length > 20 ? `${value.substring(0, 20)}...` : value; // Truncate if too long

                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px", // Gap between image and name
                            backgroundColor: "transparent", // Dynamic background color
                            padding: "4px 8px",
                            borderRadius: "4px", // Optional corner rounding
                        }}
                    >
                        <Tooltip title={value} arrow placement="top" fontSize='16'>
                            <Box
                                sx={{
                                    overflow: "hidden",
                                    // fontSize:'16px',
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap", // Prevent wrapping
                                    fontWeight: "bold",
                                    color: "black", // Text color for top 3 rows
                                    cursor: "pointer", // Indicates interactivity
                                }}
                            >
                                {truncatedValue}
                            </Box>
                        </Tooltip>
                    </Box>
                );
            },
        },
        {
            field: "createdOn",
            headerName: "Enquiry Date",
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
        // {
        //     field: "gstNumber",
        //     headerName: "GST Number",
        //     minWidth: 150,
        //     flex: 1,
        //     sortable: true,

        //     renderCell: (params) => {
        //         // console.log('params', params);
        //         const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
        // {
        //     field: "address",
        //     headerName: "Address",
        //     minWidth: 120,
        //     flex: 1,
        //     sortable: true,

        //     renderCell: (params) => {
        //         // console.log('params', params);
        //         const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "createdBy",
            headerName: "Marketing Executive",
            minWidth: 170,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "salesPersonName",
            headerName: "Assigned To",
            minWidth: 150,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
            field: "AssignByName",
            headerName: "Assigned By",
            minWidth: 160,
            flex: 1,
            sortable: true,

            renderCell: (params) => {
                // console.log('params', params);
                const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
        //     field: "salesPersonName",
        //     headerName: "Sales Person",
        //     minWidth: 120,
        //     flex: 1,
        //     sortable: true,

        //     renderCell: (params) => {
        //         // console.log('params', params);
        //         const value = params?.value ? params?.value : "N/A"; // Fallback to 'N/A' if value is null/undefined


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
    field: "actions",
    headerName: "Actions",
    minWidth: 250,
    flex: 1,
    renderCell: (params) => {
      const handleSaveNotes = (updatedNotes) => {
        console.log("Paaaaaaaaa", updatedNotes);
        const lastNote = updatedNotes[updatedNotes.length - 1]; 
        const payload = {
          status:lastNote.followUpType== "Call Not Received"?"Followup-Pending":"Followup",
          followUpData: updatedNotes,
          customerId: params.row.customerId,
        };
        console.log("Payload", payload);
  
        // Save to backend
        fetch("https://enquiry.umanerp.com/api/enquiry/addEnquiry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Notes saved successfully:", data);
            if(lastNote.followUpType=="Call Not Received"){
                setStatus('Followup-Pending')

            }
            else{
                setStatus('Followup')

            }
           
          })
          .catch((error) => {
            console.error("Error saving notes:", error);
          });
      };
  
      const fetchNotes = async (id,user) => {
        try {
            const response = await fetch("https://enquiry.umanerp.com/api/enquiry/getEnquiry", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                personId: user?.personId,
                status: "Followup",
                customerId: id,
              }),
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
        
            // Extract notes and followDate from the response
            const notes = data.customer?.followUpData || [];
            // const followDate = data.customer?.followUpData[0]?.followDate || ""; // Use the first followDate if available
        
            return {
              notes: notes,
              reason:data.customer?.reason||"",
            //   followDate: followDate,
              id: data.customer?.customerId || "", // Use customerId as the ID
            };
          } catch (error) {
            console.error("Error fetching notes:", error);
            return { notes: [], followDate: "", id: "" };
          }
      };
  
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <NotesModal
            row={params.row}
            onSave={handleSaveNotes}
            fetchNotes={fetchNotes}
            status = {status}
           
          />
  
          {status === 'Followup'|| status === 'Assigned' ? (
            <Tooltip title="Resolve" arrow>
            <Button
              onClick={() => handleOpen(params?.row,"Resolve")}
              variant="contained"
              color="success" // Green color for resolve
              startIcon={<CheckCircleIcon />} 
           
              sx={{ minWidth: "10px" }}
            >
          {/* Text appears only on hover */}
            </Button>
            </Tooltip>
          ):""}
           {status === 'Followup' || status === 'Assigned' ? (
             <Tooltip title="Reject" arrow>
            <Button
              onClick={() => handleOpen(params?.row,"Reject")}
              variant="contained"
              color="error" // Red color for reject
              startIcon={<CancelIcon />}
               // ❌ Reject icon
              
               sx={{ minWidth: "10px" }}
            >
      
            </Button>
            </Tooltip>
          ):""}
           {status === 'Resolve' || status === 'Reject' ? (
  <ReasonModal 
    row={{ ...params.row, user: params.row.user }} 
    fetchNotes={fetchNotes}
    status={status}
  />
) : ""}
        </Box>
      );
    },
  }


    ]

    if (status !== 'Assigned') {
        columns = columns.filter(column => column.field !== 'AssignByName' && column.field !== 'assignTo');
    }
    const EditIcon = ({ className, onClick }) => (
        <span className={className} onClick={onClick}>
            🖉 {/* Example icon; replace with a proper icon */}
        </span>
    );


    return columns;
}