import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOut } from "../../feauters/user.slice";
import { useLocation } from "react-router-dom";
import gautamLogo from "../../assets/gautam2.png";
import logisticLogo from "../../assets/logo3.jpg";
import { dev } from "../../utils/ApiUrl";
import { FaBars } from "react-icons/fa";

// import movingImg from "../assets/Icons/vehicle.png";
import movingImg from "../../assets/Icons/vehicle.png";

function Header({ toggleSidebar }) {
  const token = localStorage.getItem("accessToken");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const [setStatus] = useState(null);
  const navigate = useNavigate();
  const [centerOpacity, setCenterOpacity] = useState(0);
  const headerRef = useRef(null); // Ref for header if needed
  const [centerWidth, setCenterWidth] = useState(100); // Start with original width (100%)
  const [vehicleDirection, setVehicleDirection] = useState(true); // True for right
  const movingImageRef = useRef(null); // To track the moving vehicle
  const centerImageRef = useRef(null); // To track the center image
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [personId, setPersonId] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const userDepartment = localStorage.getItem("department");
    const designation = localStorage.getItem('designation');
    setPersonId(currentUser);
    setDepartment(userDepartment);
    setDesignation(designation);

    // console.log("Current Header User", currentUser);
    // console.log("Current Header Department", userDepartment);
  }, []);

  const handleClick = () => {
    if (token) {
      localStorage.removeItem("accessToken");
      dispatch(userLoggedOut());
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  // checking user status-------------------------------
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${dev}/user/checkActive`, {
          method: "POST",
          body: JSON.stringify({ personId: user?.personId }),
          headers: {
            "content-type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data?.status?.toLowerCase() === "inactive") {
          handleClick();
        }

        // setError('');
      } catch (err) {
        setStatus(null);
        console.log("error", err);
        // setError('Employee not found or an error occurred.');
      }
    };
    checkStatus();
  }, []);

  useEffect(() => {
    // Make sure the image moves and rotates on initial render
    if (movingImageRef.current) {
      movingImageRef.current.style.animationPlayState = "running";
    }
  }, []);

  // Function to get the center position of the center section
  const getCenterPosition = () => {
    if (centerImageRef.current) {
      const centerRect = centerImageRef.current.getBoundingClientRect();
      return centerRect;
    }
    return null;
  };

  // Function to handle the vehicle movement and adjust center image opacity
  const handleVehicleMovement = () => {
    if (movingImageRef.current && headerRef.current) {
      const vehicle = movingImageRef.current.getBoundingClientRect();
      const header = headerRef.current.getBoundingClientRect();
      const center = getCenterPosition();

      // If the center section exists, check if the vehicle has passed through
      if (center) {
        // Left to right movement: When vehicle is crossing center, show center gradually
        if (vehicle.right > center.left && vehicle.left < center.right) {
          const opacityFactor = Math.min(
            1,
            (vehicle.right - center.left) / center.width
          );
          setCenterOpacity(opacityFactor); // Gradually increase opacity
        }
        // Right to left movement: When vehicle is crossing center, hide center gradually
        if (vehicle.left < center.right && vehicle.right > center.left) {
          const opacityFactor = Math.max(
            0,
            1 - (center.right - vehicle.left) / center.width
          );
          setCenterOpacity(opacityFactor); // Gradually decrease opacity
        }
      }

      // Check the direction of the vehicle movement
      if (vehicle.left < header.left) {
        setVehicleDirection(false); // Moving left to right
      } else if (vehicle.right > header.right) {
        setVehicleDirection(true); // Moving right to left
      }
    }
  };

  // Set an interval to track the vehicle position and update the center image
  useEffect(() => {
    const intervalId = setInterval(handleVehicleMovement, 50); // Check every 50ms for smoother movement
    return () => clearInterval(intervalId);
  }, []);

  const profile =
    (user && user.userProfile) ||
    "https://e7.pngegg.com/pngimages/20/669/png-clipart-logistics-logo-transport-brand-logistic-miscellaneous-service.png";

  return (
    <header
      ref={headerRef}
      className="w-full flex justify-between items-center px-4 fixed top-0 left-0"
      style={{ backgroundColor: "#a20000", zIndex: 1000 }}
    >
      {/* Left Section: Hamburger Icon and Logo */}
      <div className="flex items-center space-x-4">
        <FaBars
          onClick={toggleSidebar}
          className="text-white text-4xl p-2 opacity-80 rounded-full shadow-md bg-red-500 hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer"
        />
        <div
          className="w-32 h-12 cursor-pointer"

          onClick={() => {
            // console.log("Department:", department);
            // console.log("Designation:", designation);

            if (department === "Sales" && designation === "Accountant") {
              navigate("/salestable");
            } else {
              navigate("/dashboard");
            }
          }}
        >
          <img
            src={gautamLogo}
            alt="Gautam Logo"
            className="h-full w-full object-cover"
          />
        </div>

      </div>

      {/* Center Section: Image with Red Color Overlay */}
      <div
        ref={centerImageRef}
        className="relative w-48 h-12 flex justify-center items-center overflow-hidden"
        style={{
          opacity: centerOpacity,
          transition: "opacity 0.2s ease-out", // Smooth transition for opacity
        }}
      >
        {pathname !== "/login" && (
          <div className="relative">
            <img
              src={
                logisticLogo ||
                "https://e7.pngegg.com/pngimages/20/669/png-clipart-logistics-logo-transport-brand-logistic-miscellaneous-service.png"
              }
              className="h-full w-full object-cover "
              alt="Logistics Logo"
            />
            <div className="absolute top-0 left-0 w-full h-full opacity-50"></div>
          </div>
        )}
      </div>

      {/* Moving Image (vehicle image) */}
      <div ref={movingImageRef} className="moving-image" style={{ left: 0 }}>
        <img
          src={movingImg}
          alt="Moving Vehicle"
          className="w-12 h-12 object-cover"
        />
      </div>

      {/* Right Section: Profile & Styled Logout/Login Button */}
      {pathname !== "/login" && (
        <div className="w-28 h-9 rounded-md text-white overflow-hidden ">
          <button
            onClick={handleClick}
            className="flex items-center justify-between h-full w-full gap-2 px-2 rounded-sm shadow-md transition-colors duration-300 ease-in-out bg-red-400 hover:bg-red-500 hover:text-gray-200"
          >
            {user && (
              <div
                style={{ width: "34px", height: "34px", borderRadius: "50%" }}
                className="overflow-hidden border-2 border-white"
              >
                <img
                  src={user.userProfile}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-xs font-semibold capitalize tracking-wide">
              {token ? "Log out" : "Log in"}
            </p>
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
