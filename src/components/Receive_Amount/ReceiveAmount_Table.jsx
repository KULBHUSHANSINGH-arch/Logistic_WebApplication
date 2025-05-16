import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import { Tooltip } from "primereact/tooltip";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import { useSelector } from "react-redux";
import img1 from "../../assets/Images/plus.png";
import { RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";

const ReceiveAmount_Table = () => {
    const { user } = useSelector((state) => state.user);
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(localStorage.getItem("value") || "");
    const [selectedStatus, setSelectedStatus] = useState("Approved");
    const { designation: userDesignation } = user;

    useEffect(() => getSalesDetailsList(), [user.personId]);
    useEffect(() => getSalesDetailsList(), [selectedStatus]);

    const getSalesDetailsList = () => {
        axios.post(`${dev}/party/getPartyDetails`, { personId: user.personId, Status: selectedStatus })
            .then(({ data }) => setData(Array.isArray(data.data) ? data.data : []))
            .catch(() => toast("No Data Received Amount list."));
    };
   
    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()].map(n => String(n).padStart(2, "0"));
        let hours = date.getHours(), minutes = String(date.getMinutes()).padStart(2, "0"), ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    };
    const statusOptions = [
        { label: "Received Amount", value: "Approved" },
        { label: "Final Amount", value: "Final" }
    ];


    return (
        <div className="datatable-filter-demo card">
            <DataTable value={data} paginator rows={50} rowsPerPageOptions={[5, 10, 20, 50]} scrollable scrollHeight="60vh" globalFilter={globalFilter} emptyMessage="No items found."
                header={
                    <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                        <InputText placeholder="Search..." style={{ border: "1px solid black", width: "30%", padding: "8px", borderRadius: "4px" }}
                            type="search" value={globalFilter} onInput={(e) => { setGlobalFilter(e.target.value); localStorage.setItem("value", e.target.value); }} />
                        <RadioGroup
                            row
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statusOptions.map(({ label, value }) => (
                                <FormControlLabel
                                    key={value}
                                    value={value}  
                                    control={<Radio />}
                                    label={<Typography>{label}</Typography>} 
                                />
                            ))}
                        </RadioGroup>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            {userDesignation == "Accountant" || userDesignation == "Super Admin" ? <Link to="/receiveAmount" className="plus" data-pr-tooltip="Add Receive Amount">
                                <Image src={img1} alt="plus" rounded style={{ width: "35px", height: "35px" }} />
                            </Link> : ""}
                            <Tooltip target=".plus" content="Add New Party" position="top" className="custom-tooltip" />
                        </div>
                    </div>
                }>
                <Column field="PartyName" header="Party Name" sortable style={{ border: "0.5px dotted black" }} />
                <Column field="ReceiveAmount" header="Balance Amount" sortable style={{ border: "0.5px dotted black" }}
                    body={(rowData) => formatCurrency(rowData.FinalBalanceAmount ? rowData.FinalBalanceAmount : rowData.ReceiveAmount)} />              
                {selectedStatus !== "Final" && <Column field="CreatedBy" header="Received By" sortable style={{ border: "0.5px dotted black" }} />}
                {selectedStatus !== "Final" && <Column field="createdOn" header="Received Date" body={(rowData) => formatDateTime(rowData.createdOn)} sortable style={{ border: "0.5px dotted black" }} />}                

            </DataTable>
        </div>
    );
};

export default ReceiveAmount_Table;