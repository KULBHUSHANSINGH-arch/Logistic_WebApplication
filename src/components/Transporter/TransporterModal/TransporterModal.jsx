import React, { useState, useEffect } from "react";
import { Modal, Box, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import { salesModalRows } from "./SalesModalRow";
// import { createColumnForSalesModal } from "./SalesModalColumn";
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { TransporterModalRow } from "./TransporterModalRow";
import { TransporterModalCol } from "./TransporterModalCol";


function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-IN', options).format(new Date(date));
}

const TransporterModal = ({ formData, setModalLoading, modalLoading, data, open, onClose, children }) => {
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])
    // const [list, setList] = useState([])
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [totalVechiles, setTotalVechiles] = useState("");
    // const [editedRows, setEditedRows] = useState({})

    // console.log('rows: ', rows)
    // console.log('columns: ', columns)
    console.log('data: ', data)
    useEffect(() => {
        if (data?.transporterAllOrders) {
            const createRows = TransporterModalRow(data?.transporterAllOrders)
            const createColumn = TransporterModalCol(data?.transporterAllOrders)
            setRows(createRows)
            setColumns(createColumn)
            setModalLoading(false)
        }
        // setList(data?.salesPersonAllOrders)

        setAmount(data?.totalFreightCost)
        setName(data?.transporterName)
        setTotalVechiles(data?.totalVehicles)

    }, [data])

    // const genrateExcelReport = () => {
    //     const createRows = salesModalRows(list)
    //     const createColumn = createColumnForSalesModal(list)
    //     const filterColumn = createColumn?.filter((item) => item.field !== 'action')
    //     salesExcelReport(createRows, filterColumn, formData, name, amount)
    // }
    // const salesExcelReport = async (rowsData, columnsData, formData, name, amount) => {
    //     try {
    //         const workbook = new ExcelJS.Workbook();
    //         const worksheet = workbook.addWorksheet("Sales Orders Report");

    //         // Build heading based on formData (non-array fields)
    //         let headingText = name?.toUpperCase() + "  " + `(Sales Amount: ₹ ${new Intl.NumberFormat('en-IN').format(amount)})`;
    //         let headingDetails = [];

    //         const { moduleType, monobi, wattage, type } = formData?.panelType ? formData?.panelType : {};
    //         if (formData) {
    //             if (formData.fromDate && formData.toDate) {
    //                 const formattedFromDate = formatDate(formData.fromDate);
    //                 const formattedToDate = formatDate(formData.toDate);

    //                 headingDetails.push(`${formattedFromDate} - ${formattedToDate}`);
    //             }
    //             if (formData.type) headingDetails.push(`Type: ${formData.type}`);
    //             if (formData.panelType) {
    //                 headingDetails.push(`Panel-Type: ${wattage}-${type}-${moduleType}-${monobi}`);
    //             }
    //             if (formData.wattage) headingDetails.push(`Wattage: ${formData.wattage}`);
    //             if (formData.piNo) headingDetails.push(`PI No: ${formData.piNo}`);
    //         }

    //         if (headingDetails.length > 0) {
    //             headingText += ` (${headingDetails.join(", ")})`;
    //         } else {
    //             headingText += " ";
    //         }




    //         // Set up main heading
    //         worksheet.mergeCells(
    //             "A1:" + String.fromCharCode(65 + columnsData.length - 1) + "3"
    //         );
    //         const headingCell = worksheet.getCell("A1");
    //         headingCell.value = headingText;
    //         headingCell.font = {
    //             bold: true,
    //             size: 16,
    //             color: { argb: "FFA20000" }
    //         };
    //         headingCell.alignment = {
    //             horizontal: "center",
    //             vertical: "middle"
    //         };

    //         // Add column headers (start from row 2)
    //         const headers = columnsData.map((col) => col.headerName);
    //         const headerRow = worksheet.addRow(headers);
    //         // Set row height for padding effect
    //         headerRow.height = 40; // Adjust the height as needed
    //         headerRow.eachCell((cell) => {
    //             cell.font = { bold: true };
    //             cell.alignment = {
    //                 horizontal: "start",
    //                 vertical: "middle",
    //                 wrapText: true
    //             };
    //             cell.border = {
    //                 top: { style: 'thin' },
    //                 bottom: { style: 'thin' },
    //                 left: { style: 'thin' },
    //                 right: { style: 'thin' }
    //             };
    //         });

    //         // Add data rows with enhanced styling
    //         rowsData.forEach((row, rowIndex) => {
    //             const dataRow = columnsData.map((col) => {
    //                 // Check if the current field is `totalAmount`
    //                 if (col.field === 'salesAmount' && row[col.field]) {
    //                     let amount = Number(row[col.field]);
    //                     amount = amount ? amount : 0

    //                     // Remove decimals and add commas for Indian formatting
    //                     amount = amount.toFixed(0);  // Remove decimals
    //                     const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);  // Indian number format

    //                     // Prepend rupee symbol
    //                     return `₹ ${formattedAmount}`;
    //                 }
    //                 if (col.field === 'dispatchAmount' && row[col.field]) {
    //                     let quantity = Number(row[col.field]);
    //                     quantity = quantity ? quantity : 0

    //                     // Remove decimals and add commas for Indian formatting
    //                     quantity = quantity.toFixed(0);  // Remove decimals
    //                     const formattedAmount = new Intl.NumberFormat('en-IN').format(quantity);  // Indian number format

    //                     // Prepend rupee symbol
    //                     return `₹ ${formattedAmount}`
    //                 }
    //                 if (col.field === 'quantity' && row[col.field]) {
    //                     let quantity = Number(row[col.field]);
    //                     quantity = quantity ? quantity : 0

    //                     // Remove decimals and add commas for Indian formatting
    //                     quantity = quantity.toFixed(0);  // Remove decimals
    //                     const formattedQuantity = new Intl.NumberFormat('en-IN').format(quantity);  // Indian number format

    //                     // Prepend rupee symbol
    //                     return ` ${formattedQuantity}`
    //                 }
    //                 if (col.field === 'dispatchQuantity' && row[col.field]) {
    //                     let quantity = Number(row[col.field]);
    //                     quantity = quantity ? quantity : 0

    //                     // Remove decimals and add commas for Indian formatting
    //                     quantity = quantity.toFixed(0);  // Remove decimals
    //                     const formattedDispatchQuantity = new Intl.NumberFormat('en-IN').format(quantity);  // Indian number format

    //                     // Prepend rupee symbol
    //                     return ` ${formattedDispatchQuantity}`
    //                 }

    //                 return row[col.field] || '';  // Default to empty string if not `totalAmount`
    //             });

    //             const excelRow = worksheet.addRow(dataRow);

    //             excelRow.eachCell((cell) => {
    //                 // Add colored text for first 3 rows if total rows > 3
    //                 // if (rowsData.length > 3 && rowIndex < 3) {
    //                 //     cell.font = {
    //                 //         color: { argb: "FF0000FF" }, // Blue color for first 3 rows
    //                 //     };
    //                 // }

    //                 cell.alignment = {
    //                     horizontal: 'start',
    //                     vertical: 'middle',
    //                     wrapText: true,
    //                     indent: 1
    //                 };
    //                 cell.border = {
    //                     top: { style: 'thin' },
    //                     bottom: { style: 'thin' },
    //                     left: { style: 'thin' },
    //                     right: { style: 'thin' }
    //                 };
    //             });
    //         });

    //         // Adjust column widths based on both header and content
    //         columnsData.forEach((col, index) => {
    //             let maxLength = col.headerName.length; // Start with header length

    //             // Check content length for each row
    //             rowsData.forEach((row) => {
    //                 const cellValue = row[col.field] || ''; // Default to empty string if no value
    //                 const valueLength = cellValue.toString().length;
    //                 maxLength = Math.max(maxLength, valueLength); // Get the max length
    //             });

    //             // Calculate and set optimal column width
    //             const charWidthMultiplier = 1.1; // Adjust this multiplier as needed
    //             const padding = 2;               // Add extra padding for readability
    //             const minWidth = 10;             // Minimum column width
    //             const maxWidth = 50;             // Maximum column width

    //             const calculatedWidth = Math.ceil((maxLength + padding) * charWidthMultiplier);
    //             const finalWidth = Math.min(Math.max(calculatedWidth, minWidth), maxWidth);

    //             worksheet.getColumn(index + 1).width = finalWidth; // Set column width
    //         });


    //         // Generate and download Excel file
    //         const buffer = await workbook.xlsx.writeBuffer();
    //         const blob = new Blob([buffer], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });
    //         saveAs(blob, `${headingText}.xlsx`);
    //     } catch (error) {
    //         console.error("Excel generation error:", error);
    //         toast.error("Error generating Excel file");
    //     }
    // };

    let headingDetails = [];
    let headingText = ''

    
    if (formData) {
        if (formData.fromDate && formData.toDate) {
            const formattedFromDate = formatDate(formData.fromDate);
            const formattedToDate = formatDate(formData.toDate);

            headingDetails.push(`${formattedFromDate} - ${formattedToDate}`);
        }
    }

    if (headingDetails.length > 0) {
        headingText += ` (${headingDetails.join(", ")})`;
    } else {
        headingText += " ";
    }

    console.log(headingDetails);

    const genrateExcelReport = () => {
            // const createRows = salesModalRows(list)
            // const createColumn = createColumnForSalesModal(list)
            const filterColumn = columns?.filter((item) => item.field !== 'action')
            transporterExcelReport(rows, filterColumn, formData, name, amount)
    }

    const transporterExcelReport = async (rowsData, columnsData, formData, name, amount) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Transporter Report");
    
            let headingText = name?.toUpperCase() + ` (Total Freight Cost: ₹ ${new Intl.NumberFormat('en-IN').format(amount)})`;
            let headingDetails = [];
    
            if (formData) {
                if (formData.fromDate && formData.toDate) {
                    const formattedFromDate = formatDate(formData.fromDate);
                    const formattedToDate = formatDate(formData.toDate);
                    headingDetails.push(`${formattedFromDate} - ${formattedToDate}`);
                }
                if (totalVechiles) headingDetails.push(`Total Vehicles: ${totalVechiles}`);
                if (formData.vehicleNo) headingDetails.push(`Vehicle No: ${formData.vehicleNo}`);
            }
    
            if (headingDetails.length > 0) {
                headingText += ` (${headingDetails.join(", ")})`;
            }
    
            worksheet.mergeCells("A1:E3");
            const headingCell = worksheet.getCell("A1");
            headingCell.value = headingText;
            headingCell.font = { bold: true, size: 16, color: { argb: "FFA20000" } };
            headingCell.alignment = { horizontal: "center", vertical: "middle"};
    
            const headers = columnsData.map((col) => col.headerName);
            const headerRow = worksheet.addRow(headers);
            headerRow.height = 40;
            headerRow.eachCell((cell) => {
                cell.font = { bold: true };
                cell.alignment = { horizontal: "start", vertical: "middle", wrapText: true };
                cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
            });
    
            rowsData.forEach((row) => {
                const dataRow = columnsData.map((col) => {
                    if (col.field === "price" && row[col.field]) {
                        let cost = Number(row[col.field]) || 0;
                        return `₹ ${new Intl.NumberFormat("en-IN").format(cost.toFixed(0))}`;
                    }
                    if (col.field === "invoiceNo" && Array.isArray(row[col.field])) {
                        return row[col.field].map(invoice => `LR No: ${invoice.lrNumber}, Invoice No: ${invoice.invoiceNo}`).join("; ") || "N/A";
                    }
                    if (col.field == "BookedDate" && row[col.field]) {
                        return formatDate(row[col.field]); // ✅ Using formatDate function
                    }
                    return row[col.field] || "NA";
                });
    
                const excelRow = worksheet.addRow(dataRow);
                excelRow.eachCell((cell) => {
                    cell.alignment = { horizontal: "start", vertical: "middle", wrapText: true, indent: 1 };
                    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
                });
            });
    
            columnsData.forEach((col, index) => {
                let maxLength = col.headerName.length;
                rowsData.forEach((row) => {
                    const cellValue = row[col.field] ? row[col.field].toString() : "";
                    maxLength = Math.max(maxLength, cellValue.length);
                });
    
                const calculatedWidth = Math.min(Math.max(Math.ceil((maxLength + 5) * 1.2), 15), 60);
                worksheet.getColumn(index + 1).width = calculatedWidth;
            });
    
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(blob, `${headingText}.xlsx`);
        } catch (error) {
            console.error("Excel generation error:", error);
            toast.error("Error generating Excel file");
        }
    };
    



    // const handleCellEdit = React.useCallback((params, event) => {
    //     const { id, field, value } = params;
        
    //     // Update local state of edited rows
    //     setEditedRows(prev => ({
    //         ...prev,
    //         [id]: {
    //             ...prev[id],
    //             [field]: value
    //         }
    //     }));

    //     // Update rows state
    //     setRows(prevRows => 
    //         prevRows.map(row => 
    //             row.id === id ? { ...row, [field]: value } : row
    //         )
    //     );
    // }, []);

    // const handleSaveEdits = () => {
    //     // Convert editedRows object to array of edited rows
    //     console.log("Inside handleSave edits ")
    //     const editedRowsArray = Object.entries(editedRows).map(([id, changes]) => ({
    //         id,
    //         ...changes
    //     }));

    //     // Call the prop function to handle saving
    //     if (onSaveEdits) {
    //         // onSaveEdits(editedRowsArray);
    //         console.log("payload", editedRowsArray);
    //     }

    //     // Optional: Clear edited rows state
    //     setEditedRows({});

    //     // Optional: Show success toast
    //     toast.success("Rows updated successfully");
    // };
    



    // console.log("edit rows", editedRows)

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="fullscreen-modal"
            aria-describedby="modal-that-covers-entire-screen"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "90%",
                    height: "90%",
                    bgcolor: "background.paper",
                    outline: "none",
                    display: "flex",
                    flexDirection: "column", // Split into header and body
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        borderBottom: "1px solid #ddd",
                        bgcolor: "white",
                        zIndex: 2,
                    }}
                >
                    {/* Title or any Heading */}
                    <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        {`${name?.toUpperCase()}\n` || ''}
                        ({`Transporter Amount: ₹ ${new Intl.NumberFormat('en-IN').format(amount)}`})
                        ({`Total Vechiles: ${totalVechiles}`})
                        {headingDetails?.length > 0 && ` (${headingDetails})`}

                    </Box>

                    {/* Buttons */}
                    <Box sx={{ display: "flex", gap: "40px" }}>

                    {/* <button
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            onClick={handleSaveEdits}
                            disabled={Object.keys(editedRows).length === 0}
                        >
                            Save Edits
                        </button> */}
                        <button
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            onClick={genrateExcelReport}
                        >
                            Generate Report
                        </button>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                backgroundColor: "#f5f5f5", // Light gray background
                                color: "#333", // Darker color for the icon
                                "&:hover": {
                                    backgroundColor: "#e0e0e0", // Slightly darker gray on hover
                                    color: "#000", // Darker color for the icon on hover
                                },
                                borderRadius: "8px", // Slight rounding
                                padding: "8px", // Adjust padding for size
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)", // Add shadow for elevation
                                transition: "all 0.3s ease", // Smooth transition for hover effects
                            }}
                        >
                            <CloseIcon />
                        </IconButton>


                    </Box>
                </Box>

                {/* Body Section */}
                <Box
                    sx={{
                        flex: 1, // Take the remaining height
                        overflow: "hidden", // Prevent overflow beyond the modal
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {modalLoading && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                    {!modalLoading && (
                        <Box
                            sx={{
                                flex: 1,
                                overflow: "auto",
                                padding: "16px",
                                
                            }}
                        >
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={50}
                                // editMode="row"
                                rowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200, 250]}
                                sortingOrder={["asc", "desc"]}
                                filterMode="client"
                                getRowHeight={() => "100px"}
                                // onCellEditStop={handleCellEdit}
                                sx={{
                                    height: "100%", // Take up available height
                                    width: "100%",
                                    overflowX: "auto",
                                    "& .MuiDataGrid-root": {
                                        width: "100%",
                                    },
                                    "& .MuiDataGrid-columnHeader": {
                                        backgroundColor: "blue",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        fontSize: "13px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        color: "#343333",
                                        border: "1px solid #ddd",
                                        margin: "0",
                                        padding: "0",
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>

    )
}

export default TransporterModal;
