import { useEffect, useState, Suspense, lazy } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SpeedIcon from "@mui/icons-material/Speed";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import gautamSolar from "../assets/Images/g.png";
// import des from "../assets/Images/des2.png";
import des from "../assets/Images/end.png";
import curr from "../assets/Images/crL.png";

import { dev } from "../utils/ApiUrl";

import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import fastTag from "../assets/Images/fastags.png";
import fastTagNew from "../assets/Images/fasttags.png";
// import { getMapQuestRoute } from "../utils/googleMapApi";
// Lazily load the MapSidebar component


const MapSidebar = lazy(() => import("./MapSidebar"));



function formatDateTime(dateString) {
  if (!dateString) {
    return "N/A"; // Return a default value if the dateString is undefined or null
  }

  // Parse the date string
  const [date, time] = dateString.split(" ");
  const [year, month, day] = date.split("-");
  const [hour, minute, second] = time.split(":");

  // Create a Date object using the extracted components
  const formattedDate = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second.substring(0, 2)}`
  );

  // Options for formatting the time
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Set to true for AM/PM format
  };

  // Format the time to a string with AM/PM
  const formattedTime = formattedDate.toLocaleString("en-US", options);

  // Construct the formatted output
  return `${day}-${month}-${year} ${formattedTime}`;
}

const destinationIcon = L.divIcon({
  className: "", // Avoid default Leaflet styles
  html: `
    <div 
      class="w-9 h-9 rounded-full overflow-hidden   ">
      <img 
        src="${des}" 
        alt="Destination Icon" 
        class="w-full h-full object-contain rounded-full rotate-45 " />
        
    </div>
  `,
  iconSize: [36, 36], // Adjusted to match the div size (w-9 h-9 = 36px)
  iconAnchor: [6, 23], // Center the icon (half of iconSize)
  popupAnchor: [0, -24], // Adjusted popup anchor based on icon size
});

const whiteMarkerIcon = L.divIcon({
  className: "white-marker-icon",
  html: `
    <div class=" bg-green-600 rounded-full flex items-center justify-center" style="width: 14px; height: 14px;">
     
    </div>
  `,
  iconSize: [20, 20], // Size of the outer red circle
  iconAnchor: [7, 7], // Center the icon
  popupAnchor: [0, -16], // Position the popup above the icon
});
const redMarkerIcon = (haltHours) =>
  L.divIcon({
    className: "red-marker-icon",
    html: `
      <div class="rounded-full flex items-center justify-center border-2 border-red-600 bg-white" style="width: 40px; height: 40px;">
        <span class="text-red-600 font-bold text-xs flex items-center justify-center">
          ${
            haltHours !== undefined && haltHours !== null
              ? parseFloat(haltHours).toFixed(1)
              : ""
          } 
          <span class="ml-1">H</span>
        </span>
      </div>
    `,
    iconSize: [30, 30], // Adjusted size for better display
    iconAnchor: [0, 15], // Centering the icon
    popupAnchor: [0, 6],
  });

// Current location marker with full transform-origin and rotation styling
const currentLocationIcon = L.divIcon({
  className: "", // Avoid default Leaflet styles
  html: `
    <div 
      class="w-10 h-10 rounded-full overflow-hidden" 
      style="display: flex; align-items: center; justify-content: center;">
      <img 
        src="${curr}" 
        alt="Current Location Icon" 
        style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;;" 
      />
    </div>
  `,
  iconSize: [40, 40], // Adjusted size for the current location icon
  iconAnchor: [20, 20], // Center the icon (half of iconSize)
  popupAnchor: [0, -24], // Position for the tooltip
});

const customOriginIcon = L.divIcon({
  className: "custom-icon", // Custom class for styling
  html: `
    <div class="w-8 h-8 rounded-full overflow-hidden  flex items-center justify-center">
      <img 
        src="${gautamSolar}" 
        alt="Gautam Solar Logo" 
        class="w-full h-full object-contain rounded-full" />
    </div>
  `, // Wrap the image in a div for circular effect
  iconSize: [32, 32], // Adjusted size to fit the div (12 * 4 = 48px)
  iconAnchor: [16, 16], // Center anchor point
  popupAnchor: [0, -24], // Adjusted popup anchor based on icon size
});


const getLastObject = (liveData) => {
  if (liveData.length > 0) {
    return liveData[liveData.length - 1]; // Return the last object if array is not empty
  } else {
    return null; // Return null or some default value if the array is empty
  }
};

const MapComponent = ({ handleClose, open, vehicleList }) => {
  let origin = [29.9671, 78.0596]; // Fixed origin coordinates

        let origin1=[28.91244195293824, 75.98344444232747]

         origin = vehicleList.workLocation == "b691221b-af10-11ef-a344-1a2cd4d9c0d1" ? origin1 : origin;

  const latitudeLongitude = vehicleList?.latitudeLongitude || [];
  const [live, setLive] = useState([]); // live data for current locations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripId, setTripId] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehcileData, setVehicleData] = useState([]);
  const [halt, setHalt] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const[activeFastagButton,setActiveFastagButton]=useState(true)
  // /api/vehicleIN/getFastagLocation
//   payload -{
//     "tripId": "eadc97eb-46f5-4f71-a54d-1f46bbdd3d64",
//     "vehicle_number": "UP80JT0424"
// }
  // console.log("vehicle list in map", vehicleList);
  console.log("trip live  data in map", live);
  // console.log("halt  data in map", halt);
  const fetchCurrentLocation = async () => {
    if (!tripId) {
      console.log("Trip ID is missing");
      return;
    }

    setLoading(true);
    setError(null); // Reset error state
    try {
      const resp = await fetch(`${dev}/vehicleIN/tripTracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure proper headers
        },
        body: JSON.stringify({ tripId: tripId }), // Ensure tripId is passed in the correct format
      });

      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await resp.json();
      const validData = data.filter(
        (item) => item.latitude !== "null" && item.longitude !== "null"
      );
      let haltData = validData.filter((data) => data.halt === true);
      setHalt(haltData);
      if (validData.length > 0) {
        setLive(validData);
      } else {
        toast.error("Current Location Data Not Found");
        console.log("No valid latitude/longitude data found");
      }
    } catch (error) {
      console.log("Something went wrong:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchCurrentLocation();
    }
  }, [tripId]);
  useEffect(() => {
    setVehicleNo(vehicleList?.vehicleNo);
    setVehicleData(vehicleList);
  }, [vehicleList]);
  useEffect(() => {
    if (vehicleList?.tripId) {
      setTripId(vehicleList.tripId);
    }
  }, [vehicleList?.tripId]);

  // map api calling here--
  useEffect(() => {
    
  const lastObj=live?.length>0&&getLastObject(live)
    const checkTimeDifference = () => {
      const lastUpdateTime = new Date(lastObj.time_recorded);
      const currentTime = new Date();
      const timeDifference = (currentTime - lastUpdateTime) / 1000 / 60 / 60; // in hours
  
      if (timeDifference > 2) {
        setActiveFastagButton(false);
      } else {
        setActiveFastagButton(true);
      }
    };
  
    checkTimeDifference();
  }, [live]); 
  

  const handleFastTagClick=async()=>{
    if (!tripId) {
      console.log("Trip ID is missing");
      return;
    }
  //   payload ={
  //     "tripId": "eadc97eb-46f5-4f71-a54d-1f46bbdd3d64",
  //     "vehicle_number": "UP80JT0424"
  // }
  // /api/vehicleIN/getFastagLocation

    setLoading(true);
    setError(null); // Reset error state
    try {
      const resp = await fetch(`${dev}/vehicleIN/getFastagLocation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure proper headers
        },
        body: JSON.stringify({ tripId: tripId ,vehicle_number:vehicleNo}), // Ensure tripId is passed in the correct format
      });

      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await resp.json();
      const validData = data.filter(
        (item) => item.latitude !== "null" && item.longitude !== "null"
      );
      let haltData = validData.filter((data) => data.halt === true);
      setHalt(haltData);
      if (validData.length > 0) {
        setLive(validData);
      } else {
        toast.error("Fast Tag Location Not Found");
        console.log("No valid latitude/longitude data found");
      }
    } catch (error) {
      console.log("Something went wrong:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }



  const mapStyles = { height: "100vh", width: "100%" };
  const lastCurrentLocation = live.length > 0 ? live[live.length - 1] : null;

  return (
    <div className=" ">
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Map View</span>{" "}
            {/* Main heading text */}
            <span className="text-2xl font-bold text-red-600 ml-4">
              {vehicleNo && vehicleNo}
            </span>{" "}
            {/* Styled 'Vehicle' heading */}
            <Button
              variant="text" // Keep or modify as necessary
              className=" ml-4  text-black  bg-cover bg-no-repeat bg-center  w-[200px] h-[50px]  text-[16px] flex items-center justify-center outline-none cursor-pointer  hover:bg-gray-400 bg-gray-300py-1 px-1 "
              style={{
                backgroundImage: `url(${fastTagNew})`, // Image is applied as style since it's dynamic
              }}
              // disabled={activeFastagButton}
              onClick={handleFastTagClick}
            >
              {/* Add any content here, if needed */}
            </Button>
          </div>
          <Button onClick={handleClose} color="secondary">
            Close {/* Close button */}
          </Button>
        </DialogTitle>

        <DialogContent
          className="p-0  flex justify-between items-center "
          style={{ height: "500px" }}
        >
          {" "}
          {/* Fixed consistent height */}
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <CircularProgress color="secondary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mt-4 flex items-center justify-center h-full">
              <p>Something went wrong: {error}</p>
            </div>
          ) : (
            <div className="h-full w-full">
              {" "}
              {/* Make map fill the available space */}
              <MapContainer center={origin} zoom={6} className="h-full w-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Marker for Origin */}
                <Marker position={origin} icon={customOriginIcon}>
                  <Tooltip direction="top" offset={[-8, -2]}>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                        <img
                          src={gautamSolar}
                          alt="Gautam Solar Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <strong>
                          Gautam Solar Pvt Ltd ({vehicleList?.workLocationName})
                        </strong>{" "}
                        <br />
                        Sidcul, Haridwar, Uttarakhand-249403
                      </div>
                    </div>
                  </Tooltip>
                </Marker>

                {/* Initialize lastLocation to the current location or origin */}
                {(() => {
                  let lastLocation =
                    live.length > 0
                      ? [
                          live[live.length - 1].latitude,
                          live[live.length - 1].longitude,
                        ]
                      : origin;

                  {
                    /* Destination Markers and Polylines */
                  }
                  return latitudeLongitude.map((loc, index) => {
                    if (loc.latitude && loc.longitude) {
                      const destinationPosition = [loc.latitude, loc.longitude];

                      // Create polyline from lastLocation to the current destination
                      const polylinePositions = [
                        lastLocation,
                        destinationPosition,
                      ];

                      // Update the lastLocation to the current destination after drawing the polyline
                      lastLocation = destinationPosition;

                      return (
                        <React.Fragment key={index}>
                          <Marker
                            position={destinationPosition}
                            icon={destinationIcon}
                          >
                            <Tooltip
                              direction="top"
                              offset={[-8, -2]}
                              className="bg-white border border-gray-300 rounded-md p-3 shadow-md z-50 text-sm text-gray-800"
                            >
                              <div>
                                <strong>
                                  Party Name: {vehicleList?.PartyName}
                                </strong>{" "}
                                <br />
                                <strong>Address</strong>: {loc?.Address}
                              </div>
                            </Tooltip>
                          </Marker>

                          {/* Draw polyline from last location to current destination */}
                          <Polyline
                            positions={polylinePositions}
                            color="#858594"
                          />
                        </React.Fragment>
                      );
                    }
                    return null;
                  });
                })()}

                {/* Live Data Markers */}
                {live.length > 0 &&
                  live.map((vehicle, index) => {
                    const currentPosition = [
                      vehicle.latitude,
                      vehicle.longitude,
                    ];
                    // total_hours
                    // start_time
                    // place_name
                    // leaving_time
                    // Display correct data based on halt condition
                    const haltHours = vehicle.halt && vehicle.total_hours;
                    const leavingTime = vehicle.halt && vehicle.leaving_time;
                    const startTime = vehicle.halt && vehicle.start_time;
                    const dateRecorded = vehicle.halt
                      ? undefined
                      : vehicle.time_recorded;
                    const address = vehicle.halt
                      ? vehicle.place_name
                      : vehicle.location;
                    const distanceTravel = vehicle.halt
                      ? undefined
                      : vehicle.distanceTravel;
                    const speed = vehicle.halt
                      ? "0"
                      : (typeof vehicle.speed === "string"
                          ? parseFloat(vehicle.speed)
                          : vehicle.speed
                        )?.toFixed(2) || "0";

                    if (vehicle.latitude && vehicle.longitude) {
                      return (
                        <React.Fragment key={index}>
                          <Marker
                            position={currentPosition}
                            icon={
                              index === live.length - 1 // Check if it's the last (current) location
                                ? currentLocationIcon // Always show the current location marker
                                : vehicle.halt // If not the current location, check for halt
                                ? redMarkerIcon(parseFloat(haltHours)) // Show halt marker
                                : whiteMarkerIcon // Default live marker
                            }
                          >
                            <Tooltip direction="top" offset={[-8, -2]}>
                              <div className="bg-white shadow-lg border border-gray-300 rounded-lg p-3">
                                {vehicle.halt && (
                                  <div className="flex justify-center items-center">
                                    <img
                                      src={curr}
                                      alt="Vehicle Halt"
                                      className="mr-2 h-6"
                                    />
                                    <h1 className="text-xl text-red-500 font-serif font-bold mb-1">
                                      Vehicle Halt Time
                                    </h1>
                                  </div>
                                )}

                                {/* Halt-specific Time (only shown if halted) */}
                                {vehicle.halt && (
                                  <div className="flex items-center space-x-2 mt-2">
                                    <AccessTimeIcon
                                      fontSize="small"
                                      className="text-red-600"
                                    />
                                    <strong className="text-gray-800 font-sans font-extrabold">
                                      Halt :
                                    </strong>
                                    <span className="text-red-500">
                                      {haltHours || "N/A"} Hours
                                    </span>
                                  </div>
                                )}
                                {/* Location/Place Name */}
                                <div className="flex items-center space-x-2 mt-2">
                                  <LocationOnIcon
                                    fontSize="small"
                                    className="text-green-900 "
                                  />
                                  <strong className="text-gray-800 font-sans font-extrabold">
                                    {vehicle.halt ? "Place Name:" : "Location:"}
                                  </strong>
                                  <span className=" text-green-900 font-serif font-bold">
                                    {address || "N/A"}
                                  </span>
                                </div>

                                {/* Time Information */}
                                <div className="flex items-center space-x-2 mt-2">
                                  <AccessTimeIcon
                                    fontSize="small"
                                    className="text-blue-600"
                                  />
                                  <strong className="text-gray-800 font-sans font-extrabold">
                                    {" "}
                                    {/* Dark gray for the label */}
                                    {vehicle.halt
                                      ? "Start Date & Time:"
                                      : "Date & Time:"}
                                  </strong>
                                  <span className="text-blue-500">
                                    {vehicle.halt
                                      ? startTime
                                        ? formatDateTime(startTime)
                                        : "N/A"
                                      : dateRecorded
                                      ? formatDateTime(dateRecorded)
                                      : "N/A"}
                                  </span>
                                </div>

                                {/* Distance Travelled */}
                                {!vehicle.halt && (
                                  <div className="flex items-center space-x-2 mt-2">
                                    <DirectionsCarIcon
                                      fontSize="small"
                                      className="text-purple-600"
                                    />
                                    <strong className="text-gray-800 font-sans font-extrabold">
                                      Distance Travelled:
                                    </strong>
                                    <span className="text-purple-500">
                                      {distanceTravel || "N/A"}
                                    </span>
                                  </div>
                                )}

                                {/* Speed */}
                                {!vehicle.halt && (
                                  <div className="flex items-center space-x-2 mt-2">
                                    <SpeedIcon
                                      fontSize="small"
                                      className="text-yellow-900"
                                    />
                                    <strong className="text-gray-800 font-sans font-extrabold">
                                      Speed:
                                    </strong>
                                    <span className="text-yellow-900">
                                      {speed} km/h
                                    </span>
                                  </div>
                                )}

                                {/* Leaving Time (only shown if halted) */}
                                {vehicle.halt && (
                                  <div className="flex items-center space-x-2 mt-2">
                                    <AccessTimeIcon
                                      fontSize="small"
                                      className="text-orange-600"
                                    />
                                    <strong className="text-gray-800 font-sans font-extrabold">
                                      End Date & Time:
                                    </strong>
                                    <span className="text-orange-500">
                                      {leavingTime
                                        ? formatDateTime(leavingTime)
                                        : "N/A"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </Tooltip>
                          </Marker>

                          {/* Draw polyline */}
                          {index === 0 ? (
                            <Polyline
                              positions={[origin, currentPosition]}
                              color="green"
                            />
                          ) : (
                            <Polyline
                              positions={[
                                [
                                  live[index - 1].latitude,
                                  live[index - 1].longitude,
                                ],
                                currentPosition,
                              ]}
                              color="green"
                            />
                          )}
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
              </MapContainer>
            </div>
          )}
          {/* map sidebar component */}
          <div className="  w-1/2   h-full px-1 overflow-y-scroll">
            {/* Suspense component to handle loading state */}
            <Suspense fallback={<div>Loading...</div>}>
              {/* Pass props to the lazily loaded component */}
              <MapSidebar
                data={vehcileData}
                halt={halt}
                currentLocation={live?.length > 0 && getLastObject(live)}
              />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapComponent;
