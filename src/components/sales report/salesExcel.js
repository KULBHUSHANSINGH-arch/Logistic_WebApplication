import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import rank1 from '../../assets/Icons/rank1.png';
import rank2 from '../../assets/Icons/rank2.png';
import rank3 from '../../assets/Icons/rank3.png';

// const convertToBase64 = (url) =>
//     fetch(url)
//         .then((response) => response.blob())
//         .then(
//             (blob) =>
//                 new Promise((resolve, reject) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => resolve(reader.result);
//                     reader.onerror = reject;
//                     reader.readAsDataURL(blob);
//                 })
//         );

// // Convert images to Base64
// const rank1Base64 = await convertToBase64(rank1);
// const rank2Base64 = await convertToBase64(rank2);
// const rank3Base64 = await convertToBase64(rank3);
// Function to format the date in day-month-year format (e.g., 1-Jan-2025)
function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-IN', options).format(new Date(date));
}

// export const salesExcelReport = async (rowsData, columnsData, formData) => {
//     try {
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Sales Report");

//         // Build heading based on formData (non-array fields)
//         let headingText = "Sales Report";
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
//                 if (col.field === 'totalAmount' && row[col.field]) {
//                     let amount = row[col.field];

//                     // Remove decimals and add commas for Indian formatting
//                     amount = amount.toFixed(0);  // Remove decimals
//                     const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);  // Indian number format

//                     // Prepend rupee symbol
//                     return `₹ ${formattedAmount}`;
//                 }
//                 if (col.field === 'totalQuantity' && row[col.field]) {
//                     let quantity = row[col.field];

//                     // Remove decimals and add commas for Indian formatting
//                     quantity = quantity.toFixed(0);  // Remove decimals
//                     const formattedAmount = new Intl.NumberFormat('en-IN').format(quantity);  // Indian number format

//                     // Prepend rupee symbol
//                     return ` ${formattedAmount}`
//                 }

//                 return row[col.field] || '';  // Default to empty string if not `totalAmount`
//             });

//             const excelRow = worksheet.addRow(dataRow);

//             excelRow.eachCell((cell) => {
//                 // Add colored text for first 3 rows if total rows > 3
//                 if (rowsData.length > 3 && rowIndex < 3) {
//                     cell.font = {
//                         color: { argb: "FF0000FF" }, // Blue color for first 3 rows
//                     };
//                 }

//                 cell.alignment = {
//                     horizontal: 'left', // Explicitly set alignment to left
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










// import { CSVLink } from "react-csv";

// const headers = columnsData.map(col => ({
//   label: col.headerName,
//   key: col.field
// }));

// const csvReport = {
//   filename: 'vehicle_data.csv',
//   headers: headers,
//   data: rowsData
// };

// // Button for CSV Export
// <CSVLink {...csvReport}>
//   <Button variant="contained" color="primary">Export to CSV</Button>
// </CSVLink>

