export const salesModalRows = (salesdata, formData) => salesdata.map((data, index) => {

    let tempQuantity =
        data.status === 'Out' ? data.quantity :
            data.status === 'InDispatch' ? data.dispatchQuantity :
                "0"; // Default value if none of the conditions match

    let temTotalamount = data.status === 'Out' ? data.itemTotalAmount : data.status === 'InDispatch' ? data?.dispatchAmount : '0'
    return {
        piNo: data.piNo,
        partyName: data.partyName,
        salesPersonName: data.salesPersonName,
        dcr_nondcr: data.dcr_nondcr,
        watage: data.watage,
        quantity: data.quantity,
        remainingQuantity: data.remainingQuantity,
        totalAmount: data.totalAmount,
        dispatchAmount: data.dispatchAmount,
        dispatchQuantity: data.dispatchQuantity,
        status: data.status,
        value: data.value,
        purchaseOrderNo: data.purchaseOrderNo,
        pdfPath: data.pdfPath,
        itemCreatedOn: data.itemCreatedOn,
        MonofacialBifacial: data.MonofacialBifacial,
        date: data.vehicleOutTime,
        itemTotalAmount: data.itemTotalAmount,
        salesOrderId: data.salesOrderId,
        id: data.salesOrderId + index,
        panelTypes: `${data.watage} - ${data.dcr_nondcr} - ${data.MonofacialBifacial}`,
        salesAmount:data?.actualAmount,
        finalQuantity:data?.dispatchQuantity


    };
});