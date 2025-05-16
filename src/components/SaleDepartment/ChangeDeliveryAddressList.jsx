import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Container } from "react-bootstrap";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import back from "../../assets/Icons/back.png";
import ChangeDeliveryAddressListTabel from "./ChangeDeliveryAddressListTabel";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { dev } from "../../utils/ApiUrl";
import { userLoggedOut } from "../../feauters/user.slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";



const ChangeDeliveryAddressList = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [setStatus] = useState(null);
  const [personId, setPersonId] = useState("");

  useEffect(() => {
    setPersonId(user?.personId);

  }, [user]);

  // checking user status-------------------------------
  useEffect(() => {
    const CheckActiveVersion = async () => {
      try {
        const response = await fetch(`${dev}/user/checkActive`, {
          method: "POST",
          body: JSON.stringify({ personId: user?.personId }),
          headers: {
            "content-type": "application/json",
          },
        });
  
        if (!response.ok) {
          console.error("Failed to fetch user status");
          toast.error("Error checking user status.");
          return;
        }
  
        const data = await response.json();
        // console.log("API Response:", data);
  
        // Step 1: Check versionName
        const storedVersion = localStorage.getItem("versionName");
        if (data?.versionName && data.versionName !== storedVersion) {
          // console.log("Version mismatch. Reloading the page...");
          localStorage.setItem("versionName", data.versionName); 
          toast.info("Updating to the latest version. Reloading...", {
            position: "top-center",
            autoClose: 3000,
            closeOnClick: false,
            onClose: () => {
              window.location.reload();
            },
          });
          return; 
        }
  
        // Step 2: Check user status
        if (data?.status?.toLowerCase() === "inactive") {
          // console.log("User is Inactive. Logging out...");
          toast.warn("Your session has expired. Redirecting to login...");
          localStorage.removeItem("accessToken");
          dispatch(userLoggedOut());
          navigate("/login");
        }
      } catch (err) {
        console.error("Error checking user status:", err);
        toast.error("Something went wrong while checking user status.");
      }
    };
  
    if (user?.personId) {
      CheckActiveVersion(); 
    }
  }, [user, dispatch, navigate]);





  return (
    <div
      className="min-h-screen  bg-white"

    >
      <div className="w-full h-full overflow-auto">
        <Container className="bg-[#fff] p-4 md:p-3 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="w-1">
              <Image src={back} alt="back" rounded className="w-4" />
            </Link>
            <h2 className="flex-grow text-center text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
              Delivery/Billing Address List
            </h2>
          </div>

          {/* Delivery Address List Table */}
          <div className="App">
            <div className="card">
              {/* <DeliveryAddressListTabel /> */}
              <ChangeDeliveryAddressListTabel />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ChangeDeliveryAddressList;