export const salesExcelReport = async (rowsData, columnsData, formData) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report");

        // Build heading based on formData (non-array fields)
        let headingText = "Sales Report";
        let headingDetails = [];

        const { moduleType, monobi, wattage, type } = formData?.panelType ? formData?.panelType : {};
        if (formData) {
            if (formData.fromDate && formData.toDate) {
                const formattedFromDate = formatDate(formData.fromDate);
                const formattedToDate = formatDate(formData.toDate);

                headingDetails.push(`${formattedFromDate} - ${formattedToDate}`);
            }
            if (formData.type) headingDetails.push(`Type: ${formData.type}`);
            if (formData.panelType) {
                headingDetails.push(`Panel-Type: ${wattage}-${type}-${moduleType}-${monobi}`);
            }
            if (formData.wattage) headingDetails.push(`Wattage: ${formData.wattage}`);
            if (formData.piNo) headingDetails.push(`PI No: ${formData.piNo}`);
        }

        if (headingDetails.length > 0) {
            headingText += ` (${headingDetails.join(", ")})`;
        } else {
            headingText += " ";
        }

        // Set up main heading
        worksheet.mergeCells(
            "A1:" + String.fromCharCode(65 + columnsData.length - 1) + "3"
        );
        const headingCell = worksheet.getCell("A1");
        headingCell.value = headingText;
        headingCell.font = {
            bold: true,
            size: 16,
            color: { argb: "FFA20000" }
        };
        headingCell.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        // Add column headers (start from row 2)
        const headers = columnsData.map((col) => col.headerName);
        const headerRow = worksheet.addRow(headers);
        headerRow.height = 40;
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = {
                horizontal: "start",
                vertical: "middle",
                wrapText: true
            };
            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Calculate totals while adding data rows
        let totalSalesAmount = 0;
        let totalMegaWatt = 0;
        let totalQuantity = 0;
        let totalPanelQuantity = 0;
        let salesAmountColumnIndex = -1;
        let megaWattColumnIndex = -1;
        let quantityColumnIndex = -1;
        let toatalPanelQuantityColumnIndex = -1;

        // Find column indices
        columnsData.forEach((col, index) => {
            if (col.field === 'totalAmount') salesAmountColumnIndex = index;
            if (col.field === 'totalMegaWatt') megaWattColumnIndex = index;
            if (col.field === 'quantity') quantityColumnIndex = index;
            if (col.field === 'totalQuantity') toatalPanelQuantityColumnIndex = index;
        });

        // Add data rows with enhanced styling
        rowsData.forEach((row, rowIndex) => {
            const dataRow = columnsData.map((col) => {
                if (col.field === 'totalAmount' && row[col.field]) {
                    let amount = row[col.field];
                    totalSalesAmount += Number(amount); // Add to total
                    amount = amount.toFixed(0);
                    const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);
                    return `₹ ${formattedAmount}`;
                }
                if (col.field === 'totalMegaWatt' && row[col.field]) {
                    // console.log(row[col.field])
                    let megaWatt = row[col.field];
                    totalMegaWatt += megaWatt;
                    return `${row[col.field]}`; // Keep original format
                }
                if (col.field === 'quantity' && row[col.field]) {
                    let quantity = Number(row[col.field]);
                    totalQuantity += quantity;
                    return row[col.field];
                }
                if (col.field === 'totalQuantity' && row[col.field]) {
                    let quantity = Number(row[col.field]);
                    totalPanelQuantity += quantity;
                    return row[col.field];
                }
                return row[col.field] || '';
            });

            const excelRow = worksheet.addRow(dataRow);

            excelRow.eachCell((cell) => {
                if (rowsData.length > 3 && rowIndex < 3) {
                    cell.font = {
                        color: { argb: "FF0000FF" },
                    };
                }

                cell.alignment = {
                    horizontal: 'left',
                    vertical: 'middle',
                    wrapText: true,
                    indent: 1
                };
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Add total row
        const totalRow = Array(columnsData.length).fill('');
        totalRow[0] = 'Total';

        // Add sales amount total
        if (salesAmountColumnIndex !== -1) {
            const formattedTotal = new Intl.NumberFormat('en-IN').format(totalSalesAmount.toFixed(0));
            totalRow[salesAmountColumnIndex] = `₹ ${formattedTotal}`;
        }

        // Add mega watt total
        if (megaWattColumnIndex !== -1) {
            // console.log('here',totalMegaWatt)
            totalRow[megaWattColumnIndex] = `${totalMegaWatt.toFixed(5)} MW`;
        }

        // Add quantity total
        if (quantityColumnIndex !== -1) {
            totalRow[quantityColumnIndex] = totalQuantity;
        }
        // Add Total Panel quantity total
        if (toatalPanelQuantityColumnIndex !== -1) {
            totalRow[toatalPanelQuantityColumnIndex] = totalPanelQuantity;
        }

        const totalExcelRow = worksheet.addRow(totalRow);
        totalExcelRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = {
                horizontal: 'left',
                vertical: 'middle',
                wrapText: true,
                indent: 1
            };
            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        // Adjust column widths
        columnsData.forEach((col, index) => {
            let maxLength = col.headerName.length;

            rowsData.forEach((row) => {
                const cellValue = row[col.field] || '';
                const valueLength = cellValue.toString().length;
                maxLength = Math.max(maxLength, valueLength);
            });

            // Also check total row length
            if (totalRow[index]) {
                maxLength = Math.max(maxLength, totalRow[index].toString().length);
            }

            const charWidthMultiplier = 1.1;
            const padding = 2;
            const minWidth = 10;
            const maxWidth = 50;

            const calculatedWidth = Math.ceil((maxLength + padding) * charWidthMultiplier);
            const finalWidth = Math.min(Math.max(calculatedWidth, minWidth), maxWidth);

            worksheet.getColumn(index + 1).width = finalWidth;
        });

        // Generate and download Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${headingText}.xlsx`);
    } catch (error) {
        console.error("Excel generation error:", error);
        toast.error("Error generating Excel file");
    }
};



