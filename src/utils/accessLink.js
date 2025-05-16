export function filterLinks(links, designation, department) {
    if (designation === "Super Admin") {
      return links; // Return all links for Super Admin
    }
  
    if (designation === "Super Admin") {
      return links.filter(link =>["Transporter Report"].includes(link.name)) // Return all links for Super Admin
    }
  
    if (designation === "Sales Executive") {
      // Return specific links for Sales Executive
      return links.filter(link =>
        ["dashboard", "Sales Order", "Party", "Delivery/Billing Address","Receive Amount","Lead"].includes(link.name)
      );
    }
  
    if (designation === "Accountant") {
      // Return specific link for Accountant
      // return links.filter(link => link.name === "Sales Order");
      return links.filter(link => 
        ["Sales Order", "Receive Amount"].includes(link.name)
      );
    }
  
    return []; 
  }
  