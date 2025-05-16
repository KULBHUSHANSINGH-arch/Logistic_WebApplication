import React from 'react'
import { FaMapMarkerAlt, FaTruck, FaFlagCheckered } from "react-icons/fa";

function MapProgressiveLine({ s, e, currentData, vehicleList }) {
    const distanceTravel = parseFloat(currentData?.distanceTravel);
    const roadDistance = parseFloat(vehicleList?.roadDistance);
  
    const traveledWidth = distanceTravel ? (distanceTravel / roadDistance) * 100 : 0;
    const remainingWidth = 100 - traveledWidth;
  
    return (
        <div className="custom-progress-line mt-1 border-2 border-red-600">
          <div className="flex items-center justify-between">
            
            {/* Origin point */}
            <div className="relative origin-parent">
              <div className="icon-container">
                <FaMapMarkerAlt className="icon" />
              </div>
              {/* Custom box for origin on hover */}
              <div className="origin-hover-box">
                Start Location
                <p>Static data for origin...</p>
              </div>
            </div>
    
            {/* Line */}
            <div className="flex-1 h-2 relative line-container">
              {/* Line from origin to current location */}
              <div className="line traveled" style={{ width: `${traveledWidth}%` }}></div>
              {/* Line from current location to destination */}
              <div className="line remaining" style={{ width: `${remainingWidth}%` }}></div>
    
              {/* Point on the line for distance traveled */}
              <div className="progress-point" style={{ left: `${traveledWidth}%` }}>
                <div className="point-icon">
                  <FaTruck className="icon" />
                </div>
                <div className="current-hover-box">
                  Current Location
                  <p>Lorem ipsum dolor sit amet consectetur...</p>
                </div>
              </div>
            </div>
    
            {/* Destination point */}
            {roadDistance && (
              <div className="relative destination-parent">
                <div className="icon-container">
                  <FaFlagCheckered className="icon" />
                </div>
                {/* Custom box for destination on hover */}
                <div className="destination-hover-box">
                  Destination
                  <p>Lorem ipsum dolor sit amet consectetur...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
}

export default MapProgressiveLine
