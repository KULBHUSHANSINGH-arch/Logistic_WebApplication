import React, { useEffect, useState } from "react";
import { Button } from "@mui/material"; // or '@mui/material' for newer versions
import { Card, CardContent, Typography, Tooltip, Box } from "@mui/material";
import moment from "moment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import end from "../assets/Images/ending.png";
import gautamSolar from "../assets/Images/g.png";
import { DirectionsCar } from "@mui/icons-material";
import { differenceInHours, differenceInDays } from "date-fns";
import { Collapse } from "@mui/material";
import {
  Person,
  LocalShipping,
  CarRepair,
  Phone,
  DateRange,
  LocationOn,
} from "@mui/icons-material"; // Import Material UI icons
import { Directions, NearMe } from "@mui/icons-material"; // Importing the relevant icons
import { CalendarToday, Speed, Timer, AccessTime } from "@mui/icons-material"; // Import icons
import { CheckCircle, Event } from "@mui/icons-material"; // Import Material UI icons
// import "../styles/mapSidebar.css";
// import MapProgressiveLine from "./MapProgressiveLine";
// Function to convert UTC date to IST format
const convertToISTT = (utcDateString) => {
  console.log("convert date abd time", utcDateString);
  const date = new Date(utcDateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};
// convert time and date----
const convertToIST = (utcDateString) => {
  const date = new Date(utcDateString);

  // Get the options for formatting
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};
// Function to format expected delivery date as day month year
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

// Function to calculate delay/ahead status
const getDeliveryStatus = (expectedDate, actualDate) => {
  const expected = new Date(expectedDate);
  const actual = new Date(actualDate);

  const daysDifference = differenceInDays(actual, expected);
  const hoursDifference = differenceInHours(actual, expected) % 24;

  if (daysDifference === 0 && hoursDifference === 0) {
    return { text: "On Time", color: "green" };
  } else if (
    daysDifference > 0 ||
    (daysDifference === 0 && hoursDifference > 0)
  ) {
    return {
      text: `Delayed by ${daysDifference} days ${hoursDifference} hours`,
      color: "red",
    };
  } else {
    return {
      text: `Before ${Math.abs(daysDifference)} days ${Math.abs(
        hoursDifference
      )} hours`,
      color: "blue",
    };
  }
};
// Ensure total hours is a number and format to one decimal place
const formatTotalHours = (hours) => {
  const numHours = typeof hours === "string" ? parseFloat(hours) : hours;
  return numHours.toFixed(1).replace(/^0+/, ""); // Remove leading zero if it exists
};

function MapSidebar({ data, currentLocation, halt }) {
  const [vehicleList, setVehicleList] = useState([]);
  const [currentData, setCurrentData] = useState({});
  const [activeTab, setActiveTab] = useState("details"); // State to track the active tab
  const [haltData, setHaltData] = useState([]);
  // State for toggle see all halts
  const [showAllHalts, setShowAllHalts] = useState(false);

  // Handle toggle click
  const handleToggleHalts = () => {
    setShowAllHalts((prev) => !prev);
  };
  useEffect(() => {
    setVehicleList(data);
    setCurrentData(currentLocation);
    setHaltData(halt);
  }, [data, currentLocation]);

  // console.log("vehicleList in map side bar", vehicleList);
  console.log("currentData in map side bar", currentData);
  // console.log(" haltData Data in map side bar", haltData);
  // Function to handle button click
  const handleTabChange = (tab) => {
    setActiveTab(tab); // Update the active tab
  };
  // Calculate delivery status (ontime, delayed, ahead)
  const deliveryStatus = getDeliveryStatus(
    vehicleList?.expectedDeliveryDate,
    vehicleList?.deliveryTime
  );

  // Conditionally render content based on the active tab
  const renderContent = () => {
    if (activeTab === "details") {
      return (
        <div>
          {/* Current location card */}
          {vehicleList.status === "OUT" && (
            <Card
              style={{
                width: "100%",
                backgroundColor: "#ffffff",
                borderRadius: "3",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                height: "auto",
                overflowY: "auto",
              }}
            >
              <CardContent style={{ padding: "10px 8px" }}>
                {/* Current Location */}
                <div className="py-2 px-4 bg-blue-50 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300">
                  <div className="flex items-center">
                    <LocationOn className="text-red-500 mr-3 text-2xl" />{" "}
                    {/* Increased Icon Size */}
                    <Typography
                      variant="body2"
                      className="font-sans text-gray-900 text-xs" // Reduced font size
                    >
                      <strong className="font-roboto text-red-500 text-sm font-bold">
                        Current Location:
                      </strong>{" "}
                      <span className="font-open-sans text-gray-800 text-xs font-medium  font-serif">
                        {currentData?.location ? currentData.location : "N/A"}
                      </span>
                    </Typography>
                  </div>
                  <Typography
                    variant="body2"
                    className="font-sans text-gray-800 text-sm mt-2"
                  >
                    <span
                      className={`font-open-sans text-xs font-normal text-white py-1 px-2 rounded-full  ${
                        vehicleList?.deliveryStatus
                          ?.toLowerCase()
                          .includes("arrived") // Check if it includes "arrived"
                          ? vehicleList?.deliveryStatus
                              ?.toLowerCase()
                              .includes("delay") // If it's "Arrived" and includes "delay"
                            ? "bg-yellow-500" // Yellow for "Arrived" with delay
                            : vehicleList?.deliveryStatus
                                ?.toLowerCase()
                                .includes("before") // If it's "Arrived" and includes "before"
                            ? "bg-blue-500" // Blue for "Arrived" before
                            : "bg-green-500" // Default green for "Arrived" (no delay or before)
                          : vehicleList?.deliveryStatus
                              ?.toLowerCase()
                              .includes("ontime") // For "OnTime"
                          ? "bg-green-500" // Green for "OnTime"
                          : vehicleList?.deliveryStatus
                              ?.toLowerCase()
                              .includes("before") // For "Before" without "Arrived"
                          ? "bg-blue-500" // Blue for "Before"
                          : vehicleList?.deliveryStatus
                              ?.toLowerCase()
                              .includes("delay") // For "Delay"
                          ? "bg-red-500" // Red for "Delay"
                          : "bg-gray-500" // Default gray if no condition matches
                      }`}
                    >
                      {vehicleList?.deliveryStatus
                        ? vehicleList?.deliveryStatus
                        : "N/A"}
                    </span>
                  </Typography>
                </div>

                {/* Expected Delivery Date */}
                <div className="mb-1 mt-1">
                  <div className="flex items-center">
                    <CalendarToday className="text-orange-600 mr-1 text-xl" />{" "}
                    {/* Increased Icon Size */}
                    <Typography
                      variant="body2"
                      className="font-sans text-gray-800 text-xs" // Reduced font size
                    >
                      <strong className="font-roboto text-orange-600 text-xs font-serif font-bold">
                        Expected Delivery Date:
                      </strong>{" "}
                      <span className="font-open-sans text-gray-700 text-xs font-normal">
                        {vehicleList?.expectedDeliveryDate
                          ? moment(vehicleList.expectedDeliveryDate).format(
                              "MMMM Do YYYY"
                            )
                          : "N/A"}
                      </span>
                    </Typography>
                  </div>
                </div>
                <div className="mb-1 mt-1">
                  <div className="flex items-center">
                    <CalendarToday className="text-cyan-600 mr-1 text-xl" />{" "}
                    {/* Increased Icon Size */}
                    <Typography
                      variant="body2"
                      className="font-sans text-gray-800 text-xs" // Reduced font size
                    >
                      <strong className="font-roboto text-cyan-600 text-xs font-serif font-bold">
                        Shipment Date:
                      </strong>{" "}
                      <span className="font-open-sans text-gray-700 text-xs font-normal">
                        {vehicleList?.outTime
                          ? convertToIST(vehicleList.outTime)
                          : "N/A"}
                      </span>
                    </Typography>
                  </div>
                </div>

                {/* Vehicle Speed */}
                <div className="mb-1">
                  <div className="flex items-center">
                    <Speed className="text-blue-600 mr-1 text-xl" />{" "}
                    {/* Increased Icon Size */}
                    <Typography
                      variant="body2"
                      className="font-sans text-gray-800 text-xs" // Reduced font size
                    >
                      <strong className="font-roboto text-blue-600 text-xs font-serif font-bold">
                        Vehicle Speed:
                      </strong>{" "}
                      <span className="font-open-sans text-gray-700 text-xs font-normal">
                        {currentData?.speed
                          ? `${parseFloat(currentData.speed).toFixed(2)} KM/H`
                          : vehicleList?.distanceTravel &&
                            vehicleList?.hoursPassed
                          ? `${(
                              parseFloat(vehicleList.distanceTravel) /
                              parseFloat(vehicleList.hoursPassed)
                            ).toFixed(2)} KM/H`
                          : "N/A"}
                      </span>
                    </Typography>
                  </div>
                </div>

                {/* Expected Vehicle Speed */}
                <div className="mb-1">
                  <div className="flex items-center">
                    <Speed className="text-orange-500 mr-1 text-xl" />{" "}
                    {/* Increased Icon Size */}
                    <Typography
                      variant="body2"
                      className="font-sans text-gray-800 text-xs" // Reduced font size
                    >
                      <strong className="font-roboto text-orange-500 text-xs font-serif font-bold">
                        Expected Vehicle Speed:
                      </strong>{" "}
                      <span className="font-open-sans text-gray-700 text-xs font-normal">
                        14.58 KM/H
                      </span>
                    </Typography>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="mb-1">
                  <div className="flex items-center">
                    <AccessTime className="text-green-600 mr-1 text-xl" />{" "}
                    {/* Increased Icon Size */}
                    <Typography
                      variant="body2"
                      className="font-sans text-gray-800 text-xs" // Reduced font size
                    >
                      <strong className="font-roboto text-green-600 text-xs font-serif font-bold">
                        Last Updated:
                      </strong>{" "}
                      <span className="font-open-sans text-gray-700 text-xs font-normal">
                        {currentData?.time_recorded
                          ? moment(currentData.time_recorded).fromNow()
                          : "N/A"}
                      </span>
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* halt details------------- */}
          <Box sx={{ mt: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#066c74",
                  fontSize: "15px",
                  fontFamily: "serif",
                }}
              >
                Total Halt:{" "}
                <span className=" text-red-400 font-bold ">{halt.length}</span>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#066c74",
                  fontSize: "15px",
                  fontFamily: "serif",
                }}
              >
                Total Hours:
                <span className=" text-red-400 font-bold  ">
                  (
                  {halt
                    ?.reduce(
                      (acc, curr) => acc + parseFloat(curr.total_hours || 0),
                      0
                    )
                    .toFixed(1)
                    .replace(/^0+/, "")}
                  )
                </span>
              </Typography>

              {/* Button to toggle halts visibility */}
              <Button
                onClick={handleToggleHalts}
                sx={{
                  textTransform: "none",
                  color: "#1976d2",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                {showAllHalts ? "Hide All Halts" : "See All Halts"}
              </Button>
            </Box>

            {/* Collapsible halt list */}
            <Collapse in={showAllHalts}>
              {halt.map((haltItem, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 2,
                    p: 2,
                    // border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f1f1f1", // Light green background
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    transition: "all 0.3s ease-in-out",
                    height: "auto", // Make height smaller
                    textTransform: "capitalize",
                  }}
                >
                  {/* Place Name */}
                  <Box
                    sx={{
                      textAlign: "start",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  >
                    <LocationOnIcon
                      sx={{ color: "#ff9800", mr: 1, fontSize: "20px" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                        fontWeight: "800",
                        fontFamily: "serif",
                      }}
                    >
                      {haltItem.place_name}
                    </Typography>
                  </Box>

                  {/* Start Time */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#1976d2",
                    }}
                  >
                    <AccessTimeIcon sx={{ mr: 1, fontSize: "20px" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                        fontWeight: "800",
                        fontFamily: "serif",
                      }}
                    >
                      Start Date & Time: {convertToIST(haltItem.start_time)}
                    </Typography>
                  </Box>

                  {/* Leaving Time */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#d32f2f",
                    }}
                  >
                    <ExitToAppIcon sx={{ mr: 1, fontSize: "20px" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                        fontWeight: "800",
                        fontFamily: "serif",
                      }}
                    >
                      End Date & Time: {convertToIST(haltItem.leaving_time)}
                    </Typography>
                  </Box>

                  {/* Total Hours */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#388e3c",
                    }}
                  >
                    <AvTimerIcon sx={{ mr: 1, fontSize: "20px" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                        fontWeight: "800",
                        fontFamily: "serif",
                      }}
                    >
                      Halt : {`${formatTotalHours(haltItem.total_hours)} Hours`}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Collapse>
          </Box>
          {/* when delivered status is DELIVERED */}
          {vehicleList.status === "DELIVERED" && (
            <>
              <Card
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Status */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CheckCircle sx={{ color: "green", mr: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "green",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "0.75rem",
                    }}
                  >
                    {vehicleList.status}
                  </Typography>
                </Box>

                {/* Delivery Time */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccessTime sx={{ color: "#1976d2", mr: 1 }} />
                  <Typography variant="body2" sx={{ color: "#1976d2" }}>
                    Delivery Time: {convertToIST(vehicleList.deliveryTime)}
                  </Typography>
                </Box>

                {/* Expected Delivery Date */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Event sx={{ color: "#f57c00", mr: 1 }} />
                  <Typography variant="body2" sx={{ color: "#f57c00" }}>
                    Expected Delivery:{" "}
                    {formatDate(vehicleList.expectedDeliveryDate)}
                  </Typography>
                </Box>
                {/* shipment date */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    fontWeight: "bold",
                  }}
                >
                  <AccessTime sx={{ color: "#11b9b1", mr: 1 }} />
                  <Typography variant="body2" sx={{ color: "#14aab4" }}>
                    Shipment Date & Time:{" "}
                    {vehicleList?.outTime
                      ? convertToIST(vehicleList.outTime)
                      : "N/A"}
                  </Typography>
                </Box>

                {/* Delivery Status (On Time/Delayed/Ahead) */}
                <Box
                  sx={{
                    mt: 1,
                    px: 2,
                    py: 0.5,
                    borderRadius: "16px",
                    backgroundColor:
                      deliveryStatus.color === "green"
                        ? "#d4edda"
                        : deliveryStatus.color === "red"
                        ? "#f8d7da"
                        : "#d1ecf1",
                    color: deliveryStatus.color,
                    display: "inline-block",
                    fontWeight: "bold",
                  }}
                >
                  {deliveryStatus.text}
                </Box>
              </Card>
              {/* Total Halt Section */}
            </>
          )}

          {/* vehicle no and branch */}
          <div className="flex justify-between ">
            {/* Vehicle No Box */}
            <div className="bg-teal-100 py-1 px-2 rounded-lg shadow-md flex-1 relative">
              <DirectionsCar className="text-teal-800 text-2xl absolute top-2 left-2" />{" "}
              {/* Icon placed top-left */}
              <div className="text-center ">
                {" "}
                {/* Adjusted margin to ensure space for icon */}
                <h3 className="text-sm  text-teal-800  font-serif font-bold">
                  Vehicle No
                </h3>
                <p className="text-gray-800 text-sm font-medium font-sans">
                  {vehicleList?.vehicleNo ? vehicleList.vehicleNo : "N/A"}
                </p>
              </div>
            </div>

            {/* Branch Box */}
            <div className="bg-red-200 py-1 px-2 rounded-lg shadow-md flex-1 mx-1 relative">
              <img
                src={gautamSolar} // Image as icon
                alt="Branch Icon"
                className="w-5 h-5 absolute top-2 left-0 object-contain filter brightness-110" // Adjusted brightness to enhance visibility
              />
              <div className="text-center">
                <h3 className="text-sm font-bold text-black font-serif">
                  Branch
                </h3>{" "}
                {/* Changed text color to white for contrast */}
                <p className="text-white text-sm font-medium font-sans">
                  {vehicleList?.workLocationName
                    ? `Gautam Solar ${vehicleList.workLocationName}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
          {/* Box for total distance, remaining distance */}
          {vehicleList.status === "OUT" && (
            <div className="mt-2 flex justify-between items-center">
              {/* Total Distance */}
              <div className="bg-blue-100 p-2 rounded-lg shadow-md flex-1 mx-1 relative">
                <Directions className="text-blue-800 text-2xl absolute top-2 left-1" />{" "}
                {/* Directions icon for total distance */}
                <div className="text-center">
                  {" "}
                  {/* Adjusted margin to ensure space for icon */}
                  <h3 className="text-xs font-semibold font-serif text-blue-800">
                    Total Distance
                  </h3>
                  <p className="text-gray-700 text-sm font-bold font-sans">
                    {vehicleList?.roadDistance
                      ? vehicleList.roadDistance
                      : "N/A"}{" "}
                    km
                  </p>
                </div>
              </div>

              {/* Remaining Distance */}
              <div className="bg-yellow-100 p-2 rounded-lg shadow-md flex-1 mx-1 relative">
                <NearMe className="text-yellow-800 text-xl absolute top-2 left-1" />{" "}
                {/* NearMe icon for remaining distance */}
                <div className="text-center ">
                  {" "}
                  {/* Adjusted margin to ensure space for icon */}
                  <h3 className="text-xs font-semibold font-serif text-yellow-800">
                    Remaining Distance
                  </h3>
                  <p className="text-gray-700 text-sm font-bold font-sans">
                    {currentData?.distance_remained
                      ? parseFloat(currentData.distance_remained).toFixed(2)
                      : "N/A"}{" "}
                    km
                  </p>
                </div>
              </div>
            </div>
          )}
          {vehicleList.status === "OUT" && (
            <div
              className={`py-2 px-1 rounded-lg shadow-md flex-1 
            bg-red-500 text-white`}
            >
              <h3 className="text-center text-xs font-semibold font-serif">
                Diversion Distance
              </h3>
              <p className="text-center text-xl font-bold font-sans ">
                {currentData?.diversion_distance
                  ? parseFloat(currentData.diversion_distance).toFixed(2)
                  : "N/A"}
                {"KM "}
              </p>
            </div>
          )}

          {/* distance travelled and expected distance travelled */}
          {vehicleList.status === "OUT" && (
            <div className="mt-2 ">
              {/* Container for the boxes with flex display and wrapping */}
              <div className="flex flex-wrap justify-between gap-2">
                {/* Distance Travelled */}
                <div className="bg-blue-50 p-2 rounded-lg shadow-md flex-1 ">
                  <h3 className="text-center text-xs  font-serif text-teal-800">
                    Distance Travelled
                  </h3>
                  <p className="text-center text-sky-800 text-xs font-sans font-bold">
                    {vehicleList?.distanceTravel
                      ? parseFloat(vehicleList.distanceTravel).toFixed(2)
                      : "N/A"}{" "}
                    km
                    <p className="text-xs text-red-500">
                      (
                      {`${
                        vehicleList?.hoursPassed ? vehicleList.hoursPassed : ""
                      } Hours Passed`}
                      )
                    </p>
                  </p>
                </div>
                <div className="bg-orange-50 p-2 rounded-lg shadow-md flex-1 ">
                  <h3 className="text-center text-xs font-serif text-orange-700">
                    Expected Distance Covered
                  </h3>
                  <p className="text-center text-green-800 text-xs font-bold">
                    {vehicleList?.expectedDistanceCovered !== undefined
                      ? parseFloat(vehicleList.expectedDistanceCovered).toFixed(
                          2
                        )
                      : "N/A"}{" "}
                    km
                  </p>
                </div>

                {/* Diversion Distance */}
                {/* <div
                  className={`py-2 px-1 rounded-lg shadow-md flex-1 
                   bg-red-500 text-white`}
                >
                  <h3 className="text-center text-xs font-semibold font-serif">
                    Diversion Distance
                  </h3>
                  <p className="text-center text-xs ">
                    {currentData?.diversion_distance
                      ? parseFloat(currentData.diversion_distance).toFixed(2)
                      : "N/A"}
                    {"KM "}
                  </p>
                </div> */}
              </div>
            </div>
          )}

          <div className="mt-2">
            {/* Shipment Address */}
            <div className="py-2 px-3 rounded-lg bg-yellow-400 hover:bg-yellow-600 transition duration-200 flex items-center">
              <LocationOn className="text-yellow-900 text-xl mr-2" />{" "}
              {/* Icon with right margin */}
              <div className="text-left">
                {" "}
                {/* Text aligned left */}
                <Typography
                  variant="body2"
                  className="text-gray-800 text-xs font-medium"
                >
                  <strong className="text-black font-bold font-serif">
                    Shipment Address:
                  </strong>{" "}
                  <span className="text-gray-700">
                    {vehicleList?.Address || "N/A"}
                  </span>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === "consignment") {
      return (
        <div className="w-full overflow-hidden">
          <Card className="bg-white rounded-lg shadow-md ">
            <CardContent className="p-2">
              {/* Party Name */}
              <div className="mb-2 p-3 rounded-lg bg-blue-100 hover:bg-blue-50 transition duration-200 font-serif">
                <div className="flex items-start">
                  <Person className="text-indigo-600 mr-2 mt-1" /> {/* Icon */}
                  <Typography
                    variant="body2"
                    className="text-gray-800 text-sm font-medium flex flex-col gap-1 items-start"
                  >
                    <strong className="text-indigo-600 font-serif">
                      Party Name
                    </strong>{" "}
                    <span className="text-gray-700">
                      {vehicleList?.PartyName || "N/A"}
                    </span>
                  </Typography>
                </div>
              </div>

              {/* Transporter Name */}
              <div className="mb-2 p-3 rounded-lg bg-orange-100 hover:bg-orange-50 transition duration-200 font-serif">
                <div className="flex items-start">
                  <LocalShipping className="text-orange-600 mr-2 mt-1" />{" "}
                  {/* Icon */}
                  <Typography
                    variant="body2"
                    className="text-gray-800 text-sm font-medium flex flex-col gap-1 items-start"
                  >
                    <strong className="text-orange-600 font-serif">
                      Transporter Name
                    </strong>{" "}
                    <span className="text-gray-700">
                      {vehicleList?.TransporterName || "N/A"}
                    </span>
                  </Typography>
                </div>
              </div>

              {/* Vehicle Type and Driver Number */}
              <div className="flex justify-between items-center gap-2 w-full h-full">
                {/* Vehicle Type */}
                <div className="flex-1 p-3 rounded-lg bg-purple-100 hover:bg-purple-50 transition duration-200 h-full font-serif">
                  <div className="flex items-start">
                    <CarRepair className="text-purple-600 mr-2 mt-1" />{" "}
                    {/* Icon */}
                    <Typography
                      variant="body2"
                      className="text-gray-800 text-xs font-medium flex flex-col gap-1 items-start"
                    >
                      <strong className="text-purple-600 font-serif">
                        Vehicle Type
                      </strong>{" "}
                      <span className="text-gray-700 text-xs">
                        {vehicleList?.vehicleTypeName || "N/A"}
                      </span>
                    </Typography>
                  </div>
                </div>

                {/* Driver Number */}
                <div className="flex-1 p-3 rounded-lg bg-blue-100 hover:bg-blue-50 transition duration-200 h-full font-serif">
                  <div className="flex items-start">
                    <Phone className="text-blue-600 mr-2 mt-1" /> {/* Icon */}
                    <Typography
                      variant="body2"
                      className="text-gray-800 text-xs font-medium flex flex-col gap-1 items-start"
                    >
                      <strong className="text-blue-600 font-serif">
                        Driver Number
                      </strong>{" "}
                      <span className="text-gray-700 text-xs">
                        {vehicleList?.driverNumber || "N/A"}
                      </span>
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Shipment Date */}
              <div className="flex-1 p-3 mt-2 rounded-lg bg-green-100 hover:bg-green-50 transition duration-200 h-full font-serif">
                <div className="flex items-start">
                  <DateRange className="text-green-600 mr-2 mt-1" />{" "}
                  {/* Icon */}
                  <Typography
                    variant="body2"
                    className="text-gray-800 text-xs font-medium flex flex-col gap-1 items-start"
                  >
                    <strong className="text-green-600 font-serif">
                      Shipment Date
                    </strong>{" "}
                    <span className="text-gray-700 text-xs">
                      {vehicleList?.outTime
                        ? convertToIST(vehicleList.outTime)
                        : "N/A"}
                    </span>
                  </Typography>
                </div>
              </div>

              {/* Shipment Address */}
              <div className="mt-2 py-2 px-3 rounded-lg bg-yellow-100 hover:bg-yellow-50 transition duration-200 font-serif">
                <div className="flex items-start">
                  <LocationOn className="text-yellow-600 mr-2 mt-1" />{" "}
                  {/* Icon */}
                  <Typography
                    variant="body2"
                    className="text-gray-800 text-xs font-medium flex flex-col gap-1 items-start"
                  >
                    <strong className="text-yellow-600 font-serif">
                      Shipment Address:
                    </strong>{" "}
                    <span className="text-gray-700">
                      {vehicleList?.Address || "N/A"}
                    </span>
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <main>
      <div className="flex justify-between items-center w-full">
        {/* Button to toggle between details and consignment */}
        <Button
          onClick={() => handleTabChange("details")}
          style={{
            flex: 1, // Ensures the button takes up half the width
            backgroundColor: activeTab === "details" ? "#4CAF50" : "#E8F5E9", // Green for active, light green for inactive
            color: activeTab === "details" ? "#FFFFFF" : "#388E3C", // White text for active, dark green for inactive

            transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition for background and text color
          }}
        >
          Details
        </Button>

        <Button
          onClick={() => handleTabChange("consignment")}
          style={{
            flex: 1, // Ensures the button takes up half the width
            backgroundColor:
              activeTab === "consignment" ? "#FF9800" : "#FFF3E0", // Orange for active, light orange for inactive
            color: activeTab === "consignment" ? "#FFFFFF" : "#F57C00", // White text for active, dark orange for inactive

            transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition for background and text color
          }}
        >
          Consignment
        </Button>
      </div>

      {/* Render content based on active tab */}
      <section>{renderContent()}</section>
    </main>
  );
}

export default MapSidebar;

// distanceTravel
// location
// time_recorded
// speed
