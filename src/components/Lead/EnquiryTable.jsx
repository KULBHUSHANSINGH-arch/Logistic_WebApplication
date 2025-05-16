import React, { useState, useEffect } from "react";
import { Modal, Box, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { DataGrid } from "@mui/x-data-grid";



import { toast } from "react-toastify";


function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-IN', options).format(new Date(date));
}

const EnquiryTable = ({ columnData, rowData }) => {
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])
    const [list, setList] = useState([])
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')




    return (




        <Box
            sx={{
                flex: 1,
                overflow: "auto",
                padding: "16px",
                bgcolor:'white',
                color: 'black',
                // border : '2px solid red',
                height:'72vh'
            }}
        >
            <DataGrid
                rows={rowData}
                columns={columnData}
                getRowId={(row) => row.customerId} // Use customerId as the unique ID
                pageSize={50}
                rowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200, 250]}
                sortingOrder={["asc", "desc"]}
                filterMode="client"
                getRowHeight={() => "100px"}
                sx={{
                    height: "100%", // Take up available height
                    width: "100%",
                    //   border : '2px solid green',
                    overflowX: "auto",
                    "& .MuiDataGrid-root": {
                        width: "100%",
                    },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "black",
                        color: "white",
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
                        margin: "0",
                        padding: "0",
                    },
                }}
            />
        </Box>



    )
}

export default EnquiryTable
