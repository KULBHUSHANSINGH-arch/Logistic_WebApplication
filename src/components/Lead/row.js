
function convertToIndianTime(utcTime) {
    if (!utcTime) return "Invalid Date";

    try {
        // Create a Date object from the UTC time
        const date = new Date(utcTime);

        // Get the IST offset in minutes (IST is UTC + 5:30)
        const istOffset = 5.5 * 60 * 60 * 1000;

        // Convert the date to IST
        const istDate = new Date(date.getTime() + istOffset);

        // Extract hours, minutes, and determine AM/PM
        let hours = istDate.getUTCHours();
        const minutes = istDate.getUTCMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";

        // Convert to 12-hour format
        hours = hours % 12 || 12; // Adjust for 12-hour format

        // Format minutes with leading zeros
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        // Create the formatted time string
        const timeString = `${hours}:${formattedMinutes} ${ampm}`;

        // Get day, month name, and year
        const day = istDate.getUTCDate();
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const monthName = monthNames[istDate.getUTCMonth()];
        const year = istDate.getUTCFullYear();

        // Combine date and time with month name
        return `${day} ${monthName} ${year}`;
    } catch (error) {
        return "Error converting time";
    }
}
export const rows = (datas) => datas.map((data, index) => {
    let formateDate=convertToIndianTime(data.createdOn)
    // console.log('formateDate',formateDate)
    return {
        customerId: data.customerId,
        customerName: data.customerName,
        mobileNumber: data.mobileNumber,
        state: data.state,
        email: data.email,
        city: data.city,
        gstNumber: data.gstNumber,
        address: data.address,
        notes: data.notes,
        companyName: data.companyName,
        salesPerson: data.salesPerson,
        salesPersonName: data.salesPersonName,
        createdOn: data.createdOn,
        updatedOn: data.updatedOn,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        status: data.status,
        id:data.customerId + data.salesPerson,
        AssignByName:data.AssignByName,
        salesPersonName:data.salesPersonName,

    };
});