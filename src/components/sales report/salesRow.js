export const salesReportRows = (salesdata,formData) => salesdata.map((data, index) => {
    // Helper function to format the date (if needed)
    const { MonofacialBifacial, dcr_nondcr, watage } = data.orders[0];
    let panelType = `${watage}-${dcr_nondcr}-${MonofacialBifacial}` || 'N/A'; // Calculate panelType
    // const {moduleType='',monobi='',wattage='',type=''}=formData?.panelType
    // if(moduleType && monobi ){
    //     panelType=`${wattage}-${type}-${moduleType}-${monobi}`
    // }

    return {
        totalAmount: data.totalAmount,
        totalQuantity: data.totalQuantity,
        salesPersonName: data.salesPersonName,
        orders: data.orders[0]?.partyName,
        piNo: data.orders[0]?.piNo,
        quantity: data.orders[0]?.quantity,
        remainingQuantity: data.orders[0]?.remainingQuantity??0,
        partyName: data.orders[0]?.partyName,
        MonofacialBifacial: data.orders[0]?.MonofacialBifacial,
        watage: watage,
        dcr_nondcr: dcr_nondcr,
        panelType: panelType, 
        id: index,
        uniqueId: index,
        dispatchQuantity:Number(data.orders[0]?.quantity) - Number(data.orders[0]?.remainingQuantity),
        salesPersonAllOrders:data.orders,
        totalMegaWatt:data.totalMegaWatt
    };
});
