import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
export const genrateExcelReport = async (
    rowsData,
    columnsData,
    formData
) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Report");

        // Build heading based on formData (non-array fields)
        let headingText = "Vehicle Report";

        // Check for non-array fields in formData and build heading
        let headingDetails = [];
        if (formData.freightCost) headingDetails.push(`Freight Cost: ${formData.freightCost}`);
        if (formData.detention && formData.detention !== "all") headingDetails.push(`Detention: ${formData.detention}`);
        if (formData.vehicleStatus && formData.vehicleStatus !== "all") headingDetails.push(`Status: ${formData.vehicleStatus}`);
        if (formData.vehicleRunningStatus && formData.vehicleRunningStatus !== "all") headingDetails.push(`Running Status: ${formData.vehicleRunningStatus}`);
        
        
        if (formData.workLocations && formData.workLocations.length) {
            const workLocationNames = formData.workLocations.map(location => location.workLocationName).join(", ");
            headingDetails.push(`Work Locations: ${workLocationNames}`);
        }
        
        if (formData.salesPerson && formData.salesPerson.length) {
            const salesPersonNames = formData.salesPerson.map(person => person.userName);
            headingDetails.push(`Sales Person: ${salesPersonNames.join(", ")}`);
        }
        
        if (formData.pis && formData.pis.length) {
            const piNumbers = formData.pis.map(pi => pi.piNo).join(", ");
            headingDetails.push(`PI Numbers: ${piNumbers}`);
        }
        if (formData.transpotter && formData.transpotter.length) {
            const transporterNames = formData.transpotter.map(tr => tr.TransporterName).join(", ");
            headingDetails.push(`Transporter Name: ${transporterNames}`);
        }
        if (formData.partyName && formData.partyName.length) {
            const PartyNames = formData.partyName.map(tr => tr.PartyName).join(", ");
            headingDetails.push(`Party Name: ${PartyNames}`);
        }
        if (formData.vehicleTypes && formData.vehicleTypes.length) {
            const vehicleTypeName = formData.vehicleTypes.map(tr => tr.vehicleTypeName).join(", ");
            headingDetails.push(`Vehicle Type: ${vehicleTypeName}`);
        }
        
        if (formData.fromDate && formData.toDate) {
            const formattedFromDate = new Date(formData.fromDate).toLocaleDateString("en-GB");
            const formattedToDate = new Date(formData.toDate).toLocaleDateString("en-GB");
            headingDetails.push(`Date Range: ${formattedFromDate} to ${formattedToDate}`);
        }

        if (headingDetails.length > 0) {
            headingText = `Vehicle Report (${headingDetails.join(" | ")})`;
        }

        worksheet.mergeCells(
            "A1:" + String.fromCharCode(65 + columnsData.length - 1) + "1"
        );
        const headingCell = worksheet.getCell("A1");
        headingCell.value = headingText;
        headingCell.font = { bold: true, size: 16, color: { argb: "FFA20000" } }; // Set text color
        headingCell.alignment = { horizontal: "center", vertical: "middle" };
        headingCell.border = {
            bottom: { style: "thin" },
        };
        
        // Add column headers (start from row 2)
        const headers = columnsData.map((col) => col.headerName);
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "start", vertical: "middle" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // Add data rows and style them
        rowsData.forEach((row) => {
            const dataRow = columnsData.map((col) => {
                const fieldValue = row[col.field];

                if (col.field === 'price' && row[col.field]) {
                    let amount = row[col.field];
              
                    const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);
                    return `₹ ${formattedAmount}`;
                }
                if (col.field === 'oldPrice' && row[col.field]) {
                    let amount = row[col.field];
              
                    const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);
                    return `₹ ${formattedAmount}`;
                }

                // Handle PI Numbers (piNo)
                if (col.field === "piNo") {
                    if (!fieldValue || fieldValue === null || fieldValue === "" || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
                        return "N/A";
                    }
                    
                    return Array.isArray(fieldValue) ? fieldValue.join(", ") : fieldValue;
                }

                // Handle Date fields (outTime, deliveryTime)
                if (col.field === "outTime" || col.field === "deliveryTime") {
                    const dateValue = row[col.field];
                    if (dateValue) {
                        const dateObj = new Date(dateValue);
                        const options = {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Kolkata"
                        };
                        return dateObj.toLocaleString("en-IN", options); // Indian standard time (IST)
                    }
                    return ''; // Handle missing date
                }

                // Handle URL fields
                if (['chalanDis', 'ewayDis', 'invoiceImg', 'materialList', 'vehicleImg'].includes(col.field)) {
                    if (fieldValue) {
                        const truncatedText = 'Click Here'; // Truncate the visible text
                        return {
                            text: truncatedText,
                            hyperlink: encodeURI(fieldValue) // Keep the full URL as the hyperlink
                        };
                    } else {
                        return ''; // No URL present
                    }
                }

                // Default case for other fields
                return fieldValue || '';
            });

            const excelRow = worksheet.addRow(dataRow);

            // Apply alignment and hyperlink formatting
            excelRow.eachCell((cell, index) => {
                const cellValue = cell.value;

                // If the cell contains a hyperlink, add it
                if (typeof cellValue === 'object' && cellValue.hyperlink) {
                    cell.value = { text: cellValue.text, hyperlink: cellValue.hyperlink };
                    cell.font = { color: { argb: 'FF0000FF' }, underline: true }; // Hyperlink styling
                }

                cell.alignment = {
                    horizontal: 'start',
                    vertical: 'middle',
                    indent: 1 // Simulates left padding by indenting the text
                };
                
            });
        });

        // Compute and set column widths dynamically based on content length
        columnsData.forEach((col, index) => {
            let maxLength = col.headerName.length;

            worksheet.eachRow({ includeEmpty: true }, (row) => {
                const cellValue = row.getCell(index + 1).value;
                if (cellValue) {
                    maxLength = Math.max(maxLength, cellValue.toString().length);
                }
            });

            worksheet.getColumn(index + 1).width = Math.min(maxLength + 2, 30); // Set a max width of 30 units
        });

        // Generate Excel and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${headingText}.xlsx`);
    } catch (error) {
        toast.error("Error generating Excel file");
    }
};

  



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
