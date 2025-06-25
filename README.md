# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


    
  // Handle dropdown change
  const handleVehicleTypeChange = (event) => {
    const selectedTypeId = event.target.value;
    const selectedType = vehicleTypes.find(
      (type) => type.vehicleTypeId === selectedTypeId
    );
console.log('tyupa changes',selectedType)
    setFormData({
      ...formData,
      vehicleTypeId: selectedTypeId,
      vehicleType: selectedType ? selectedType.vehicleTypeName : "",
    });
  };

    useEffect(() => {
    if (data && vehicleTypes.length > 0) {
      const vehicleType = vehicleTypes.find(type => type.vehicleTypeName === data.vehicleTypeName);
      console.log('vehicle type 2',vehicleType)
      setFormData({
        vehicleId: data.id || "",
        vehicleNo: data.vehicleNo || "",
        vehicleType: vehicleType ? vehicleType.vehicleTypeId : "", // Set vehicleTypeId
        driverNumber: data.driverNumber || "",
        partyName: data.partyName || "",
        location: data.location || "",
        transpotterName: data.transpotterName || "",
        transferFrom: data.transferFrom || "",
        image: data.vehicleImg || null,
        currentUser: localStorage.getItem("currentUser"),
      });
    }
  }, [data, vehicleTypes]);

  {
  field: "actions",
  headerName: "Actions",
  width: 150,
  renderCell: (params) => {
    const normalStatus = (params.row.status || '').toLowerCase(); // Normalize status

    // Check if any of the images are not null or undefined
    const hasImages = params.row.vehicleImg1 || params.row.vehicleImg2 || params.row.vehicleImg3 || params.row.vehicleImg4;

    return (
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
          <Edit />
        </IconButton>

        {/* Only show MoreVert icon if images exist or based on other statuses */}
        {(hasImages || normalStatus === 'in' || normalStatus === 'loading' || normalStatus === 'approved') && (
          <IconButton color="info" onClick={(event) => handleClick(event, params.row)}>
            <MoreVert />
          </IconButton>
        )}
      </Box>
    );
  }
}


