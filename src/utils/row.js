export const transformVehicleDataToRows = (vehicleData) => vehicleData.map((vehicle) => {
  // Helper function to format the date
  

  return {
    id: vehicle.vehicleId,
    piNo: vehicle.piNo,
    vehicleNo: vehicle.vehicleNo,
    vehicleTypeName: vehicle.vehicleTypeName,
    driverNumber: vehicle.driverNumber,
    partyName: vehicle.partyName,
    location: vehicle.location,
    transferFrom: vehicle.transferFrom,
    transpotterName: vehicle.transpotterName,
    status: vehicle.status,
    vehicleImg: vehicle.vehicleImg,
    createdOn: vehicle.createdOn,
    updatedOn: vehicle.updatedOn,
    resultDate: vehicle.resultDate,
    vehicleImg1: vehicle.vehicleImg1,
    vehicleImg2: vehicle.vehicleImg2,
    vehicleImg3: vehicle.vehicleImg3,
    vehicleImg4: vehicle.vehicleImg4,
    ewayBill: vehicle.ewayBill,
    invoiceImg: vehicle.invoiceImg,
    resultTime: vehicle.resultTime,
    createdPerson: vehicle.createdPerson,
    vehicleLoadingType: vehicle.vehicleLoadingType,
    price: vehicle.price,
    reason: vehicle.reason,
    detension: vehicle.detension,
    chalanDis: vehicle.chalanDis,
    ewayDis: vehicle.ewayDis,
    materialList: vehicle.materialList,
    Address:vehicle.Address,
    Latitude:vehicle.Latitude,
    Longitude:vehicle.Longitude,
    deliveryId:vehicle.deliveryId,
    PinCode:vehicle.PinCode,
    salesPerson:vehicle.salesPerson,
    expectedDeliveryDate:vehicle.expectedDeliveryDate,
    remainingDistance:vehicle.remainingDistance,
    workLocationName:vehicle.workLocationName,
    PartyName:vehicle.PartyName,
    TransporterName:vehicle.TransporterName,
    deliveryStatus:vehicle?.deliveryStatus,
    consentStatus:vehicle?.consentStatus,
    salesOrderId:vehicle?.salesOrderId,
    tripId:vehicle.tripId,
    panelDetails:vehicle.panelDetails,
    invoiceNo:vehicle.invoiceNo,
    transporterBillingDetails: vehicle.transporterBillingDetails
  };
});


export const watageListRows = (data) => {
  return data.map((d, index) => {
    return {
      id: d.watageId, /** Ensure id is defined for DataGrid **/ 
      siNo: index + 1, /** Add 1 to convert 0-based index to 1-based SI No **/ 
      createdOn: d.createdOn,
      createdPerson: d.createdPerson,
      status: d.status,
      updatedOn: d.updatedOn,
      watageId: d.watageId,
      watageName: d.watageName,
    };
  });
};
