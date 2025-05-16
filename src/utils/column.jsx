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
  Typography,

} from "@mui/material";
import { useSelector } from "react-redux";
import { IoCheckmarkDone } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
// BR45P6041
// Helper function to convert UTC to IST
const convertToIST = (utcDate) => {
  const date = new Date(utcDate);
  const options = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleTimeString("en-IN", options);
};

// Helper function to check if all images exist
const allImagesExist = (row) => {
  return (
    row.vehicleImg1 && row.vehicleImg2 && row.vehicleImg3 && row.vehicleImg4
  );
};

export const createColumns = ({
  handleClick = () => { },
  handleEdit = () => { },
  handleEdits = () => { },
  handleImageClick = () => { },
  handleInvoiceModalPHP = () => { },
  userDesignation,
  userDepartment,
  vehicleStatus,
  setOpenUploadModal = () => { },
  setUploadType = () => { },
  setUploadData = () => { },
  handlePdfClick = () => { },
  handleExcelClick = () => { },
  handleMaplick = () => { },
  handleDeliveredClick = () => { },
  handleWatageOpen = () => { },

} = {}) => {
  console.log('designation', userDesignation, 'vehcile status', vehicleStatus)
  const columns = [
    {
      field: "piNo",
      headerName: "PI Number",
      minWidth: 130,
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
      field: "panelDetails",
      headerName: "Panel Details",
      minWidth: 190,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        // console.log('params row data:', params.row.id);
        const data = Array.isArray(params.value) && params.value.length > 0 ? params.value : null;

        return (
          <Tooltip
            title={
              data ? (
                <Box
                  sx={{
                    padding: 1,
                    borderRadius: "4px",
                    backgroundColor: "#f5f5f5",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    maxWidth: "300px",
                  }}
                >
                  {data.map((item, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        padding: "4px 0",
                        borderBottom: index < data.length - 1 ? "1px solid #ddd" : "none",
                      }}
                    >
                      <strong>wattage:</strong> {item.watage}, <strong>quantity:</strong> {item.quantity}
                    </Typography>
                  ))}
                </Box>
              ) : (
                "No Data Available"
              )
            }
            arrow
            placement="top"
          >
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "#1976d2", // Primary color for better visibility
                fontWeight: "bold",
                cursor: "pointer", // Indicates interactivity
                textDecoration: "underline", // Subtle highlight
              }}
              onClick={() => handleWatageOpen(data, params.row.id)}
            >
              {data ? (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Wattage: {data[0].watage}, Quantity: {data[0].quantity}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#999",
                  }}
                >
                  N/A
                </Typography>
              )}
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
      field: "driverNumber",
      headerName: "Driver Number",
      minWidth: 130,
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
      field: "PartyName",
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
      field: "Address",
      headerName: "Delivery Address",
      minWidth: 120,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const handleCopy = () => {
          if (navigator.clipboard) {
            navigator.clipboard
              .writeText(params.value)
              .then(() => {
                toast.success("Copied to clipboard!");
              })
              .catch((error) => {
                console.error("Copy failed", error);
                toast.error("Failed to copy. Please try again!");
              });
          } else {
            toast.error("Clipboard API not supported in this browser.");
          }
        };

        return (
          <Tooltip
            title={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row", // Keep text and icon side by side
                  alignItems: "flex-start", // Align content at the top if text wraps
                  gap: 1, // Space between text and icon
                  whiteSpace: "normal", // Allow wrapping for long content
                  maxWidth: 300, // Fixed width for the tooltip
                  overflow: "auto", // Allow vertical scrolling for very long content
                  padding: 1, // Add some padding for a polished look
                  background: "#000000", // Black background for tooltip
                  borderRadius: 1, // Rounded corners
                  fontSize: "0.875rem", // Slightly smaller text for better scaling
                  color: "#fafafa", // White text
                }}
              >
                <span
                  style={{
                    wordBreak: "break-word", // Ensure text wraps properly
                  }}
                >
                  {params.value}
                </span>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent grid row selection on button click
                    handleCopy();
                  }}
                  size="small"
                  sx={{
                    color: "#fafafa", // White color for the icon
                    padding: 0, // Compact button
                  }}
                >
                  <FileCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer", // Indicate interactivity
              }}
            >
              {params.value}
            </Box>
          </Tooltip>
        );
      },
    },

    {
      field: "TransporterName",
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

    // {
    //   field: "invoiceNo",
    //   headerName: vehicleStatus === "transporter billing pending" ? "Transporter Billing Details" : "Billing Details",
    //   minWidth: 350,
    //   flex: 1,
    //   sortable: true,
    //   renderCell: (params) => {
    //     console.log("Invoice No Data:", params);

    //     // Ensure invoiceData is an array; if it's null, set it to an empty array
    //     const invoiceData = Array.isArray(params.row?.invoiceNo) ? params.row.invoiceNo : [];
    //     const price = params.row?.price ? params.row.price : "N/A"

    //     return (
    //       <Box display="flex" alignItems="center" gap={1} width="100%">
    //         {/* Tooltip for Invoice Details */}
    //         <Tooltip
    //           title={
    //             invoiceData.length > 0 ? (
    //               <Box>
    //                 {invoiceData.map((item, index) => (
    //                   <div key={index}>
    //                     LR Number: {item.lrNumber}, 
    //                     {vehicleStatus !== "transporter billing pending" && ` Invoice No: ${item.invoiceNo},`} 
    //                   </div>
    //                 ))}
    //                 Price: {price ?? "N/A"}
    //               </Box>
    //             ) : (
    //               "No Billing Details Available"
    //             )
    //           }
    //           arrow
    //           placement="top"
    //         >
    //           <Typography
    //             variant="body2"
    //             sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}
    //           >
    //             {invoiceData.length > 0
    //               ? `LR Number: ${invoiceData[0]?.lrNumber}, ${
    //               vehicleStatus !== "transporter billing pending" ? `Invoice No: ${invoiceData[0]?.invoiceNo}, ` : ""
    //               }Price: ${price}`
    //           : "No Data Available"}
    //           </Typography>
    //         </Tooltip>

    //         {/* Edit Button (Always Visible) */}
    //         {userDesignation === "Super Admin" && (
    //           <IconButton color="secondary" onClick={() => handleEdits(params.row)}>
    //             <Edit />
    //           </IconButton>
    //         )}
    //       </Box>
    //     );

    //   },
    // },
    ...(vehicleStatus !== "transporter billing pending"
      ? [
        {
          field: "invoiceNo",
          headerName: "Company Billing Details",
          minWidth: 350,
          flex: 1,
          sortable: true,
          renderCell: (params) => {
            console.log("Invoice No Data:", params);

            // Ensure invoiceData is an array; if it's null, set it to an empty array
            const invoiceData = Array.isArray(params.row?.invoiceNo) ? params.row.invoiceNo : [];


            return (
              <Box display="flex" alignItems="center" gap={1} width="100%">
                {/* Tooltip for Invoice Details */}
                <Tooltip
                  title={
                    invoiceData.length > 0 ? (
                      <Box>
                        {invoiceData.map((item, index) => (
                          <div key={index}>
                            LR Number: {item.lrNumber},
                            Invoice No: {item.invoiceNo},
                          </div>
                        ))}
                      </Box>
                    ) : (
                      "No Billing Details Available"
                    )
                  }
                  arrow
                  placement="top"
                >
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}
                  >
                    {
                      invoiceData.length > 0
                        ? `LR Number: ${invoiceData[0]?.lrNumber}, Invoice No: ${invoiceData[0]?.invoiceNo}`
                        : "No Data Available"
                    }
                  </Typography>
                </Tooltip>

                {/* Edit Button (Always Visible) */}
                {(userDesignation === "Super Admin" && vehicleStatus === "pending") && (
                  <IconButton color="secondary" onClick={(e) => {
                    handleEdits(params.row)
                    e.stopPropagation();
                  }
                  }
                  >
                    <Edit />
                  </IconButton>
                )}
              </Box>
            );
          },
        },
      ]
      : []
    ),


    ...(vehicleStatus !== "pending"
      ? [
        {
          field: "transporterBillingDetails",
          headerName: "Transporter Billing Details",
          minWidth: 350,
          flex: 1,
          sortable: true,
          renderCell: (params) => {
            console.log("transporterBillingDetails Params:", params);

            // Ensure invoiceData is an array; if it's null, set it to an empty array
            const transporterBillingDetails = Array.isArray(params.row?.transporterBillingDetails) ? params.row.transporterBillingDetails : [];

            console.log("transporterBillingDetails", transporterBillingDetails);

            return (
              <Box display="flex" alignItems="center" gap={1} width="100%">
                {/* Tooltip for Invoice Details */}
                <Tooltip
                  title={
                    transporterBillingDetails.length > 0 ? (
                      <Box>
                        {transporterBillingDetails.map((item, index) => (
                          <div key={index}>
                            LR Number: {item.lrNumber},
                            Invoice No: {item.invoiceNo},
                            Price: {item.price}
                          </div>
                        ))}

                      </Box>
                    ) : (
                      "No Billing Details Available"
                    )
                  }
                  arrow
                  placement="top"
                >
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}
                  >
                    {
                      vehicleStatus === "transporter billing pending"
                        ? "No Data Available"
                        : transporterBillingDetails.length > 0
                          ? `LR Number: ${transporterBillingDetails[0]?.lrNumber}, Invoice No: ${transporterBillingDetails[0]?.invoiceNo}, Price: ${transporterBillingDetails[0]?.price}`
                          : "No Data Available"
                    }
                  </Typography>
                </Tooltip>

                {/* Edit Button (Always Visible) */}
                {(userDesignation === "Super Admin" && vehicleStatus === "transporter billing pending") && (
                  <IconButton color="secondary" onClick={() => handleEdits(params.row)}>
                    <Edit />
                  </IconButton>
                )}
              </Box>
            );
          },
        },
      ]
      : []
    ),




    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const status = params.value;
        let color = "black";
        let bgColor = "white";

        switch (status) {
          case "IN":
            bgColor = "#05713e";
            color = "#f9f9f9";
            break;
          case "OUT":
            bgColor = "#f8d7da";
            color = "#721c24";
            break;
          case "CANCELED":
            bgColor = "#fb3403";
            color = "#eaeaea";
            break;
          case "LOADING":
            bgColor = "#424646";
            color = "#d4d4d4";
            break;
          case "TRANSFERRED":
            bgColor = "#125a38";
            color = "#ffffff";
            break;
          case "PENDING":
            bgColor = "#b59a2e";
            color = "#ffffff";
            break;
          default:
            bgColor = "white";
            color = "black";
        }

        return (
          <Box
            sx={{
              backgroundColor: bgColor,
              color: color,
              cursor: "pointer",
              padding: "0px 3px",
              borderRadius: "4px",
              textAlign: "center",
              whiteSpace: "normal", // Allow wrapping
              fontSize: "10px",
            }}
          >
            {status}
          </Box>
        );
      },
    },

    {
      field: "vehicleImg",
      headerName: "Vehicle Image",
      width: 130,
      renderCell: (params) => (
        <Box sx={{ width: 130, height: 100 }}>
          <img
            src={params.value}
            alt="Vehicle"
            style={{
              width: "100%", // Use full width of the cell
              height: "100%", // Use full height of the box
              objectFit: "cover", // Adjust image scaling
              cursor: "pointer",
            }}
            onClick={(e) => {
              handleImageClick(params.value)
              e.stopPropagation();
            }
            }
          />
        </Box>
      ),
    },
    {
      field: "resultDate",
      headerName: "Date",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const dateToFormat = params.row.resultDate;
        const parsedDate = new Date(dateToFormat);
        if (isNaN(parsedDate.getTime())) {
          return (
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal", // Allow wrapping
              }}
            >
              Invalid Date
            </Box>
          );
        }

        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(parsedDate);

        return (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
            }}
          >
            {formattedDate}
          </Box>
        );
      },
    },
    {
      field: "transferFrom",
      headerName: "Transfer From",
      minWidth: 100,
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
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        const hasImages =
          params.row.vehicleImg1 ||
          params.row.vehicleImg2 ||
          params.row.vehicleImg3 ||
          params.row.vehicleImg4 ||
          params.row.invoiceImg ||
          params.row.ewayBill;

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {userDesignation !== "Dispatcher" && (
              <IconButton
                color="primary"
                onClick={() => handleEdit(params.row)}
              >
                <Edit />
              </IconButton>
            )}
            {/* { vehicleStatus === "billing pending" && (
              <IconButton
                color="secondary"
                onClick={() => handleEdits(params.row)}
              >
                <Edit />
              </IconButton>
             )}  */}

            {hasImages && (
              <IconButton
                color="info"
                onClick={(event) => handleClick(event, params.row)}
              >
                <MoreVert />
              </IconButton>
            )}

            {/* Add the right arrow icon based on the conditions */}
            {params.row.status === "OUT" &&
              params.row.consentStatus === "ALLOWED" && (
                <IconButton
                // style={{
                //   backgroundColor: "white",
                //   padding: "8px",
                //   borderRadius: "50%",
                // }}
                >
                  <IoCheckmarkDone
                    style={{ color: "green", fontSize: "24px" }}
                  />
                </IconButton>
              )}
          </Box>
        );
      },
    },

    {
      field: "createdPerson",
      headerName: "Gaurd Name",
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
  ];

  if (
    vehicleStatus === "out" ||
    vehicleStatus === "delivered" ||
    vehicleStatus === "delay"
  ) {
    columns.splice(7, 0, {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      minWidth: 140,
      flex: 1,
      sortable: true,

      renderCell: (params) => {
        let deliveryStatus = params.value;
        let color = "black";
        let bgColor = "white";

        if (deliveryStatus) {
          const statusLower = deliveryStatus.toLowerCase();

          if (vehicleStatus === "delivered") {
            // Remove "arrived()" and get the content inside parentheses
            const match = statusLower.match(/\((.*?)\)/);
            if (match) {
              deliveryStatus = match[1]; // Extract content inside parentheses
            }

            // Apply color logic based on extracted content
            if (deliveryStatus.includes("ontime")) {
              bgColor = "#28a745"; // Green for ontime
              color = "#ffffff"; // White text
            } else if (deliveryStatus.includes("before")) {
              bgColor = "#007bff"; // Blue for before
              color = "#ffffff"; // White text
            } else if (deliveryStatus.includes("delay")) {
              bgColor = "#dc3545"; // Red for delay
              color = "#ffffff"; // White text
            } else {
              // Default to red if no conditions match
              bgColor = "#dc3545"; // Red
              color = "#ffffff"; // White text
            }
          } else if (vehicleStatus === "out") {
            // Do not remove "arrived()" and check its presence
            if (statusLower.startsWith("arrived")) {
              bgColor = "#28a745"; // Green for arrived
              color = "#ffffff"; // White text
            } else if (statusLower.includes("delay")) {
              bgColor = "#dc3545"; // Red for delay
              color = "#ffffff"; // White text
            } else if (statusLower.includes("before")) {
              bgColor = "#007bff"; // Blue for before
              color = "#ffffff"; // White text
            } else {
              // Default to red if no conditions match
              bgColor = "#dc3545"; // Red
              color = "#ffffff"; // White text
            }
          } else {
            // Default for other vehicleStatus cases
            bgColor = "#6c757d"; // Gray for unknown
            color = "#ffffff"; // White text
          }
        } else {
          // If deliveryStatus is null
          bgColor = "#6c757d"; // Light gray for N/A
          color = "#ffffff"; // White text
        }

        return (
          <Box
            onClick={() => handleMaplick(params?.id)} // Add the onClick event
            sx={{
              cursor: "pointer",
              backgroundColor: bgColor,
              color: color,
              padding: "0px 3px",
              borderRadius: "4px",
              textAlign: "center",
              whiteSpace: "normal", // Allow wrapping
              fontSize: "10px",
            }}
          >
            {deliveryStatus == null ? "N/A" : deliveryStatus}
          </Box>
        );
      },
    });
  }

  // Add Delivered Vehicle Column if vehicleStatus is 'out'
  // Add Delivered Vehicle Column if vehicleStatus is 'out'
  if (vehicleStatus === "out" && userDepartment !== 'Sales') {
    columns.splice(8, 0, {
      field: "deliveredVehicle",
      headerName: "Delivered Vehicle",
      minWidth: 130,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const deliveryStatus = params.row.deliveryStatus; // Access deliveryStatus from row data
        const isButtonEnabled = deliveryStatus
          ?.toLowerCase()
          .startsWith("arrived");

        // const handleDeliveredClick = () => {
        //   // Handle button click logic here
        //   console.log("Delivered button clicked for:", params.row);
        // };

        return (
          <Button
            onClick={() => handleDeliveredClick(params.row)}
            // disabled={!isButtonEnabled} // Disable button if not "Arrived"
            variant="contained"
            color={"warning"} // Change color based on button state
            size="small"
          >
            Delivered
          </Button>
        );
      },
    });
  }


  // Conditionally include "Pricing" column based on status and designation
  if (
    userDesignation === "Super Admin" &&
    (vehicleStatus === "out" || vehicleStatus === "pending" || vehicleStatus === "delivered")
  ) {
    columns.push({
      field: "price",
      headerName: "Pricing",
      minWidth: 150,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal", // Allow wrapping
            color: params.value ? "green" : "orange", // Use green for positive values, red for others
          }}
        >
          {params.value ? `₹  ${new Intl.NumberFormat('en-IN').format(params.value)}` : "No Pricing"}
        </Box>
      ),
    });
  }
  // Conditionally include columns if userDesignation is Super Admin or Dispatcher, and vehicleStatus is 'out'
  if (
    (userDesignation === "Super Admin" || userDesignation === "Dispatcher" || userDesignation === "Sales Executive") &&
    (vehicleStatus === "out" || vehicleStatus === "pending" || vehicleStatus === "delivered")
  ) {
    // ChalanDis column (PDF)
    columns.push({
      field: "chalanDis",
      headerName: "Invoice",
      minWidth: 150,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const chalanUrl = params.value;

        return chalanUrl ? (
          <Box
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
              cursor: "pointer",
              color: "blue", // Indicate it's clickable
            }}
            onClick={() => handlePdfClick(chalanUrl, "pdf")} // handleFileClick will handle viewing PDF in popup
          >
            View Invoice
          </Box>
        ) : (
          <Box
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "normal", // Allow wrapping
              cursor: "pointer",
              color: "red", // Indicate it's clickable
            }}
            onClick={() => {
              setUploadType("upload-invoice"); // Set the type of file to upload (chalan in this case)
              setUploadData(params.row); // Pass the row data so that you know which vehicle you're uploading for
              setOpenUploadModal(true); // Open the upload modal
            }}
          >
            Upload Invoice
          </Box>
        );
      },
    });

    // EwayDis column (PDF)
    // columns.push({
    //   field: "ewayDis",
    //   headerName: "Eway Bill",
    //   minWidth: 150,
    //   flex: 1,
    //   sortable: true,
    //   renderCell: (params) => {
    //     const ewayBillUrl = params.value;

    //     return ewayBillUrl ? (
    //       <Box
    //         sx={{
    //           textOverflow: "ellipsis",
    //           whiteSpace: "normal", // Allow wrapping
    //           cursor: "pointer",
    //           color: "blue", // Indicate it's clickable
    //         }}
    //         onClick={() => handlePdfClick(ewayBillUrl, "pdf")} // handleFileClick will handle viewing PDF in popup
    //       >
    //         View Eway Bill
    //       </Box>
    //     ) : (
    //       <Box
    //         sx={{
    //           textOverflow: "ellipsis",
    //           whiteSpace: "normal", // Allow wrapping
    //           cursor: "pointer",
    //           color: "red", // Indicate it's clickable
    //         }}
    //         onClick={() => {
    //           setUploadType("upload-e-bill"); // Set the type of file to upload (eway in this case)
    //           setUploadData(params.row); // Pass the row data so that you know which vehicle you're uploading for
    //           setOpenUploadModal(true); // Open the upload modal
    //         }}
    //       >
    //         Upload Eway Bill
    //       </Box>
    //     );
    //   },
    // });

    // Material List column (Excel)
    columns.push({
      field: "materialList",
      headerName: "Material List",
      minWidth: 300,
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const materialListUrl = params.value;
        const { invoiceNo } = params.row;

        const showInvoice = vehicleStatus?.trim() === 'pending' &&
          invoiceNo &&
          Array.isArray(invoiceNo) &&
          invoiceNo.length > 0;

        return (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, width: '100%' }}>
            {/* Show View Material List if invoice exists */}
            {showInvoice && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleInvoiceModalPHP(invoiceNo[0]?.invoiceNo);
                }}
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  padding: '2px 8px',
                  minWidth: 'auto',
                  color: 'blue',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 255, 0.04)'
                  }
                }}
                size="small"
                variant="text"
              >
                View Material list
              </Button>
            )}

            {/* Show Download Material List if materialListUrl exists */}
            {materialListUrl && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExcelClick(materialListUrl, "excel");
                }}
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  padding: '2px 8px',
                  minWidth: 'auto',
                  color: 'blue',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 255, 0.04)'
                  }
                }}
                size="small"
                variant="text"
              >
                Download Material List
              </Button>
            )}

            {/* Always show Upload Material List button */}
            {
              !materialListUrl && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadType("upload-material-list");
                    setUploadData(params.row);
                    setOpenUploadModal(true);
                  }}
                  sx={{
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    padding: '2px 8px',
                    minWidth: 'auto',
                    color: 'red',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.04)'
                    }
                  }}
                  size="small"
                  variant="text"
                >
                  Upload Material List
                </Button>
              )
            }

          </Box>
        );
      },
    });

  }
  // Conditionally hide columns if userDesignation is 'Sales Executive'
  if (userDesignation === "Sales Executive") {
    // Filter out the specified columns
    return columns.filter(
      (col) =>
        ![
          "TransporterName",
          "driverNumber",
          "vehicleImg",
          "transferFrom",
          "createdPerson",
          "actions",
        ].includes(col.field)
    );
  }

  return columns;
};

// Function to generate columns based on the data structure
export const getColumns = (handleEdit) => {
  return [
    {
      field: "siNo",
      headerName: "SI No",
      width: 100,
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            color: "black",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "watageName",
      headerName: "Watage Name",
      minWidth: 100,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            color: "black",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,

      renderCell: (params) => (
        <EditIcon
          onClick={() => handleEdit(params.row)}
          sx={{ cursor: "pointer", color: "#f44336" }}
        />
      ),
    },
  ];
};