<!-- 345678988888888888888888888888888888888888888888888 -->
  // Define the columns of the data grid, each field represents a column in the table
  const columns = [
    {
      field: "vehicleNo",
      headerName: "Vehicle No", // Column header
      width: 150, // Column width
      sortable: true, // Allows sorting by this column
      renderCell: (
        params // Render the content of this column with ellipsis if overflow
      ) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.value} {/* The vehicle number value */}
        </Box>
      ),
    },
    {
      field: "vehicleTypeName",
      headerName: "Vehicle Type",
      width: 120,
      sortable: true,
      renderCell: (
        params // Render the vehicle type with ellipsis for long text
      ) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.value} {/* The vehicle type name */}
        </Box>
      ),
    },
    {
      field: "driverNumber",
      headerName: "Driver Number",
      width: 130,
      sortable: true,
      renderCell: (
        params // Render the driver's number with overflow handling
      ) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "partyName",
      headerName: "Party Name",
      width: 150,
      sortable: true,
      renderCell: (
        params // Render the party name, showing ellipsis if too long
      ) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      width: 120,
      sortable: true,
      renderCell: (
        params // Render the location, showing ellipsis if too long
      ) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "transferFrom",
      headerName: "Transfer From",
      width: 120,
      sortable: true,
      flex: 1, // Makes this column flexible in width based on available space
      renderCell: (
        params // Render the transfer from value
      ) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "transpotterName",
      headerName: "Transporter Name",
      width: 150,
      sortable: true,
      renderCell: (
        params // Render the transporter name
      ) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: true,
      renderCell: (params) => {
        // Render the status with color-coding
        const status = params.value; // The status of the vehicle (IN, OUT, etc.)
        let color = "black"; // Default text color
        let bgColor = "white"; // Default background color

        // Conditional styling based on status
        switch (status) {
          case "IN":
            bgColor = "#d4edda"; // Light green
            color = "#155724"; // Dark green
            break;
          case "OUT":
            bgColor = "#f8d7da"; // Light red
            color = "#721c24"; // Dark red
            break;
          case "CANCELED":
            bgColor = "#b5614c"; // Light yellow
            color = "#eaeaea"; // Dark yellow
            break;
          case "LOADING":
            bgColor = "#e2e3e5"; // Light gray
            color = "#6c757d"; // Dark gray
            break;
          case "APPROVED":
            bgColor = "#d1e7dd"; // Light teal
            color = "#0f5132"; // Dark teal
            break;
          default:
            bgColor = "white"; // Default background color
            color = "black"; // Default text color
        }

        // Return the status box with color-coded styles
        return (
          <Box
            sx={{
              backgroundColor: bgColor,
              color: color,
              padding: "2px 8px",
              borderRadius: "4px",
              textAlign: "center",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {status}
          </Box>
        );
      },
    },
    {
      field: "vehicleImg",
      headerName: "Vehicle Image",
      width: 200, // Width for the image column
      height: 300, // Height for the image

      renderCell: (params) => (
        <Box sx={{ width: 200, height: 300 }}>
          <img
            src={params.value} // Image URL from the vehicle data
            alt="Vehicle"
            style={{
              width: "100",
              height: "100",
              objectFit: "fill", // Ensures the image fits within the box
              cursor: "pointer", // Cursor changes to pointer on hover
            }}
            onClick={() => handleImageClick(params.value)} // Handle image click to open full-size preview
          />
        </Box>
      ),
    },
    {
      field: "resultDate",
      headerName: "Date",
      width: 180,
      sortable: true,
      renderCell: (params) => {
        // Convert UTC to IST
        const utcDate = new Date(params.value);
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)
        const istDate = new Date(utcDate.getTime() + istOffset);
  
        // Format IST date and time
        const formattedDate = istDate.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const formattedTime = istDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
  
        return (
          <Box>
            {formattedDate} {formattedTime}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions", // Column for edit and menu actions
      width: 150,
      renderCell: (params) => {
        const normalStatus = (params.row.status || "").toLowerCase(); // Normalize status to lowercase for comparison

        // Check if any of the vehicle images (image1, image2, etc.) are available
        const hasImages =
          params.row.vehicleImg1 ||
          params.row.vehicleImg2 ||
          params.row.vehicleImg3 ||
          params.row.vehicleImg4;

        return (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            {/* Edit button */}
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <Edit />
            </IconButton>

            {/* Show the three-dot menu if the all images exists */}
            {hasImages && (
              <IconButton
                color="info"
                onClick={(event) => handleClick(event, params.row)}
              >
                <MoreVert />
              </IconButton>
            )}

            
          </Box>
        );
      },
    },
  ];


    // Transform the vehicle data for rendering in the table
  const rows = vehicleData.map((vehicle, index) => ({
    id: vehicle.vehicleId,
    vehicleNo: vehicle.vehicleNo,
    vehicleTypeName: vehicle.vehicleTypeName,
    driverNumber: vehicle.driverNumber,
    partyName: vehicle.partyName,
    location: vehicle.location,
    transferFrom: vehicle.transferFrom,
    transpotterName: vehicle.transpotterName,
    status: vehicle.status,
    vehicleImg: vehicle.vehicleImg,
    createdOn: new Date(vehicle.createdOn).toLocaleString(),
    updatedOn: new Date(vehicle.updatedOn).toLocaleString(),
    resultDate: new Date(vehicle.resultDate).toLocaleString(),
    vehicleImg1: vehicle.vehicleImg1,
    vehicleImg2: vehicle.vehicleImg2,
    vehicleImg3: vehicle.vehicleImg3,
    vehicleImg4: vehicle.vehicleImg4,
  }));




   <section className="w-full bg-gray-100 p-6 flex justify-between items-center">
        {/* Centered Title */}
        <div className="flex-grow text-center">
          <h2 className="text-3xl text-red-500 font-sans font-bold capitalize tracking-wider">
            Vehicle List
          </h2>
        </div>

        {/* Buttons Container */}
        <div className="flex space-x-4">
          {/* Date Filter Button */}
          <Button
            variant="contained"
            className="bg-blue-500 hover:bg-blue-600 text-white" // Custom background and hover color
            // startIcon={<FilterIcon />} // Icon related to filtering
            onClick={() => setDateFilterOpen(true)} // Opens the date filter popup
          >
            Date Filter
          </Button>

          {/* Export Button */}
          <Button
            disabled={vehicleList.length === 0} // Disable if there's no vehicle list
            variant="contained"
            className="bg-green-500 hover:bg-green-600 text-white" // Custom background and hover color
            startIcon={<ExportIcon />} // Icon related to export
            onClick={handleExcelFile} // Excel file generation handler
          >
            Export
          </Button>
        </div>
      </section>

       {pathname !== "/login" && <Header />}
  
    <ToastContainer
      position="top-center"
      autoClose={3000} // Auto close after 3 seconds
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  
    <Routes>
      {/* Login route outside of the app-container div */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
  
      {/* All other routes inside app-container */}
      <Route
        path="*"
        element={
          pathname !== "/login" && (
            <div className={`app-container `}>
              {/* Sidebar */}
              <div className={`side-bar-wrapper`}>
                <Sidebar onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
              </div>
  
              {/* Main content */}
              <div className="main-content ">
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <VehicleList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <Navigate to={"/login"} />
                      </PublicRoute>
                    }
                  />
                  <Route path="/add-vehicle" element={<AddVehicle />} />
                  <Route path="/vehicle-list" element={<VehicleList />} />
                  <Route path="/newParty" element={<NewParty />} />
          </Routes>
              </div>
            </div>
          )
        }
      />
    </Routes>

    <!-- map--------------------------------- -->
    import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/map.css";
import vehicleImage from "../assets/Icons/new-user.png"; // Import your vehicle image
import originIcon from "leaflet/dist/images/marker-icon.png";
import destinationIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Set up default icon for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;

// Create custom icons
const greenIcon = new L.Icon({
  iconUrl: originIcon,
  iconSize: [12, 41],
  iconAnchor: [15, 25],
  shadowUrl: markerShadow,
});

const redIcon = new L.Icon({
  iconUrl: destinationIcon,
  iconSize: [12, 41],
  iconAnchor: [15, 25],
  shadowUrl: markerShadow,
});

// Create a custom vehicle icon with rotation
const createVehicleIcon = (angle) => {
  return L.divIcon({
    html: `<img src="${vehicleImage}" style="transform: rotate(${angle}deg); width: 30px; height: 40px;" />`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });
};

// Helper function to calculate bearing (angle) between two points
const calculateBearing = (start, end) => {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const dLng = endLng - startLng;

  const x = Math.sin(dLng) * Math.cos(endLat);
  const y =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360; // Convert bearing to degrees
};

// Helper function to move current location towards the next destination
const moveTowardsDestination = (currentLocation, destination, stepSize) => {
  const latDiff = destination.lat - currentLocation.lat;
  const lngDiff = destination.lng - currentLocation.lng;

  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

  if (distance < stepSize) {
    return destination; // Return destination if within stepSize distance
  }

  const stepLat = (latDiff / distance) * stepSize;
  const stepLng = (lngDiff / distance) * stepSize;

  return {
    lat: currentLocation.lat + stepLat,
    lng: currentLocation.lng + stepLng,
  };
};

// Simulate a road route (list of waypoints) from origin to destination
const simulatedRoute = [
  { lat: 12.9716, lng: 77.5946 }, // Origin (Bangalore)
  { lat: 12.9770, lng: 77.5895 },
  { lat: 12.9875, lng: 77.6033 },
  { lat: 13.0000, lng: 77.6200 },
  { lat: 13.0400, lng: 77.6700 },
  { lat: 13.0827, lng: 80.2707 }, // Destination (Chennai)
];

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState(simulatedRoute[0]); // Starting point
  const [waypointIndex, setWaypointIndex] = useState(0);
  const [reachedDestination, setReachedDestination] = useState(false);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (reachedDestination || waypointIndex >= simulatedRoute.length - 1) return; // Stop if destination is reached

    const stepSize = 0.005; // Adjust step size for smoother movement

    const interval = setInterval(() => {
      const nextWaypoint = simulatedRoute[waypointIndex + 1];

      setCurrentLocation((prevLocation) => {
        const newLocation = moveTowardsDestination(prevLocation, nextWaypoint, stepSize);

        // Calculate new angle/direction
        const newAngle = calculateBearing(prevLocation, nextWaypoint);
        setAngle(newAngle);

        // If the current location reaches the next waypoint
        if (
          Math.abs(newLocation.lat - nextWaypoint.lat) < 0.0001 &&
          Math.abs(newLocation.lng - nextWaypoint.lng) < 0.0001
        ) {
          setWaypointIndex((prevIndex) => prevIndex + 1); // Move to next waypoint
          if (waypointIndex + 1 >= simulatedRoute.length - 1) {
            setReachedDestination(true); // Reached the destination
            clearInterval(interval); // Stop interval
            return nextWaypoint; // Set to exact destination
          }
        }

        return newLocation;
      });
    }, 1000); // Move every 1 second

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [waypointIndex, reachedDestination]);

  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={7} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Origin Marker */}
      <Marker position={simulatedRoute[0]} icon={greenIcon}>
        <Popup>
          <h4 style={{ color: "green" }}>Origin:</h4>
          <p>Bangalore</p>
        </Popup>
      </Marker>

      {/* Vehicle Marker */}
      <Marker
        position={currentLocation}
        icon={createVehicleIcon(angle)} // Rotate the vehicle icon based on direction
      >
        <Popup>
          <h4>Current Location:</h4>
          <p>Moving on road...</p>
        </Popup>
      </Marker>

      {/* Destination Marker */}
      <Marker position={simulatedRoute[simulatedRoute.length - 1]} icon={redIcon}>
        <Popup>
          <h4 style={{ color: "red" }}>Destination:</h4>
          <p>Chennai</p>
        </Popup>
      </Marker>

      {/* Road Path (Polyline) */}
      <Polyline positions={simulatedRoute} color="blue" />

      {/* Destination Reached Popup */}
      {reachedDestination && (
        <Popup position={simulatedRoute[simulatedRoute.length - 1]}>
          <div>
            <h3>Vehicle has reached the destination!</h3>
          </div>
        </Popup>
      )}
    </MapContainer>
  );
};

