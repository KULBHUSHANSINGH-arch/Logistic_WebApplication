import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { dev } from "../../utils/ApiUrl";
import "react-toastify/dist/ReactToastify.css";

const FinalPi = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { SalesOrderId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [finalError, setFinalError] = useState("");
  const [formData, setFormData] = useState([
    {
      Replacement: false,
      PanelType: "",
      Quantity: "",
      ActualUnitPrice: "",
      TotalAmount: "",
      CreatedBy: localStorage.getItem("currentUser"),
    },
  ]);

  const notifySuccess = () =>
    toast.success(SalesOrderId ? "Final PI Updated Successfully!" : "Final PI Added Successfully!", {
      autoClose: 5000,
    });

  const notifyError = (message) => toast.error(message, { autoClose: 5000 });

  const validate = () => {
    const newErrors = formData.map((row) => ({
      PanelType: !row.PanelType ? "Panel Type is required" : "",
    }));

    return newErrors.every((row) => !row.PanelType);
  };

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = type === "checkbox" ? checked : value;
    setFormData(updatedFormData);
  };

  const addRow = () => {
    setFormData([
      ...formData,
      {
        Replacement: false,
        PanelType: "",
        Quantity: "",
        ActualUnitPrice: "",
        TotalAmount: "",
        CreatedBy: localStorage.getItem("currentUser"),
      },
    ]);
  };

  const removeRow = (index) => {
    if (formData.length > 1) {
      const updatedFormData = formData.filter((_, i) => i !== index);
      setFormData(updatedFormData);
    } else {
      toast.error("At least one row is required!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const resp = await axios.post(`${dev}/sales/getSalesItems`, {
        salesID: salesOrderId,       
    }, {
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
      const result = await resp.json();
      setLoading(false);
      if (resp.ok) {
        notifySuccess();
        console.log('All Data', result)
        navigate("/delivery-address");
      } else {
        notifyError(result.message || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      console.log("Add Delivery Failed", error.message);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-4 bg-gradient-to-t from-red-300 to-indigo-400">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
        <h1 className="text-gray-700 text-2xl font-extrabold text-center mb-4">
          {SalesOrderId ? "Edit Final PI" : "Final PI"}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {formData.map((row, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded-lg mb-4">
              {/* First Row: Replacement, Panel Type, Quantity */}
              <div className="grid grid-cols-3 gap-4">
                {/* Replacement Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="Replacement"
                    checked={row.Replacement}
                    onChange={(e) => handleChange(index, e)}
                    className="w-5 h-5"
                  />
                  <label className="text-sm font-medium text-gray-600">Replacement</label>
                </div>

                {/* Panel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Panel Type</label>
                  <input
                    type="text"
                    name="PanelType"
                    value={row.PanelType}
                    placeholder="Enter Panel Type"
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Quantity</label>
                  <input
                    type="number"
                    name="Quantity"
                    value={row.Quantity}
                    placeholder="Enter Quantity"
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Second Row: Unit Price, Total Amount */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Unit Price</label>
                  <input
                    type="number"
                    name="ActualUnitPrice"
                    value={row.ActualUnitPrice}
                    placeholder="Enter Unit Price"
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">Total Amount</label>
                  <input
                    type="number"
                    name="TotalAmount"
                    value={row.TotalAmount}
                    placeholder="Enter Total Amount"
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Remove Button */}
              {formData.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* Add Row Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addRow}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            >
              + Add Row
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-5 rounded-md"
              onClick={() => navigate("/delivery-address")}
            >
              Back
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {finalError && <p className="text-red-600 text-center mt-2">{finalError}</p>}
        </form>
      </div>
    </main>
  );
};

export default FinalPi;
