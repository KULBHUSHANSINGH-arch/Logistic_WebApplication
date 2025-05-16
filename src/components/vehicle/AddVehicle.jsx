import React, { useEffect, useState } from "react";
import "../../styles/vehicle/addVehicle.css";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi";
import { Toast } from "flowbite-react";
import { toast } from "react-toastify";
import { dev } from '../../utils/ApiUrl'
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

function AddVehicle() {
  const { user } = useSelector((state) => state.user)
  // State for input values
  const [formData, setFormData] = useState({
    vehicleNo: "",
    vehicleType: "",
    driverNumber: "",
    partyName: "",
    location: "",
    transpotterName: "",
    transferFrom: "",
    vehicleImage: null,
    currentUser: localStorage.getItem("currentUser"),
    workLocation: user.workLocation
  });
  const [vehicleImage, setvehicleImage] = useState(null);
  const [vehicleError, setvehicleError] = useState("");
  const [vehicleTypes, setVehicletypes] = useState([]);
  const [PartyNameList, setPartyNameList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [vehicleId, setVehicleId] = useState("");



  // fetch vehicle types on component mount----
  const navigate = useNavigate();
  useEffect(() => {
    const fecthVehiclesTypesData = async () => {
      try {
        const resp = await fetch(
          `${dev}/vehicle/vehicle-types`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
          }
        );

        const result = await resp.json();


        if (!resp.ok) {
          toast.error(result.message || 'vehicle types not found')

          return;
        }

        setVehicletypes(result.vehicleTypes)
      } catch (error) {
        toast.error("something went wrong in fecthing vehicle types");
        console.log("fetching vehicle type failed!", error.message);
      }
    };
    fecthVehiclesTypesData();
  }, []);


  /******** --------- get patrty list data */
  useEffect(() => {
    const fetchPartyNamesData = async () => {
      try {
        const resp = await fetch(`${dev}/party/getParty`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
        });
        const result = await resp.json();
        if (!resp.ok) {
          toast.error(result.message || 'Party names not found');
          return;
        }

        setPartyNameList(result.data);
      } catch (error) {
        toast.error("Something went wrong in fetching party names");
        console.log("Fetching party names failed!", error.message);
      }
    };

    fetchPartyNamesData();
  }, []);
  
  /************ selected party list  */
  const handlePartyList = (e) => {
    const selectedPartyName = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      partyName: selectedPartyName,
    }));

    // Clear errors if the user selects a valid party name
    setErrors((prevErrors) => ({
      ...prevErrors,
      partyName: selectedPartyName ? '' : 'Please select a party name',
    }));
  };



  // State for input errors
  const [errors, setErrors] = useState({
    vehicleNo: "",
    vehicleType: "",
    driverNumber: "",
    partyName: "",
    location: "",
    transpotterName: "",
    transferFrom: "",
    vehicleImage: null,
  });
  // Validate individual fields
  const validate = () => {
    const newErrors = {};
    if (!formData.vehicleNo) newErrors.vehicleNo = "Vehicle number is required";
    if (!formData.vehicleType)
      newErrors.vehicleType = "Vehicle type is required";


    if (!vehicleImage) newErrors.vehicleImage = "vehicleImage  is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;


    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        vehicleImage: file,
      }));
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setvehicleImage(file);

      if (vehicleImage) {
        errors.vehicleImage = null;
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        vehicleImage: null,
      }));
    }
  };

  /****** ----- upload vehicle image  ------- */
  const uploadVehicleImage = async (vehicleId, vehicleImage) => {

    const url =
      `${dev}/vehicleIN/upload-vehicleIn-image`;

    const formData = new FormData();
    formData.append("vehicleId", vehicleId);
    formData.append("vechileInImage", vehicleImage);
    formData.append('type', 'IN')

    try {
      toast.error(null);
      setLoading(true);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });


      const result = await response.json();
      if (!response.ok) {
        setLoading(false);
        toast.error(result.message || 'Please check the image file');
        return;
      }
      setLoading(false);
      return result;
    } catch (error) {
      console.error("Image upload failed", error.message);
      toast.error("Something went wrong with image upload");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    /**------  MObile no. 10 Digit Only */
    if (formData.driverNumber && formData.driverNumber.length !== 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        driverNumber: "Number must be 10 digits",
      }));
      return;
    }

    try {
      setvehicleError(null);
      setLoading(true);

      /** -------  Add Vehicle - vehicleIN  ---------- */
      const resp = await fetch(
        `${dev}/vehicleIN/vehicle-entry`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await resp.json();
      if (!resp.ok) {
        setLoading(false);
        toast.error(result.message || 'Failed, please re-check data');
        return;
      }

      setVehicleId(result.vehicleId);
      const data = await uploadVehicleImage(result.vehicleId, vehicleImage);
      if (data?.success === true) {
        setLoading(false);
        setFormData({
          vehicleNo: "",
          vehicleType: "",
          driverNumber: "",
          partyName: "",
          location: "",
          transpotterName: "",
          transferFrom: "",
        });
        setErrors({});
        setImageUrl(null);

        toast.success("Vehicle added successfully");
        navigate("/dashboard");
      } else {
        toast.error("Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Add vehicle failed", error.message);
      toast.error("An error occurred while adding the vehicle");
    }
  };


  /***   Form Input Fields Start */

  return (
    <main className="add-vehicle-conatiner bg-gray-100">
      <div className="add-vehicle-header bg-gray-100">
        <h1>add vehicle entry</h1>
        <div>
          <img
            src={logo || "https://w7.pngwing.com/pngs/644/485/png-transparent-air-transportation-cargo-freight-transport-logistics-logistic-people-mode-of-transport-intermodal-freight-transport-thumbnail.png"}
            alt=""
            className=" w-full h-full  object-fill"
          />
        </div>
      </div>
      <div className="add-vehicle-form-wrapper bg-gray-100">
        <form action="" className="add-vehicle-form" onSubmit={handleSubmit}>
          <div className="add-vehicle-input-wrapper">
            <label htmlFor="">vehicle number</label>
            <input
              type="text"
              value={formData.vehicleNo}
              name="vehicleNo"
              placeholder="enter vehicle number"
              onChange={handleChange}
              style={{
                borderColor: errors.vehicleNo ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
            {errors.vehicleNo && <p className="error">{errors.vehicleNo}</p>}
          </div>
          <div className="add-vehicle-input-wrapper">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}

              style={{
                borderColor: errors.vehicleType ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((type) => (
                <option key={type.vehicleTypeId} value={type.vehicleTypeId}>
                  {type.vehicleTypeName}
                </option>
              ))}
            </select>
            {errors.vehicleType && (
              <p className="error">{errors.vehicleType}</p>
            )}
          </div>
          <div className="add-vehicle-input-wrapper">
            <label htmlFor="">driver mobile number</label>
            <input
              type="number"
              value={formData.driverNumber}
              name="driverNumber"
              onChange={handleChange}
              placeholder="enter driver number"
              style={{
                borderColor: errors.driverNumber ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
            {errors.driverNumber && (
              <p className="error">{errors.driverNumber}</p>
            )}
          </div>


          {/* Part Name  */}
          <div className="add-vehicle-input-wrapper">
            <label htmlFor="">party name</label>
            {/* <input
              type="text"
              value={formData.partyName}
              name="partyName"
              onChange={handleChange}
              placeholder="enter party name"
              style={{
                borderColor: errors.partyName ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            /> */}
            <select
              id="partyName"
              name="partyName"
              value={formData.partyName}
              onChange={handlePartyList}
              style={{
                borderColor: errors.partyName ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <option value="">Select Party Name</option>
              {PartyNameList.map((type) => (
                <option key={type.PartyNameId} value={type.PartyNameId}>
                  {type.PartyName}
                </option>
              ))}
            </select>
            {errors.partyName && <p className="error">{errors.partyName}</p>}
            {/* {errors.partyName && <p className="error">{errors.partyName}</p>} */}
          </div>




          <div className="add-vehicle-input-wrapper">
            <label htmlFor="">location</label>
            <input
              type="text"
              value={formData.location}
              name="location"
              placeholder="enter location"
              onChange={handleChange}
              style={{
                borderColor: errors.location ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
            {errors.location && <p className="error">{errors.location}</p>}
          </div>
          <div className="add-vehicle-input-wrapper">
            <label htmlFor="">transpotter name</label>
            <input
              type="text"
              value={formData.transpotterName}
              name="transpotterName"
              placeholder="enter transpottter name"
              onChange={handleChange}
              style={{
                borderColor: errors.transpotterName ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
            {errors.transpotterName && (
              <p className="error">{errors.transpotterName}</p>
            )}
          </div>
          {/* <div className="add-vehicle-input-wrapper">
            <label htmlFor="">transfer from</label>
            <input
              type="text"
              value={formData.transferFrom}
              name="transferFrom"
              onChange={handleChange}
              placeholder="enter transfer from"
              style={{
                borderColor: errors.transferFrom ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
            {errors.transferFrom && (
              <p className="error">{errors.transferFrom}</p>
            )}
          </div> */}
          <div className="add-vehicle-input-wrapper">
            <label htmlFor="">vehicle image</label>
            <input
              type="file"
              id="vehicle-image"
              name="vehicleImage"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                borderColor: errors.vehicleImage ? "red" : "initial",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
            {errors.vehicleImage && (
              <p className="error">{errors.vehicleImage}</p>
            )}
          </div>

          <div className=" w-full flex justify-center items-center ">
            {imageUrl && (
              <div className="vehicle-image">
                <img src={imageUrl} alt="" />
              </div>
            )}
          </div>

          <div className="vehicle-entry-btn">
            <button
              className="cancel "
              onClick={() => navigate("/dashboard")}
            >
              cancel
            </button>
            <button type="submit">
              {loading ? (
                <>
                  <Spinner
                    color="failure"
                    aria-label="Failure spinner example"
                  />
                  {" submitting"}
                </>
              ) : (
                "submit"
              )}
            </button>
          </div>
          {vehicleError && <p className="error">{vehicleError}</p>}
        </form>
      </div>
    </main>
  );
}

export default AddVehicle;