export default MapComponent;



    <div
        className="w-full flex justify-start pt-10 bg-gray-100 items-center flex-col "
        style={{ height: "calc(100vh - 48px)" }}
      >
        <div className=" w-80 h-28 overflow-hidden  flex justify-center items-center">
          <img
            src={logo}
            alt="Gautam Solar"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className=" w-full flex justify-center  ">
          <form
            onSubmit={handleSubmit}
            className="w-1/2 flex flex-wrap justify-start bg-white px-4 py-5 rounded-md shadow-lg gap-4"
          >
            <div className="flex flex-col gap-1 w-full md:w-1/3">
              <label
                htmlFor="watage"
                className="block text-xl font-medium text-gray-700"
              >
                Watage
              </label>
              <input
                value={watage}
                onChange={handleChange}
                name="watage"
                type="text"
                placeholder="Enter Watage"
                className="w-full py-3 px-4 text-xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-500"
              />
              <p
                className={`h-2 text-sm text-red-500 capitalize font-semibold transition-opacity duration-300 ${
                  error ? "opacity-100" : "opacity-0"
                }`}
                style={{ height: "20px" }}
              >
                {error}
              </p>
            </div>

            <div className="flex justify-end w-full space-x-2">
              {" "}
              {/* Added space between buttons */}
              <Button
                color="default" // You can customize the color
                onClick={handleCancel}
                sx={{
                  backgroundColor: "lightgray", // Customize as needed
                  color: "black",
                  "&:hover": {
                    backgroundColor: "gray",
                  },
                  padding: "10px 20px",
                  borderRadius: "4px",
                }}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={handleSubmit}
                type="submit"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
                  },
                  padding: "10px 20px",
                  borderRadius: "4px",
                  width: "150px", // Set a fixed width for the button
                  position: "relative", // Position relative to contain the loader
                }}
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      left: "calc(50% - 12px)",
                      color: "white",
                    }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
            {/* Add more divs here if needed */}
          </form>
        </div>
      </div>