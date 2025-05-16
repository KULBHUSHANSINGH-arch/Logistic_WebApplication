import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import {
    Box,
    IconButton,
    Menu,
    MenuItem,

    Dialog, DialogContent,
    Icon,
    Button,
    Typography,
    TextField,
    CircularProgress,
    InputLabel,
    Select,

} from "@mui/material";
import { ClipLoader } from 'react-spinners';

import { Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download"; // Import the download icon
import { convertToIndianTime } from '../vehicleReport/vehicleReportCoulumns';
import { DataGrid } from '@mui/x-data-grid';
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,

} from '@mui/material';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MeetingMap from './MeetingMap';
import { useSelector } from 'react-redux';
import { dev } from '../../utils/ApiUrl';

import downloadImage from '../../utils/downloadFile';
import { genrateExcelMeetingReport } from './excelOfMeeting';
import { Autocomplete, } from '@mui/material';
// making column--------------------------------------------------------
let createColumns = (handleMapClick, key) => {
    // console.log('key: ' + key);
    const columns = [
        {
            field: "meetingPerson",
            headerName: "Meeting With",
            minWidth: 150,
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                <Box
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                    }}
                >
                    {params.value || "N/A"}
                </Box>
            ),
        },

        {
            field: "Address",
            headerName: "Meeting Address",
            minWidth: 120,
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                <Box
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                    }}
                >
                    {params.value || "N/A"}
                </Box>
            ),
        },
        {
            field: "companyName",
            headerName: "Company Name",
            minWidth: 150,
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                <Box
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                    }}
                >
                    {params.value || "N/A"}
                </Box>
            ),
        },
        {
            field: "fromDate",
            headerName: key === "Meeting" ? "Meeting Start date" : "Travelling Start Date",
            minWidth: 150,
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                <Box
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                    }}
                >
                    {params.value || "N/A"}
                </Box>
            ),
        },
        {
            field: "toDate",
            headerName: key === "Meeting" ? "Meeting Completed Date" : "Travelling End Date",
            minWidth: 150,
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                <Box
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                    }}
                >
                    {params.value || "N/A"}
                </Box>
            ),
        },
        {
            field: "meetingUrl",
            headerName: key === "Meeting" ? "Meeting Picture" : "Travelling Start Point",
            minWidth: 150,
            flex: 1,
            sortable: true,
            renderCell: (params) => {
                const [open, setOpen] = useState(false);
                const url = params.value; // Get the URL from the cell value

                // Function to handle popup open
                const handleOpen = () => {
                    setOpen(true);
                };

                // Function to handle popup close
                const handleClose = () => {
                    setOpen(false);
                };
                // Function to handle download


                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                        }}
                    >
                        {/* Display the URL or "N/A" if no URL is available */}

                        {/* If the URL is available, show the view and download buttons */}
                        {url && (
                            <>
                                {/* View Button */}
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleOpen}
                                    sx={{ marginRight: "8px" }}
                                >
                                    View
                                </Button>

                                {/* Download Icon */}
                                <Button
                                    onClick={() => downloadImage(url)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        color: "blue",
                                    }}
                                >
                                    <DownloadIcon />
                                </Button>

                                {/* Dialog Popup */}
                                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                                    <DialogContent>
                                        <div className="">
                                            {/* Close Button - Positioned at the top right */}
                                            <Button
                                                onClick={handleClose}
                                                color="warning"
                                                variant="outlined"
                                                sx={{ float: 'right', marginBottom: '10px' }} // Aligns the button to the right
                                            >
                                                Close
                                            </Button>


                                            {/* Image Preview - Below the button */}
                                            <div style={{ marginTop: '20px' }}> {/* Space between button and image */}
                                                <img
                                                    src={url}
                                                    alt="Preview"
                                                    style={{
                                                        width: "100%",  // Full width of the modal
                                                        height: "auto", // Maintains aspect ratio
                                                        maxHeight: "500px",  // Set a max height for the image
                                                    }}
                                                />
                                            </div>
                                        </div>

                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                    </Box>
                );
            },
        },
        {
            field: "vistingCardUrl",
            headerName: key === "Meeting" ? "Visiting Card" : "Travelling End Point",
            minWidth: 150,
            flex: 1,
            sortable: true,
            renderCell: (params) => {
                const [open, setOpen] = useState(false);
                const url = params.value; // Get the URL from the cell value

                // Function to handle popup open
                const handleOpen = () => {
                    setOpen(true);
                };

                // Function to handle popup close
                const handleClose = () => {
                    setOpen(false);
                };
                // Function to handle download


                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                        }}
                    >
                        {/* Display the URL or "N/A" if no URL is available */}


                        {/* If the URL is available, show the download icon */}
                        {url && (
                            <>
                                {/* View Button */}
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleOpen}
                                    sx={{ marginRight: "8px" }}
                                >
                                    View
                                </Button>

                                {/* Download Icon */}
                                <Button
                                    onClick={() => downloadImage(url)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        color: "blue",
                                    }}
                                >
                                    <DownloadIcon />
                                </Button>

                                {/* Dialog Popup */}
                                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                                    <DialogContent>
                                        <div className="">
                                            {/* Close Button - Positioned at the top right */}
                                            <Button
                                                onClick={handleClose}
                                                color="warning"
                                                variant="outlined"
                                                sx={{ float: 'right', marginBottom: '10px' }} // Aligns the button to the right
                                            >
                                                Close
                                            </Button>


                                            {/* Image Preview - Below the button */}
                                            <div style={{ marginTop: '20px' }}> {/* Space between button and image */}
                                                <img
                                                    src={url}
                                                    alt="Preview"
                                                    style={{
                                                        width: "100%",  // Full width of the modal
                                                        height: "auto", // Maintains aspect ratio
                                                        maxHeight: "500px",  // Set a max height for the image
                                                    }}
                                                />
                                            </div>
                                        </div>


                                    </DialogContent>
                                </Dialog>

                            </>
                        )}
                    </Box>
                );
            },
        },
        {
            field: "createdBy",
            headerName: "Sales Executive Name",
            minWidth: 150,
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                <Box
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                    }}
                >
                    {params.value || "N/A"}
                </Box>
            ),
        },

        {
            field: "notes",
            headerName: "Notes",
            minWidth: 100,
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                <Tooltip title={params.value || "N/A"} placement="top">
                    <Box
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                            cursor: "pointer", // Indicate that it's interactive
                        }}
                    >
                        {params.value || "N/A"}
                    </Box>
                </Tooltip>
            ),
        },

        {
            field: "Action",
            headerName: key === "Meeting" ? "Meeting Location" : "Travelling Location",
            minWidth: 60,
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                    }}
                >
                    {/* Tooltip for Map Icon */}
                    <Tooltip let title={key === "Meeting" ? "Meeting Location" : "Travelling Location"} placement="top">
                        <IconButton
                            onClick={() => handleMapClick(params.row)}
                            sx={{
                                color: "red", // Set icon color to red
                                cursor: "pointer",
                            }}
                        >
                            <LocationOnIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }





    ];

    if (key === "Travelling") {

        // Remove Meeting-specific columns
        //    columns = columns.filter(
        //     (col) =>
        //         !["meetingPerson", "Address", "companyName"].includes(col.field)
        // );
        columns.splice(1, 1); // Remove "Company"
        columns.splice(1, 1); // Remove "Meeting Address"
        columns.splice(0, 1); // Remove "Meeting With"
        console.log('colour columns', columns);
        // Add Travelling-specific columns
        columns.unshift(
            {
                field: "travellingFrom",
                headerName: "Travelling From",
                minWidth: 150,
                flex: 1,
                sortable: true,
                renderCell: (params) => (
                    <Box
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                        }}
                    >
                        {params.value || "N/A"}
                    </Box>
                ),
            },
            {
                field: "travellingTo",
                headerName: "Travelling To",
                minWidth: 150,
                flex: 1,
                sortable: true,
                renderCell: (params) => (
                    <Box
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                        }}
                    >
                        {params.value || "N/A"}
                    </Box>
                ),
            }
        );
    }

    return columns;
};
// Travelling

