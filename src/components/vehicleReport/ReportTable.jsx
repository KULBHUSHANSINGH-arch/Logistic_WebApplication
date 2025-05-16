import React, { useState, useEffect } from 'react'
// import {createColumnsForReport} from './vehicleReportCoulumns'
import { createColumnsForReport } from './vehicleReportCoulumns';
import { transformVehicleReportToRows } from './vehicleReportRow';
import { CircularProgress, Typography, Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import './report.css'


function ReportTable({ reportData }) {
    const [rowsData, setRows] = useState([]);
    const [columnsData, setColumns] = useState([]);


    // creating table column and row here------------------------------
    useEffect(() => {
        if (reportData) {
            const transformedRows = transformVehicleReportToRows(reportData);
            setRows(transformedRows);

            const columnsConfig = createColumnsForReport();
            console.log('columns', columnsConfig)
            setColumns(columnsConfig);
        }

    }, [reportData]);



    return (


        //     <DataGrid
        //         rows={rowsData}
        //         columns={columnsData}
        //         pageSize={30} // Show 5 rows per page
        //         rowsPerPageOptions={[10, 20, 30]}
        //         sortingOrder={["asc", "desc"]}
        //         filterMode="client"
        //         getRowHeight={() => "70px"}
        //         // components={{
        //         //   Toolbar: GridToolbar,
        //         // }}
        //         // componentsProps={{
        //         //   toolbar: {
        //         //     showQuickFilter: true,
        //         //   },
        //         // }}
        //         sx={{
        //             height:`600px`,
        //    border:'2px solid green',
        //             "& .MuiDataGrid-root": {
        //                 border: '2px solid blue',
        //             },
        //             "& .MuiDataGrid-columnHeader": {
        //                 width: "100%",
        //                 backgroundColor: "black",
        //                 color: "#fff",
        //                 fontWeight: "bold",
        //                 fontFamily: "sans-serif",
        //                 // padding: "8px 10px",
        //                 fontSize: "14px", // Reduce the font size for column headers
        //                 border: "1px solid #ddd",
        //                 display: "flex",
        //                 alignItems: "center",
        //                 justifyContent: "center",
        //                 overflow: "hidden",
        //                 whiteSpace: "normal", // Allow text wrapping
        //                 wordWrap: "break-word", // Wrap long text
        //             },
        //             "& .MuiDataGrid-columnHeaderTitle": {
        //                 width: "100%",
        //                 color: "#fff",
        //                 fontWeight: "bold",
        //                 textOverflow: "ellipsis",
        //             },
        //             "& .MuiDataGrid-cell": {
        //                 padding: "5px 6px",
        //                 fontSize: "13px",
        //                 overflow: "hidden",
        //                 textOverflow: "ellipsis",
        //                 whiteSpace: "normal", // Allow cell content to wrap
        //                 wordWrap: "break-word", // Wrap long text in cells
        //                 color: "#343333",
        //                 border: "1px solid #ddd",
        //             },
        //             "& .MuiDataGrid-row": {
        //                 fontSize: "13px",
        //                 border: "1px solid #ddd",
        //             },
        //         }}
        //     />

       <Box className=' h-[80vh]'>
         <DataGrid
            rows={rowsData}
            columns={columnsData}
            pageSize={50} // Show 5 rows per page
            rowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200.250]}
            sortingOrder={["asc", "desc"]}
            filterMode="client"
            getRowHeight={() => "100px"}
            // components={{
            //   Toolbar: GridToolbar,
            // }}
            // componentsProps={{
            //   toolbar: {
            //     showQuickFilter: true,
            //   },
            // }}
            sx={{
                height: "80vh",
                width: "100%",
                // border:'2px solid blue',
                overflowX: "auto",
                "& .MuiDataGrid-root": {
                    
                    // border:'2px solid green'
                    // width:'100%',
                },
                "& .MuiDataGrid-columnHeader": {
                    width: "100%",
                    backgroundColor: "#f97474",
                    color: "#fff",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    padding: "8px 10px",
                    fontSize: "14px", // Reduce the font size for column headers
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    whiteSpace: "normal", // Allow text wrapping
                    wordWrap: "break-word", // Wrap long text
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    width: "100%",
                    color: "#fff",
                    fontWeight: "bold",
                    textOverflow: "ellipsis",
                },
                "& .MuiDataGrid-cell": {
                    padding: "5px 6px",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal", // Allow cell content to wrap
                    wordWrap: "break-word", // Wrap long text in cells
                    color: "#343333",
                    border: "1px solid #ddd",
                },
                "& .MuiDataGrid-row": {
                    fontSize: "13px",
                    border: "1px solid #ddd",
                },
            }}
        />

       </Box>



    )
}

export default ReportTable
