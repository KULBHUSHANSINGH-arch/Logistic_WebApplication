import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, RadioGroup, FormControlLabel, Radio, Button, Grid, Typography, Box, CircularProgress } from '@mui/material';
import EnquiryTable from './EnquiryTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { url } from '../../utils/ApiUrl';
import { rows } from './row';
import { Column } from './Column';
import { useSelector } from 'react-redux';
import { genrateExcelReport } from '../../utils/genrateExcelReport'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,

  FormControl,


  InputLabel,
  MenuItem,

  Select,

} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { toast } from 'react-toastify';

import { keyframes } from '@mui/system';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;


const globalSearch = (data, searchValue) => {
  if (!searchValue) return data; // If no search value is provided, return the full data set.

  return data.filter((item) => {
    return Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchValue.toLowerCase())
    );
  });
};

const EnquiryHeader = ({ personList, filterData, setfilterData, setSearchTerm, setStatus, searchTerm, status, handleExcelReport,fetchData }) => {

  const navigate = useNavigate()
  const [errors, setErrors] = useState({ from: "", to: "" });
  const [enquiryTypes, setEnquiryTypes] = useState([]);
  const [designation, setDesignation] = useState('');
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);


  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const userDepartment = localStorage.getItem("department");
    const designation = localStorage.getItem('designation')

    setDesignation(designation);
    // setPersonId(currentUser);
    // setDepartment(userDepartment);

    // console.log('Current User', currentUser);
    // console.log('Current Department', userDepartment);
  }, []);

  useEffect(() => {
    // Fetch data from the API
    const fetchEnquiryTypes = async () => {
      try {
        const response = await fetch(
          "https://enquiry.umanerp.com/api/enquiry/getOrderTypes"
        );
        const data = await response.json();
        if (data.success) {
          setEnquiryTypes(data.data); // Update state with the fetched data
        } else {
          console.error("Failed to fetch enquiry types");
        }
      } catch (error) {
        console.error("Error fetching enquiry types:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchEnquiryTypes();
  }, []);


  const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  return (
    <Accordion 
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: '10px 20px',
        }}
      >
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Search Leads"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            flexGrow: 1,
          }}
        >
          Lead List
        </Typography>
        <Grid item xs={12} md={6} style={{marginRight:"50px"}}>
            {/* Status Filter */}
            <RadioGroup
              row
              value={status}
              onChange={handleStatusChange}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {/* <FormControlLabel value="Pending" control={<Radio />} label="Pending" /> */}
              <FormControlLabel value="Assigned" control={<Radio />} label="Assigned" />
              <FormControlLabel value="Followup-Pending" control={<Radio />} label="Followup-Pending" />
              <FormControlLabel value="Followup" control={<Radio />} label="Followup" />
              <FormControlLabel value="Resolve" control={<Radio />} label="Resolve" />
              <FormControlLabel value="Reject" control={<Radio />} label="Reject" />
            </RadioGroup>
          </Grid>
        <Box
          sx={{
            display: 'flex',
            gap: 5,
            paddingRight: '10px'
          }}
        >
          {/* <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate('/enquiry')}
          >
            Add Leads
          </Button> */}
          <Button
            onClick={handleExcelReport}
            variant="contained"
            color="secondary"
            size="small"
          >
            Export
          </Button>
        </Box>
      </AccordionSummary>
     { designation=="Super Admin"? <AccordionDetails>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {/* Search Field */}
          {/* <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Search Leads"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid> */}

          {/* From Date */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="From Date"
              type="date"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filterData.from}
              name="from"
              inputProps={{
                max: currentDate, // Restrict "From Date" to not exceed the current date
              }}
              onChange={(e) => {

                const value = e.target.value;
                setfilterData((prev) => ({ ...prev, from: value, to: '' }));
              
               // Reset "To Date" when "From Date" changes
              }}
            />
          </Grid>

          {/* To Date */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="To Date"
              type="date"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filterData.to}
              name="to"
              inputProps={{
                min: filterData.from || '', // Restrict "To Date" to be no earlier than "From Date"
                max: currentDate, // Restrict "To Date" to not exceed the current date
              }}
              onChange={(e) => {
                const value = e.target.value;
                setfilterData((prev) => ({ ...prev, to: value }));
           
              }}
            />
          </Grid>

          {/* Dropdown Field */}
          <Grid item xs={12} sm={6} md={4}>
      <Autocomplete
        options={enquiryTypes}
        getOptionLabel={(option) => option.name} // Use the `name` field for display
        value={
          enquiryTypes.find((option) => option.id === filterData?.enquiry) || null
        }
        onChange={(event, newValue) => {
          console.log("Selected value:", newValue);
          setfilterData((prev) => ({
            ...prev,
            enquiry: newValue ? newValue.id : "",
          }));
       
        }}
        // loading={loading} // Show loading state if necessary
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            placeholder="Select Leads Type"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9fafb",
              },
            }}
          />
        )}
      />
    </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              options={personList}
              getOptionLabel={(option) => option.userName} // Adjust this if your option structure is different
              value={
                personList.find((option) => option.personId === filterData?.salesPerson) || null
              }
              onChange={async (event, newValue) =>{
                console.log("Changeee");
                
             
                setfilterData((prev) => ({
                  ...prev,
                  salesPerson: newValue ? newValue.personId : '',
                  
                }))
              
                
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  placeholder="Select Sales Executive"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f9fafb',
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Status Filter */}
          {/* <Grid item xs={12} md={6}>
          
            <RadioGroup
              row
              value={status}
              onChange={handleStatusChange}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >

              <FormControlLabel value="Assigned" control={<Radio />} label="Assigned" />
              <FormControlLabel value="Followup" control={<Radio />} label="Followup" />
              <FormControlLabel value="Resolve" control={<Radio />} label="Resolve" />
              <FormControlLabel value="Reject" control={<Radio />} label="Reject" />
            </RadioGroup>
          </Grid> */}
        </Grid>
      </AccordionDetails>:""}
    </Accordion>


  );
};

