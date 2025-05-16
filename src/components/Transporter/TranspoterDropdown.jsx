import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import debounce from "lodash/debounce"; // Import debounce

function TranspoterDropdown({ formData, setFormData, errors = {} }) {
  const [transpotterList, setTranspotterList] = useState([]);
  const [filteredTranspotterList, setFilteredTranspotterList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch transporter list from the backend
  const fetchTranspotterList = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/transporter/getTransporter`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!resp.ok) {
        toast.error("Transporter list fetching failed");
        setLoading(false);
        return;
      }
      const data = await resp.json();
      setTranspotterList(data.data);
      setFilteredTranspotterList(data.data); // Set the initial filtered list
      console.log("Transpotter list data:", data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranspotterList();
  }, []);

  // Handle search functionality using debounce
  const handleSearchChange = useCallback(
    debounce((event, value) => {
      const query = value?.toLowerCase() || "";
      setFilteredTranspotterList(
        transpotterList.filter((trans) =>
          trans.TransporterName.toLowerCase().startsWith(query) // Filter based on the starting text
        )
      );
    }, 300),
    [transpotterList]
  );

  // Handle dropdown selection change
  const handleChange = (event, newValue) => {
    setFormData({
      ...formData,
      transpotterName: newValue ? newValue.TransporterNameId : "", // Update formData with selected TransporterNameId
    });
  };

  return (
    <Autocomplete
      options={filteredTranspotterList}
      getOptionLabel={(option) => option.TransporterName || ""} // Use the transporter name for display
      value={transpotterList.find(
        (trans) => trans.TransporterNameId === formData?.transpotterName
      ) || null} // Set selected value based on TransporterNameId
      onChange={handleChange}
      onInputChange={handleSearchChange} // Handle search query change
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Transporter Name"
          margin="normal"
          fullWidth
          required
          error={!!errors?.transpotterName}
          helperText={errors?.transpotterName}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      isOptionEqualToValue={(option, value) =>
        option.TransporterNameId === value?.TransporterNameId
      } // Match selected value correctly
    />
  );
}

export default TranspoterDropdown;
