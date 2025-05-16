import React, { useEffect, useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CircularProgress, Typography, Box, Paper, Button, IconButton } from '@mui/material';
// import SalesReportFilter from '../sales report/SalesReportFilter';
import DownloadIcon from '@mui/icons-material/Download';
import TransporterReportFilter from './TransportReportFilter';
import { dev } from '../../utils/ApiUrl';
import { TransporterColumn } from './TransporterReportData/TransporterColumn';
import { TransporterRow } from './TransporterReportData/TransporterRow';
import { DataGrid } from '@mui/x-data-grid';
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import TransporterModal from './TransporterModal/TransporterModal';
import { TransporterExcel } from './TransporterReportData/TransporterExcel';

const TransporterReport = () => {

    const [isFilterVisible, setIsFilterVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [totalVechlies, setTotalVechlies] = useState(null);
    const [totalPriceAll, setTotalPriceAll] = useState(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [singleRowData, setSingleRowData] = useState(null);
    const [modalLoading, setModalLoading] = useState(false)

    const [formData, setFormData] = useState({
        transporter: "",
        fromDate: '',
        toDate: '',
        selectedLocationId: []
    })

    const handleOpen = (data) => {
        console.log(data, 'clciked');
        setModalLoading(true)
        setIsModalOpen(true)
        setSingleRowData(data)
    };
    const handleClose = () => setIsModalOpen(false);

    const toggleFilter = () => {
        setIsFilterVisible((prev) => !prev);
    };


    useEffect(() => {
        handleTransporterReport()
    }, []);

    const handleTransporterReport = async () => {
        const payload = {
            transporter: formData.transporter || "",
            fromDate: formData.fromDate || "",
            toDate: formData.toDate || "",
            workLocation: formData.selectedLocationId == "ALL" ? "" : formData.selectedLocationId || []

        }
        console.log("payload", payload);
        try {
            setLoading(true);
            setError(null)
            setData(null)
            const response = await fetch(`${dev}/vehicleIN/getTransporterSummary`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                setLoading(false);
                setError(result.message || null)
                setData(null)

                return;
            }
            if (result) {
                setTotalPriceAll(result.totalPriceAll);
                setTotalVechlies(result.totalVehiclesAll);
            }

            if (result.data.length > 0) {

                setData(result.data);
                const createRows = TransporterRow(result?.data, formData);
                const createColumn = TransporterColumn(result?.data, formData, handleOpen);

                setRows(createRows);
                setColumns(createColumn);


            } else {
                setData(null);

                setError("No data found ")
            }
            console.log("response", result);


            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.message || "Please Try again")
            setData(null)
            console.error("Error in fetching report:", error);

        }
    }


    const handleReportGenrate = async() => {
            try {
                const resp = await fetch(`${dev}/workLocation/work-location-list`, {
                    method: "GET",
                    headers: { "content-type": "application/json" },
                });
        
                const result = await resp.json();
        
                if (!resp.ok) {
                    toast.error(result.message || "Something went wrong");
                    return;
                }
        
                const workLocations = [
                    ...result.workLocations,
                    { WorkLocationId: "ALL", workLocationName: "All" },
                ];
        
                if (!data) {
                    return
                }
                const transformedRows = TransporterRow(data, formData);
                // console.log('transformedRows', transformedRows)
    
    
                const columnsConfig = TransporterColumn(data, formData);
                // console.log('columnsConfig', columnsConfig)
    
                TransporterExcel(transformedRows, columnsConfig, formData, workLocations).then(() => {
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
        
    // console.log("column", columns);
    console.log("rows", rows);
    return (
        <main className="main-container-report">
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
                                backgroundColor: '#fff',
                                borderRadius: '5px',
                                // padding: '0px 12px',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #ccc',
                                display: 'flex',
                                justifyContent: 'space-between', // Align items with space between them
                                alignItems: 'center',
                                // border:'2px solid green'
                            }}
                        >
                            <Typography
                                className="font-serif font-bold text-blue-500 text-xl"
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    textAlign: 'center', // Center-align text
                                    flex: 1, // Allow the text to take up remaining space
                                }}
                            >
                                Total Fright Cost: {`₹${totalPriceAll}`}
                            </Typography>
                            <Typography
                                className="font-serif font-bold text-blue-500 text-2xl"
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    textAlign: 'center', // Center-align text
                                    flex: 1, // Allow the text to take up remaining space
                                }}
                            >
                                Transporter Report
                            </Typography>
                            <Typography
                                className="font-serif font-bold  text-blue-500 text-xl"
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    textAlign: 'center', // Center-align text
                                    flex: 1, // Allow the text to take up remaining space
                                }}
                            >
                                Total Vichles: {totalVechlies}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                className="generate-report-button"
                                startIcon={<DownloadIcon />}
                                style={{
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                    marginLeft: 'auto', // Push button to the far right
                                    marginRight: '22px'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent click event from propagating to AccordionSummary
                                    handleReportGenrate();
                                }}
                            >
                                Generate Report
                            </Button>
                        </AccordionSummary>



                        {/* Filter Section */}
                        <AccordionDetails>

                            <TransporterReportFilter
                                handleTransporterReport={handleTransporterReport}
                                setFormData={setFormData}
                                formData={formData}
                            />

                        </AccordionDetails>
                    </Accordion>
                </section>
            </div>

            <section
                //  ${isFilterVisible  ? 'margin-remove' : ''}
                className={`table-section `}
            >
                {/* Loading state */}
                {loading && (
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
                {error && (
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
                        // onClick={fetchReport}
                        >
                            Retry
                        </Button>
                    </Box>
                )}

                {data && data.length > 0 && (
                    <div className='table-box '>
                        <Box className="h-[74vh]" sx={{ overflowX: "auto" }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={50}
                                rowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200, 250]}
                                sortingOrder={["asc", "desc"]}
                                filterMode="client"
                                getRowHeight={() => "100px"}
                                // getRowId={(row) => ${row.partyName}-${row.piNo || row.id}}
                                sx={{
                                    height: "70vh",
                                    width: "100%",
                                    overflowX: "auto", // Horizontal scrollbar enabled here
                                    "& .MuiDataGrid-root": {
                                        width: "100%",
                                    },
                                    "& .MuiDataGrid-columnHeader": {
                                        backgroundColor: "blue",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        fontSize: "13px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        color: "#343333",
                                        border: "1px solid #ddd",
                                        margin: '0',
                                        padding: '0'
                                    },
                                }}
                            />
                        </Box>
                    </div>
                )}
                {/* Data or empty state */}

            </section>
            {
                isModalOpen && <TransporterModal formData={formData} setModalLoading={setModalLoading}
                    modalLoading={modalLoading} data={singleRowData} open={isModalOpen} onClose={handleClose} />
            }
        </main>
    )
}

export default TransporterReport