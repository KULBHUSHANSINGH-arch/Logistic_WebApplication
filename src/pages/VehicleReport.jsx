import React, { useState, useEffect, useRef } from 'react'
import ReportFilter from '../components/vehicleReport/ReportFilter'
import { dev } from '../utils/ApiUrl'
import { CircularProgress, Typography, Box, Paper, Button, IconButton } from '@mui/material';
// import ReportTable from './ReportTable';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DownloadIcon from '@mui/icons-material/Download';
import ReportTable from '../components/vehicleReport/ReportTable';
import '../components/vehicleReport/report.css'
import TuneIcon from '@mui/icons-material/Tune'; // Import the Tune icon
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { createColumnsForReport } from '../components/vehicleReport/vehicleReportCoulumns';
import { transformVehicleReportToRows } from '../components/vehicleReport/vehicleReportRow';
import { genrateExcelReport } from '../components/vehicleReport/excelReport';
import { toast } from 'react-toastify';
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// {
//   handleClick,
//   handleEdit,
//   handleImageClick,
//   userDesignation: user.designation, // Make sure to pass designation like this
//   userDepartment: user.department, // Make sure to pass designation like this
//   vehicleStatus: status,
//   setOpenUploadModal,
//   setUploadType,
//   setUploadData,
//   handlePdfClick,
//   handleExcelClick,
//   handleMaplick,
//   handleDeliveredClick,
// }

function VehicleReport({ isCollapsed }) {
  const [formData, setFormData] = useState({
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
  })
  console.log('form data', formData)
  const [isFilterVisible, setIsFilterVisible] = useState(true); // Toggle filter visibility
  const filterSectionRef = useRef(null); // Reference for the filter section

  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };

  // const[loadingg,setloadingg] = useState(false)
  // const[data,setData]=useState([])
  // const[error,setError] = useState(null)
  // console.log('formData', formData)
  // /api/vehicleIN/getFilterReport

  const [fetchState, setFetchState] = useState({
    loading: true, // Initially loading
    error: null, // No error initially
    data: null, // No data initially
  });

  const fetchReport = async () => {
    const payload = {
      freightCost: formData.freightCost,
      detention: formData.detention === "all" ? "" : formData.detention,
      vehicleStatus: formData.vehicleStatus === "all" ? "" : formData.vehicleStatus,
      vehicleRunningStatus: formData.vehicleRunningStatus === "all" ? "" : formData.vehicleRunningStatus,
      transpotter: formData.transpotter?.map(item => item.TransporterNameId),
      partyName: formData.partyName?.map(item => item.PartyNameId),
      vehicleTypes: formData.vehicleTypes?.map(item => item.vehicleTypeId),
      workLocations: formData.workLocations?.map(item => item.WorkLocationId),
      salesPerson: formData.salesPerson?.map(item => item.personId),
      pis: formData.pis?.map(item => item.salesOrderId),
      fromDate: formData.fromDate,
      toDate: formData.toDate,
    };

    setFetchState({ loading: true, error: null, data: null });

    try {
      const response = await fetch(`${dev}/vehicleIN/getFilterReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setFetchState({ loading: false, error: result.message, data: null });
        return;
      }

      setFetchState({ loading: false, error: null, data: result.data || [] });
    } catch (error) {
      console.error("Error in fetching report:", error);
      setFetchState({ loading: false, error: "Something went wrong", data: null });
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleReportGenrate = () => {
    try {
      if (!fetchState.data) {
        return
      }
      const transformedRows = transformVehicleReportToRows(fetchState.data);


      const columnsConfig = createColumnsForReport();

      genrateExcelReport(transformedRows, columnsConfig, formData).then(() => {
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




  return (
    <main className="main-container-report">
      {/* ${isCollapsed ? 'expanded' : 'collapsed */}
      {/* wrapper-of-head-filter */}
      <div className={``}>
        {/* Header with toggle button */}
        <section className="header-report ">

          {/* Left side: Arrow button */}
          <Accordion expanded={isFilterVisible}>
            <AccordionSummary
              expandIcon={
                isFilterVisible ? (
                  <ArrowDropUpIcon style={{ color: '#1976d2' }} />
                ) : (
                  <ArrowDropDownIcon style={{ color: '#1976d2' }} />
                )
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
              onClick={toggleFilter}
              style={{
                backgroundColor: '#fff', // White background for the box
                borderRadius: '5px', // Rounded corners
                padding: '0px 12px', // Reduced padding around the icon and text for a tighter layout
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Light shadow for a card effect
                border: '1px solid #ccc', // Subtle border for the "card" look
                display: 'flex', // Use flexbox to center content
                justifyContent: 'center', // Center both the icon and the text
                alignItems: 'center', // Center content vertically
              }}
            >
              <Typography
                className="font-serif font-bold text-red-600 text-lg" // Adjusted text size (text-lg)
                style={{
                  margin: 0, // Remove default margin
                }}
              >
                Vehicle Report
              </Typography>
            </AccordionSummary>


            {/* Filter Section */}
            <AccordionDetails>
              <div className="w-full ">
                <ReportFilter
                  setFormData={setFormData}
                  formData={formData}
                  fetchReport={fetchReport}
                  loadingg={fetchState.loading}
                  error={fetchState.error}
                  handleReportGenrate={handleReportGenrate}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </section>
      </div>

      {/* Table Section */}
      <section
        //  ${isFilterVisible  ? 'margin-remove' : ''}
        className={`table-section `}
      >
        {/* Loading state */}
        {fetchState.loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "start",
              height: "100%",
            }}
          >
            <CircularProgress size={50} color='red' />
          </Box>
        )}

        {/* Error state */}
        {!fetchState.loading && fetchState.error && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Paper
              sx={{
                padding: 2,
                backgroundColor: "pink",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="error">
                {fetchState.error}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Data or empty state */}
        {!fetchState.loading && !fetchState.error && (
          <Box sx={{}} className='table-box'>
            {fetchState.data && fetchState.data.length > 0 ? (
              <ReportTable reportData={fetchState.data} />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="24vh"
                width="100%" // Ensures responsiveness
                maxWidth="400px" // Optional: restricts max width to a card-like size
                bgcolor="#f9f9f9" // Light background color for a card feel
                textAlign="center"
                p={3}
                boxShadow={3} // Material-UI shadow level for subtle depth
                borderRadius="12px" // Rounded corners for a card-like effect
                mx="auto" // Centers the card horizontally
              >
                <SentimentDissatisfiedIcon
                  style={{ fontSize: 50, color: "grey", marginBottom: 16 }}
                />
                <Typography
                  variant="h6"
                  color="textSecondary"
                  gutterBottom
                >
                  Data not found
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 16 }}
                  onClick={fetchReport}
                >
                  Retry
                </Button>
              </Box>

            )}
          </Box>
        )}
      </section>
    </main>
  )
}

export default VehicleReport
{/* Right side: Generate Report Button */ }
{/* <Button
  variant="contained"
  color="primary"
  className="generate-report-button"
  startIcon={<DownloadIcon />}
  disabled={fetchState.data?.length === 0}
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
</Button> */}