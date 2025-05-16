import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { dev } from '../../utils/ApiUrl'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

function Transporter() {
    const [formData, setFormData] = useState({
        TransporterNameId: "",
        TransporterName: "",
        Address: "",
        Country: "India",
        State: "",
        City: "",
        Email: "",
        MobileNumber: "",
        PinCode: "",
        currentUser: localStorage.getItem("currentUser"),
        CreatedBy: localStorage.getItem('currentUser'),
    });

    const location = useLocation();
    const { TransporterNameId } = location.state || {};
    const [statelist, setStateList] = useState([]);
    const [citylist, setCityList] = useState([]);
    const [transporterError, setTransporterError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // console.log("citylist", citylist);

    const [errors, setErrors] = useState({
        TransporterName: "",
        Address: "",
        Country: "",
        State: "",
        City: "",
        Email: "",
        MobileNumber: "",
        PinCode: "",
    });

    const notifySuccess = () => toast.success(TransporterNameId ? "Transporter Update Successfully!" : "New Transporter Added Successfully!", { autoClose: 5000 });
    const notifyError = (message) => toast.error(message, { autoClose: 5000 });

    const validate = () => {
        const newErrors = {};
        if (!formData.TransporterName) newErrors.TransporterName = "Transporter Name is required";
        if (!formData.Address) newErrors.Address = "Address  is required";
        if (!formData.Country) newErrors.Country = "Country  is required";
        if (!formData.State) newErrors.State = "State  is required";
        if (!formData.City) newErrors.City = "City  is required";
        // if (!formData.Email) newErrors.Email = "Email  is required";
        // if (!formData.MobileNumber) newErrors.MobileNumber = "MobileNumber  is required";
        if (!formData.PinCode) newErrors.PinCode = "Pin Code  is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "MobileNumber") {
            const regex = /^[0-9]{0,10}$/;
            if (value.length <= 10 && regex.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else

            if (name === "PinCode") {
                const PinMethod = /^[0-9]{0,6}$/;
                if (value.length <= 10 && PinMethod.test(value)) {
                    setFormData((prev) => ({ ...prev, [name]: value }));
                }
            }

            else {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const handleStateChange = (e) => {
        const selectedIsoCode = e.target.value;
        const selectedState = statelist.find(state => state.isoCode === selectedIsoCode);

        if (selectedState) {
            // Update formData with the selected state and then fetch cities
            setFormData((prevFormData) => ({
                ...prevFormData,
                State: {
                    isoCode: selectedState.isoCode,
                    name: selectedState.name
                },
                City: "",
            }));

            /***------- Clear city-related errors, if any-------- */
            setErrors((prevErrors) => ({
                ...prevErrors,
                City: "",
                State: "",
            }));

            fetchCities(selectedState.isoCode); // Fetch cities for the selected state
        }
    };

    const handleChangecity = (e) => {
        const selectedCity = e.target.value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            City: selectedCity
        }));

        /****---------- Clear city-related errors, if any  -----***/
        setErrors((prevErrors) => ({
            ...prevErrors,
            City: selectedCity ? "" : "City is required",
        }));

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        if (formData.MobileNumber && formData.MobileNumber.length !== 10) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                MobileNumber: "Number must be 10 digits",
            }));
            return;
        }

        if (formData.PinCode && formData.PinCode.length !== 6) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                PinCode: "Pin Number Must be 6 digits",
            }));
            return;
        }

        const updatedFormData = {
            ...formData,
            State: formData.State?.name || "",
            TransporterNameId: TransporterNameId ? TransporterNameId : "",

        };

        await addTransporter(updatedFormData);

        console.log('All Data', formData);
    };

    const addTransporter = async (updatedFormData) => {
        try {
            setTransporterError('');
            setLoading(true);

            const resp = await fetch(
                `${dev}/transporter/addTransporter`,
                {
                    method: "POST",
                    body: JSON.stringify(updatedFormData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await resp.json();

            if (resp.ok) {
                setLoading(false);
                // toast.success("Add Transporter successfully");
                notifySuccess();
                navigate("/transporterlist");
            } else {
                toast.error(result.message || "Something went wrong");
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log("Add Transporter Failed", error.message);
        }
    };

    /** ------------------ Binding the All Fields -------------------- */
    useEffect(() => {
        // console.log("TransporterNameId", TransporterNameId);

        if (TransporterNameId) {
            axios.post(`${dev}/transporter/addTransporter`, { TransporterNameId })
                .then((response) => {
                    const partyData = response.data.data;

                    /*** for without selecting the states bind */
                    const selectedState = statelist.find(
                        (state) => state.name.toLowerCase() === partyData.State.toLowerCase()
                    );

                    console.log('Transporter Data:', partyData);
                    console.log('Selected State:', selectedState);

                    setFormData({
                        TransporterName: partyData.TransporterName,
                        Address: partyData.Address,
                        Country: partyData.Country,
                        State: selectedState
                            ? { isoCode: selectedState.isoCode, name: selectedState.name }
                            : { isoCode: '', name: '' },
                        City: partyData.City,
                        Email: partyData.Email,
                        MobileNumber: partyData.MobileNumber,
                        PinCode: partyData.PinCode,
                        Status: partyData.Status,

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
    }, [TransporterNameId, statelist]);

    /*** District List / City List */
    const fetchCities = async (stateIsoCode) => {
        try {
            const response = await fetch(`${dev}/party/getCities/${stateIsoCode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isoCode: stateIsoCode })
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
        <main className="min-h-screen p-4 md:p-6 lg:p-4 overflow-y-auto" style={{ background: 'linear-gradient(to top, #f19090 0%, #897edd 100%)' }} >
            <div className="bg-[#fff] p-4 md:p-3 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
                <div className="mb-4 md:mb-6 flex flex-col items-center">
                    {/* <Image src={logo} rounded alt="" className="w-2 mb-2 md:mb-3" />  */}
                    <h1 className="text-[#2c3e50] text-3xl md:text-2xl font-extrabold font-serif">
                        {TransporterNameId ? "Edit Transporter" : "Add New Transporter"}
                    </h1>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Transporter Name*/}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Transporter Name</label>
                            <input
                                type="text"
                                value={formData.TransporterName}
                                name="TransporterName"
                                onChange={handleChange}
                                placeholder="Enter Transporter Name"
                                className={`w-full p-2 border ${errors.TransporterName ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                            />
                            {errors.TransporterName && <p className="mt-1 text-xs text-red-600">{errors.TransporterName}</p>}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Mobile Number</label>
                            <input
                                type="number"
                                value={formData.MobileNumber}
                                name="MobileNumber"
                                // onChange={handleMobileNumber}
                                onChange={handleChange}
                                placeholder="Enter Mobile Number"
                                className={`w-full p-2 border ${errors.MobileNumber ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                            />
                            {errors.MobileNumber && <p className="mt-1 text-xs text-red-600">{errors.MobileNumber}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={formData.Email}
                                name="Email"
                                // onChange={handleEmailValidation}
                                onChange={handleChange}
                                placeholder="Enter Valid Email"
                                className={`w-full p-2 border ${errors.Email ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                            />
                            {/* {errors.Email && <p className="mt-1 text-xs text-red-600">{errors.Email}</p>} */}
                        </div>
                    </div>

                    {/* Country, State, City */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Country</label>
                            <input
                                type="text"
                                value="India"
                                readOnly
                                className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">State</label>
                            <select
                                id="State"
                                name="State"
                                value={formData.State?.isoCode || ""}
                                onChange={handleStateChange}
                                className={`w-full p-2 border ${errors.State ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                            >
                                <option value="">Select State</option>
                                {statelist.map((type) => (
                                    <option key={type.isoCode} value={type.isoCode}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            {errors.State && <p className="mt-1 text-xs text-red-600">{errors.State}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">City</label>
                            <select
                                id="City"
                                name="City"
                                value={formData.City || ""}
                                onChange={handleChangecity}
                                className={`w-full p-2 border ${errors.City ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                            >
                                <option value="">Select City</option>
                                {citylist.map((type) => (
                                    <option key={type.name} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            {errors.City && <p className="mt-1 text-xs text-red-600">{errors.City}</p>}
                        </div>
                    </div>

                    {/* Address and Pin Code */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Address</label>
                            <input
                                type="text"
                                value={formData.Address}
                                name="Address"
                                onChange={handleChange}
                                placeholder="Enter Address"
                                className={`w-full p-2 border ${errors.Address ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                            />
                            {errors.Address && <p className="mt-1 text-xs text-red-600">{errors.Address}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-600">Pin Code</label>
                            <input
                                type="number"
                                value={formData.PinCode}
                                name="PinCode"
                                onChange={handleChange}
                                placeholder="Enter Valid Pin Code"
                                className={`w-full p-2 border ${errors.PinCode ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                            />
                            {errors.PinCode && <p className="mt-1 text-xs text-red-600">{errors.PinCode}</p>}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-5 rounded-md"
                            onClick={() => navigate("/transporterlist")}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>

                    {transporterError && <p className="text-red-500 text-center mt-4 col-span-3">{transporterError}</p>}
                </form>
            </div>
        </main>

    );
}

export default Transporter;