import React, { useState, useEffect } from "react";
import DisplayVehicleList from "./DisplayVehicleList";
import StatusRadioGroup from "./StatusVehicle";
import { ClipLoader } from "react-spinners";
import "../../styles/vehicle/vehicle.css";
import { dev } from "../../utils/ApiUrl";
import { useSelector } from "react-redux";
import { transformVehicleDataToRows } from "../../utils/row";
import { createColumns } from "../../utils/column";
import { Button } from "@mui/material";
import ExportIcon from "@mui/icons-material/UploadFile";
import { exportToExcel } from "../../utils/excel";
import { toast } from "react-toastify";
import DateFilterPopup from "./DateFilterPopup";
import "../../styles/vehicle/vehicle.css";

function VehicleList() {
  const { user } = useSelector((state) => state.user);

  // State hooks
  const [vehicleList, setVehicleList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(
    user?.designation === "Sales Executive" ? "out" : "all"
  ); // Set initial status based on user designation
  const [searchValue, setSearchValue] = useState("");
  const [preventApiCall, setPreventApiCall] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(user?.designation === 'Super Admin' ? 'ALL' : user?.workLocation);
  const [isDateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({});
  const [vehicleCount, setVehicleCount] = useState(null)

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

  // Handle Excel file download
  const handleExcelFile = (workLocation) => {
    try {
      const transformedRows = transformVehicleDataToRows(vehicleList);
      const columnsConfig = createColumns({
        userDesignation: user.designation,
        vehicleStatus: status,
      });

      // Filter out "actions" column
      const filteredColumnsConfig = columnsConfig.filter(
        (col) => col.field !== "actions"
      );

      const currentStatus = dateRange?.status || status; // Use dateRange status if available

      // Export to Excel
      exportToExcel(
        transformedRows,
        filteredColumnsConfig,
        currentStatus,
        workLocation[0].workLocationName,
        dateRange
      )
        .then(() => {
          toast.success("Excel file generated and downloaded successfully!");
        })
        .catch((error) => {
          console.error("Error exporting Excel file:", error);
          toast.error("Failed to export Excel file. Please try again.");
        });
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  // Search function to filter vehicle list
  const searchInData = (data, inputValue) => {
    const normalizedInputValue = inputValue.trim().toLowerCase().replace(/\s+/g, "");
    if (!normalizedInputValue) return [...data]; // Return all data if input is empty

    return [...data].filter((item) => {
      return Object.keys(item).some((key) => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        const normalizedValue = value.toString().replace(/\s+/g, "").trim().toLowerCase();
        return normalizedValue.includes(normalizedInputValue);
      });
    });
  };

  // Search input handler
  const handleSearchInput = (value) => {
    setSearchValue(value);
    if (vehicleList.length > 0) {
      const data = value ? searchInData(vehicleList, value) : vehicleList;
      setFilteredData(data);
    }
  };

  // call after dashborad load----
  const callForUpdate = async () => {
    try {
      const response = await fetch(`${dev}/vehicleIN/getvehicleListStatus`, {
        method: "POST",
        body: JSON.stringify({
          status: 'OUT',
          workLocation: "ALL",
          // mapId: id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      // console.log("data for delivery", result);
      if (!response.ok) {

        return;
      }

    } catch (error) {
      console.log('call for update failed', error)
    }

  }

  // Fetch vehicle data by status
  const getDataByStatus = async () => {

    try {
      setLoading(true);
      setError(null);
      // console.log('personidddddddddd', user.personId);
      const response = await fetch(`${dev}/vehicleIN/getvehicleListByStatus`, {
        method: "POST",
        body: JSON.stringify({
          status: status.toUpperCase(),
          workLocation: selectedLocationId || user.workLocation,
          personId: user.personId
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
        toast.error(result.message);
        return;
      }
      // console.log('result.data',result.data)

      setVehicleList(result.data);
      setFilteredData(searchValue ? searchInData(result.data, searchValue) : result.data);
      // calling for status update---
      callForUpdate()
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // /countVehicle data 
  const countVehicleData = async (s) => {
    try {
      // setLoading(true);
      // setError(null);
      // console.log('personidddddddddd', user.personId);
      const response = await fetch(`${dev}/vehicleIN/countVehicle`, {
        method: "GET",
        // body: JSON.stringify({
        //   status: status.toUpperCase(),
        //   workLocation: selectedLocationId || user.workLocation,
        //   personId: user.personId
        // }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        // setError(result.message);
        // toast.error(result.message);
        return;
      }
      // console.log('result.data',result.data)
      // console.log('result.data', result)
      setVehicleCount(result)
    } catch (error) {
      console.log('count data error', error)
      // setError(error.message);
      // toast.error(`Error: ${error.message}`);
    } finally {
      // setLoading(false);
    }
  };
  // console.log('vehicle count data', vehicleCount)

  // Fetch data when location ID or status changes
  useEffect(() => {
    if ((selectedLocationId || status) && !preventApiCall) {
      countVehicleData()
      getDataByStatus();
    } else {
      setPreventApiCall(false);
    }
  }, [selectedLocationId, status]);

  // Change status without API call
  const changeStatusWithoutApiCall = (newStatus) => {
    setPreventApiCall(true);
    setStatus(newStatus);
  };

  return (
    <main className="vehicle-list-container">
      <div id="status-radio-group">
        <StatusRadioGroup
          status={status}
          getStatus={setStatus}
          handleSearchInput={handleSearchInput}
          searchValue={searchValue}
          setSelectedLocationId={setSelectedLocationId}
          selectedLocationId={selectedLocationId}
          handleExcelFile={handleExcelFile}
          setDateFilterOpen={setDateFilterOpen}
          vehicleData={filteredData}
          setDateRange={setDateRange}
          dateRange={dateRange}
          setPreventApiCall={setPreventApiCall}
        />
      </div>

      {/* delayVehicles,inFactoryVehicles,transitVehicles */}
      {/* <div className="relative h-[50px] bg-white text-black flex items-center justify-center overflow-hidden w-full border border-gray-300">
        <h1 className="text-sm font-bold  font-sans tracking-wider  uppercase whitespace-nowrap marquee flex space-x-4 justify-end   w-3/4">
          {vehicleCount ? (
            <>
              <span className="text-red-500 font-bold">
                ({vehicleCount.delayVehicles || 'N/A'})
              </span>
              <span className="text-black"> Vehicles Running Delay</span>

              <span className="text-red-500 font-bold">
                ({vehicleCount.inFactoryVehicles || 'N/A'})
              </span>
              <span className="text-black">Vehicles Are Stand In Factory</span>

              <span className="text-red-500 font-bold">
                ({vehicleCount.transitVehicles || 'N/A'})
              </span>
              <span className="text-black">Vehicles Are In Transit</span>
            </>
          ) : (
            <span className="text-gray-500">Loading...</span>
          )}
        </h1>
      </div> */}
      {
        user?.designation === "Super Admin" && (
          <marquee
            className="text-sm py-2 font-bold font-sans tracking-wider uppercase whitespace-nowrap text-black"
            behavior="scroll"
            direction="left"
            scrollamount="5"
          >
            {vehicleCount ? (
              < >
                <span className=" flex gap-2 justify-start items-center">
                  <span className="mx-4 flex items-center">
                    <span className="text-red-500 text-xl font-bold">
                      {vehicleCount.delayVehicles || 'N/A'}
                    </span>
                    <span className="text-black ml-2">Vehicles Running Delay</span>
                  </span>

                  <span className="mx-4 flex items-center">
                    <span className="text-red-500 text-xl font-bold">
                      {vehicleCount.inFactoryVehicles || 'N/A'}
                    </span>
                    <span className="text-black ml-2">Vehicles Are Stand In Factory</span>
                  </span>

                  <span className="mx-4 flex items-center">
                    <span className="text-red-500 text-xl font-bold">
                      {vehicleCount.transitVehicles || 'N/A'}
                    </span>
                    <span className="text-black ml-2">Vehicles Are In Transit</span>
                  </span>
                </span>
              </>
            ) : (
              <span className="text-gray-500">Loading...</span>
            )}
          </marquee>

        )
      }












      {loading && (
        <div className="w-full flex justify-center items-center">
          <ClipLoader color="#e04816" loading={loading} size={50} />
        </div>
      )}

      {isDateFilterOpen && (
        <DateFilterPopup
          changeStatusWithoutApiCall={changeStatusWithoutApiCall}
          selectedLocationId={selectedLocationId}
          setStatus={setStatus}
          setDateRange={setDateRange}
          setFilteredData={setFilteredData}
          setVehicleList={setVehicleList}
          handleClose={() => setDateFilterOpen(false)}
        />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {vehicleList.length === 0 && !loading && !error && (
        <h1 className="text-center text-red-500 font-serif font-bold text-2xl capitalize p-9 w-full block bg-slate-200 rounded-md">
          Data not found
        </h1>
      )}

      {!loading && !error && vehicleList.length > 0 && (
        <DisplayVehicleList
          vehicleData={filteredData}
          status={status}
          updateStatus={setStatus}
          getDataByStatus={getDataByStatus}
        />
      )}
    </main>
  );
}

export default VehicleList;
