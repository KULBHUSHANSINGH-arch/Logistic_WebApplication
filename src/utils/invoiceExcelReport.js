import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

// dispatch_date
// dispatch_id
// dispatch_no
// dispatch_qty
// factory_name
// invoice_no
// party_name
// vehicle_no

export const generateExcelReportOfInvoice = async (data, fileName = 'Dispatch_Report.xlsx') => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Report');

    const pallets = data.pallets || [];
    const headers = pallets.length > 0 ? Object.keys(pallets[0]) : ['Data'];

    sheet.addRow([]);

    const {
        dispatch_date,
        dispatch_id,
        dispatch_no,
        dispatch_qty,
        factory_name,
        invoice_no,
        party_name,
        vehicle_no
    } = data.dispatch_info || {};

    const dispatchInfoString =
        `Dispatch Date: ${dispatch_date || ''} | ` +
        `Dispatch ID: ${dispatch_id || ''} | ` +
        `Dispatch No: ${dispatch_no || ''} | ` +
        `Dispatch Qty: ${dispatch_qty || ''} | ` +
        `Factory Name: ${factory_name || ''} | ` +
        `Invoice No: ${invoice_no || ''} | ` +
        `Party Name: ${party_name || ''} | ` +
        `Vehicle No: ${vehicle_no || ''}`;

    const infoRow = sheet.addRow([dispatchInfoString]);
    infoRow.height = 30;
    sheet.mergeCells(`A${infoRow.number}:H${infoRow.number}`);

    const mergedCell = sheet.getCell(`A${infoRow.number}`);
    mergedCell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    mergedCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    mergedCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };

    sheet.addRow([]);

    if (pallets.length === 0) {
        sheet.addRow(['No pallets found']);
        return;
    }

    const tableHeaderRow = sheet.addRow(headers);
    tableHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    sheet.getRow(tableHeaderRow.number).height = 25;

    const tableStartColumn = tableHeaderRow.getCell(1)._column._number;

    headers.forEach((header, index) => {
        const columnIndex = tableStartColumn + index;
        const column = sheet.getColumn(columnIndex);
        if (header.toLowerCase().includes('barcode')) column.width = 70;
        else if (header.toLowerCase().includes('qty')) column.width = 12;
        else if (header.toLowerCase() === 'pallet_no') column.width = 10;
        else if (header.toLowerCase() === 'model_no') column.width = 15;
        else column.width = Math.max(header.length + 5, 12);
    });

    // 🚀 FIXED HERE
    console.log('pallets', pallets)
    console.log('pallets', pallets);
    pallets.forEach((pallet) => {
        const rowValues = headers.map((header) => {
            let value = pallet[header];

            if (
                (header.toLowerCase().includes('barcode') || header.toLowerCase().includes('barcodes'))
            ) {
                // If it's an array with a single long space-separated string
                if (Array.isArray(value)) {
                    if (value.length === 1 && typeof value[0] === 'string') {
                        // Split the single long string by whitespace
                        value = value[0].split(/\s+/);
                    }
                    return value.join(', ');
                }

                // If value is a string (just in case)
                if (typeof value === 'string') {
                    value = value.split(/\s+/);
                    return value.join(', ');
                }
            }

            return value;
        });

        const row = sheet.addRow(rowValues);
        row.height = 22;

        row.eachCell((cell, colNumber) => {
            const headerName = headers[colNumber - tableStartColumn];
            const value = cell.value;

            if (headerName && headerName.toUpperCase().includes('BARCODE')) {
                cell.alignment = {
                    horizontal: 'left',
                    vertical: 'middle',
                    wrapText: false,
                    shrinkToFit: false
                };
            } else {
                const isNumber = typeof value === 'number' ||
                    (typeof value === 'string' && !isNaN(value) && value !== '');

                cell.alignment = {
                    horizontal: isNumber ? 'right' : 'left',
                    vertical: 'middle',
                    wrapText: true
                };
            }

            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    });


    const barcodeColumnIndex = headers.findIndex(h =>
        h.toLowerCase().includes('barcode') || h.toLowerCase().includes('barcodes')
    );

    if (barcodeColumnIndex !== -1) {
        const actualBarcodeColumnIndex = tableStartColumn + barcodeColumnIndex;
        for (let i = tableHeaderRow.number + 1; i <= sheet.rowCount; i++) {
            const row = sheet.getRow(i);
            const barcodeCell = row.getCell(actualBarcodeColumnIndex);
            if (barcodeCell.value && Array.isArray(barcodeCell.value)) {
                barcodeCell.value = barcodeCell.value.join(', ');
            }
            barcodeCell.alignment = {
                horizontal: 'left',
                vertical: 'middle',
                wrapText: false,
                shrinkToFit: false
            };
        }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
};





export default generateExcelReportOfInvoice