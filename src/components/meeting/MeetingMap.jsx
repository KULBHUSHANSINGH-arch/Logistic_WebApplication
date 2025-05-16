import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Dialog, DialogContent, Typography, Button } from "@mui/material";
import startPoint from '../../assets/logo/start-point.png'
import endPoint from '../../assets/logo/end-point2.png'

// Fix marker icons for react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetina, // Correct Retina Icon
    iconUrl: markerIcon, // Default Marker Icon
    shadowUrl: markerShadow, // Marker Shadow
});

// Custom icon definition
const startMarkerIcon = L.icon({
    iconUrl: startPoint, // Replace with the path to your custom icon
    iconSize: [38, 38], // Adjust size as needed
    iconAnchor: [22, 36], // Point of the icon which corresponds to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
    className: "custom-start-marker" // Optional: Add custom class for further styling
});
const endMarkerIcon = L.icon({
    iconUrl: endPoint, // Replace with the path to your custom icon
    iconSize: [42, 42], // Adjust size as needed
    iconAnchor: [16, 32], // Point of the icon which corresponds to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
    className: "custom-start-marker" // Optional: Add custom class for further styling
});




const MeetingMap = ({ open, onClose, mapData }) => {
    if (!mapData) return null; // If no map data, do not render the map.

    const {
        endLatitude,
        endLongitude,
        latitude: startLatitude,
        longitude: startLongitude,
        companyName,
        createdBy,
        fromDate: meetingStartDateTime,
        toDate: meetingCompletedDateTime,
        notes,
        meetingPerson,
        meetingUrl,
        type
    } = mapData;
    // console.log('type', type);

    // Check if start and end coordinates are available
    const hasStart = startLatitude && startLongitude;
    // console.log('has start and end coordinates', hasStart)
    const hasEnd = endLatitude && endLongitude;

    // Prepare positions for markers and polyline
    const startPosition = hasStart ? [startLatitude, startLongitude] : null;
    // console.log('start position', startPosition)
    const endPosition = hasEnd ? [endLatitude, endLongitude] : null;
    const polylinePositions = hasStart && hasEnd ? [startPosition, endPosition] : null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogContent>
                <div className="relative">
                    {/* Map Header */}
                    <div className="flex justify-between items-center py-2 px-4 bg-gray-100 shadow-md rounded-t-lg">
                        <h2 className="text-lg font-semibold text-gray-700">
                           {type === "Meeting" ? 'Meeting Location' : 'Travelling Location'} </h2>
                        <Button
                            onClick={onClose}
                            color="warning" // You can change this to any color, like "error" or "primary" if needed
                            variant="outlined" // Optionally, add "outlined" for a border style
                        >
                            Close {/* Text instead of the icon */}
                        </Button>

                    </div>

                    {/* Map Container */}
                    <MapContainer
                        center={startPosition || endPosition || [0, 0]} // Center on available marker
                        zoom={7}
                        style={{ height: "500px", width: "100%" }} // Increased height for larger map
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/* Start Marker */}
                        {hasStart && (
                            <Marker position={startPosition} icon={startMarkerIcon}>
                                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                    <div className="bg-white p-2 rounded-lg shadow-lg  min-w-72 text-wrap">
                                        {/* Centered Circular Image */}
                                        <div className="flex justify-center mb-3">
                                            {meetingUrl ? (
                                                <img
                                                    src={meetingUrl}
                                                    alt="Meeting Person"
                                                    className="w-24 h-24 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-white text-lg">N/A</span> {/* Fallback when no image */}
                                                </div>
                                            )}
                                        </div>

                                        {/* Meeting Person Name */}
                                        {type === "Meeting" && (
                                            <p className="text-indigo-500 font-bold font-sans text-center mb-3">
                                                <strong className=" text-black">Meeting With:</strong> {meetingPerson}
                                            </p>
                                        )}

                                        <p className="text-indigo-900 font-bold font-sans text-center mb-3">

                                            <strong >{type === "Travelling" ? 'Travelling Start Location' : 'Meeting Start Location'}</strong>
                                        </p>


                                        {/* Other Information */}
                                        <div className="space-y-2">
                                            {
                                                type === "Meeting" && (
                                                    <p className="text-blue-500 font-bold font-sans">
                                                        <strong className=" text-black">

                                                            Company:</strong> {companyName}
                                                    </p>
                                                )
                                            }

                                            <p className="text-purple-500 font-bold font-sans">
                                                <strong className=" text-black">
                                                    {type === "Travelling" ? 'Travelling Started On : ' : 'Meeting Started On : '}

                                                </strong> {meetingStartDateTime}
                                            </p>
                                            <p className="text-pink-500 font-bold font-sans">
                                                <strong className=" text-black">
                                                    {type === "Travelling" ? 'Travelling Completed On : ' : 'Meeting Completed On : '}

                                                </strong> {meetingCompletedDateTime}
                                            </p>
                                            <p className="text-yellow-800 font-bold font-sans">
                                                <strong className=" text-black">Notes:</strong> {notes}
                                            </p>
                                            <p className="text-teal-500 font-bold font-sans">
                                                <strong className=" text-black">Sales Person:</strong> {createdBy}
                                            </p>
                                        </div>
                                    </div>


                                </Tooltip>
                            </Marker>
                        )}

                        {/* End Marker */}
                        {hasEnd && (
                            <Marker position={endPosition} icon={endMarkerIcon}>
                                <Tooltip direction="bottom" offset={[0, -10]} opacity={1} >
                                    <div className="bg-white p-4 rounded-lg shadow-lg min-w-72 text-wrap">
                                        {/* Centered Circular Image */}
                                        <div className="flex justify-center mb-3">
                                            {meetingUrl ? (
                                                <img
                                                    src={meetingUrl}
                                                    alt="Meeting Person"
                                                    className="w-24 h-24 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-white text-lg">N/A</span> {/* Fallback when no image */}
                                                </div>
                                            )}
                                        </div>

                                        {/* Meeting Person Name */}
                                        {/* Meeting Person Name */}
                                        {type === "Meeting" && (
                                            <p className="text-indigo-500 font-bold font-sans text-center mb-3">
                                                <strong className=" text-black">Meeting With:</strong> {meetingPerson}
                                            </p>
                                        )}
                                        <p className="text-indigo-900 font-bold font-sans text-center mb-3">

                                            <strong >{type === "Travelling" ? 'Travelling Completed Location' : 'Meeting End Location'}</strong>
                                        </p>

                                        {/* Other Information */}
                                        <div className="space-y-2">
                                            {
                                                type === "Meeting" && (
                                                    <p className="text-blue-500 font-bold font-sans">
                                                        <strong className=" text-black">

                                                            Company:</strong> {companyName}
                                                    </p>
                                                )
                                            }
                                            <p className="text-purple-500 font-bold font-sans">
                                                <strong className=" text-black">
                                                    {type === "Travelling" ? 'Travelling Started  On : ' : 'Meeting Started On  : '}

                                                </strong> {meetingStartDateTime}
                                            </p>
                                            <p className="text-pink-500 font-bold font-sans">
                                                <strong className=" text-black">
                                                    {type === "Travelling" ? 'Travelling Completed On : ' : 'Meeting Completed On : '}

                                                </strong> {meetingCompletedDateTime}
                                            </p>
                                            <p className="text-yellow-800 font-bold font-sans">
                                                <strong className=" text-black">Notes:</strong> {notes}
                                            </p>
                                            <p className="text-teal-500 font-bold font-sans">
                                                <strong className=" text-black">Sales Person:</strong> {createdBy}
                                            </p>
                                        </div>
                                    </div>


                                </Tooltip>
                            </Marker>
                        )}

                        {/* Polyline */}
                        {polylinePositions && <Polyline positions={polylinePositions} color="red" />}
                    </MapContainer>
                </div>
            </DialogContent>
        </Dialog>


    );
};

export default MeetingMap;
