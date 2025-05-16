import React, { useState, useEffect } from 'react'
import { dev } from '../../utils/ApiUrl'
import { toast } from 'react-toastify'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    TextField,
    Button
} from '@mui/material'

const TransporterReportFilter = ({ handleTransporterReport, setFormData, formData }) => {
    const [workLocations, setWorkLocations] = useState([]);
    const [transporterList, setTransporterList] = useState([]);

    // Fetch work locations and transporters
    useEffect(() => {
        const fetchWorkLocationLists = async () => {
            try {
                const resp = await fetch(`${dev}/workLocation/work-location-list`, {
                    method: "GET",
                    headers: {
                        "content-type": "application/json",
                    },
                });
                const result = await resp.json();

                if (!resp.ok) {
                    toast.error(result.message || "Something went wrong");
                    return;
                }

                setWorkLocations([
                    ...result.workLocations,
                    { WorkLocationId: "ALL", workLocationName: "All" },
                ]);
            } catch (error) {
                console.log("Error fetching work locations:", error.message);
                toast.error("Failed to fetch work locations");
            }
        };

        const fetchTransporterList = async () => {
            try {
                const resp = await fetch(`${dev}/transporter/getTransporter`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                });
                const result = await resp.json();

                if (!resp.ok) {
                    toast.error(result.message || "Something went wrong");
                    return;
                }

                setTransporterList(result.data || []);
            } catch (error) {
                console.log("Error fetching transporters:", error.message);
                toast.error("Failed to fetch transporters");
            }
        };

        fetchWorkLocationLists();
        fetchTransporterList();
    }, []);

    const handleWorkLocationChange = (e) => {
        const { value } = e.target;
        const updatedFormData = {
            ...formData,
            selectedLocationId: typeof value === "string" ? value.split(",") : value
        };
        setFormData(updatedFormData);
        // onFilterChange(updatedFormData);
    };

    const handleFromDateChange = (e) => {
        const { value } = e.target;
        const updatedFormData = {
            ...formData,
            fromDate: value,
            toDate: value, // Update toDate to match fromDate initially
        };
        setFormData(updatedFormData);
        // onFilterChange(updatedFormData);
    };

    const handleToDateChange = (e) => {
        const { value } = e.target;
        const currentDate = new Date().toISOString().split('T')[0];

        if (new Date(value) >= new Date(formData.fromDate) && new Date(value) <= new Date(currentDate)) {
            const updatedFormData = {
                ...formData,
                toDate: value,
            };
            setFormData(updatedFormData);
            // onFilterChange(updatedFormData);
        } else {
            alert(`Invalid date. 'To' date must be between '${formData.fromDate}' and '${currentDate}'.`);
        }
    };

    const handleTransporterChange = (e) => {
        const updatedFormData = {
            ...formData,
            transporter: e.target.value
        };
        setFormData(updatedFormData);
        // onFilterChange(updatedFormData);
    };

    const handleClear = () => {
        const clearedFormData = {
            selectedLocationId: [],
            fromDate: '',
            toDate: '',
            transporter: ''
        };
        setFormData(clearedFormData);
        // onFilterChange(clearedFormData);
    };

    useEffect(() => {
        if (
            formData.selectedLocationId.length === 0 &&
            formData.fromDate === '' &&
            formData.toDate === '' &&
            formData.transporter === ''
        ) {
            handleTransporterReport();
        }
    }, [formData]);

    return (
        <div className="flex flex-wrap gap-4 justify-start w-full">
            {/* Unit/Work Location Filter */}
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="work-location-label">
                    Unit
                </InputLabel>
                <Select
                    labelId="work-location-label"
                    id="work-location"
                    multiple
                    value={formData.selectedLocationId}
                    onChange={handleWorkLocationChange}
                    renderValue={(selected) =>
                        selected.map(id =>
                            workLocations.find(loc => loc.WorkLocationId === id)?.workLocationName || id
                        ).join(", ")
                    }
                >
                    {workLocations.map((location) => (
                        <MenuItem
                            key={location.WorkLocationId}
                            value={location.WorkLocationId}
                        >
                            <Checkbox
                                checked={formData.selectedLocationId.includes(location.WorkLocationId)}
                            />
                            {location.workLocationName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* From Date Filter */}
            <TextField
                label="From"
                type="date"
                sx={{ minWidth: 160 }}
                name="fromDate"
                value={formData.fromDate || ''}
                onChange={handleFromDateChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                    max: new Date().toISOString().split('T')[0],
                }}
                variant="outlined"
            />

            {/* To Date Filter */}
            <TextField
                label="To"
                type="date"
                disabled={!formData.fromDate}
                sx={{ minWidth: 160 }}
                name="toDate"
                value={formData.toDate || ''}
                onChange={handleToDateChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                    min: formData.fromDate,
                    max: new Date().toISOString().split('T')[0],
                }}
                variant="outlined"
            />

            {/* Transporter Filter */}
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="transporter-label">
                    Transporter
                </InputLabel>
                <Select
                    labelId="transporter-label"
                    id="transporter"
                    value={formData.transporter || ''} // Ensure a default empty string
                    onChange={handleTransporterChange}
                    label="Transporter"
                >
                    {transporterList.map((transporter) => (
                        <MenuItem
                            key={transporter.TransporterNameId}
                            value={transporter.TransporterNameId} // Use TransporterNameId as the value
                        >
                            {transporter.TransporterName} {/* Display TransporterName */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Clear Filters Button */}
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleClear}
                sx={{ alignSelf: 'center' }}
            >
                Clear Filters
            </Button>

            <Button
                variant="contained"
                color="primary"
                onClick={handleTransporterReport}
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
    )
}

export default TransporterReportFilter