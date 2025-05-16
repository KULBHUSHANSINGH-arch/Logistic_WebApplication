import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const formatDate = (date) => {
    if (!date) return ""; // Return empty string for null/undefined dates
    try {
        const options = {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return new Date(date).toLocaleDateString("en-IN", options);
    } catch (error) {
        console.error("Error formatting date:", error);
        return ""; // Fallback to empty string
    }
};

export const genrateExcelReport = async (rowsData, columnsData, formData,userReport=false,status='') => {
    try {
        const workbook = new ExcelJS.Workbook();
        let worksheet;
        if(userReport){
             worksheet = workbook.addWorksheet("User Report");
        }else{
             worksheet = workbook.addWorksheet("Lead Report");
        }
      

        // Build heading based on formData (non-array fields)
        let headingText =userReport? "User Report" : "Lead Report";
        let headingDetails = [];

       

        if (!userReport) {
            headingText += ` (${status})`;
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
        // Set row height for padding effect
        headerRow.height = 40; // Adjust the height as needed
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

        // Add data rows with enhanced styling
        rowsData.forEach((row, rowIndex) => {
            const dataRow = columnsData.map((col) => {
                const value = row[col.field];

                // Format `createdOn` or other date fields
                if (col.field === "createdOn" && value ) {
                    return formatDate(value); // Format the date
                }
                
                return row[col.field] || '';  // Default to empty string if not `totalAmount`
            });

            const excelRow = worksheet.addRow(dataRow);

            excelRow.eachCell((cell) => {
              
            

                cell.alignment = {
                    horizontal: 'left', // Explicitly set alignment to left
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

        // Adjust column widths based on both header and content
        columnsData.forEach((col, index) => {
            let maxLength = col.headerName.length; // Start with header length

            // Check content length for each row
            rowsData.forEach((row) => {
                const cellValue = row[col.field] || ''; // Default to empty string if no value
                const valueLength = cellValue.toString().length;
                maxLength = Math.max(maxLength, valueLength); // Get the max length
            });

            // Calculate and set optimal column width
            const charWidthMultiplier = 1.1; // Adjust this multiplier as needed
            const padding = 2;               // Add extra padding for readability
            const minWidth = 10;             // Minimum column width
            const maxWidth = 50;             // Maximum column width

            const calculatedWidth = Math.ceil((maxLength + padding) * charWidthMultiplier);
            const finalWidth = Math.min(Math.max(calculatedWidth, minWidth), maxWidth);

            worksheet.getColumn(index + 1).width = finalWidth; // Set column width
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