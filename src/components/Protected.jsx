import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const department = localStorage.getItem('department');
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  /**Agar token nahi hai to login page par redirect karo **/
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (user?.department === "Sales" && user.designation === "Accountant") {
    // Only allow access to sales-order route
    if (location.pathname !== "/sales-order" && location.pathname !== "/receiveAmountList"&& location.pathname !=="/receiveAmount") {
      return <Navigate to="/sales-order" />;
    }
    return children;
  }

  if (department === "Sales") {
    // console.log("path name in sales", location.pathname)
    /**  Sales department can access only Sales-related routes **/
    if (location.pathname !== "/dashboard" && location.pathname !== '/addtransporter' && location.pathname !== '/transporterlist' && location.pathname !== '/sales-report' && location.pathname !== "/add-sales-order" && location.pathname !== "/sales-order"
      && location.pathname !== "/add-delivery-address" && location.pathname !== "/delivery-address"
      && location.pathname !== "/newParty" && location.pathname !== "/partylist"
      && location.pathname !== "/panelpricelist" && location.pathname !== "/watage"
      && location.pathname !== '/setpanelprice' && location.pathname !== "/vehicle-report" && location.pathname !== "/lead" && location.pathname !== "/finalpi"
      && location.pathname !== "/meeting-travelling"
      && location.pathname !== "/receiveAmount"
      && location.pathname !== "/receiveAmountList"


    ) {
      // console.log("path name", location.pathname)
      return <Navigate to="/dashboard" />;
    }
  } else if (department === "Logistics") {
    /** Logistics department can access only non-Sales routes **/
    if (user.designation !== "Super Admin" && (location.pathname === "/marketing" || location.pathname === "/sales-order")) {
      return <Navigate to="/dashboard" />;
    }
  } else {
    /** If no valid department, redirect to login or an error page **/
    return <Navigate to="/login" />;
  }

  /** Agar token hai to children ko render karo (jo bhi protected component hoga) **/
  return children
    ;
};

export default ProtectedRoute;
