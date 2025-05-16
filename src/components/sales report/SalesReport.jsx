import React, { useState, useEffect, useRef } from 'react'

// import { dev } from '../utils/ApiUrl'
import { dev } from '../../utils/ApiUrl';
import { CircularProgress, Typography, Box, Paper, Button, IconButton } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import { salesReportRows } from './salesRow'
import { createColumnsForSalesReport } from './SalesColumn';

// import '../components/vehicleReport/report.css'
// import '../../components/vehicleReport/report.css'
import TuneIcon from '@mui/icons-material/Tune'; // Import the Tune icon
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { toast } from 'react-toastify';
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaleReportTable from './SaleReportTable';
import SalesReportFilter from './SalesReportFilter';
import { salesExcelReport } from './salesExcel';
import SalesModal from './salesModal/SalesModal';

function SalesReport({ isCollapsed }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [singleRowData, setSingleRowData] = useState(null);
    const [modalLoading, setModalLoading] = useState(false)

    const handleOpen = (data) => {
        console.log(data, 'clciked');
        setModalLoading(true)
        setIsModalOpen(true)
        setSingleRowData(data)
    };
    console.log('obj',{h:'hii'})
    const handleClose = () => setIsModalOpen(false);
    const [formData, setFormData] = useState({
        partyName: '',
        salesPerson: '',
        fromDate: '',
        toDate: '',
        type: "",
        panelType: '',
        panelTypeId: '',
        wattage: '',
        piNo: '',
        selectedLocationId: [] 
    })
    console.log('form data', formData)
    const [isFilterVisible, setIsFilterVisible] = useState(true); // Toggle filter visibility
    const filterSectionRef = useRef(null); // Reference for the filter section

    const toggleFilter = () => {
        setIsFilterVisible((prev) => !prev);
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null)
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([])
    const [showTopSalesPerson, setShowTopSalesPerson] = useState(true)
    const handleSalesReport = async (flag = '') => {
        // console.log('Sales Report CALLOING')

        let payload;

        if (flag === 'clear') {
            payload = {


                partyName: '',
                type: '',
                panelType: '',
                wattage: '',
                salesPerson: '',
                fromDate: '',
                toDate: '',
                piNo: '',
                selectedLocationId: [] //
            };
            setFormData({
                partyName: '',
                salesPerson: '',
                fromDate: '',
                toDate: '',
                type: '',
                panelType: '',
                wattage: '',
                selectedLocationId: [] 
            });
        } else {
            payload = {


                partyName: formData.partyName,
                type: formData.panelType?.type ? formData.panelType?.type : formData.type,
                panelType: formData.panelType && formData.panelType ? formData.panelType?.moduleType + " " + formData.panelType?.monobi : '',
                wattage: formData.panelType?.wattage ? formData.panelType?.wattage : formData?.wattage,
                salesPerson: formData.salesPerson,
                fromDate: formData.fromDate,
                toDate: formData.toDate,
                piNo: formData?.piNo,
                workLocation: formData?.selectedLocationId 
            };
        }

        const { partyName, type, panelType, wattage, salesPerson, fromDate, toDate, piNo ,workLocation} = payload

        if (partyName || salesPerson || piNo) {
            setShowTopSalesPerson(false)
            localStorage.setItem('rankShow', false)
        } else {
            setShowTopSalesPerson(true)
            localStorage.setItem('rankShow', true)
        }


        // console.log('payload', payload)

        try {
            setLoading(true);
            setError(null)
            setData(null)
            const response = await fetch(`${dev}/sales/getSalesOrderFilter`, {
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

            if (result.data.length > 0) {
                setData(result.data);
                const createRows = salesReportRows(result?.data, formData);
                const createColumn = createColumnsForSalesReport(result?.data, formData, showTopSalesPerson, handleOpen);

                setRows(createRows);
                setColumns(createColumn);


            } else {
                setData(null);

                setError("No data found ")
            }


            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.message || "Please Try again")
            setData(null)
            console.error("Error in fetching report:", error);

        }
    };
    // console.log('rows', rows)
    // totalAmount
    useEffect(() => {
        handleSalesReport();
    }, []);

    // useEffect(() => {
    //     if (data && data.length > 0) {
    //         setLoading(true); 

    //     }

    // }, [data])

    const handleReportGenrate = () => {
        try {
            if (!data) {
                return
            }
            const transformedRows = salesReportRows(data, formData);
            // console.log('transformedRows', transformedRows)


            const columnsConfig = createColumnsForSalesReport(data, formData);
            // console.log('columnsConfig', columnsConfig)

            salesExcelReport(transformedRows, columnsConfig, formData).then(() => {
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


    let totalAmount = !error && rows && rows?.length > 0
        ? rows.reduce((sum, row) => sum + row.totalAmount, 0)
        : 0;

    totalAmount = new Intl.NumberFormat('en-IN').format(Number(totalAmount.toFixed(0)));

    let totalMegaWatts = !error && rows && rows.length>0  ? rows.reduce((sum, row) => sum + row.totalMegaWatt,0).toFixed(5) : 0;




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
                                className="font-serif font-bold text-red-600 text-xl"
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    textAlign: 'center', // Center-align text
                                    flex: 1, // Allow the text to take up remaining space
                                }}
                            >
                                Total Sales Amount: {`₹ ${totalAmount}`}
                            </Typography>
                            <Typography
                                className="font-serif font-bold text-red-600 text-2xl"
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    textAlign: 'center', // Center-align text
                                    flex: 1, // Allow the text to take up remaining space
                                }}
                            >
                                Sales Report
                            </Typography>
                            <Typography
                                className="font-serif font-bold text-red-600 text-xl"
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    textAlign: 'center', // Center-align text
                                    flex: 1, // Allow the text to take up remaining space
                                }}
                            >
                                Total Quantity: {` ${totalMegaWatts} MW`}
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
                            <div className="w-full ">
                                <SalesReportFilter
                                    setFormData={setFormData}
                                    formData={formData}
                                    handleSalesReport={handleSalesReport}
                                    setShowTopSalesPerson={setShowTopSalesPerson}
                                    showTopSalesPerson={showTopSalesPerson}
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
                        <SaleReportTable formData={formData} columnsData={columns} rowsData={rows}
                            showTopSalesPerson={showTopSalesPerson} />
                    </div>
                )}
                {/* Data or empty state */}

            </section>

            {
                isModalOpen && <SalesModal formData={formData} setModalLoading={setModalLoading}
                    modalLoading={modalLoading} data={singleRowData} open={isModalOpen} onClose={handleClose} />
            }
        </main>
    )
}

export default SalesReport

