import React, { useState, useEffect } from 'react'
import { dev } from '../../utils/ApiUrl'
import { toast } from 'react-toastify'
import { Autocomplete, TextField } from '@mui/material';
import Checkbox from "@mui/material/Checkbox";

import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,

} from '@mui/material';
import { Tooltip,  Paper, IconButton, InputLabel, Select, Box, Menu, MenuItem,   Divider } from "@mui/material";
import { Button, Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DownloadIcon from '@mui/icons-material/Download';
import { createColumnsForSalesReport } from './SalesColumn';
import { salesReportRows } from './salesRow';
import { useSelector } from "react-redux";
// import InputLabel from "@mui/material/InputLabel";


const SalesReportFilter = ({ showTopSalesPerson, setShowTopSalesPerson, formData, setFormData, handleSalesReport }) => {
    // 550 Wp-Non DCR-Mono-PERC
    // Monofacial 
     const { user } = useSelector((state) => state.user);
    const [partyList, setPartyList] = useState([])
    const [panelTypeList, setPanelTypeList] = useState([])
    const [watageList, setWatageList] = useState([])
    const [type, setTypes] = useState(['DCR', 'Non DCR'])
    const [loading, setLoading] = useState(null)
    const [piList, setPiList] = useState([])
    const [personList, setSalesPersonList] = useState([])

    const [error, setError] = useState("");
    // console.log("transport: " , transporterList)
    const [party, setParty] = useState([])
    const [initialLoad, setInitialLoad] = useState(true); // Track the first render
    const [ispartySelected, setIsPartySelected] = useState(false)
    const [isSalesPersonSelected, setSalesPersonSelected] = useState(false)
      const [designation, setDesignation] = useState('');
      const [department, setDepartment] = useState('');
       const [workLocations, setWorkLocations] = useState([]);
        const [selectedLocationId, setSelectedLocationId] = useState(user?.designation === 'Super Admin' ? 'ALL' : user?.workLocation);
    // console.log('ispartySelected', ispartySelected)
    // console.log('isSalesPersonSelected', isSalesPersonSelected)
      useEffect(() => {
        const department = localStorage.getItem('department');
        const designation = localStorage.getItem('designation');
        setDesignation(designation);
        setDepartment(department);
        // if (designation === "Sales Executive"  ) {
        //   getStatus("out"); 
        // }
      }, []);
    const fetchPartyList = async () => {

        try {
            setLoading(true);
            const resp = await fetch(`${dev}/party/dropdownParty`, {
                method: "POST",
                body: JSON.stringify({ personId: formData?.salesPerson }),
                headers: {
                    "content-type": "application/json",
                },
            });
            if (!resp.ok) {
                // toast.error("Party list fetching failed");
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
      useEffect(() => {
        const fetchWorkLocationLists = async () => {
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
    
            if (!resp.ok) {
              toast.error(result.message || "Something went wrong");
              return;
            }
    
            if (user.designation === 'Sales Executive' ) {
              setWorkLocations([{ WorkLocationId: "ALL", workLocationName: "All" }]);
              setSelectedLocationId("ALL"); 
            } else {
              setWorkLocations([
                ...result.workLocations,
                { WorkLocationId: "ALL", workLocationName: "All" },
              ]);
            }
    
          } catch (error) {
            console.log("Error fetching work locations:", error.message);
            toast.error("Failed to fetch work locations");
          }
        };
        fetchWorkLocationLists();
      }, []);



    const fetchSalesPersnLists = async () => {
        try {
            setLoading(true);
            const resp = await fetch(`${dev}/user/dropdownSalesPerson`, {
                method: "POST",
                body: JSON.stringify({ partyNameId: formData?.partyName }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!resp.ok) {
                setLoading(false);
                setSalesPersonList([])
                // toast.error("Sales Person list fetching failed");
                return;
            }
            setLoading(false);
            const data = await resp.json()
            // console.log('Person data', data)
            setSalesPersonList(data.allList);
        } catch (error) {
            setLoading(false);
            console.log('fetching sales person failed', error);
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
                    customerName: formData.partyName ? [formData.partyName] : [],
                    personId: formData.salesPerson ? [formData.salesPerson] : []
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!resp.ok) {
                // toast.error("PI list fetching failed");
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

    useEffect(() => {

        if (!isSalesPersonSelected) {
            fetchSalesPersnLists()
        }
        getPiListForSalesPerson();

    }, [formData?.partyName,]);

    useEffect(() => {
        if (!ispartySelected) {
            fetchPartyList()

        }
        getPiListForSalesPerson();

    }, [formData?.salesPerson])


    const fetchWatageList = async () => {
        try {
            setLoading(true);
            const resp = await fetch(`${dev}/watage/getWatageList`, {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!resp.ok) {
                setLoading(false);
                // toast.error("Watage list fetching failed");
                return;
            }
            const data = await resp.json();
            // console.log('watage data', data)
            setWatageList(data.data || null);
        } catch (error) {
            setLoading(false);
            console.log('fetching watage failed', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const fetchPanelTypeList = async () => {
        try {
            setLoading(true);
            const resp = await fetch(`${dev}/sales/getPanelDetails`, {
                method: "POSt",

                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!resp.ok) {
                setLoading(false);
                // toast.error("Panel Type list fetching failed");
                return;
            }
            const data = await resp.json();
            // console.log('panel type data', data)
            setPanelTypeList(data.data || null);
        } catch (error) {
            setLoading(false);
            console.log('fetching panel type failed', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWatageList()
        fetchPanelTypeList()
    }, [])
    useEffect(() => {
        // When both party and salesPerson are selected, fetch PI List
        if (formData?.partyName && formData?.salesPerson) {
            getPiListForSalesPerson();
        }
    }, [formData?.partyName, formData?.salesPerson]);

    const handleFromDateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            toDate: value, // Update toDate to match fromDate initially
        }));
    };

    const handleToDateChange = (e) => {
        const { name, value } = e.target;
        const currentDate = new Date().toISOString().split('T')[0];

        if (new Date(value) >= new Date(formData.fromDate) && new Date(value) <= new Date(currentDate)) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            alert(`Invalid date. 'To' date must be between '${formData.fromDate}' and '${currentDate}'.`);
        }
    };
    const handleWorkLocationChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            selectedLocationId: typeof value === "string" ? value.split(",") : value // Ensure array format
        }));
    };



    const handleClear = () => {


        setFormData({
            partyName: '',
            salesPerson: '',
            fromDate: '',
            toDate: '',
            type: '',
            panelType: '',
            wattage: '',
            piNo: '',
            selectedLocationId: [] 
        });
        // handleSalesReport('clear')

        ;
    }
    // https://www.umanlogistics.info/api/sales/getPanelDetails  ---- POst
    // https://www.umanlogistics.info/api/watage/getWatageList ----Get


    return (
        <div>
            {/* <section className=' flex justify-center items-center  '>
        <h1 className=' font-serif  font-bold text-red-600 text-2xl mb-2'>Vehilce Report</h1>
      </section> */}
            <section className='flex flex-wrap gap-4 justify-start w-full'>
            <Grid item>
            <FormControl sx={{ marginRight: "0px", minWidth: 200 }}>
                <InputLabel
                    id="work-location-label"
                    sx={{ fontSize: "13px", fontWeight: "bold" }}
                >
                    Unit
                </InputLabel>
                <Select
                    labelId="work-location-label"
                    id="work-location"
                    multiple // Enable multi-selection
                    value={designation === "Sales Executive" ? ["ALL"] : formData.selectedLocationId}
                    onChange={handleWorkLocationChange} // Updates formData as an array
                    renderValue={(selected) => 
                        Array.isArray(selected) ? selected.map(id => 
                            workLocations.find(loc => loc.WorkLocationId === id)?.workLocationName || id
                        ).join(", ") : selected
                    }
                    disabled={designation === 'Sales Executive'}
                    sx={{
                        fontSize: "10px",
                        height: "auto",
                        "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "4px",
                        },
                    }}
                >
                    {workLocations.map((location) => (
                        <MenuItem
                            key={location.WorkLocationId}
                            value={location.WorkLocationId}
                            sx={{
                                backgroundColor: "#ffffff",
                                color: "#333333",
                                fontSize: "10px",
                                "&:hover": {
                                    backgroundColor: "#e0e0e0",
                                    color: "#000000",
                                },
                            }}
                        >
                            <Checkbox checked={formData.selectedLocationId.includes(location.WorkLocationId)} />
                            {location.workLocationName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
                
                <TextField
                    label="From"
                    type="date"
                    sx={{
                        width: '10%',
                        minWidth: '160px'
                    }}
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
                    sx={{
                        width: '10%',
                        minWidth: '160px'
                    }}
                    type="date"
                    name="toDate"
                    value={formData?.toDate || ''}
                    onChange={handleToDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: formData?.fromDate, // Ensure 'To' date cannot be before 'From'
                        max: new Date().toISOString().split('T')[0], // Today's date as max
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

                {partyList && (
                    <Autocomplete
                        className="min-w-44 w-2/12"
                        id="partyName"
                        value={partyList.find((option) => option.PartyNameId === formData.partyName) || null} // Map ID to object
                        options={partyList}
                        getOptionLabel={(option) => option?.PartyName || ''} // Avoid undefined labels
                        isOptionEqualToValue={(option, value) => option?.PartyNameId === value?.PartyNameId}
                        renderOption={(props, option, index) => (
                            <li {...props} key={`${option.PartyNameId}-${index}`}>
                                {option.PartyName}
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Party Name" />}
                        onChange={(event, newValue) => {
                            setFormData((prevState) => ({
                                ...prevState,
                                partyName: newValue?.PartyNameId || '', // Store ID in state
                            }));
                            if (newValue?.PartyNameId) {
                                setIsPartySelected(true)
                            } else {
                                setIsPartySelected(false)
                            }

                        }}
                    />
                )}

                {personList && (
                    <Autocomplete
                        className="min-w-44 w-2/12"
                        id="salesPerson"
                        value={personList.find((option) => option.personId === formData.salesPerson) || null} // Map ID to object
                        options={personList}
                        getOptionLabel={(option) => option?.userName || ''} // Avoid undefined labels
                        isOptionEqualToValue={(option, value) => option?.personId === value?.personId}
                        renderInput={(params) => <TextField {...params} label="Sales Executive" />}
                        onChange={(event, newValue) => {
                            setFormData((prevState) => ({
                                ...prevState,
                                salesPerson: newValue?.personId || '', // Store ID in state
                            }));
                            if (newValue?.personId) {
                                setSalesPersonSelected(true)
                            } else {
                                setSalesPersonSelected(false)
                            }
                        }}
                    />
                )}
                {
                    piList && (
                        <Autocomplete
                            className="min-w-44 w-2/12"
                            id="pis"
                            options={piList}
                            disabled={formData?.type || formData.wattage || formData.panelType}
                            value={
                                formData.piNo
                                    ? piList?.find((option) => option?.piNo === formData.piNo)
                                    : null // Clear the selection if piNo is empty
                            }

                            getOptionLabel={(option) => option?.piNo}
                            isOptionEqualToValue={(option, value) => option?.piNo === value?.piNo}
                            disableCloseOnSelect
                            renderInput={(params) => <TextField {...params} label="PI Number " />}
                            renderOption={(props, option, index) => (
                                <li {...props} key={`${option.salesOrderId}-${index}`}>
                                    {option.piNo}
                                </li>
                            )}
                            onChange={(event, newValue) => {
                                // Update formData with the selected value (single object)
                                setFormData((prevState) => ({
                                    ...prevState,
                                    piNo: newValue ? newValue.piNo : null, // Store only the salesOrderId or null if none selected
                                }));
                            }}
                            // key={(option) => option.piNo}
                            key="autocomplete-piNo" // Ensure rerender on key change
                        />
                    )
                }


                {/* {panelTypeList  && (
                    <Autocomplete
                        className="min-w-44 w-2/12"
                        id="panelType"
                        disabled={formData?.type || formData.wattage || formData.piNo}
                        value={
                            panelTypeList.find(
                                (option) =>
                                    option.moduleType === formData.panelType?.moduleType &&
                                    option.monobi === formData.panelType?.monobi
                            ) || null
                        } // Match based on stored moduleType and monobi
                        options={panelTypeList}
                        getOptionLabel={(option) =>
                            `${option.wattage} - ${option.PanelDcr_nondcr} - ${option.moduleType} - ${option.monobi}`
                        }
                        renderOption={(props, option, index) => (
                            <li {...props} key={`${option.panelDetailsId}-${index}`}>
                                {`${option.wattage} - ${option.PanelDcr_nondcr} - ${option.moduleType} - ${option.monobi}`}
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Panel Type" />}
                        onChange={(event, newValue) => {
                            setFormData((prevState) => ({
                                ...prevState,
                                panelType: newValue
                                    ? { moduleType: newValue.moduleType, monobi: newValue.monobi, wattage: newValue.wattage, type: newValue.PanelDcr_nondcr }
                                    : null, // Store only moduleType and monobi
                            }));
                        }}
                    />
                )
                } */}
                {panelTypeList && (
                    <Autocomplete
                        className="min-w-44 w-2/12"
                        id="panelType"
                        disabled={formData?.type || formData.wattage || formData.piNo}
                        value={panelTypeList.find(
                            (option) => option.panelDetailsId === formData.panelTypeId
                        ) || null} // Match based on panelDetailsId
                        options={panelTypeList}
                        getOptionLabel={(option) =>
                            `${option.wattage} - ${option.PanelDcr_nondcr} - ${option.moduleType} - ${option.monobi}`
                        }
                        renderOption={(props, option, index) => (
                            <li {...props} key={`${option.panelDetailsId}-${index}`}>
                                {`${option.wattage} - ${option.PanelDcr_nondcr} - ${option.moduleType} - ${option.monobi}`}
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Panel Type" />}
                        onChange={(event, newValue) => {
                            setFormData((prevState) => ({
                                ...prevState,
                                panelType: newValue
                                    ? { moduleType: newValue.moduleType, monobi: newValue.monobi, wattage: newValue.wattage, type: newValue.PanelDcr_nondcr }
                                    : null, 
                                panelTypeId: newValue ? newValue.panelDetailsId : null, // Store only the panelDetailsId
                            }));
                        }}
                    />
                )}


                {watageList && (
                    <Autocomplete
                        className="min-w-44 w-2/12"
                        id="wattage"
                        disabled={formData?.panelType || formData.piNo}
                        value={watageList.find((option) => option.watageName === formData.wattage) || null} // Map ID to object
                        options={watageList}
                        getOptionLabel={(option) => option.watageName || ''} // Avoid undefined labels
                        renderInput={(params) => <TextField {...params} label="Wattage" />}
                        onChange={(event, newValue) => {
                            setFormData((prevState) => ({
                                ...prevState,
                                wattage: newValue?.watageName || '', // Store ID in state
                            }));
                        }}
                    />
                )}


                {type && (
                    <Autocomplete
                        className="min-w-44 w-2/12"
                        id="type"
                        disabled={formData?.panelType || formData.piNo}
                        options={type}
                        getOptionLabel={(option) => option}
                        value={formData.type || null}
                        renderInput={(params) => <TextField {...params} label="Type" />}
                        onChange={(event, newValue) => {
                            setFormData((prevState) => ({
                                ...prevState,
                                type: newValue || null,
                            }));
                        }}
                    />
                )}
                <div className="flex  justify-end gap-5 px-10  ">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClear}
                        style={{
                            borderColor: '#d32f2f',
                            color: '#d32f2f',
                            textTransform: 'capitalize',
                            padding: '6px 22px',
                            fontSize: '14px',
                            minWidth: '100px'
                        }}
                    >
                        Clear
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSalesReport}
                        style={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            textTransform: 'capitalize',
                            padding: '6px 22px',
                            fontSize: '14px',
                            // marginLeft: '8px'
                            minWidth: '100px'
                        }}
                    >
                        Search
                    </Button>
                </div>

            </section>




        </div>
    )
}

export default SalesReportFilter
