import React, { useState, useEffect } from 'react'
import { dev } from '../../utils/ApiUrl'
import { toast } from 'react-toastify'
import { Autocomplete, TextField } from '@mui/material';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,

} from '@mui/material';
import { Button, Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DownloadIcon from '@mui/icons-material/Download';


function ReportFilter({ setFormData, formData, fetchReport, loadingg, handleReportGenrate }) {
  const [transporterList, setTransporterList] = useState(null)
  const [partyList, setPartyList] = useState(null)
  const [vehicleType, setVehicleType] = useState(null)
  const [loading, setLoading] = useState(null)
  const [piList, setPiList] = useState(null)
  const [personList, setSalesPersonList] = useState(null)
  const [workLocationList, setWorkLocationList] = useState(null)
  const [error, setError] = useState("");
  // console.log("transport: " , transporterList)
  const [party, setParty] = useState([])



  const fetchWorkLocationList = async () => {
    try {
      const resp = await fetch(
        `${dev}/workLocation/work-location-list`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const result = await resp.json();
      console.log('work location data', result);

      if (!resp.ok) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      // if (user.designation === 'Sales Executive' ) {
      //   setWorkLocationList([{ WorkLocationId: "ALL", workLocationName: "All" }]);
      //   // setSelectedLocationId("ALL"); 
      // } else {
      setWorkLocationList([
        ...result.workLocations,
        { WorkLocationId: "ALL", workLocationName: "All" },
      ]);


    } catch (error) {
      console.log("Error fetching work locations:", error.message);
      toast.error("Failed to fetch work locations");
    }
  };

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
        return;
      }
      const data = await resp.json();
      console.log("Transporter lis", data)
      setTransporterList(data.data || []);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const resp = await fetch(`${dev}/vehicle/vehicle-types`, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (!resp.ok) {
        return;
      }
      // console.log("Vehicle type",data)
      setVehicleType(data.vehicleTypes || []);
    } catch (error) {
      toast.error("Fetching vehicle types failed");
    }
  };



  const fetchPartyList = async () => {

    try {
      setLoading(true);
      const resp = await fetch(`${dev}/party/dropdownParty`, {
        method: "POST",
        body: JSON.stringify({ personId: formData.salesPerson?.map(item => item.personId) }),
        headers: {
          "content-type": "application/json",
        },
      });
      if (!resp.ok) {
        toast.error("Party list fetching failed");
        return;
      }
      const data = await resp.json();
      // console.log("Party list", data)
      setPartyList(data.data || []);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const getPiListForSalesPerson = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/sales/getAllSalesOrders`, {
        method: "POST",
        body: JSON.stringify({
          customerName: formData.partyName?.map(item => item.PartyNameId),
          personId: formData.salesPerson?.map(item => item.personId)
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        toast.error("PI list fetching failed");
        return;
      }
      const data = await resp.json();
      console.log('pis', data)
      setPiList(data.data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const fetchSalesPersnLists = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/user/dropdownSalesPerson`, {
        method: "POST",
        body: JSON.stringify({ partyNameId: formData.partyName?.map(item => item.PartyNameId) }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        setLoading(false);
        toast.error("Sales Person list fetching failed");
        return;
      }
      setLoading(false);
      const data = await resp.json()
      console.log('Person', data)
      setSalesPersonList(data.allList);
    } catch (error) {
      setLoading(false);
      console.log('fetching sales person failed', error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }

  };


  useEffect(() => {
    // Initial fetch for all data
    fetchTranspotterList();
    fetchVehicleTypes();
    fetchWorkLocationList();
  }, []);

  useEffect(() => {
    // When sales person is selected, fetch Party and PI List
    if (formData?.salesPerson) {
      fetchPartyList();
      getPiListForSalesPerson();
    }
  }, [formData?.salesPerson]);

  useEffect(() => {
    // When party is selected, fetch Sales Person and PI List
    if (formData?.partyName) {
      fetchSalesPersnLists();
      getPiListForSalesPerson();
    }
  }, [formData?.partyName]);

  useEffect(() => {
    // When both party and salesPerson are selected, fetch PI List
    if (formData?.partyName && formData?.salesPerson) {
      getPiListForSalesPerson();
    }
  }, [formData?.partyName, formData?.salesPerson]);

  const handleChange = (event, id) => {
    const { name, value } = event.target;


    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };





  const handleDropdownChange = (id, newValue) => {
    // Ensure that newValue is always an array, whether single or multiple selection
    const updatedValue = newValue && newValue.length
      ? newValue.map((value) => {
        const key = Object.keys(value).find((k) => k.toLowerCase().includes('id'));
        return value[key];
      })
      : [];  // Empty array if no values selected

    // Update the formData state
    setFormData((prevData) => ({
      ...prevData,
      [id]: updatedValue,  // Update the specific field in formData
    }));

    // If partyName is changed, also update the local 'party' state
    if (id === 'partyName') {
      setParty(updatedValue);
    }

    console.log(`Selected for ${id}:`, updatedValue);
  };



  // Date functionality-------------------------
  // Handle the date change logic
  const handleFromDateChange = (e) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      toDate:value
    }));
    // setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // setToDate(e.target.value);
  };


  // handle clear  
  const handleClear = () => {

    setFormData({
      freightCost: 'all',
      detention: 'all',
      vehicleStatus: 'all',
      vehicleRunningStatus: 'all',
      transpotter: [],
      partyName: [],
      vehicleTypes: [],
      workLocations: [],
      salesPerson: [],
      pis: [],
      fromDate: '',
      toDate: ''
    });


    // Logging to check the formData state after clearing
    // Explicitly reset the value of the Autocomplete component
    setTimeout(() => {
      setFormData((prevState) => ({
        ...prevState,
        partyName: [], // Clear the selected values
        transpotter: [],
        vehicleTypes: [],
        workLocations: [],
        salesPerson: [],
        pis: []
      }));
    }, 0); // This ensures the state update happens after the render cycle
    // console.log("After Clear:", formData.partyName); 
  }
  return (
    <div>
      {/* <section className=' flex justify-center items-center  '>
        <h1 className=' font-serif  font-bold text-red-600 text-2xl mb-2'>Vehilce Report</h1>
      </section> */}
      <section className=' flex flex-wrap gap-2  justify-start w-full '>

        <TextField
          label="From"
          type="date"
          sx={
            {
              // border:'2px solid yellow',
              width: '10%',
              // flex: 1,
              minWidth: '160px'
            }
          }
          // className=' w-1/5 border-2 border-yellow-600'
          name="fromDate"
          value={formData?.fromDate || ''}
          onChange={handleFromDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: new Date().toISOString().split('T')[0], // Today's date as max
          }}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="To"
          disabled={!formData?.fromDate}
          sx={
            {
              // border:'2px solid yellow',
              width: '10%',
              // flex: 1,
              minWidth: '160px'
            }
          }
          type="date"
          name="toDate"
          value={formData?.toDate || ''}
          onChange={handleToDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: formData?.fromDate, // Ensure 'To' date cannot be before 'From'
          }}
          fullWidth
          variant="outlined"
        />
        {error && (
          <Grid item xs={12}>
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          </Grid>
        )}

        {
          partyList && (
            <Autocomplete
              className=" min-w-44 w-2/12"
              multiple
              value={formData.partyName}  // Bind the value here
              id="partyName"
              options={partyList}
              getOptionLabel={(option) => option?.PartyName}  // Default to 'Unknown Party' if PartyName is missing

              isOptionEqualToValue={(option, value) => option?.PartyNameId === value?.PartyNameId} // Compare PartyNameId to identify the selected value
              disableCloseOnSelect
              renderInput={(params) => <TextField {...params} label="Party Name" />}
              onChange={(event, newValue) => {
                // Update formData with the selected values
                setFormData((prevState) => ({
                  ...prevState,
                  partyName: newValue, // Store the full selected objects
                }));
              }}

              getOptionSelected={(option, value) => option.PartyNameId === value.PartyNameId} // Compare by PartyNameId
              renderOption={(props, option) => (
                <li {...props} key={option?.PartyNameId || option?.PartyName}>
                  {option?.PartyName}
                </li>
              )}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === 'reset') {
                  // If reset is triggered, clear the selection
                  setFormData(prevState => ({
                    ...prevState,
                    partyName: [] // Clear selected values
                  }));
                } else {
                  // Ignore the text input and only update the selected value (PartyNameId)
                  // Check if the input is a valid selected value (check if it's part of the list)
                  const matchedParty = partyList.find(party => party.PartyName.toLowerCase() === newInputValue.toLowerCase());

                  if (matchedParty) {
                    // If the text matches a valid PartyName, set the PartyNameId in the form data
                    setFormData(prevState => ({
                      ...prevState,
                      partyName: [matchedParty.PartyNameId] // Store PartyNameId in the form data
                    }));
                  }
                }
              }}
            />


          )
        }
        {
          piList && (
            <Autocomplete
              multiple
              className=" min-w-44 w-2/12"
              id="pis"
              options={piList}
              value={formData.pis} // Ensure value is controlled by formData
              getOptionLabel={(option) => option?.piNo}
              isOptionEqualToValue={(option, value) => option?.salesOrderId === value?.salesOrderId}
              disableCloseOnSelect
              renderInput={(params) => <TextField {...params} label="PI Number " />}
              // onChange={(event, newValue) => handleDropdownChange('pis', newValue)}
              onChange={(event, newValue) => {
                // Update formData with the selected values
                setFormData((prevState) => ({
                  ...prevState,
                  pis: newValue, // Store the full selected objects
                }));
              }}
              // Ensure the options are unique by using the unique PartyNameId as the key
              key={(option) => option.salesOrderId}

            />
          )
        }

        {
          personList && (
            <Autocomplete
              multiple
              className=" min-w-44 w-2/12"
              id="salesPerson"
              value={formData.salesPerson} // Ensure value is controlled by form
              options={personList}
              getOptionLabel={(option) => option?.userName}
              isOptionEqualToValue={(option, value) => option?.personId === value.personId}
              disableCloseOnSelect
              renderInput={(params) => <TextField {...params} label=" Sales Executive  " />}
              // onChange={(event, newValue) => handleDropdownChange('salesPerson', newValue)}
              onChange={(event, newValue) => {
                // Update formData with the selected values
                setFormData((prevState) => ({
                  ...prevState,
                  salesPerson: newValue, // Store the full selected objects
                }));
              }}
              // Ensure the options are unique by using the unique PartyNameId as the key
              key={(option) => option.personId}

            />
          )
        }
        {
          transporterList && (
            <Autocomplete
              multiple
              className=" min-w-44 w-2/12"
              id="transpotter"
              value={formData.transpotter} // Ensure value is controlled by formData
              options={transporterList}
              getOptionLabel={(option) => option?.TransporterName}
              isOptionEqualToValue={(option, value) => option?.TransporterNameId === value?.TransporterNameId}
              disableCloseOnSelect
              renderInput={(params) => <TextField {...params} label=" Transpotter Name" />}
              // onChange={(event, newValue) => handleDropdownChange('transpotter', newValue)}
              onChange={(event, newValue) => {
                // Update formData with the selected values
                setFormData((prevState) => ({
                  ...prevState,
                  transpotter: newValue,
                }));
              }}

              key={(option) => option.TransporterNameId}

            />
          )
        }

        {
          vehicleType && (
            <Autocomplete
              multiple
              className=" min-w-44 w-2/12"
              value={formData.vehicleTypes}
              id="vehicle Type"
              options={vehicleType}
              getOptionLabel={(option) => option?.vehicleTypeName}
              isOptionEqualToValue={(option, value) => option?.vehicleTypeId === value.vehicleTypeId}
              disableCloseOnSelect
              renderInput={(params) => <TextField {...params} label=" Vehicle Type" />}
              // onChange={(event, newValue) => handleDropdownChange('vehicleTypes', newValue)}
              onChange={(event, newValue) => {
                // Update formData with the selected values
                setFormData((prevState) => ({
                  ...prevState,
                  vehicleTypes: newValue, // Store the full selected objects
                }));
              }}
              // Ensure the options are unique by using the unique PartyNameId as the key
              key={(option) => option.vehicleTypeId}

            />
          )
        }



        {
          workLocationList && (
            <Autocomplete
              multiple
              className=" min-w-44 w-2/12"
              id="workLocation"
              value={formData.workLocations}
              options={workLocationList}
              getOptionLabel={(option) => option?.workLocationName}
              isOptionEqualToValue={(option, value) => option?.WorkLocationId === value.WorkLocationId}
              disableCloseOnSelect
              renderInput={(params) => <TextField {...params} label="Work Location" />}
              onChange={(event, newValue) => {
                setFormData((prevState) => ({
                  ...prevState,
                  workLocations: newValue,
                }));
              }}
            />


          )
        }


      </section>
      <section className="w-full mt-2  flex flex-wrap  justify-between items-center">
        {/* Radio Inputs Section */}
        <div className="w-3/4 flex  gap-3 justify-start items-center">
          {/* Price Section */}
          <FormControl component="fieldset" sx={{
            padding: '6px 2px', // Add padding for a more spacious feel
            // margin: '10px auto', // Center the card horizontally
            // maxWidth: '300px', // Limit the width of the card
            borderRadius: '6px', // Rounded corners
            // border:'2px solid green',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
            backgroundColor: '#f0f8ff', // Light pastel blue background
            transition: 'all 0.3s ease-in-out', // Smooth transition on hover
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // Enhanced shadow on hover
              transform: 'scale(1.05)', // Slight zoom effect on hover
            },
          }}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#003366', // Dark blue for the label
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                marginBottom: '0px',
                letterSpacing: '0.5px', // Slightly increased letter spacing for a neat look
              }}
            >
              Price
            </FormLabel>
            <RadioGroup
              row
              name="freightCost"
              value={formData?.freightCost}
              onChange={handleChange}
              sx={{
                justifyContent: 'center',
                padding: '0',
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio sx={{ color: '#00796b', '&.Mui-checked': { color: '#00796b' } }} />} // Teal color for checked state
                label="All"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#003366', // Dark blue text color
                    fontFamily: 'serif',
                  },
                }}
              />

              <FormControlLabel
                value="yes"
                control={<Radio sx={{ color: '#00796b', '&.Mui-checked': { color: '#00796b' } }} />} // Teal color for checked state
                label="Yes"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#003366', // Dark blue text color
                    fontFamily: 'serif',
                  },
                }}
              />
              <FormControlLabel
                value="no"
                control={<Radio sx={{ color: '#00796b', '&.Mui-checked': { color: '#00796b' } }} />} // Teal color for checked state
                label="No"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#003366', // Dark blue text color
                    fontFamily: 'serif',
                  },
                }}
              />
            </RadioGroup>
          </FormControl>




          {/* Detention Section */}
          <FormControl component="fieldset" sx={{
            padding: '6px 2px', // Add padding for a spacious feel
            borderRadius: '6px', // Rounded corners for smooth edges
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
            backgroundColor: '#F5F5F5', // Light grey background
            transition: 'all 0.3s ease-in-out', // Smooth transition on hover
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // Enhanced shadow on hover
              transform: 'scale(1.05)', // Slight zoom effect on hover
            },
          }}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#1A237E', // Navy blue for heading
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                marginBottom: '8px',
                letterSpacing: '0.5px', // Slightly increased letter spacing for a neat look
              }}
            >
              Detention
            </FormLabel>
            <RadioGroup
              row
              name="detention"
              value={formData?.detention}
              onChange={handleChange}
              sx={{
                justifyContent: 'space-evenly', // Even space distribution
                padding: '0',
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio sx={{ color: '#1A237E', '&.Mui-checked': { color: '#1A237E' } }} />} // Navy blue for radio button
                label="All"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#1A237E', // Navy blue for label text
                    fontFamily: 'serif',
                  },
                }}
              />
              <FormControlLabel
                value="yes"
                control={<Radio sx={{ color: '#1A237E', '&.Mui-checked': { color: '#1A237E' } }} />} // Navy blue for radio button
                label="Yes"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#1A237E', // Navy blue for label text
                    fontFamily: 'serif',
                  },
                }}
              />
              <FormControlLabel
                value="no"
                control={<Radio sx={{ color: '#1A237E', '&.Mui-checked': { color: '#1A237E' } }} />} // Navy blue for radio button
                label="No"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#1A237E', // Navy blue for label text
                    fontFamily: 'serif',
                  },
                }}
              />
            </RadioGroup>
          </FormControl>

          {/* Running Status Section */}
          <FormControl component="fieldset" sx={{
            padding: '6px 2px', // Add padding for a spacious feel
            borderRadius: '6px', // Rounded corners for smooth edges
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
            backgroundColor: '#E0F2F1', // Light pastel mint green background
            transition: 'all 0.3s ease-in-out', // Smooth transition on hover
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // Enhanced shadow on hover
              transform: 'scale(1.05)', // Slight zoom effect on hover
            },
          }}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#006F5F', // Deep teal for heading
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                marginBottom: '8px',
                letterSpacing: '0.5px', // Slightly increased letter spacing for neat look
              }}
            >
              Running Status
            </FormLabel>
            <RadioGroup
              row
              name="vehicleRunningStatus"
              value={formData?.vehicleRunningStatus}
              onChange={handleChange}
              sx={{
                justifyContent: 'space-evenly', // Even space distribution
                padding: '0',
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio sx={{ color: '#006F5F', '&.Mui-checked': { color: '#006F5F' } }} />} // Deep teal for radio button
                label="All"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#006F5F', // Deep teal for label text
                    fontFamily: 'serif',
                  },
                }}
              />
              <FormControlLabel
                value="delay"
                control={<Radio sx={{ color: '#006F5F', '&.Mui-checked': { color: '#006F5F' } }} />} // Deep teal for radio button
                label="Delay"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#006F5F', // Deep teal for label text
                    fontFamily: 'serif',
                  },
                }}
              />
              <FormControlLabel
                value="before"
                control={<Radio sx={{ color: '#006F5F', '&.Mui-checked': { color: '#006F5F' } }} />} // Deep teal for radio button
                label="Before"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#006F5F', // Deep teal for label text
                    fontFamily: 'serif',
                  },
                }}
              />
            </RadioGroup>
          </FormControl>



          {/* Vehicle Status Section */}
          <FormControl component="fieldset" sx={{
            padding: '6px 2px', // Add padding for spacious feel
            // margin: '10px auto', // Center the card horizontally
            // maxWidth: '320px', // Limit the width of the card for better appearance
            borderRadius: '6px', // Rounded corners for a smooth look
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
            backgroundColor: '#F5F5F5', // Soft neutral beige background
            transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // Deeper shadow on hover
              transform: 'scale(1.05)', // Slight zoom on hover
            },
          }}>
            <FormLabel
              component="legend"
              sx={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#1E3A8A', // Rich blue shade for heading
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                marginBottom: '8px',
                letterSpacing: '0.5px', // Neat letter spacing for a clean look
              }}
            >
              Vehicle Status
            </FormLabel>
            <RadioGroup
              row
              name="vehicleStatus"
              value={formData?.vehicleStatus}
              onChange={handleChange}
              sx={{
                justifyContent: 'space-evenly', // Even space distribution between radio buttons
                padding: '0',
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio sx={{ color: '#1E3A8A', '&.Mui-checked': { color: '#1E3A8A' } }} />} // Blue for radio button
                label="All"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#1E3A8A', // Blue color for label text
                    fontFamily: 'serif',
                  },
                }}
              />
              <FormControlLabel
                value="Delivered"
                control={<Radio sx={{ color: '#1E3A8A', '&.Mui-checked': { color: '#1E3A8A' } }} />} // Blue for radio button
                label="Delivered"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#1E3A8A', // Blue for label text
                    fontFamily: 'serif',
                  },
                }}
              />
              <FormControlLabel
                value="Out"
                control={<Radio sx={{ color: '#1E3A8A', '&.Mui-checked': { color: '#1E3A8A' } }} />} // Blue for radio button
                label="Out"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#1E3A8A', // Blue for label text
                    fontFamily: 'serif',
                  },
                }}
              />
            </RadioGroup>
          </FormControl>


        </div>

        {/* Buttons Section */}
        <div className="w-1/4  justify-center gap-3  items-center flex ">
          <button
            className="bg-gray-400 w-24 text-white font-semibold px-2 py-2  shadow hover:bg-gray-600"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="bg-red-500 w-24 text-white font-semibold px-2 py-2  shadow hover:bg-red-700"
            onClick={fetchReport}
            disabled={loadingg}
          >
            Search
          </button>

        </div>
      </section>
      <section className=' flex justify-end items-center py-1 px-3 '>
        {/* Right side: Generate Report Button */}
        <Button
          variant="contained"
          color="primary"
          className="generate-report-button"
          startIcon={<DownloadIcon />}
          // disabled={fetchState.data?.length === 0}
          style={{
            backgroundColor: '#1976d2', // Blue color for the button
            color: '#fff', // White text color
            padding: '4px 8px', // Reduced padding for smaller size
            borderRadius: '4px', // Slightly smaller border radius
            fontSize: '12px', // Smaller text size
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Lighter shadow effect
          }}
          onClick={handleReportGenrate}
        >
          Generate Report
        </Button>

      </section>

    </div>
  )
}

export default ReportFilter