//   making rows ----------------------------------------------------------------
const createRows = (meetingLists) => meetingLists.map((meeting) => {
    // Helper function to format the date


    return {
        id: meeting.meetingId,
        Address: meeting.Address,
        companyName: meeting.companyName,
        createdBy: meeting.createdBy,
        createdOn: meeting.createdOn,
        endLatitude: meeting.endLatitude,
        endLongitude: meeting.endLongitude,
        fromDate: meeting.fromDate,
        latitude: meeting.latitude,
        longitude: meeting.longitude,
        meetingPerson: meeting.meetingPerson,
        meetingUrl: meeting.meetingUrl,
        notes: meeting.notes,
        status: meeting.status,
        toDate: meeting.toDate,
        updatedBy: meeting.updatedBy,
        updatedOn: meeting.updatedOn,
        vistingCardUrl: meeting.vistingCardUrl,
        travellingFrom: meeting?.travellingFrom || '',
        travellingTo: meeting?.travellingTo || '',
        type: meeting?.type || '',


    };
});

// Search function to filter vehicle list
const searchInData = (data, inputValue) => {
    const normalizedInputValue = inputValue.trim().toLowerCase().replace(/\s+/g, "");
    if (!normalizedInputValue) return [...data]; // Return all data if input is empty

    return [...data].filter((item) => {
        return Object.keys(item).some((key) => {
            const value = item[key];
            if (value === null || value === undefined) return false;
            const normalizedValue = value.toString().replace(/\s+/g, "").trim().toLowerCase();
            return normalizedValue.includes(normalizedInputValue);
        });
    });
};


