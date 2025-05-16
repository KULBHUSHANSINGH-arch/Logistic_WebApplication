import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import axios from "axios";
import Select from "react-select";

const ReceiveAmount = () => {
    const [formData, setFormData] = useState({
        partyId: "",
        PartyName: "",
        ReceiveAmount: "",
        currentUser: localStorage.getItem("currentUser"),
    });
    
    const location = useLocation();
    const { partyId } = location.state || {};
    const [amountReceiveError, setAmountReceiveError] = useState("");
    const [loading, setLoading] = useState(false);
    const [PartyNameList, setPartyNameList] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPartyNamesData = async () => {
            try {
                const resp = await fetch(`${dev}/party/getSalesParty`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ personId: formData.currentUser }),
                });
                const result = await resp.json();
                if (!resp.ok) return toast.error(result.message || "Party names not found");
                setPartyNameList(result.data);
            } catch (error) {
                toast.error("Error fetching party names");
            }
        };
        fetchPartyNamesData();
    }, []);

    // const handlePartyList = (e) => {
    //     setFormData({ ...formData, PartyName: e.target.value });
    //     setErrors({ ...errors, PartyName: e.target.value ? "" : "Please select a party name" });
    // };

    // Format party data for react-select
    const partyOptions = PartyNameList.map((party) => ({
        value: party.PartyNameId,
        label: party.PartyName
    }));

    const handlePartySelect = (selectedOption) => {
        setFormData({ ...formData, PartyName: selectedOption ? selectedOption.value : "" });
        setErrors({ ...errors, PartyName: selectedOption ? "" : "Please select a party name" });
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.PartyName) newErrors.PartyName = "Party Name is required";
        if (!formData.ReceiveAmount) newErrors.ReceiveAmount = "Receive Amount is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);
            const resp = await fetch(`${dev}/party/addPartyDetails`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, partyId: partyId || "" }),
            });
            const result = await resp.json();
            if (!resp.ok) throw new Error(result.message);
            toast.success("Amount Received Successfully!");
            navigate("/receiveAmountList");
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const selectedParty = partyOptions.find(option => option.value === formData.PartyName) || null;


    return (
<main className="min-h-screen flex items-center justify-center  " style={{ backgroundColor: "#e7e7e7", marginTop:'-65px' }}>
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl "> 
        <h1 className="text-gray-800 text-xl md:text-2xl font-bold text-center mb-4">
            {partyId ? "Edit Receive Amount" : "Add Received Amount"}
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div>
                    <label className="block mb-1 text-sm font-medium text-blue-700">Party Name</label>
                    <select
                        name="PartyName"
                        value={formData.PartyName}
                        onChange={handlePartyList}
                        className={`w-full p-2 border ${errors.PartyName ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50`}
                    >
                        <option value="">Select Party Name</option>
                        {PartyNameList.map(({ PartyNameId, PartyName }) => (
                            <option key={PartyNameId} value={PartyNameId}>{PartyName}</option>
                        ))}
                    </select>
                    {errors.PartyName && <p className="mt-1 text-xs text-red-600">{errors.PartyName}</p>}
                </div> */}
                <div>
                            <label className="block mb-1 text-sm font-medium text-blue-700">Party Name</label>
                            <Select
                                value={selectedParty}
                                onChange={handlePartySelect}
                                options={partyOptions}
                                placeholder="Search or select party name"
                                isClearable
                                isSearchable
                                className={errors.PartyName ? "react-select-error" : ""}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderColor: errors.PartyName ? '#f56565' : (state.isFocused ? '#63b3ed' : '#e2e8f0'),
                                        boxShadow: state.isFocused ? '0 0 0 1px #63b3ed' : 'none',
                                        backgroundColor: '#f9fafb',
                                        '&:hover': {
                                            borderColor: errors.PartyName ? '#f56565' : '#cbd5e0'
                                        }
                                    })
                                }}
                            />
                            {errors.PartyName && <p className="mt-1 text-xs text-red-600">{errors.PartyName}</p>}
                        </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-green-700">Receive Amount <span className="text-black">⟨₹⟩</span></label>
                    <input
                        type="number"
                        name="ReceiveAmount"
                        value={formData.ReceiveAmount || ""}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.ReceiveAmount ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-green-400 bg-gray-50`}
                        placeholder="Enter Amount"
                    />
                    {errors.ReceiveAmount && <p className="mt-1 text-xs text-red-600">{errors.ReceiveAmount}</p>}
                </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-md"
                    onClick={() => navigate("/receiveAmountList")}
                >
                    Cancel
                </button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded-md">
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
            {amountReceiveError && <p className="text-center mt-2 text-red-600">{amountReceiveError}</p>}
        </form>
    </div>
</main>

    );
};

export default ReceiveAmount;