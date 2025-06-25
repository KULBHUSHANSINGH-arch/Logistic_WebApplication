import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/vehicle/addVehicle.css";
// import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { validateGST } from "../../utils/downloadFile";
// import { preview } from "vite";

// import logo from "../../assets/logo.png";
// import { Image } from 'react-bootstrap';


import { useSelector } from "react-redux";
// GST validation function--------

function NewParty() {
  const { user } = useSelector((state) => state.user)
  const [formData, setFormData] = useState({
    PartyNameId: "",
    PartyName: "",
    Address: "",
    GSTNo: "",
    Country: "India",
    State: "",
    SalesMan: user.designation === 'Sales Executive' ? user.personId : "",
    Email: "",
    City: "",
    MobileNumber: "",
    PinCode: "",
    // Latitude: "",
    // Longitude: "",
    CreatedBy: user.personId,
    currentUser: user.personId,
  });

  // console.log('form data', formData)


  const location = useLocation();
  const { PartyNameId } = location.state || {};
  const [statelist, setStateList] = useState([]);
  const [citylist, setCityList] = useState([]);
  const [vehicleError, setvehicleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [salesManList, setSalesManList] = useState([]);
  const navigate = useNavigate();


  const [personId, setPersonId] = useState('');
  const [errors, setErrors] = useState({
    PartyName: "",
    Address: "",
    GSTNo: "",
    Country: "",
    State: "",
    SalesMan: "",
    Email: "",
    City: "",
    MobileNumber: "",
    PinCode: "",
    // Latitude: "",
    // Longitude: "",
    CreatedBy: "",
  });

  useEffect(() => {

    setPersonId(user.personId);
    // console.log('currentUser data ID ',user.personId );


  }, []);

  const notifySuccess = () =>
    toast.success(
      PartyNameId
        ? "Party Update Successfully!"
        : "New Party Added Successfully!",
      { autoClose: 5000 }
    );
  const notifyError = (message) => toast.error(message, { autoClose: 5000 });

  const validate = () => {
    const newErrors = {};
    if (!formData.PartyName) newErrors.PartyName = "Party Name is required";
    if (!formData.Address) newErrors.Address = "Address  is required";
    if (!formData.GSTNo) newErrors.GSTNo = "GSTNo  is required";
    if (!formData.Country) newErrors.Country = "Country  is required";
    if (!formData.State) newErrors.State = "State  is required";
    if (!formData.SalesMan) newErrors.SalesMan = "Sales Man  is required";
    if (!formData.City) newErrors.City = "City  is required";
    // if (!formData.Email) newErrors.Email = "Email  is required";
    // if (!formData.MobileNumber) newErrors.MobileNumber = "MobileNumber  is required";
    if (!formData.PinCode) newErrors.PinCode = "PinCode  is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleEmailValidation = (e) => {
  //     const email = e.target.value;
  //     // Update formData
  //     setFormData((prevFormData) => ({
  //         ...prevFormData,
  //         Email: email,
  //     }));

  //     // Email format validation regex
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     // Validate email format
  //     if (!email) {
  //         setErrors((prevErrors) => ({
  //             ...prevErrors,
  //             Email: "Email is required",
  //         }));
  //     } else if (!emailRegex.test(email)) {
  //         setErrors((prevErrors) => ({
  //             ...prevErrors,
  //             Email: "Email is not correct",
  //         }));
  //     } else {
  //         // Clear email error if valid
  //         setErrors((prevErrors) => ({
  //             ...prevErrors,
  //             Email: "",
  //         }));
  //     }
  // };

  // const handleMobileNumber = (e) => {
  //     const input = e.target.value;

  //     // Allow only numbers and ensure input length does not exceed 10 digits
  //     if (/^\d{0,10}$/.test(input)) {
  //         setFormData((prevFormData) => ({
  //             ...prevFormData,
  //             MobileNumber: input,
  //         }));
  //     }

  //     // Validate mobile number length
  //     if (!input) {
  //         setErrors((prevErrors) => ({
  //             ...prevErrors,
  //             MobileNumber: "Mobile number is required",
  //         }));
  //     } else if (input.length !== 10) {
  //         setErrors((prevErrors) => ({
  //             ...prevErrors,
  //             MobileNumber: "Number must be exactly 10 digits",
  //         }));
  //     } else {
  //         setErrors((prevErrors) => ({
  //             ...prevErrors,
  //             MobileNumber: "",
  //         }));
  //     }
  // };

  // fetch sales man data----------

  const getSalesManData = async () => {
    try {
      const resp = await fetch(`${dev}/user/getSalesPersons`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        }
      })

      const data = await resp.json()

      if (!resp.ok) {
        console.log(`error ${data}`)
        return toast.error(data.message || 'Could Not Fetch Sales Data')
      }
      // console.log('sales data', data.allList
      // )

      setSalesManList(data.allList)



    } catch (error) {
      // console.log(`error: fecthing sales man data ${error}`);
      toast.error("Something Went Wrong");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    // GSTNo should not contain any spaces at all
    if (name === "GSTNo") {
      if (value.includes(" ")) return; // block any space input

      const gstError = validateGST(value);
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        GSTNo: gstError || "", // If there's an error, set it, otherwise clear it
      }));
      return;
    }

    // Pincode validation
    if (name === "PinCode") {
      const PinMethod = /^[0-9]{0,6}$/;
      if (value.length <= 6 && PinMethod.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      // Default handling
      setFormData((prev) => ({
        ...prev,
        [name]: name === "PartyName" ? value?.toUpperCase() : value,
      }));
    }

    // Clear field-specific error
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
    // Check if GST is valid and handle errors
    // const gstValidationError = validateGST(formData.GSTNo);
    // if (gstValidationError) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     GSTNo: gstValidationError, // Set error message if GST is invalid
    //   }));
    //   return; // Prevent form submission if GST is invalid
    // }

    // if (formData.MobileNumber && formData.MobileNumber.length !== 10) {
    //     setErrors((prevErrors) => ({
    //         ...prevErrors,
    //         MobileNumber: "Number must be 10 digits",
    //     }));
    //     return;
    // }

    if (formData.PinCode && formData.PinCode.length !== 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        PinCode: "Pin Number Must be 6 digits",
      }));
      return;
    }

    const updatedFormData = {
      ...formData,
      UpdatedBy: user.personId,
      State: formData.State?.name || "",
      PartyNameId: PartyNameId ? PartyNameId : "",
      PartyName: formData?.PartyName?.trim(),
    };
    // console.log("Updated Data", updatedFormData);

    await addParty(updatedFormData);
  };

  const addParty = async (updatedFormData) => {
    try {
      setvehicleError(null);
      setLoading(true);
      const resp = await fetch(`${dev}/party/addParty`, {
        method: "POST",
        body: JSON.stringify(updatedFormData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await resp.json();

      if (resp.ok) {
        setLoading(false);
        // toast.success("Add Party successfully");
        notifySuccess();

        navigate("/partylist");
      } else {
        toast.error(result.message || "Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      // console.log("Add Party Failed", error.message);
    }
  };

  /** ------------------ Binding the All Fields -------------------- */
  useEffect(() => {
    // console.log("PartyNameId", PartyNameId);

    if (PartyNameId) {
      axios
        .post(`${dev}/party/addParty`, { PartyNameId })
        .then((response) => {
          const partyData = response.data.data;

          /*** for without selecting the states bind */
          const selectedState = statelist.find(
            (state) =>
              state.name.toLowerCase() === partyData.State.toLowerCase()
          );

          // console.log("Party Data:", partyData);


          setFormData({
            PartyName: partyData.PartyName,
            Address: partyData.Address,
            Country: partyData.Country,
            State: selectedState
              ? { isoCode: selectedState.isoCode, name: selectedState.name }
              : { isoCode: "", name: "" },
            City: partyData.City,
            SalesMan: salesManList && salesManList.find((s) => s.personId === partyData.SalesMan)?.personId,
            Email: partyData.Email,
            MobileNumber: partyData.MobileNumber,
            PinCode: partyData.PinCode,
            Status: partyData.Status,
            GSTNo: partyData?.GSTNo,

            // Latitude: partyData.Latitude,
            // Longitude: partyData.Longitude,
            // CreatedBy:partyData.currentUser,
            CreatedBy: partyData.currentUser,
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
  }, [PartyNameId, statelist, salesManList]);

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
    getSalesManData()
  }, []);

  return (
    <main
      className="min-h-screen p-4 md:p-6 lg:p-4 overflow-y-auto"
      style={{
        background: "linear-gradient(to top, #f19090 0%, #897edd 100%)",
      }}
    >
      <div className="bg-[#fff] p-4 md:p-3 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
        <div className="mb-4 md:mb-6 flex flex-col items-center">
          {/* <Image src={logo} rounded alt="" className="w-2 mb-2 md:mb-3" />  */}
          <h1 className="text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
            {PartyNameId ? "Edit Party" : "Add New Party"}
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Party Name*/}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Party Name
              </label>
              <input
                type="text"
                value={formData.PartyName}
                name="PartyName"
                onChange={handleChange}
                placeholder="Enter party name"
                className={`w-full p-2 border ${errors.PartyName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.PartyName && (
                <p className="mt-1 text-xs text-red-600">{errors.PartyName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Mobile Number
              </label>
              <input
                type="number"
                value={formData.MobileNumber}
                name="MobileNumber"
                onChange={handleChange}
                // onChange={handleMobileNumber}
                placeholder="Enter mobile number"
                className={`w-full p-2 border ${errors.MobileNumber ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.MobileNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.MobileNumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={formData.Email}
                name="Email"
                placeholder="Enter valid email"
                // onChange={handleEmailValidation}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.Email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {/* {errors.Email && <p className="mt-1 text-xs text-red-600">{errors.Email}</p>} */}
            </div>
          </div>

          {/* Country */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Country
              </label>
              <input
                type="text"
                value="India"
                readOnly
                className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md"
              />
            </div>

            {/* State*/}
            <div>
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

            {/*  City */}
            <div>
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
          </div>

          {/* Address*/}
          <div className="grid grid-cols-2 gap-4">
            <div>
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

            {/*Pin Code */}
            <div>
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
          <div className="grid grid-cols-2 gap-4">

            {/*Sales */}
            {(user.designation !== 'Sales Executive' && <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Sales Executive
              </label>
              <select
                id="Sales"
                name="SalesMan"
                value={formData.SalesMan || ""}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.SalesMan ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              >
                <option value="">Select Sales Executive</option>
                {salesManList.map((s) => (
                  <option key={s.personId} value={s.personId}>
                    {s.userName}
                  </option>
                ))}
              </select>
              {errors.SalesMan && (
                <p className="mt-1 text-xs text-red-600">{errors.SalesMan}</p>
              )}
            </div>)}

            {/* GST No */}
            <div>
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

          {/* Button Row */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-5 rounded-md"
              onClick={() => navigate("/partylist")}
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

export default NewParty;