const MeetingList = () => {
    const [loading, setLoading] = useState(false);
    const [meetings, setMeetings] = useState(null); // Null indicates data is not yet fetched
    const [error, setError] = useState(null);
    const [meetingstatus, setMeetingStatus] = useState('start')
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const { user } = useSelector(state => state.user)
    const [dropdownValue, setDropdownValue] = useState('Meeting');  // Default value is 'Meeting'
    const [salesPersonsList, setSalesPersonsList] = useState([])
    const [personId, setPersonId] = useState('')

    // console.log('loading', loading)
    // console.log('meetings', meetings)
    // console.log('error', error)
    // console.log('loading', loading)
    const handleDropdownChange = (event) => {
        setDropdownValue(event.target.value);
    };
    const handleDropdownChangeOfPerson = (newPersonId) => {
        // Update the state with the selected person's ID
        setPersonId(newPersonId);

        // You can also perform other actions if needed, like calling an API or updating other parts of the UI
        // console.log('Selected Sales Person ID:', newPersonId);
    };

    const [isMapOpen, setIsMapOpen] = useState(false); // State for popup visibility
    const [mapData, setMapData] = useState(null); // State for map data
    // console.log('meeting map data', mapData)
    const fetchMeetingList = async () => {
        try {
            setLoading(true);
            setError(null)
            setMeetings(null);
            const resp = await fetch(`${dev}/meeting/getMeeting`, {
                method: "POST",
                body: JSON.stringify({
                    status: meetingstatus,
                    personId: personId ? personId : user.personId,
                    type: dropdownValue,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!resp.ok) {
                setLoading(false);
                toast.error("meeting List list fetching failed");
                setError(null)
                return;
            }

            const data = await resp.json()
            // console.log('Meeting List', data)
            if (data.data && data.data.length > 0) {
                console.log('Meeting List found ', data)
                setError(null)
                setMeetings(data.data);
            } else {
                setError(data.message)
                setMeetings(null);
            }

            if (data.data && data?.data?.length > 0) {


                const rows = createRows(data.data)

                let columns = createColumns(handleMapClick, dropdownValue)

                setRows(rows)
                setColumns(columns)
                setLoading(false);
            }
            setLoading(false);
        } catch (error) {
            setError(null)
            setLoading(false);
            setMeetings(null);
            console.log('Error Occured In fetching Meeting List failed', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
            // setError(null)
        }
    }

    useEffect(() => {
        fetchMeetingList();
    }, [meetingstatus, dropdownValue, personId]);

    const fetchPersonList = async () => {
        try {
            setLoading(true);

            const resp = await fetch(`${dev}/user/getSalesPersons`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!resp.ok) {
                setLoading(false);
                toast.error("Person List  fetching failed");

                return;
            }

            const data = await resp.json()
            console.log('data', data);

            setSalesPersonsList(data.allList || [])

            setLoading(false);
        } catch (error) {

            setLoading(false);

            console.log('Error Occured In Person  List failed', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
            // setError(null)
        }
    }

    const handleSearchInput = (value) => {
        setSearchValue(value);

        if (meetings.length > 0) {
            const data = value ? searchInData(meetings, value) : meetings;
            setFilteredData(data);

            const filteredRows = createRows(data);  // Update rows based on filtered data
            const filteredColumns = createColumns(handleMapClick);  // Update columns if necessary

            setRows(filteredRows);
            setColumns(filteredColumns);
        }
    };





    const handleMapClick = (data) => {
        // console.log('map open')
        // Static coordinates and tooltips for this example
        setMapData(data);
        setIsMapOpen(true);
    };

    const handleClose = () => {
        setIsMapOpen(false);
    };

    useEffect(() => {
        fetchPersonList()

    }, [])

    const handleChange = (e) => {
        const { value, name } = e.target
        setMeetingStatus(value)
    }


    const handleReportGenrate = () => {
        try {
            const transformedRows = createRows(meetings);
            const columnsConfig = createColumns(handleMapClick, dropdownValue);

            // Filter out "actions" column
            const filteredColumnsConfig = columnsConfig.filter(
                (col) => col.field !== "Action"
            );



            // Export to Excel
            genrateExcelMeetingReport(
                transformedRows,
                filteredColumnsConfig,
                meetingstatus,
                dropdownValue
            )
                .then(() => {
                    toast.success("Excel file generated and downloaded successfully!");
                })
                .catch((error) => {
                    console.error("Error exporting Excel file:", error);
                    toast.error("Failed to export Excel file. Please try again.");
                });
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error("An unexpected error occurred. Please try again later.");
        }
    }

    const sharedStyles = {
        height: '56px', // Ensure uniform height
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
        borderColor: 'gray',
},
    '&:hover fieldset': {
        borderColor: 'darkgreen',
},
    '&.Mui-focused fieldset': {
        borderColor: 'red',
},
},
    '& input': {
        fontSize: '18px',
    fontFamily: 'serif',
    color: '#003366',
},
};




    return (
        <div className=" ">
            <div className='px-3  bg-gray-200 flex justify-center items-center h-10 text-red-600 text-xl font-sans font-bold'>
                {dropdownValue === 'Travelling' ? 'Travelling List' : 'Meeting List'}   </div>
            <div className='flex justify-start gap-3 items-center w-full  px-3 py-2'>

                {/* Search Input */}
                

                <TextField
                    placeholder="Search..."
                    onChange={(event) => handleSearchInput(event.target.value)}
                    value={searchValue}
                    variant="outlined"
                    sx={{
                        width: '20%',
                        ...sharedStyles,
                    }}
                />

                <FormControl
                    variant="outlined"
                    sx={{
                        width: '18%',
                        ...sharedStyles,
                    }}
                >
                    <Autocomplete
                        id="sales-person-select"
                        value={salesPersonsList.find((person) => person.personId === personId) || null}
                        onChange={(event, newValue) => handleDropdownChangeOfPerson(newValue ? newValue.personId : null)}
                        options={salesPersonsList}
                        getOptionLabel={(option) => option.userName}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Sales Person"
                                variant="outlined"
                                sx={{
                                    fontSize: '20px',
                                    fontFamily: 'serif',
                                    color: '#003366',
                                }}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.personId === value?.personId}
                    />
                </FormControl>

                <FormControl
                    variant="outlined"
                    sx={{
                        width: '15%',
                        marginLeft: '40px',
                        ...sharedStyles,
                    }}
                >
                    <InputLabel id="dropdown-label">Type</InputLabel>
                    <Select
                        labelId="dropdown-label"
                        value={dropdownValue}
                        onChange={handleDropdownChange}
                        label="Type"
                        sx={{
                            fontSize: '20px',
                            fontFamily: 'serif',
                            color: '#003366',
                        }}
                    >
                        <MenuItem value="Meeting">Meeting</MenuItem>
                        <MenuItem value="Travelling">Travelling</MenuItem>
                    </Select>
                </FormControl>




                {/* Form Control with Radio Buttons */}
                <FormControl
                    component="fieldset"
                    sx={{
                        padding: '0px 2px',
                        borderRadius: '6px',
                        marginLeft: '30px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f0f8ff',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    <RadioGroup
                        row
                        name="meetingstatus"
                        value={meetingstatus}
                        onChange={handleChange}
                        sx={{
                            justifyContent: 'center',
                            padding: '0',
                            display: 'flex',
                            gap: '20px',
                        }}
                    >
                        <FormControlLabel
                            value="start"
                            control={<Radio sx={{ color: '#00796b', '&.Mui-checked': { color: '#00796b' } }} />} // Teal color for checked state
                            label="Start"
                            sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '20px',
                                    fontWeight: 500,
                                    color: '#003366', // Dark blue text color
                                    fontFamily: 'serif',
                                },
                            }}
                        />
                        <FormControlLabel
                            value="Completed"
                            control={<Radio sx={{ color: '#00796b', '&.Mui-checked': { color: '#00796b' } }} />} // Teal color for checked state
                            label="Completed"
                            sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '20px',
                                    fontWeight: 500,
                                    color: '#003366', // Dark blue text color
                                    fontFamily: 'serif',
                                },
                            }}
                        />
                    </RadioGroup>
                </FormControl>

                {/* Export Button */}
                <Button
                    variant="contained"
                    onClick={handleReportGenrate}
                    sx={{
                        backgroundColor: '#00796b',
                        color: 'white',
                        textTransform: 'capitalize',
                        marginLeft: '50px',
                        fontFamily: 'serif',
                        fontSize: '14px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            backgroundColor: '#005a4f',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                        },
                    }}
                >
                    Export
                </Button>

            </div>

            {loading && (
                <div className="w-full flex justify-center items-center">
                    <ClipLoader color="#e04816" loading={loading} size={50} />
                </div>
            )}

            {error && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        padding: '30px',
                        maxWidth: '400px',
                        margin: 'auto',
                    }}
                >
                    <div
                        style={{
                            fontSize: '40px',
                            color: '#FF6347',
                            marginBottom: '20px',
                        }}
                    >
                        <span role="img" aria-label="no-meetings">📅</span>
                    </div>
                    <Typography
                        variant="h6"
                        style={{
                            color: '#2d3748',
                            fontWeight: 600,
                            fontSize: '1.25rem',
                            textAlign: 'center',
                            marginTop: '10px',
                        }}
                    >
                        {dropdownValue ? ' Travelling Not Found' : 'Meetings Not Found'}
                    </Typography>
                </div>
            )}

            {!loading && !error && meetings && meetings?.length > 0 && (
                <div className="h-[74vh]">


                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={50}
                        rowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200, 250]}
                        sortingOrder={['asc', 'desc']}
                        filterMode="client"
                        getRowHeight={() => '100px'}
                        sx={{
                            height: '70vh',
                            width: '100%',
                            overflowX: 'auto',
                            '& .MuiDataGrid-columnHeader': {
                                backgroundColor: 'black',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                textAlign: 'center',
                            },
                            '& .MuiDataGrid-cell': {
                                fontSize: '13px',
                                color: '#343333',
                                border: '1px solid #ddd',
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                            },
                        }}
                    />



                </div>
            )}
            {/* Map Popup */}
            <MeetingMap open={isMapOpen} onClose={handleClose} mapData={mapData} />
        </div>
    )
}

export default MeetingList