const EnquiryList = () => {
  const { user } = useSelector((state) => state.user)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('Assigned');

  const [rowData, setRowData] = useState([])
  const [columnData, setColumnData] = useState([])
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [salesPerson, setSalesPerson] = useState('')
  const [personList, setSalesPersonList] = useState([])
  const [userList, setUserList] = useState([])
 const [AdditionalNotes,setAdditionalNotes] = useState();
 const [updateStatus,setUpdatedStatus] = useState();
  const [filterData, setfilterData] = useState({
    from: '',
    to: '',
    salesPerson: '',
    enquiry:""

  })
  // console.log('filterData', filterData)
  const [salesPersonError, setSalesPersonError] = useState(null)
  const [notesError, setNotesError] = useState("");



  const navigate = useNavigate()
  const handleOpen = (data,updatedStatus) => {
    // console.log('data', data)
    setOpen(true);
    setSelectedRow(data)
    setUpdatedStatus(updatedStatus);
  };

  const handleClose = () => {
    setOpen(false);
    setAdditionalNotes("");
  };

  // edit handler 
  const handleEdit = (data) => {
    navigate('/enquiry', { state: { data: data } })
  }


  // console.log('loading', loading)
  const fetchSalesPersnLists = async () => {
    try {

      const resp = await fetch(`https://www.umanlogistics.info/api/user/dropdownSalesPerson`, {
        method: "POST",
        body: JSON.stringify({ partyNameId: '' }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {

        setSalesPersonList([])
        // toast.error("Sales Person list fetching failed");
        return;
      }

      const data = await resp.json()
      // console.log('Person data', data)
      setSalesPersonList(data.allList);
    } catch (error) {

      console.log('fetching sales person failed', error);

    } 

  };

  useEffect(() => {
    fetchSalesPersnLists()
  }, [])
  const fetchData = async () => {
    // console.log("Changeeel");
    try {
      // console.log("Changeeem");
      setLoading(true)

      setData(null)
      setError(null)
      const response = await fetch(`${url}/enquiry/getEnquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "personId": user?.personId,
          "status": status,
          "fromDate":filterData.from,
          "toDate":filterData.to,
          "SalesPerson":filterData.salesPerson,
          "enquiryType":filterData.enquiry
        }),
      })

      const result = await response.json()


      if (!response.ok) {
        toast.error(result.message || 'Fethcing Failed')
        setLoading(false)
        setError(result.message)
        setData(null)
        return
      }


      if (result?.data?.length === 0 || result.customerList?.length === 0) {

        setLoading(false)
        setError('No Leads found')
        setData(null)
        return
      }


      setData(result?.customerList)
      if (result.customerList?.length > 0) {
        const rowsData = rows(result.customerList || [])
        const columnsData = Column(result.customerList || [], handleOpen, status, user?.designation, handleEdit,fetchData,setStatus)
        setColumnData(columnsData)
        setRowData(rowsData)
      }

      setLoading(false)


    } catch (error) {
      // console.log('error In fetching  data', error)
      toast.error(error.message || 'Fethcing Failed')
      setLoading(false)
      setData(null)
    }
  }

  useEffect(() => {
    fetchData()
  }, [status,salesPerson,filterData])

  useEffect(() => {
    const filteredData = globalSearch(data, searchTerm);
    setRowData(filteredData);
  }, [searchTerm, data]); // Re-run when `searchValue` or `data` changes


  const handleChangeDropDown = (e) => {
    const { name, value } = e.target;
    setSalesPerson(value)
    if (value) {
      setSalesPersonError("")
    }
  }


  const handleAssign = async () => {
    if (!AdditionalNotes) {
      setNotesError("Notes are required.");
      return;
    }

   
 
    try {
      setLoading(true)
      const payload = {
        customerId: selectedRow?.customerId,
        reason: AdditionalNotes,
        status: updateStatus,
        personId: user?.personId,
        approveOrRejectDate: Date.now(),
      }
      const response = await fetch(`${url}/enquiry/addEnquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) {
        toast.error(result?.message || 'Assigning Failed')
        setLoading(false)
        return
      }


      toast.success(  `${updateStatus} Successfully`)
      setLoading(false)
      handleClose()
      fetchData()
      setSalesPerson('')
      setAdditionalNotes('')
      setStatus(updateStatus);


    } catch (error) {
      // console.log('error in assign', error)
      toast.error('Assigning Failed')
      setLoading(false)
    }
  }

  const handleExcelReport = async () => {
    try {
      const filterColumn = columnData.filter(column => column.field !== 'actions')
      await genrateExcelReport(rowData, filterColumn, '', false, status)
    } catch (error) {
      console.log('error in genrateExcelReport', error)
    }
  }



  return (
    <div className='bg-gray-200 min-h-[90vh]'>
      <EnquiryHeader personList={personList} filterData={filterData} setfilterData={setfilterData} handleExcelReport={handleExcelReport} status={status} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setStatus={setStatus} fetchData ={fetchData} />
      {/* You can render EnquiryTable here */}

      {
        error && (

          <Typography variant="h6" color="error"
            sx={{
              bgcolor: 'white',
              textAlign: 'center',
              fontSize: '20px',
              color: 'red',
              padding: '10px 0px',

              marginTop: '20px',

              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.15)',
            }}>
            {error}
          </Typography>
        )
      }
      {
        loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'start',
              height: '20vh',
              marginTop: '50px'

            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                border: '5px solid rgba(255, 255, 255, 0.3)',
                borderTop: '5px solid white',
                borderRadius: '50%',
                animation: `${spin} 1s linear infinite`,
              }}
            />
          </Box>
        )
      }


      {
        data?.length > 0 && (

          <div className=' h-full'>
            <EnquiryTable rowData={rowData} columnData={columnData} />
          </div>
        )}
{
  open && (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%", // Ensures it takes full width on smaller screens
          maxWidth: "600px", // Max width to limit the size
          minWidth: "300px", // Minimum width
          margin: "auto", // Centers the dialog
        },
      }}
    >
      <DialogContent>
        {/* Main Heading (Centered at the Top) */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          {`${updateStatus} Lead`}
        </h2>

        {/* Label Above the Input Field */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
           Notes
          </label>
          <textarea
            fullWidth
            variant="outlined"
            className={`w-full min-h-[100px] p-2 rounded-md focus:outline-none focus:ring-2 ${
              notesError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            style={{ border: '1px solid black' }} // Inline style for border color
            rows={3}
            placeholder="Enter your notes here..."
            value={AdditionalNotes}
            onChange={(e) => {
              setAdditionalNotes(e.target.value);
              setNotesError(""); // Clear error when user starts typing
            }}
           
           
          />
           {notesError && (
              <p className="text-red-500 text-sm mt-1">{notesError}</p>
            )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button disabled={loading} onClick={handleAssign} color="warning">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}


    </div>
  );
};

export default EnquiryList;


