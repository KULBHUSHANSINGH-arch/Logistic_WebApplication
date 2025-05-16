export const TransporterModalRow = (transporterData, formData) => transporterData.map((data, index) => {
    const lrNumbers = Array.isArray(data.invoiceNo)
        ? data.invoiceNo.map((item) => item.lrNumber).join(", ") // Convert array to string
        : "N/A";

    const invoiceNumbers = Array.isArray(data.invoiceNo)
        ? data.invoiceNo.map((item) => item.invoiceNo).join(", ")
        : "N/A";



    return {
        BookedDate: data.BookedDate,
        vehicleNo: data.vehicleNo,
        price: data.price,
        // invoiceNo: Array.isArray(data.invoiceNo) ? data.invoiceNo : [],
        lrNumber: lrNumbers, // Separate LR numbers
        invoiceNo: invoiceNumbers,
        transporterInvoice: data.transporterBillingInvoiceNo,
        // invoiceDate: invoiceDate || "N/A",
        id: index,
        status: data.status,
        chalanDis: data.chalanDis

    };
});