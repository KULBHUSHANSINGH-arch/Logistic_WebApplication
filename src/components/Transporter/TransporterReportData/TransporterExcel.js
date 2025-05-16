import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
// import rank1 from '../../assets/Icons/rank1.png';
// import rank2 from '../../assets/Icons/rank2.png';
// import rank3 from '../../assets/Icons/rank3.png';

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




export const TransporterExcel = async (rowsData, columnsData, formData, workLocations) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Transporter Report");

        let headingText = "Transporter Report";
        let headingDetails = [];

        if (formData?.fromDate && formData?.toDate) {
            headingDetails.push(`${formatDate(formData.fromDate)} - ${formatDate(formData.toDate)}`);
        }
        if (formData?.transporter) headingDetails.push(`Type: ${formData.transporter}`);

        if (formData?.selectedLocationId?.length) {
            const locationNames = formData.selectedLocationId.map(
                (id) => workLocations.find(loc => loc.WorkLocationId === id)?.workLocationName || id
            );
            headingDetails.push(`Location: ${locationNames.join(", ")}`);
        }

        if (headingDetails.length > 0) {
            headingText += ` (${headingDetails.join(", ")})`;
        }

        // Merge heading across all columns
        worksheet.mergeCells(`A1:${String.fromCharCode(65 + columnsData.length - 1)}3`);
        const headingCell = worksheet.getCell("A1");
        headingCell.value = headingText;
        headingCell.font = { bold: true, size: 16, color: { argb: "FFA20000" } };
        headingCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

        // Set column headers
        const headerRow = worksheet.addRow(columnsData.map(col => col.headerName));
        headerRow.eachCell((cell, colIndex) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.border = { top: { style: "thin" }, bottom: { style: "thin" } };
            worksheet.getColumn(colIndex).width = 40; // Set column width
        });

        let totalVehicles = 0;
        let totalFreightCost = 0;

        // Add data rows
        rowsData.forEach((row) => {
            const dataRow = columnsData.map((col) => {
                if (col.field === "totalVehicles" && row[col.field]) {
                    totalVehicles += Number(row[col.field]);
                    return row[col.field];
                }
                if (col.field == "totalFreightCost") {
                    const cost = Number(row[col.field]) || 0; // Default to 0 if missing
                    totalFreightCost += cost;
                    return cost ? `₹ ${new Intl.NumberFormat("en-IN").format(cost.toFixed(0))}` : "₹ 0";
                }
                return row[col.field] || "";
            });

            const excelRow = worksheet.addRow(dataRow);
            excelRow.eachCell((cell) => {
                cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
                cell.border = { top: { style: "thin" }, bottom: { style: "thin" } };
            });
        });

        // Add total row
        const totalRow = Array(columnsData.length).fill("");
        totalRow[0] = "Total";
        totalRow[columnsData.findIndex((col) => col.field === "totalVehicles")] = totalVehicles;
        totalRow[columnsData.findIndex((col) => col.field === "totalFreightCost")] = `₹ ${new Intl.NumberFormat("en-IN").format(totalFreightCost.toFixed(0))}`;

        const totalExcelRow = worksheet.addRow(totalRow);
        totalExcelRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
            cell.border = { top: { style: "thin" }, bottom: { style: "thin" } };
        });

        // Generate and save Excel file
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




