
export const transformVehicleReportToRows = (vehicleData) => vehicleData.map((vehicle) => {
    // Helper function to format the date
    const lrNumbers = Array.isArray(vehicle.invoiceNo)
    ? vehicle.invoiceNo.map((item) => item.lrNumber).join(", ") // Convert array to string
    : "N/A";

const invoiceNumbers = Array.isArray(vehicle.invoiceNo)
    ? vehicle.invoiceNo.map((item) => item.invoiceNo).join(", ")
    : "N/A";
    
  
    return {
      id: vehicle.vehicleId,
      vehicleNo: vehicle.vehicleNo,
      lrNumber: lrNumbers,
      invoiceNo: invoiceNumbers,
      vehicleType: vehicle.vehicleType,
      vehicleTypeName: vehicle.vehicleTypeName,
      partyName: vehicle.partyName,
      transporterName: vehicle.transporterName,
      status: vehicle.status,
      price: vehicle.price,
      oldPrice: vehicle.oldPrice,
      detension: vehicle.detension,
      resultDate: vehicle.resultDate,
      reason: vehicle.reason,
      resultTime: vehicle.resultTime,
      outTime: vehicle.outTime,
      deliveryStatus: vehicle.deliveryStatus,
      deliveryTime: vehicle.deliveryTime,  //when status is delivered otherwise null or empty string
      salesOrderId: vehicle.salesOrderId,  //Either Empty Array 0r Null
      piNo:vehicle.piNo, //Either Empty Array 0r Null or Empty String
      workLocationName:vehicle.workLocationName,
      salesPerson:vehicle.salesPerson, //ID
      SalesMan:vehicle.SalesMan, //Name
      resultDate:vehicle.resultDate,
      resultTime:vehicle.resultTime,
      vehicleInTime:vehicle.vehicleInTime,
     
    };
  });