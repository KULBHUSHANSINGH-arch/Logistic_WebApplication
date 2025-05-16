import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
export const exportToExcel = async (
  rowsData,
  columnsData,
  status,
  workLocationName,
  dateRange
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Vehicle Data");

    // Format the date range to DD-MM-YYYY
    let formattedFromDate = "";
    let formattedToDate = "";

    if (
      dateRange &&
      dateRange.fromDate &&
      dateRange.toDate &&
      dateRange.status
    ) {
      const fromDate = new Date(dateRange.fromDate);
      const toDate = new Date(dateRange.toDate);
      formattedFromDate = fromDate.toLocaleDateString("en-GB"); // This formats the date as DD-MM-YYYY
      formattedToDate = toDate.toLocaleDateString("en-GB");
    }

    // Construct heading with date range if available
    let headingText = `Vehicle List (STATUS: ${status.toUpperCase()} - UNIT: ${workLocationName})`;

    // Use formatted dates if date range exists
    if (formattedFromDate && formattedToDate) {
      headingText = `Vehicle List (STATUS: ${dateRange.status.toUpperCase()} - UNIT: ${workLocationName}) [DATE RANGE: ${formattedFromDate} to ${formattedToDate}]`;
    }

    worksheet.mergeCells(
      "A1:" + String.fromCharCode(65 + columnsData.length - 1) + "1"
    );
    const headingCell = worksheet.getCell("A1");
    headingCell.value = headingText;
    headingCell.font = { bold: true, size: 16 };
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
        if (col.field === 'price' && row[col.field]) {
          let amount = row[col.field];
          // console.log('amoutn',amount)
          amount = Number(amount);
          const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);
          return `₹ ${formattedAmount}`;
      }

        // Handle URL fields with truncation and hyperlink
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

        // Handle date fields
        if (col.field === 'resultDate' || col.field ==='createdOn') {
          const dateValue = row[col.field];
          if (dateValue) {
            const validDate = new Date(dateValue);
            if (!isNaN(validDate)) {
              return validDate.toLocaleDateString('en-GB');
            } else {
              return ''; // If the date is invalid, return an empty string
            }
          } else {
            return ''; // Handle missing date
          }
        }

        // Default case for other fields
        const value = fieldValue || '';
        return value.length > 30 ? value.substring(0, 30) + '...' : value;
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
    console.log('failed to genrate', error);
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
