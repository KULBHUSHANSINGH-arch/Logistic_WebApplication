import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddVehicle from "./components/vehicle/AddVehicle";
import VehicleList from "./components/vehicle/VehicleList";
import Header from "./components/header/Header";
import ProtectedRoute from "./components/Protected";
import PublicRoute from "./components/Publicroute";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import './App.css'
import NewParty from "./components/Add_Party/newParty";
import PartList from "./components/Add_Party/PartyList";
import Transporter from "./components/Transporter/Transporter";
import TransporterList from "./components/Transporter/TransporterList";
import DeliveryAddress from "./components/DeliveryAddress/DeliveryAddress";
import DeliveryAddressList from "./components/DeliveryAddress/DeliveryAddressList";
import { useDispatch, } from "react-redux";
import { toggleTheme } from "./feauters/theme.slice";
import DeliveryProcess from "./components/Delivery_Status/DeliveryProcess";
import Watage from "./components/watage/Watage";
import VehicleReport from "./pages/VehicleReport";
import Sales from "./components/Marketing_Team/Sales";
import SalesList from "./components/Marketing_Team/SalesList";
import ChangeDeliveryAddressList from "./components/SaleDepartment/ChangeDeliveryAddressList";
import ChangePartAddress from "./components/SaleDepartment/ChangePartAddress";
import SetPenalPrice from "./components/Set_Penal_Price/Set_Penal_Price";
import PanelPriceList from "./components/Set_Penal_Price/PanelPriceList";
import MeetingList from "./components/meeting/MeetingList";
import SalesReport from "./components/sales report/SalesReport";
import { RouteGuard } from './components/RouteGuard';
import { useSelector } from "react-redux";
import EnquiryList from "./components/Lead/EnquiryList";
import FinalPi from "./components/Final_PI/FinalPi";
import ReceiveAmount from "./components/Receive_Amount/ReceiveAmount";
import ReceiveList from "./components/Receive_Amount/ReceiveList";
import TransporterReport from "./components/Transporter/TransporterReport";
function App() {
  const { user } = useSelector((state) => state.user);
  // console.log("User", user);
  // if (!user) {
  //   return <div>Loading...</div>;  // Show loading indicator if user is not yet available
  // }

  const versionNo = user && user.department == "Sales" ? 'V1.0.20250322.1219' :  "V1.0.20250301.1617";
  const handleLogout = () => {
    // console.log('User logged out due to status/version mismatch');
    localStorage.clear();
    window.location.href = '/login';
  };
  return (
    <Router>
      <RouteGuard handleLogout={handleLogout} versionNo={versionNo}>
        <InnerApp />
      </RouteGuard>
    </Router>
  );
}

function InnerApp() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  // const {darkMode} = useSelector((state) => state.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Conditional class for login page
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && (
        <Header toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000} // Auto close after 3 seconds
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />

      <div className={`app-container ${isLoginPage ? "login-page" : ""}`}>
        {/* Sidebar */}
        {!isLoginPage && (
          <div
            className={`dashboard-sidebar-wrapper ${isCollapsed ? "collapsed" : ""
              }`}
          >
            <Sidebar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
          </div>
        )}

        {/* Main content */}
        <div className={`main-content ${isCollapsed ? "collapsed" : ""} ${isLoginPage ? "login-page" : ""}  `}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Navigate to="/login" />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <VehicleList />
                </ProtectedRoute>
              }
            />
            <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /> </ProtectedRoute>} />
            <Route path="/vehicle-list" element={<ProtectedRoute><VehicleList /> </ProtectedRoute>} />

            {/* Add Party */}
            <Route path="/newParty" element={<ProtectedRoute>  <NewParty /> </ProtectedRoute>} />
            <Route path="/partylist" element={<ProtectedRoute>  <PartList /> </ProtectedRoute>} />

            {/* Add Transporter */}
            <Route path="/addtransporter" element={<ProtectedRoute> <Transporter />  </ProtectedRoute>} />
            <Route path="/transporterlist" element={<ProtectedRoute>  <TransporterList />  </ProtectedRoute>} />
            <Route path="/transporter-report" element={<TransporterReport/>}/>

            {/* Add Delivery Address */}
            {/* <Route path="/deliveryAddress" element={<ProtectedRoute>  <DeliveryAddress />  </ProtectedRoute>} />
            <Route path="/deladdresslist" element={<ProtectedRoute>  <DeliveryAddressList />  </ProtectedRoute>} /> */}

            {/* Delivery Status */}
            <Route path="/deliveryprocess" element={<ProtectedRoute>  <DeliveryProcess />  </ProtectedRoute>} />
            <Route path="/watage" element={<ProtectedRoute>  <Watage />  </ProtectedRoute>} />

            {/* Marketing Team */}
            <Route path="/add-sales-order" element={<ProtectedRoute>  <Sales />  </ProtectedRoute>} />
            <Route path="/sales-order" element={<ProtectedRoute>  <SalesList />  </ProtectedRoute>} />

            {/* Change Sales */}
            <Route path="/add-delivery-address" element={<ProtectedRoute>  <ChangePartAddress />  </ProtectedRoute>} />
            <Route path="/delivery-address" element={<ProtectedRoute>  <ChangeDeliveryAddressList />  </ProtectedRoute>} />

            {/* vehicle report */}
            <Route path="/vehicle-report" element={<ProtectedRoute>  <VehicleReport isCollapsed={isCollapsed} />  </ProtectedRoute>} />
            {/* Set Panel Price  */}
            <Route path="/setpanelprice" element={<ProtectedRoute>  <SetPenalPrice />  </ProtectedRoute>} />
            <Route path="/panelpricelist" element={<ProtectedRoute>  <PanelPriceList />  </ProtectedRoute>} />

            <Route path="/meeting-travelling" element={<ProtectedRoute>  <MeetingList />  </ProtectedRoute>} />
            <Route path="/sales-report" element={<ProtectedRoute>  <SalesReport />  </ProtectedRoute>} />
            <Route path="/lead" element={ <ProtectedRoute><EnquiryList /></ProtectedRoute>} />
            <Route path="/finalpi" element={ <ProtectedRoute><FinalPi /></ProtectedRoute>} />

            <Route path="/receiveAmount" element={ <ProtectedRoute><ReceiveAmount /></ProtectedRoute>} />
            <Route path="/receiveAmountList" element={ <ProtectedRoute><ReceiveList /></ProtectedRoute>} />




          </Routes>
        </div>
      </div>
    </>
  );
}


export default App;
