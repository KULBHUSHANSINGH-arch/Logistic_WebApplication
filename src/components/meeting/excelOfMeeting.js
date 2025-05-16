import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { head } from "lodash";
import { toast } from "react-toastify";
export const genrateExcelMeetingReport = async (
    rowsData,
    columnsData,
    status,
    dropdownValue
) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(dropdownValue === "Meeting" ? "Meeting Report" : "Travelling Report");

        // Build heading based on formData (non-array fields)
        let headingText = dropdownValue === "Meeting" ? "Meeting Report" : "Travelling Report";

        // Append status in parentheses to headingText
        headingText += status ? ` (${status.trim()})` : "";

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
            cell.alignment = { horizontal: "center", vertical: "middle" };
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
                if (['meetingUrl', 'vistingCardUrl', 'invoiceImg', 'materialList', 'vehicleImg'].includes(col.field)) {
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
                    horizontal: 'center',
                    vertical: 'middle',
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
