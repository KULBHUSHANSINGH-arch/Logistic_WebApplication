import React, { useState, useEffect } from 'react'
// import {createColumnsForReport} from './vehicleReportCoulumns'

import { CircularProgress, Typography, Box, Paper, StyledEngineProvider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import '../vehicleReport/report.css'
import rank1 from '../../assets/Icons/rank1.png'
import rank2 from '../../assets/Icons/rank2.png'
import rank3 from '../../assets/Icons/rank3.png'

function SalesReportTable({ formData, rowsData, columnsData, showTopSalesPerson }) {

    function formatCurrency(value) {
        return value.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2, // To ensure only 2 decimal places
        });
    }




    return (
        // const index = params.indexRelativeToCurrentPage;

        <Box className="h-[74vh]" sx={{ overflowX: "auto" }}>
            <DataGrid
                rows={rowsData}
                columns={columnsData}
                pageSize={50}
                rowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200, 250]}
                sortingOrder={["asc", "desc"]}
                filterMode="client"
                getRowHeight={() => "100px"}
                // getRowId={(row) => `${row.partyName}-${row.piNo || row.id}`}
                sx={{
                    height: "70vh",
                    width: "100%",
                    overflowX: "auto", // Horizontal scrollbar enabled here
                    "& .MuiDataGrid-root": {
                        width: "100%",
                    },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#f97474",
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


    )
}

export default SalesReportTable
