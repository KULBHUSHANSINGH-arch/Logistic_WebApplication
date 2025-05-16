import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import debounce from 'lodash/debounce'; // Import debounce

function PartyDropdown({ formData, setFormData, errors, dropDown = true }) {
  const [partyList, setPartyList] = useState([]);
  const [filteredPartyList, setFilteredPartyList] = useState([]); // State for filtered list
  const [loading, setLoading] = useState(false);

  const fetchPartyList = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/party/getParty`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!resp.ok) {
        toast.error("Party list fetching failed");
        return;
      }
      const data = await resp.json();
      setPartyList(data.data);
      setFilteredPartyList(data.data); // Initialize filtered list with full data
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dropDown) {
      fetchPartyList(); // Initial fetch
    }
  }, [dropDown]);

  const handleSearchChange = useCallback(
    debounce((event, value) => {
      const query = value?.toLowerCase() || ""; // Use 'value' directly for the input text
      console.log('query:', query);
  
      setFilteredPartyList(
        partyList.filter((party) =>
          party.PartyName.toLowerCase().startsWith(query) // Use startsWith instead of includes
        )
      );
    }, 300),
    [partyList]
  );
  

  const handleChange = (event, newValue) => {
    setFormData({
      ...formData,
      partyName: newValue ? newValue.PartyNameId : "", // Use PartyNameId for value
    });
  };

  return dropDown ? (
    <Autocomplete
      options={filteredPartyList} // Use filtered list
      getOptionLabel={(option) => option.PartyName || ""} // Display party name as label
      value={partyList.find((party) => party.PartyNameId === formData?.partyName) || null} // Match the selected value
      onChange={handleChange}
      onInputChange={handleSearchChange} // Handle input search changes
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Party Name"
          margin="normal"
          fullWidth
          required
          error={!!errors?.partyName}
          helperText={errors?.partyName}
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
      isOptionEqualToValue={(option, value) => option.PartyNameId === value?.PartyNameId} // Handle value equality
    />
  ) : (
    <TextField
      label="Party Name"
      value={formData.partyName} // Keep partyName from formData
      name="partyName" // Name attribute remains the same
      onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
      fullWidth
      margin="normal"
      required
      error={!!errors.partyName} // Refer to the correct error state
      helperText={errors.partyName} // Display helper text for validation
    />
  );
}

export default PartyDropdown;
