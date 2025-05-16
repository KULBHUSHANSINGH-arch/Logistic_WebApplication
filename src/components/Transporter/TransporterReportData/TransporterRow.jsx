// import React from 'react'

// const TransporterRow = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default TransporterRow
export const TransporterRow = (salesdata,formData) => salesdata.map((data, index) => {
  // Helper function to format the date (if needed)
  // const { MonofacialBifacial, dcr_nondcr, watage } = data.orders[0];
  // let panelType = ${watage}-${dcr_nondcr}-${MonofacialBifacial} || 'N/A'; // Calculate panelType
  // const {moduleType='',monobi='',wattage='',type=''}=formData?.panelType
  // if(moduleType && monobi ){
  //     panelType=${wattage}-${type}-${moduleType}-${monobi}
  // }

  return {
    id: index,
    transporterName: data.transporterName,
    totalVehicles: data.totalVehicles,
    transporterAllOrders:data.orders,
    totalFreightCost: data.totalFreightCost,
  };
});