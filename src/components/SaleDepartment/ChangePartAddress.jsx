
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/vehicle/addVehicle.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
// import logo from "../../assets/logo.png";
// import { Image } from 'react-bootstrap';
import { validateGST } from "../../utils/downloadFile";

function ChangePartAddress() {
  const [formData, setFormData] = useState({
    deliveryId: "",
    PartyName: "",
    Address: "",
    MobileNumber1: "",
    State: "",
    City: "",
    PinCode: "",
    GSTNo: "",
    ShipmentName: "",
    type: "",
    // Latitude: "",
    // Longitude: "",
    CreatedBy: localStorage.getItem("currentUser"),
    currentUser: localStorage.getItem("currentUser"),
  });
  const location = useLocation();
  const { deliveryId } = location.state || {};
  const [statelist, setStateList] = useState([]);
  const [citylist, setCityList] = useState([]);
  const [vehicleError, setvehicleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [PartyNameList, setPartyNameList] = useState([]);
  const navigate = useNavigate();


  const handleDivBillAddress = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // You can clear the error if any after a valid change
    setErrors((prevState) => ({
      ...prevState,
      type: '',
    }));
  };
  const DivBillList = [
    { value: "Billing", label: "Billing" },
    { value: "Delivery", label: "Delivery" },
  ];


  /************ selected party list  */
  const handlePartyList = (e) => {
    const selectedPartyName = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      PartyName: selectedPartyName,
    }));

    // Clear errors if the user selects a valid party name
    setErrors((prevErrors) => ({
      ...prevErrors,
      PartyName: selectedPartyName ? "" : "Please select a party name",
    }));
  };

  /******** --------- get patrty list data */
  useEffect(() => {
    const fetchPartyNamesData = async () => {
      try {

        const currentUser = localStorage.getItem("currentUser");
        // console.log('checking the PesonId', currentUser);
        const resp = await fetch(`${dev}/party/getSalesParty`, {
          // const resp = await fetch(`${dev}/party/getParty`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ personId: currentUser }),
        });
        const result = await resp.json();
        if (!resp.ok) {
          toast.error(result.message || "Party names not found");
          return;
        }

        setPartyNameList(result.data);
      } catch (error) {
        toast.error("Something went wrong in fetching party names");
        // console.log("Fetching party names failed!", error.message);
      }
    };

    fetchPartyNamesData();
  }, []);

  const [errors, setErrors] = useState({
    PartyName: "",
    Address: "",
    MobileNumber1: "",
    State: "",
    City: "",
    PinCode: "",
    ShipmentName: "",
    type: "",
    // GSTNo: "",
    // Latitude: "",
    // Longitude: "",
    CreatedBy: "",
  });

  const notifySuccess = () =>
    toast.success(
      deliveryId
        ? "Delivery Location Update Successfully!"
        : "Delivery Location Added Successfully!",
      { autoClose: 5000 }
    );
  const notifyError = (message) => toast.error(message, { autoClose: 5000 });

  const validate = () => {
    const newErrors = {};
    if (!formData.PartyName) newErrors.PartyName = "Party Name is required";
    if (!formData.Address) newErrors.Address = "Address  is required";
    if (!formData.State) newErrors.State = "State  is required";
    if (!formData.City) newErrors.City = "City  is required";
    if (!formData.type) newErrors.type = "Delivery/Billing  is required";
    if (!formData.PinCode) newErrors.PinCode = "PinCode  is required";
    // if (!formData.GSTNo) newErrors.GSTNo = "GSTNo  is required";
    // if (!formData.ShipmentName)newErrors.ShipmentName = "ShipMent Name  is required";
    if (formData.type === 'Delivery' && !formData.ShipmentName) {
      newErrors.ShipmentName = "Shipment Name is required";
    }


    if (formData.type === 'Billing' && !formData.GSTNo) {
      newErrors.GSTNo = "GST Number is required for Billing";
    }
    // console.log('lllllll', formData.type)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // PinCode validation
    if (name === "PinCode") {
      const PinMethod = /^[0-9]{0,6}$/;
      if (value.length <= 6 && PinMethod.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    // GSTNo validation - disallow any spaces
    else if (name === "GSTNo") {
      if (!value.includes(" ")) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    // For other fields
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error on input change
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };


  const handleStateChange = (e) => {
    const selectedIsoCode = e.target.value;
    const selectedState = statelist.find(
      (state) => state.isoCode === selectedIsoCode
    );

    if (selectedState) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        State: {
          isoCode: selectedState.isoCode,
          name: selectedState.name,
        },
        City: "",
      }));

      /***------- Clear city-related errors, if any-------- */
      setErrors((prevErrors) => ({
        ...prevErrors,
        City: "",
        State: "",
      }));

      fetchCities(selectedState.isoCode);
    }
  };

  const handleChangecity = (e) => {
    const selectedCity = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      City: selectedCity,
    }));

    /****---------- Clear city-related errors, if any  -----***/
    setErrors((prevErrors) => ({
      ...prevErrors,
      City: selectedCity ? "" : "City is required",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("All Data", formData);

    if (!validate()) {
      return;
    }

    if (formData.PinCode && formData.PinCode.length !== 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        PinCode: "Pin Number Must be 6 digits",
      }));
      return;
    }
    // Check if GST is valid and handle errors
    // const gstValidationError = validateGST(formData.GSTNo);
    // if (gstValidationError) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     GSTNo: gstValidationError, // Set error message if GST is invalid
    //   }));
    //   return; // Prevent form submission if GST is invalid
    // }

    const updatedFormData = {
      ...formData,
      State: formData.State?.name || "",
      deliveryId: deliveryId ? deliveryId : "",
    };

    await addDeleivery(updatedFormData);
  };

  const addDeleivery = async (updatedFormData) => {
    try {
      setvehicleError(null);
      setLoading(true);

      const resp = await fetch(`${dev}/party/addDeleivery`, {
        method: "POST",
        body: JSON.stringify(updatedFormData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await resp.json();

      if (resp.ok) {
        setLoading(false);
        notifySuccess();

        navigate("/delivery-address");
      } else {
        toast.error(result.message || "Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Add Delivery Address Failed", error.message);
    }
  };

  /** ------------------ Binding the All Fields -------------------- */
  useEffect(() => {
    // console.log("deliveryId", deliveryId);
    if (deliveryId) {
      axios
        .post(`${dev}/party/addDeleivery`, { deliveryId })
        .then((response) => {
          const partyData = response.data.data;
          /*** for without selecting the states bind */
          const selectedState = statelist.find(
            (state) =>
              state.name.toLowerCase() === partyData.State.toLowerCase()
          );
          // console.log("Deleivery Data:", partyData);
          setFormData({
            PartyName: partyData.PartyName,
            Address: partyData.Address,
            type: partyData.type,
            MobileNumber1: partyData.MobileNumber1,
            State: selectedState
              ? { isoCode: selectedState.isoCode, name: selectedState.name }
              : { isoCode: "", name: "" },
            City: partyData.City,
            PinCode: partyData.PinCode,
            Status: partyData.Status,
            CreatedBy: partyData.currentUser,
            UpdatedBy: partyData.UpdatedBy,
            ShipmentName: partyData?.ShipmentName,
            GSTNo: partyData?.GSTNo
          });

          // Fetch cities for the selected state after it's bound
          if (selectedState?.isoCode) {
            fetchCities(selectedState.isoCode);
          }
        })
        .catch((error) => {
          console.error("Error fetching party data:", error);
        });
    }
  }, [deliveryId, statelist]);

  /*** District List / City List */
  const fetchCities = async (stateIsoCode) => {
    try {
      const response = await fetch(`${dev}/party/getCities/${stateIsoCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isoCode: stateIsoCode }),
      });

      if (!response.ok) {
        // throw new Error("Failed to fetch cities");
        notifyError();
      }

      const data = await response.json();
      setCityList(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  /*** State List  */
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(`${dev}/party/getStates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // throw new Error("Failed to fetch states");
          notifyError();
        }

        const data = await response.json();
        setStateList(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  return (
    <main
      className="min-h-screen p-4 md:p-6 lg:p-4"
      style={{
        background: "linear-gradient(to top, rgb(241, 144, 144) 0%, rgb(137, 126, 221) 100%)"
      }}
    >
      <div className="bg-[#fff] p-4 md:p-3 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
        <div className="mb-4 md:mb-6 flex flex-col items-center">
          <h1 className="text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
            {deliveryId ? "Edit Delivery/Billing" : "Delivery/Billing Address"}
          </h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Party Name */}
            <div className="min-w-[250px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Party Name
              </label>
              <select
                id="PartyName"
                name="PartyName"
                value={formData.PartyName}
                onChange={handlePartyList}
                className={`w-full p-2 border ${errors.State ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              >
                <option value="">Select Party Name</option>
                {PartyNameList.map((type) => (
                  <option key={type.PartyNameId} value={type.PartyNameId}>
                    {type.PartyName}
                  </option>
                ))}
              </select>
              {errors.PartyName && (
                <p className="mt-1 text-xs text-red-600">{errors.PartyName}</p>
              )}
            </div>
            {/* Choose Address  */}
            <div className="min-w-[250px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Delivery/Billing Address
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleDivBillAddress}
                className={`w-full p-2 border ${errors.type ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              >
                <option value="">Choose  Address</option>
                {DivBillList.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Shipment Name */}
            {(formData.type === 'Delivery' && <div className="min-w-[250px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Shipment Name
              </label>
              <input
                type="text"
                value={formData.ShipmentName}
                name="ShipmentName"
                placeholder="Enter Shipment Name"
                onChange={handleChange}
                className={`w-full p-2 border ${errors.ShipmentName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.ShipmentName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.ShipmentName}
                </p>
              )}
            </div>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State */}
            <div className="min-w-[250px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                State
              </label>
              <select
                id="State"
                name="State"
                value={formData.State?.isoCode || ""}
                onChange={handleStateChange}
                className={`w-full p-2 border ${errors.State ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              >
                <option value="">Select State</option>
                {statelist.map((type) => (
                  <option key={type.isoCode} value={type.isoCode}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.State && (
                <p className="mt-1 text-xs text-red-600">{errors.State}</p>
              )}
            </div>

            {/* City */}
            <div className="min-w-[250px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                City
              </label>
              <select
                id="City"
                name="City"
                value={formData.City || ""}
                onChange={handleChangecity}
                className={`w-full p-2 border ${errors.City ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              >
                <option value="">Select City</option>
                {citylist.map((type) => (
                  <option key={type.name} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.City && (
                <p className="mt-1 text-xs text-red-600">{errors.City}</p>
              )}
            </div>

            {/* Pin Code */}
            <div className="min-w-[250px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Pin Code
              </label>
              <input
                type="number"
                value={formData.PinCode}
                name="PinCode"
                placeholder="Enter valid pin code"
                onChange={handleChange}
                className={`w-full p-2 border ${errors.PinCode ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.PinCode && (
                <p className="mt-1 text-xs text-red-600">{errors.PinCode}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 ">
            {/* Address */}
            <div className="col-span-3 min-w-[50px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                type="text"
                value={formData.Address}
                name="Address"
                placeholder="Enter address"
                onChange={handleChange}
                className={`w-full p-2 border ${errors.Address ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.Address && (
                <p className="mt-1 text-xs text-red-600">{errors.Address}</p>
              )}
            </div>

            <div className="col-span-3 min-w-[50px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Shipment Mobile Number
              </label>
              <input
                type="number"
                value={formData.MobileNumber1}
                name="MobileNumber1"
                placeholder="Enter MobileNumber1"
                onChange={handleChange}
                className={`w-full p-2 border ${errors.MobileNumber1 ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.MobileNumber1 && (
                <p className="mt-1 text-xs text-red-600">{errors.MobileNumber1}</p>
              )}
            </div>
            {/* GST No */}
            <div className="min-w-[250px]">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                GST No
              </label>
              <input
                type="text"
                value={formData.GSTNo}
                name="GSTNo"
                maxLength={15}
                placeholder="Enter GST No"
                onChange={handleChange}
                className={`w-full p-2 border ${errors.GSTNo ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.GSTNo && (
                <p className="mt-1 text-xs text-red-600">{errors.GSTNo}</p>
              )}
            </div>


          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-5 rounded-md"
              //   onClick={() => navigate("/deladdresslist")}
              onClick={() => navigate("/delivery-address")}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              {loading ? <>{/* Spinner here */}</> : "Submit"}
            </button>
          </div>

          {vehicleError && (
            <p className="col-span-3 mt-2 text-red-600">{vehicleError}</p>
          )}
        </form>
      </div>
    </main>
  );
}

export default ChangePartAddress;