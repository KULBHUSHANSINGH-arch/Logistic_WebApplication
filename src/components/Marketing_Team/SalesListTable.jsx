import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from 'react-router-dom';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { Tooltip } from 'primereact/tooltip';
import { toast } from 'react-toastify';
import { dev } from '../../utils/ApiUrl';
import { Radio, RadioGroup, FormControlLabel, Typography } from '@mui/material';
import axios from 'axios';
import ExcelJS from 'exceljs';
import img1 from "../../assets/Images/plus.png";
import '../Add_Party/table.css';
import { Modal } from 'react-bootstrap';
import { Form, } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Tooltip as MaterialToolTip } from "@mui/material";
import FinalPi from '../Final_PI/FinalPi';

const SalesListTable = () => {
    const { user } = useSelector((state) => state.user)
    const { designation: userDesignation } = user
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [personId, setPersonId] = useState('');
    // const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [selectedStatus, setSelectedStatus] = useState(userDesignation === 'Accountant' ? 'Final' : 'Pending');
    const navigate = useNavigate();
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [currentSalesOrderId, setCurrentSalesOrderId] = useState('');
    const [confirmationAction, setConfirmationAction] = useState('');
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [amountReceived, setReceivedAmount] = useState("");
    const [errors, setErrors] = useState({});
    const [currentSalesData, setCurrentSalesData] = useState(null);
    const [skipDue, setSkipDue] = useState(false);
    const [skip, setSkip] = useState(""); 
    const [paymentType,setPaymentType] = useState("Part Wise");
    // console.log('selectedStatus', data)
    const [formData, setFormData] = useState([
        {
            Replacement: false,
            PanelType: "",
            Quantity: "",
            ActualUnitPrice: "",
            TotalAmount: "",
            CreatedBy: localStorage.getItem("currentUser"),
        },
    ]);
    const [formErrors, setFormErrors] = useState([{}]);
    const [panelTypeOptions, setPanelTypeOptions] = useState([]);
    const [advanceAmount, setAdvanceAmount] = useState("");
    const [finalBalanceAmount, setfinalBalanceAmount] = useState("");

    // const fetchSalesOrderItems = async (salesOrderId) => {
    //     // console.log('ddddddddddddddddd',currentSalesOrderId)
    //     try {
    //         setLoading(true);
    //         if (!salesOrderId) {
    //             notifyError("Sales Order ID is missing");
    //             setLoading(false);
    //             return;
    //         }
    //         // setLoading(true);
    //         console.log('checking the Current Sales Order ID', salesOrderId)
    //         const response = await axios.post(
    //             `${dev}/sales/getSalesItems`,
    //             {
    //                 // salesOrderId: "89f3a6b3-153e-4cea-8ba9-f48e38af9222" 
    //                 salesOrderId: salesOrderId,

    //             },
    //             { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    //         );

    //         // setLoading(false);
    //         console.log('checking the api ');
    //         console.log('API response received');

    //         if (response.data?.success) {
    //             console.log('API response received111');
    //             setPanelTypeOptions(response.data.data);
    //             if (response.data.data.length > 0) {
    //                 setAdvanceAmount(response.data.data[0].advanceAmount);
    //             }
    //         } else {
    //             notifyError(response.data.message || "Failed to fetch sales items");
    //         }
    //     } catch (error) {
    //         // setLoading(false);
    //         console.error("API Call Failed:", error.message);
    //         notifyError("Failed to fetch sales order items");
    //     } finally {
    //         setLoading(false); // Always set loading to false when finished
    //     }
    // };


    const fetchSalesOrderItems = async (salesOrderId) => {
        try {
            setLoading(true);
            if (!salesOrderId) {
                notifyError("Sales Order ID is missing");
                setLoading(false);
                return;
            }
            console.log('checking the Current Sales Order ID', salesOrderId);
    
            const response = await axios.post(
                `${dev}/sales/getSalesItems`,
                { salesOrderId },
                { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
            );
    
            console.log('API response received');
    
            if (response.data?.success) {
                console.log('API response received successfully');
                setPanelTypeOptions(response.data.data);
    
                if (response.data.data.length > 0) {
                    setAdvanceAmount(response.data.data[0].advanceAmount);
    
                    // ✅ Skip value ko state me store karein
                    setSkip(response.data.data[0]?.skip || "notSkip");
                }
            } else {
                notifyError(response.data.message || "Failed to fetch sales items");
            }
        } catch (error) {
            console.error("API Call Failed:", error.message);
            notifyError("Failed to fetch sales order items");
        } finally {
            setLoading(false);
        }
    };
    
    
    
    const handleChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedFormData = [...formData];
        updatedFormData[index][name] = type === "checkbox" ? checked : value;

        const updatedErrors = [...formErrors];
        if (name === "Quantity") {
            if (!value || parseFloat(value) <= 0) {
                updatedErrors[index] = { ...updatedErrors[index], Quantity: "Quantity is required " };

            } else {
                if (updatedErrors[index]) {
                    delete updatedErrors[index].Quantity;
                }
            }
        }
        if (name === "PanelType") {
            if (!value || parseFloat(value) <= 0) {
                updatedErrors[index] = { ...updatedErrors[index], PanelType: "PanelType is required " };

            } else {
                if (updatedErrors[index]) {
                    delete updatedErrors[index].PanelType;
                }
            }
        }

        if (name === "Replacement") {
            if (checked) {
                updatedFormData[index].PanelType = "";
                updatedFormData[index].Quantity = "";

                updatedFormData[index].ActualUnitPrice = "0";
                updatedFormData[index].TotalAmount = "0";
            } else if (updatedFormData[index].PanelType) {
                const selectedPanel = panelTypeOptions.find(
                    option => option.combinedKey === updatedFormData[index].PanelType
                );
                if (selectedPanel) {
                    updatedFormData[index].ActualUnitPrice = selectedPanel.actualUnitPrice;
                    if (updatedFormData[index].Quantity) {
                        updatedFormData[index].TotalAmount = (
                            parseFloat(updatedFormData[index].Quantity) *
                            parseFloat(selectedPanel.actualUnitPrice)
                        ).toFixed(2);

                        console.log('checking the Quantity', quantity)
                    }
                }
            }
        }

        if (name === "PanelType" && value && !updatedFormData[index].Replacement) {
            const selectedPanel = panelTypeOptions.find(option => option.combinedKey === value);
            if (selectedPanel) {
                updatedFormData[index].ActualUnitPrice = selectedPanel.actualUnitPrice;
                if (updatedFormData[index].Quantity) {
                    updatedFormData[index].TotalAmount = (
                        parseFloat(updatedFormData[index].Quantity) *
                        parseFloat(selectedPanel.actualUnitPrice)
                    ).toFixed(2);
                }
            }
        }

        // Auto-calculate total amount when quantity or unit price changes
        if (name === "Quantity" || name === "ActualUnitPrice") {
            const quantity = name === "Quantity" ? value : updatedFormData[index].Quantity;
            const unitPrice = name === "ActualUnitPrice" ? value : updatedFormData[index].ActualUnitPrice;

            if (quantity && unitPrice) {
                updatedFormData[index].TotalAmount = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2);
            }
            // if(advanceAmount<updatedFormData[index].TotalAmount ){
            //     formErrors[index]?.TotalAmount= "Insufficient Amount"
            // }else{
            //     formErrors[index]?.TotalAmount= " "
            // }
        }

        setFormData(updatedFormData);
    };

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        const userDesignation = localStorage.getItem('designation');
        const department = localStorage.getItem('department');
        setDepartment(department);
        setPersonId(currentUser);
        setDesignation(userDesignation);
    }, []);

    useEffect(() => {
        const personId = localStorage.getItem("currentUser");
        setPersonId(personId);
    }, []);

    const getSalesDetailsList = async () => {
        setLoading(true);
        const personId = localStorage.getItem('currentUser');
        try {
            const response = await axios.post(`${dev}/sales/getSalesDetails`, { personId, status: selectedStatus }, {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });
            if (response.status === 200 && Array.isArray(response.data.data)) {
                setData(response.data.data);
            } else {
                toast.error('Failed to fetch sales list.');
            }
        } catch (error) {
            console.error('Error fetching sales data:', error.message);
            toast.error('Failed to fetch sales data.');
        }
        setLoading(false);
    };

    useEffect(() => {
        getSalesDetailsList();
    }, [selectedStatus]);


  
    
    
    const updateStatus = async (salesOrderId, status, salesOrderItems = []) => {
        try {
            setLoading(true);
    
            const firstFormItem = formData[0] || {};
            const sumTotalAmount = formData.reduce((total, item) => {
                return total + (parseFloat(item.TotalAmount) || 0);
            }, 0).toFixed(2);
    
            console.log("TotalAmount:", sumTotalAmount);
            console.log("Quantity:", formData.map(item => item.Quantity));
    
            // ✅ Skip value ko correctly define karein
            const skipValue = skip;  // Jo `fetchSalesOrderItems` function me set hua tha
    
            // Yahan aapka original payload hai, isme koi change nahi kiya gaya
            const payload = {
                salesID: salesOrderId,
                status,
                personId,
                amountReceived: amountReceived,
                skipDueAmount: skipDue,
                Replacement: firstFormItem.Replacement || false,
                totalAmount: sumTotalAmount,
                advanceAmount: advanceAmount,
                finalBalanceAmount: finalBalanceAmount,
                skip: skipValue ,
                piType:paymentType // ✅ Corrected variable
            };
    
            console.log("Checking my all data for the update status", payload);
    
            if (salesOrderItems && salesOrderItems.length > 0) {
                payload.salesOrderItems = salesOrderItems.map(item => ({
                    salesOrderItemId: item.salesOrderItemId,
                    quantity: item.quantity
                }));
            }
    
            const response = await axios.post(`${dev}/sales/updateSalesStatus`, payload, {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            });
    
            setLoading(false);
            console.log('Response:', response);
    
            if (response.status === 200) {
                if (response.data.success) {
                    toast.success(`Status updated to ${status}`);
                    setData((prevData) => prevData.map((item) =>
                        item.salesOrderId === salesOrderId ? { ...item, status } : item
                    ));
                    setSelectedStatus(status);
                    getSalesDetailsList(status);
                    setFormData([{
                        Replacement: false,
                        PanelType: "",
                        Quantity: "",
                        ActualUnitPrice: "",
                        TotalAmount: "",
                        CreatedBy: localStorage.getItem("currentUser"),
                    }]);
                    handleCancelModal();
                }
                else if(response.status === 403){
                    console.log("AAAAAa");
                    
                    toast.error("Insufficient balance, please check the ledger."); 
                }
                 else {
                    console.log("AAAAAB");
                    console.error("API Error:", response.data.message);
                    toast.error(response.data.message || "Failed to update status.");
                }
            } else {
                console.log("AAAAAc");
                console.error("Unexpected Response Status:", response.status);
                toast.error("Unexpected error occurred while updating status.");
            }
            setLoading(false);
        } catch (error) {
            console.log("AAAAAD");
            console.error("Error updating status:", error?.response?.data || error.message);
            let errorMessage = "Error updating status.";
    
            if (error.response) {
                console.log("AAAAAE");
                // if (error.response.status==403 ) {
                //     console.log("AAAAAF");
                //     errorMessage = "Insufficient balance, please check the ledger.";
                // }
                if (error.response.data && error.response.data.message) {
                    console.log("AAAAAF");
                    errorMessage = error.response.data.message;
                } else {
                    console.log("AAAAAG");
                    errorMessage = `Server Error: ${error.response.status}`;
                }
            } else if (error.request) {
                console.log("AAAAAH");
                errorMessage = "No response from server. Please check your internet connection.";
            } else {
                console.log("AAAAAI");
                errorMessage = error.message;
            }
    
            toast.error(errorMessage);
            setLoading(false);
        }
    };
    
    // const updateStatus = async (salesOrderId, status, salesOrderItems = []) => {
    //     try {
    //         setLoading(true);
    //         const firstFormItem = formData[0] || {};
    //         const sumTotalAmount = formData.reduce((total, item) => {
    //             return total + (parseFloat(item.TotalAmount) || 0);
    //         }, 0).toFixed(2);

    //         console.log("TotalAmount:", sumTotalAmount);
    //         console.log("Quantity:", formData.map(item => item.Quantity));

    //         const payload = {
    //             salesID: salesOrderId,
    //             status,
    //             personId,
    //             amountReceived: amountReceived,
    //             skipDueAmount: skipDue,
    //             Replacement: firstFormItem.Replacement || false,
    //             totalAmount: sumTotalAmount,
    //             advanceAmount: advanceAmount,
    //             finalBalanceAmount: finalBalanceAmount,
    //             skip: skip
    //         };
    //         console.log("Checking my all data for the update status", payload);
    //         if (salesOrderItems && salesOrderItems.length > 0) {
    //             payload.salesOrderItems = salesOrderItems.map(item => ({
    //                 salesOrderItemId: item.salesOrderItemId,
    //                 quantity: item.quantity
    //             }));
    //         }
    //         const response = await axios.post(`${dev}/sales/updateSalesStatus`,
    //             payload,
    //             {
    //                 headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    //             }
    //         );
    //         setLoading(false);
    //         console.log('Response:', response);

    //         if (response.status === 200) {
    //             if (response.data.success) {
    //                 toast.success(`Status updated to ${status}`);
    //                 setData((prevData) => prevData.map((item) =>
    //                     item.salesOrderId === salesOrderId ? { ...item, status } : item
    //                 ));
    //                 setSelectedStatus(status);
    //                 getSalesDetailsList(status);
    //                 setFormData([{
    //                     Replacement: false,
    //                     PanelType: "",
    //                     Quantity: "",
    //                     ActualUnitPrice: "",
    //                     TotalAmount: "",
    //                     CreatedBy: localStorage.getItem("currentUser"),
    //                 }]);
    //                 handleCancelModal();
    //             } else {
    //                 console.error("API Error:", response.data.message);
    //                 toast.error(response.data.message || "Failed to update status.");
    //             }
    //         } else {
    //             console.error("Unexpected Response Status:", response.status);
    //             toast.error("Unexpected error occurred while updating status.");
    //         }
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Error updating status:", error?.response?.data || error.message);

    //         let errorMessage = "Error updating status.";

    //         // Check if the API response contains an error message
    //         console.log('error.response', error.response)
    //         if (error.response) {
    //             if (error.response.data && error.response.data.message) {
    //                 errorMessage = error.response.data.message;
    //             } else {
    //                 errorMessage = `Server Error: ${error.response.status}`;
    //             }
    //         } else if (error.request) {
    //             errorMessage = "No response from server. Please check your internet connection.";
    //         } else {
    //             errorMessage = error.message;
    //         }

    //         toast.error(errorMessage);
    //         setLoading(false);
    //     }
    // };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        console.log('ccccccccccccccccccccccccccccccccc', newStatus);
        if (event.target.value === 'Dispatched') {
            setSelectedStatus('Out')
        } else if (event.target.value === 'Dispatch In Progress') {
            setSelectedStatus('InDispatch')
        }
        else {
            setSelectedStatus(event.target.value);
        }
    };

    /** For Final  Popup to show the Questions */
    const openConfirmationModal = (salesOrderId, action) => {
        if (!salesOrderId) {
            notifyError("Sales Order ID is missing");
            return;
        }
        // fetchSalesOrderItems(salesOrderId);
        if (action !== 'Approved' && action !== 'Out') {
            fetchSalesOrderItems(salesOrderId);
        }
        const currentRow = data.find(item => item.salesOrderId === salesOrderId);
        setCurrentSalesData(currentRow);
        setCurrentSalesOrderId(salesOrderId);
        setConfirmationAction(action);
        setShowConfirmationModal(true);
    };

    const validate = () => {
        // Check if skip is present in the first panel type options
        const isSkipPresent = panelTypeOptions && panelTypeOptions.length > 0
            && panelTypeOptions[0].skip === "skip";

        // If skip is present, perform minimal validation
        if (isSkipPresent) {
            let isValid = true;
            const newErrors = formData.map(row => {
                const rowErrors = {};

                // Mandatory validation for Panel Type and Quantity
                if (!row.PanelType) {
                    rowErrors.PanelType = "Panel Type is required";
                    isValid = false;
                }

                if (!row.Quantity || parseFloat(row.Quantity) <= 0) {
                    rowErrors.Quantity = "Quantity is required and must be greater than 0";
                    isValid = false;
                }

                return rowErrors;
            });

            setFormErrors(newErrors);
            return isValid;
        }

        // Original validation logic remains the same for non-skip scenarios
        let isValid = true;
        const newErrors = formData.map(row => {
            const rowErrors = {};
            const selectedPanel = panelTypeOptions.find(option => option.combinedKey === row.PanelType);
            const availableQuantity = selectedPanel ? parseFloat(selectedPanel.quantity) : 0;
            const enteredQuantity = parseFloat(row.Quantity) || 0;
            const TotalAmountVal = parseFloat(row.TotalAmount) || 0;

            // Quantity validation
            if (paymentType=="Part Wise" &&!row.Quantity) {
                rowErrors.Quantity = "Quantity is required";
                isValid = false;
            } else if (paymentType=="Part Wise"&& enteredQuantity > availableQuantity) {
                rowErrors.Quantity = `Quantity cannot exceed Available Quantity: ${availableQuantity}`;
                isValid = false;
            }

            // else if (currentSalesData?.paymentTerms === 'RTGS/NEFT') {
            //     const remainingBalance = parseFloat(advanceAmount) - TotalAmountVal;
            //     if (remainingBalance < -5000) {
            //         rowErrors.TotalAmount = 'The advance amount is insufficient to proceed.';
            //         isValid = false;
            //     }
            // }

            if (paymentType=="Part Wise"&& !row.PanelType) {
                rowErrors.PanelType = "Panel Type is required";
            }
            return rowErrors;
        });
        setFormErrors(newErrors);
        return isValid;
    };

    const validateForm = () => {
        const newErrors = {};
        // if (!amountReceived && !skipDue) {
        //     newErrors.amountReceived = 'Please enter the received amount';
        // }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const notifyError = (message) => toast.error(message, { autoClose: 5000 });


    const handleConfirmAction = () => {
        // Check if skip is present in the first panel type options
        const isSkipPresent = panelTypeOptions && panelTypeOptions.length > 0
            && panelTypeOptions[0].skip === "skip";

        // If skip is present, bypass most validations
        if (isSkipPresent) {
            // First, validate Panel Type and Quantity
            if (!validate()) {
                return;
            }

            const salesOrderItems = formData.map(item => {
                const selectedPanel = panelTypeOptions.find(
                    option => option.combinedKey === item.PanelType
                );
                return {
                    salesOrderItemId: selectedPanel?.salesOrderItemId,
                    quantity: item.Quantity
                };
            });
            updateStatus(currentSalesOrderId, confirmationAction, salesOrderItems);
            return;
        }

        // Rest of the original validation logic remains the same
        if (confirmationAction === 'Final' && !validate()) {
            return;
        }

        if (confirmationAction === 'Approved') {
            const discountPrice = panelTypeOptions && panelTypeOptions.length > 0
                ? parseFloat(panelTypeOptions[0].discountPrice || 0)
                : 0;

            const receivedAmount = parseFloat(amountReceived || 0);

            // if (receivedAmount <= discountPrice) {
            //     console.log("Amount within discount price range, skipping validation");
            // } else {
            //     if (!validateForm()) {
            //         return;
            //     }
            // }
            if (confirmationAction === 'Approved') {
                if (!validateForm()) {
                    return;
                }
            }
            
        }

        const totalAmount = formData.reduce((total, item) =>
            total + (parseFloat(item.TotalAmount) || 0), 0);
        // if (confirmationAction === 'Final' &&
        //     currentSalesData?.paymentTerms === 'RTGS/NEFT') {
        //     const remainingBalance = parseFloat(advanceAmount) - totalAmount;
        //     if (remainingBalance < -5000) {
        //         toast.error("The advance amount is insufficient to proceed.");
        //         return;
        //     }
        // }

        if (confirmationAction === 'Final') {
            const errors = validate(formData);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }
            const salesOrderItems = formData.map(item => {
                const selectedPanel = panelTypeOptions.find(
                    option => option.combinedKey === item.PanelType
                );
                return {
                    salesOrderItemId: selectedPanel?.salesOrderItemId,
                    quantity: item.Quantity
                };
            });
            updateStatus(currentSalesOrderId, confirmationAction, salesOrderItems);
        } else {
            updateStatus(currentSalesOrderId, confirmationAction);
        }
    };

    useEffect(() => {
        if (!showConfirmationModal) {
            emptyAllStates();
        }
    }, [showConfirmationModal]);

    const emptyAllStates = () => {
        // Reset form data
        setFormData([{
            Replacement: false,
            PanelType: "",
            Quantity: "",
            ActualUnitPrice: "",
            TotalAmount: "",
        }]);
    };


    const handleSkipDueChange = (e) => {
        setSkipDue(e.target.checked);
        if (e.target.checked) {
            setErrors({ ...errors, amountReceived: '' });
        }
    };

    const handleCancelModal = () => {
        setShowConfirmationModal(false);
        setLoading(false);
        // getSalesDetailsList();
    };

    const handleEditClick = (salesOrderId, Type) => {
        navigate("/add-sales-order", { state: { salesOrderId, Type, selectedStatus } });
    };

    const handleDownloadPdf = async (pdfUrl, piNo, partyName) => {
        try {
            const response = await fetch(pdfUrl);
            if (!response.ok) throw new Error('Failed to fetch the file');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `PI-${partyName}-${piNo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading the PDF:', error);
        }
    };

    const actionBodyTemplate = (rowData) => {
        const { status, designation } = rowData;
        const userDesignation = localStorage.getItem('designation');

        return (
            <React.Fragment>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Show actions based on status */}
                    {status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {userDesignation !== "Accountant" && (
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button p-button custom-tooltip-button"
                                    data-pr-tooltip="Edit"
                                    style={{ backgroundColor: '#2ccadd', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                    onClick={() => handleEditClick(rowData.salesOrderId, "")}
                                />

                            )}


                            {userDesignation !== "Accountant" && (
                                <Button
                                    icon="pi pi-check"
                                    className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                    data-pr-tooltip="Final"
                                    style={{ backgroundColor: '#a52cdd', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                    onClick={() => openConfirmationModal(rowData.salesOrderId, 'Final')}
                                />
                            )}

                            <Button
                                icon="pi pi-download"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Download PI"
                                style={{ backgroundColor: '#d5dd2c', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => handleDownloadPdf(rowData.pdfUrl, rowData.piNo, rowData.partyName)}
                            />

                            {userDesignation !== "Accountant" && (
                                <Button
                                    icon="pi pi-times-circle"
                                    className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                    data-pr-tooltip="Cancel"
                                    style={{ backgroundColor: '#a20000', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                    onClick={() => openConfirmationModal(rowData.salesOrderId, 'Cancelled')}
                                />
                            )}
                            <Button
                                icon="pi pi-plus"
                                className="p-button-rounded p-button-success custom-tooltip-button"
                                data-pr-tooltip="Make PI With Same Data" style={{ marginRight: '5px', backgroundColor: '#cb34dc' }}
                                onClick={() => handleEditClick(rowData.salesOrderId, "Resend")} />

                        </div>
                    )}

                    {status === 'Final' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {userDesignation !== "Accountant" && (
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-success custom-tooltip-button"
                                    data-pr-tooltip="Make PI With Same Data"
                                    style={{ marginRight: '5px', backgroundColor: '#cb34dc' }}
                                    onClick={() => handleEditClick(rowData.salesOrderId, "Resend")} />
                            )}

                            <Button
                                icon="pi pi-download"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Download PI"
                                style={{ backgroundColor: '#d5dd2c', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => handleDownloadPdf(rowData.pdfUrl, rowData.piNo, rowData.partyName)}
                            />
                            {(userDesignation !== "Sales Executive" && <Button
                                icon="pi pi-check-circle"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Approve"
                                style={{ backgroundColor: '#689F38', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => openConfirmationModal(rowData.salesOrderId, 'Approved')}
                            />)}
                            {(userDesignation == "Super Admin" && userDesignation !== "Accountant" && userDesignation !== 'Sales Executive' && department !== 'Sales' && <Button
                                icon="pi pi-times-circle"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Cancel"
                                style={{ backgroundColor: '#a20000', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => openConfirmationModal(rowData.salesOrderId, 'Cancelled')}
                            />)}
                            {/* {(userDesignation == "Super Admin" && <Button
                                icon="pi pi-times-circle"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Cancel"
                                style={{ backgroundColor: '#a20000', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => openConfirmationModal(rowData.salesOrderId, 'Cancelled')}
                            />)} */}
                        </div>
                    )}

                    {status === 'Approved' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {userDesignation !== "Accountant" && (
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-success custom-tooltip-button"
                                    data-pr-tooltip="Make PI With Same Data"
                                    style={{ marginRight: '5px', backgroundColor: '#cb34dc' }}
                                    onClick={() => handleEditClick(rowData.salesOrderId, "Resend")} />
                            )}

                            <Button
                                icon="pi pi-download"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Download PI"
                                style={{ backgroundColor: '#d5dd2c', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => handleDownloadPdf(rowData.pdfUrl, rowData.piNo, rowData.partyName)}
                            />
                            {(userDesignation === "Super Admin" && <Button
                                icon="pi pi-check"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Dispatch"
                                style={{ backgroundColor: '#a20000', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => openConfirmationModal(rowData.salesOrderId, 'Out')}
                            />)}
                            {(userDesignation == "Super Admin" && <Button
                                icon="pi pi-times-circle"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Cancel"
                                style={{ backgroundColor: '#a20000', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => openConfirmationModal(rowData.salesOrderId, 'Cancelled')}
                            />)}
                        </div>
                    )}

                    {status === 'Out' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button icon="pi pi-plus" className="p-button-rounded p-button-success custom-tooltip-button" data-pr-tooltip="Make PI With Same Data" style={{ marginRight: '5px', backgroundColor: '#cb34dc' }} onClick={() => handleEditClick(rowData.salesOrderId, "Resend")} />
                            <Button
                                icon="pi pi-download"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Download PI"
                                style={{ backgroundColor: '#d5dd2c', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => handleDownloadPdf(rowData.pdfUrl, rowData.piNo, rowData.partyName)}
                            />
                        </div>
                    )}

                    {status === 'Cancelled' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button icon="pi pi-plus" className="p-button-rounded p-button-success custom-tooltip-button" data-pr-tooltip="Make PI With Same Data" style={{ marginRight: '5px', backgroundColor: '#cb34dc' }} onClick={() => handleEditClick(rowData.salesOrderId, "Resend")} />
                            <Button
                                icon="pi pi-download"
                                className="p-button p-button-success p-button-icon-only custom-tooltip-button"
                                data-pr-tooltip="Download PI"
                                style={{ backgroundColor: '#d5dd2c', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                onClick={() => handleDownloadPdf(rowData.pdfUrl, rowData.piNo, rowData.partyName)}
                            />
                        </div>
                    )}

                    <Tooltip target=".custom-tooltip-button" position="top" className="custom-tooltip" />
                </div>
            </React.Fragment>
        );
    };

    const HeaderRow = () => {
        return (
            <div className="   py-1" style={{ width: '100%', padding: '' }}>
                <div className="row align-items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >

                    {/* Search Input */}
                    <div style={{ display: 'flex', alignItems: 'center', width: '20%' }}>
                        <span className="p-input-icon-left" style={{ width: '100%' }}>
                            <InputText
                                style={{
                                    border: "1px solid black",
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                }}
                                type="search"
                                onInput={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Search..."
                            />
                        </span>
                    </div>

                    {/* Status Radio Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60%' }}>
                        <RadioGroup row
                            value={selectedStatus}
                            // value={selectedStatus === 'Dispatched' ? 'Dispatched' : selectedStatus}
                            onChange={handleStatusChange}
                        >
                            {["Pending", "Final", "Approved", "Dispatch In Progress", 'Dispatched', "Cancelled"]
                                .filter((status) => {
                                    if (designation === 'Accountant') {
                                        return status !== "Pending" && status !== "Cancelled" && status !== 'Dispatched';
                                    }
                                    return true;
                                })
                                .map((status) => (
                                    <FormControlLabel
                                        key={status}
                                        value={status}
                                        // value={selectedStatus === 'Dispatched' ? 'Dispatched' : status}
                                        control={<Radio
                                            checked={
                                                status === "Dispatched"
                                                    ? selectedStatus === "Out"  // Check against "Out" for Dispatched
                                                    : status === "Dispatch In Progress"
                                                        ? selectedStatus === "InDispatch"  // Check against "InDispatch" for Dispatch In Progress
                                                        : selectedStatus === status  // Default check for other statuses
                                            }
                                        />}
                                        label={<Typography>{status}</Typography>}
                                    />
                                ))}
                        </RadioGroup>
                    </div>

                    {/* Actions (Link and Button) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '20%' }}>
                        {designation !== 'Accountant' && (
                            <Link to="/add-sales-order" className="plus" data-pr-tooltip="Add Sales" style={{ marginRight: '10px' }}>
                                <Image src={img1} alt="plus" rounded style={{ width: '40px', height: '40px' }} />
                            </Link>
                        )}

                        {(designation !== "Accountant" && <Button
                            label="Export"
                            icon="pi pi-file-excel"
                            className="p-button-success export-button custom-button"
                            onClick={exportExcel}
                            style={{ marginRight: '10px' }}
                        />)}
                        <Tooltip target=".custom-button" content="Download Report" position="top" className="custom-tooltip" />
                        <Tooltip target=".plus" content="Add New Sales" position="top" className="custom-tooltip" />
                    </div>

                    <div className=''>
                        <p className=' text-red-500 text-sm  font-bold font-sans'>Total : {data && data?.length || 0}</p>
                    </div>

                </div>
            </div>
        );
    };

    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Purchase Orders');
        worksheet.columns = [
            { header: 'PI Number', key: 'piNo', width: 25 },
            { header: 'Customer Name', key: 'partyName', width: 25 },
            { header: 'Delivery Address', key: 'fullDeliveryAddress', width: 35 },
            { header: 'Company Name', key: 'companyName', width: 35 },
            { header: 'Received Amount By Accountant ', key: 'amountReceived', width: 35 },
            { header: 'Quantity', key: 'quantity', width: 35 },
            { header: 'Remaining Quantity ', key: 'remainingQuantity', width: 35 },
            { header: 'Dispatch Quantity', key: 'dispatchQuantity', width: 35 },
            { header: 'Dispatch Amount ', key: 'dispatchAmount', width: 35 },
            { header: 'Extra Amount', key: 'extraAmount', width: 35 },
            // { header: 'Due Amount', key: 'balanceAmount', width: 35 },
            { header: 'Sales Executive Name', key: 'personName', width: 35 },
            { header: 'Date', key: 'date', width: 25 },
        ];
        // Apply styles to specific columns
        const styledColumns = ['quantity', 'remainingQuantity', 'dispatchQuantity', 'dispatchAmount'];

        styledColumns.forEach((key) => {
            worksheet.getColumn(key).eachCell((cell) => {
                cell.font = {
                    name: 'Arial', // Font name
                    size: 12,      // Font size
                    bold: true,    // Font weight
                };
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                };
            });
        });
        worksheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow(1).height = 35;
        const processedData = data.map(item => {


            // Create arrays to store comma-separated quantities, remaining quantities, and wattage
            const quantities = [];
            const remainingQuantities = [];
            const dispatchQuantities = []
            const dispatchAmounts = []

            // Iterate over each salesItem in the item.salesItems array
            item.salesItems.forEach(salesItem => {
                // Add current salesItem quantity, remainingQuantity, and wattage to respective arrays
                quantities.push(`${salesItem.quantity} (${salesItem.watage})`);  // quantity with wattage in parentheses
                remainingQuantities.push(`${salesItem.remainingQuantity} (${salesItem.watage})`);

                // Calculate dispatchQuantity for the current salesItem
                let salesQuantity = salesItem.quantity ? Number(salesItem?.quantity) : 0
                let salesRemainingQuantity = salesItem.quantity ? Number(salesItem?.remainingQuantity) : 0
                const dispatchQuantity = salesQuantity - salesRemainingQuantity;

                dispatchQuantities.push(`${dispatchQuantity} (${salesItem.watage})`)

                let unitPrice = salesItem.unitPrice ? Number(salesItem?.unitPrice) : 0
                let dispatchAmount = dispatchQuantity * unitPrice
                dispatchAmounts.push(`${new Intl.NumberFormat('en-IN').format(dispatchAmount)} (${salesItem.watage})`)
            });

            return {
                date: item.date,
                piNo: item.piNo,
                partyName: item.partyName,
                destination: item.destination,
                fullDeliveryAddress: item.fullDeliveryAddress,
                companyName: item.companyName,
                personName: item.personName,
                amountReceived: item.amountReceived,
                extraAmount: item.extraAmount,
                balanceAmount: `₹ ${new Intl.NumberFormat('en-IN').format(item.balanceAmount)}`,
                // Join quantities and remaining quantities with commas
                quantity: quantities.join(', '),  // Comma-separated quantities with wattage
                remainingQuantity: remainingQuantities.length > 0 ? remainingQuantities.join(', ') : '0',  // Show 0 if no remaining quantity
                dispatchQuantity: dispatchQuantities.join(', '), // Ensure dispatchQuantity shows 0 if calculated as zero
                dispatchAmount: dispatchAmounts.join(', ')  // Total dispatch amount
            };
        });


        worksheet.addRows(processedData);
        const totalRows = worksheet.rowCount;
        const totalCols = worksheet.columnCount;

        for (let row = 1; row <= totalRows; row++) {
            for (let col = 1; col <= totalCols; col++) {
                const cell = worksheet.getCell(row, col);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (row > 1) {
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                    cell.font = { size: 12 };
                }
            }
        }

        // Auto-fit row heights
        worksheet.eachRow({ includeEmpty: true }, (row) => {
            let maxRowHeight = 0;

            row.eachCell({ includeEmpty: true }, (cell) => {
                const cellValue = cell.value ? cell.value.toString() : '';
                const colWidth = worksheet.getColumn(cell.col).width || 10;
                const words = cellValue.split(' ');
                let currentLineLength = 0;
                let lineCount = 1;

                words.forEach(word => {
                    const wordLength = word.length;
                    if (currentLineLength + wordLength + 1 > colWidth) {
                        lineCount++;
                        currentLineLength = wordLength;
                    } else {
                        currentLineLength += wordLength + 1;
                    }
                });

                const baseLineHeight = 15;
                const padding = 4;
                const estimatedRowHeight = (lineCount * baseLineHeight) + padding;
                maxRowHeight = Math.max(maxRowHeight, estimatedRowHeight);
            });

            if (maxRowHeight > 0) {
                row.height = maxRowHeight;
            }
        });

        // Generate and save the file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'SalesExcelReport.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const header = HeaderRow();

    const renderSkeletonRows = () => {
        return Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
                <td><Skeleton width="100%" height="2em" /></td>
                <td><Skeleton width="100%" height="2em" /></td>
                <td><Skeleton width="100%" height="2em" /></td>
                <td><Skeleton width="100%" height="2em" /></td>
                <td><Skeleton width="100%" height="42em" /></td>
                <td>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Skeleton width="30%" height="2em" />
                        <Skeleton width="30%" height="2em" />
                        <Skeleton width="30%" height="2em" />
                    </div>
                </td>
            </tr>
        ));
    };

    const hasExtraAmount = currentSalesData?.extraAmount > 0;

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || parseFloat(value) >= 0) {
            setReceivedAmount(value);
            if (errors.amountReceived) {
                setErrors({ ...errors, amountReceived: null });
            }
        }
        // setReceivedAmount(value);
        // if (errors.amountReceived) {
        //     setErrors({ ...errors, amountReceived: null });
        // }
    };

    // Function to render truncated text with a tooltip
    const renderAddress = (rowData) => {
        const maxLength = 30; // Define the max length to display
        const address = rowData.fullDeliveryAddress;

        return (
            <MaterialToolTip
                title={<span style={{ userSelect: "text" }}>{address}</span>}
                placement="top"
                arrow
                componentsProps={{
                    tooltip: { sx: { pointerEvents: "auto", userSelect: "text" } },
                }}
            >
                <span style={{ userSelect: "text", cursor: "text" }}>
                    {address.length > maxLength ? `${address.slice(0, maxLength)}...` : address}
                </span>
            </MaterialToolTip>
        );
    };

    const renderParty = (rowData) => {
        // console.log(rowData)
        const maxLength = 30;
        const party = rowData?.partyName;

        return (
            <MaterialToolTip
                title={<span style={{ userSelect: "text" }}>{party}</span>}
                placement="top"
            >
                <span style={{ userSelect: "text" }}>
                    {party.length > maxLength ? `${party.slice(0, maxLength)}...` : party}
                </span>
            </MaterialToolTip>

        );
    };

    const headerStyle = {
        backgroundColor: "#f0f8ff",
        padding: "10px",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        color: "#333",
    };

    const renderdispatchQuantity = (rowData) => {
        // console.log('rowData In dispatch amount', rowData);
        const { salesItems } = rowData;
        const dispatchData = salesItems.map((item) => {
            const quantity = Number(item.quantity) || 0;
            const remainingQuantity = Number(item.remainingQuantity) || 0;
            return {
                dispatchQuantity: quantity - remainingQuantity,
                watage: item.watage
            };
        });
        const [isExpanded, setIsExpanded] = useState(false);

        const handleToggle = () => {
            setIsExpanded((prev) => !prev);
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Show the first dispatch quantity */}
                <span style={{ fontWeight: 'bold' }}>
                    {dispatchData[0]?.dispatchQuantity} ({dispatchData[0]?.watage}),
                </span>
                {/* If there are more than one item, show the "See More" button */}
                {dispatchData.length > 1 && (
                    <>
                        {isExpanded && (
                            <div>
                                {dispatchData.slice(1).map((item, index) => (
                                    <span key={index} style={{ display: 'block', fontWeight: 'bold' }}>
                                        {item.dispatchQuantity} ({item.watage}),
                                    </span>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleToggle}
                            style={{
                                color: 'black',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textAlign: 'left'
                            }}
                        >
                            {isExpanded ? 'Hide' : 'See More'}
                        </button>
                    </>
                )}
            </div>
        );
    };


    const renderDispatchAmount = (rowData) => {
        // console.log('rowData In dispatch amount', rowData);
        const { salesItems } = rowData;
        const dispatchData = salesItems.map((item) => {
            const quantity = Number(item.quantity) || 0;
            const remainingQuantity = Number(item.remainingQuantity) || 0;
            return {
                dispatchQuantity: quantity - remainingQuantity,
                unitPrice: Number(item?.unitPrice) || 0,
                watage: item.watage
            };
        });

        // Step 2: Calculate dispatch amounts
        const dispatchAmountData = dispatchData.map((item) => ({
            dispatchAmount: item.dispatchQuantity * item.unitPrice,
            unitPrice: item.unitPrice,
            watage: item.watage
        }));

        // Step 3: State for toggling view
        const [isExpanded, setIsExpanded] = useState(false);
        const handleToggle = () => {
            setIsExpanded((prev) => !prev);
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Show the first dispatch amount */}
                <span style={{ fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('en-IN').format(dispatchAmountData[0]?.dispatchAmount.toFixed()) || 'N/A'} ({dispatchAmountData[0]?.watage}),

                </span>
                {dispatchAmountData.length > 1 && (
                    <>
                        {isExpanded && (
                            <div>
                                {dispatchAmountData.slice(1).map((item, index) => (
                                    <span key={index} style={{ display: 'block', fontWeight: 'bold' }}>
                                        {new Intl.NumberFormat('en-IN').format(item.dispatchAmount.toFixed())} ({item?.watage}),
                                    </span>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleToggle}
                            style={{
                                color: 'black',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textAlign: 'left'
                            }}
                        >
                            {isExpanded ? 'Hide' : 'See More'}
                        </button>
                    </>
                )}
            </div>
        );
    };

    const renderQuantity = (rowData) => {
        const { salesItems } = rowData;
        const [isExpanded, setIsExpanded] = useState(false);
        const handleToggle = () => {
            setIsExpanded((prev) => !prev);
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold' }}>{salesItems[0]?.quantity || 'N/A'} ({salesItems[0]?.watage}),</span>
                {salesItems.length > 1 && (
                    <>
                        {isExpanded && (
                            <div>
                                {salesItems.slice(1).map((item, index) => (
                                    <span key={index} style={{ display: 'block', fontWeight: 'bold' }}>
                                        {item.quantity} ({item.watage}),
                                    </span>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleToggle}
                            style={{
                                color: 'black',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textAlign: 'left'
                            }}
                        >
                            {isExpanded ? 'Hide' : 'See More'}
                        </button>
                    </>
                )}
            </div>
        );
    };

    const renderRemainingQuantity = (rowData) => {
        const { salesItems } = rowData
        const data = salesItems.map((item) => {
            return {

                remainingQuantity: item.remainingQuantity,
                wattage: item.watage
            }
        })
        const [isExpanded, setIsExpanded] = useState(false);

        const handleToggle = () => {
            setIsExpanded((prev) => !prev);
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', }}>{salesItems[0]?.remainingQuantity || 'N/A'} ({salesItems[0]?.watage}),</span>
                {salesItems.length > 1 && (
                    <>
                        {isExpanded && (
                            <div>
                                {salesItems.slice(1).map((item, index) => (
                                    <span key={index} style={{ display: 'block', fontWeight: 'bold', }}>
                                        {item.remainingQuantity} ({item.watage}),
                                    </span>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleToggle}
                            style={{
                                color: 'black',
                                cursor: 'pointer',
                                fontSize: '14px',

                                textAlign: 'left'
                            }}
                        >
                            {isExpanded ? 'Hide' : 'See More'}
                        </button>
                    </>
                )}
            </div>
        );
    }

    const baseColumns = [
        {
            field: "piNo",
            header: "PI Number",
            body: null,
        },
        {
            field: "salesItems",
            header: "Item Description",
            body: (rowData) => {
                return rowData.salesItems.map((item, index) => (
                    <div key={index}>
                        ({item.watage})
                        {item.dcr_nondcr} {item.MonofacialBifacial}
                        <p> <strong>Quantity :</strong> ({item.quantity})</p>
                    </div>
                ));
            }
        },
        {
            field: "partyName",
            header: "Customer Name",
            body: renderParty,
        },
        {
            header: "Delivery Address",
            body: renderAddress,
        },
        {
            field: "companyName",
            header: "Company Name",
            body: null,
        },
        {
            field: "amountReceived",
            header: (
                <div
                    style={{
                        userSelect: "text",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <span style={{ userSelect: "text", fontWeight: "bold" }}>Amount</span>
                    <small style={{ userSelect: "text", fontStyle: "italic" }}>
                        (Received by Accountant)
                    </small>
                </div>
            ),
            body: (rowData) =>
                rowData.amountReceived !== undefined
                    ? parseFloat(Number(rowData.amountReceived)).toFixed(2)
                    : "N/A",
        },
        {
            field: "extraAmount",
            header: "Extra Amount",
            body: (rowData) =>
                rowData.extraAmount !== undefined || rowData.extraAmount !== null
                    ? parseFloat(Number(rowData.extraAmount)).toFixed(2)
                    : "0.00",
        },
        // {
        //     field: "balanceAmount",
        //     header: "Due Amount",
        //     body: (rowData) =>
        //         rowData.balanceAmount !== undefined || rowData.extraAmount !== balanceAmount
        //             ? ` ₹ ${new Intl.NumberFormat('en-IN').format(rowData?.balanceAmount)}`
        //             : "0.00"
        // },
        {
            field: "personName",
            header: "Sales Executive Name",
            body: null,
        },
        {
            field: "date",
            header: "Date",
            body: null,
        },
        {
            header: "Actions",
            body: actionBodyTemplate,
        },
    ];

    const dispatchColumns = [
        { field: "quantity", header: "Quantity", body: renderQuantity },
        { field: "remainingQuantity", header: "Remaining Quantity", body: renderRemainingQuantity },
        { field: "dispatchQuantity", header: "Dispatch Quantity", body: renderdispatchQuantity },
        { field: "dispatchAmount", header: "Dispatch Amount", body: renderDispatchAmount },
    ];

    const columnsToRender =
        selectedStatus === "InDispatch" || selectedStatus === "Out"
            ? [
                ...baseColumns.slice(0, 5),
                ...dispatchColumns,
                ...baseColumns.slice(5),
            ]
            : baseColumns;


    const addRow = () => {
        setFormData([
            ...formData,
            {
                Replacement: false,
                PanelType: "",
                Quantity: "",
                ActualUnitPrice: "",
                TotalAmount: "",
                CreatedBy: localStorage.getItem("currentUser"),
            },
        ]);
        setFormErrors([...formErrors, {}]);
    };

    // Remove specific row
    const removeRow = (index) => {
        if (formData.length > 1) {
            const updatedFormData = formData.filter((_, i) => i !== index);
            const updatedErrors = formErrors.filter((_, i) => i !== index);
            setFormData(updatedFormData);
            setFormErrors(updatedErrors);
        } else {
            toast.error("At least one row is required!");
        }
    };

    const calculateFinalBalance = () => {
        if (advanceAmount && currentSalesData?.totalAmount) {
            setFinalBalanceAmount(advanceAmount - currentSalesData.totalAmount);
        }
    };

    return (

        <div className=" h-full flex-grow flex flex-col">

            <DataTable
                value={loading ? [] : data}
                paginator
                rows={8}
                rowsPerPageOptions={[5, 10, 20, 50]}
                scrollable
                scrollHeight="80vh"
                style={{ height: "100%", userSelect: "text" }}
                header={header}
                globalFilter={globalFilter}
                emptyMessage={loading ? null : "No items found."}
                rowClassName={() => ({
                    paddingTop: "0px",
                    paddingBottom: "0px",
                    userSelect: "text",
                })}
            >
                {columnsToRender.map((col, index) => (
                    <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        style={{
                            userSelect: "text",
                            border: "1px solid black",
                            whiteSpace: "nowrap",
                            padding: "5px 8px",
                        }}
                        headerStyle={headerStyle}
                        sortable
                    />
                ))}
            </DataTable>


            {loading && (
                <div className="p-p-3">
                    <table className="p-datatable-table">
                        <tbody>
                            {renderSkeletonRows()}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Final Popup for Conformation  */}
            <Modal show={showConfirmationModal} onHide={handleCancelModal} centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="w-100 text-center">
                        {confirmationAction === 'Final'
                            ? 'Final PI'
                            : confirmationAction === 'Approved'
                                ? 'Approve Sales Order'
                                 : confirmationAction === 'Out'
                                ? 'Dispatched Sales Order'
                                : 'Cancel Sales Order'
                        }
                        {/* Replacement Checkbox */}

                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="px-4 py-4">
                    <div className="confirmation-content">
                        <div className="mb-4">
                            <h5 className="text-center mb-3">
                                {confirmationAction === 'Approved' && currentSalesData?.balanceAmount > 0
                                    // ? 'Have you received due payment from the party?'
                                    // : ''}
                                    ? 'Have you received due payment from the party?'
                                    : confirmationAction === 'Approved'
                                        ? 'Do you want to approve this sales order?'
                                        : ''}
                            </h5>

                            {confirmationAction === 'Approved' && (

                                <div className="amount-input-container">

                                    {/* {currentSalesData?.balanceAmount > 0 && (
                                        // <div className="alert alert-warning">
                                        // <div className="alert bg-danger text-white">
                                        <div className="alert alert-danger" >
                                            Pending Due Amount: ₹{currentSalesData?.balanceAmount}
                                        </div>
                                    )}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Received Amount <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder={"Enter Received Amount"}
                                            // placeholder={`Enter  due amount: ₹${currentSalesData?.balanceAmount}`}
                                            value={amountReceived}
                                            onChange={handleAmountChange}
                                            className={errors.amountReceived ? 'is-invalid' : ''}
                                            style={{
                                                borderColor: errors.amountReceived ? '#dc3545' : '#ced4da',
                                                borderWidth: '2px',
                                            }}
                                            disabled={skipDue}
                                        />
                                        {errors.amountReceived && (
                                            <div className="invalid-feedback">
                                                {errors.amountReceived}
                                            </div>
                                        )}
                                    </Form.Group> */}
                                    { <Form.Group>
                                        <Form.Check
                                            className="custom-checkbox"
                                            type="checkbox"
                                            label="Skip Due Amount"
                                            checked={skipDue}
                                            onChange={handleSkipDueChange}
                                        />
                                    </Form.Group> }
                                </div>
                            )}
                        </div>

                        <div className="confirmation-message text-center mb-4">
                            <p className="fw-bold">
                                {confirmationAction === 'Final'
                                    ? ''
                                    : confirmationAction === 'Approved'
                                        ? ''
                                        : confirmationAction === 'Out'
                                            ? 'Are you sure you want to Dispatch this sales order'
                                            : 'Are you sure you want to cancel this sales order?'
                                }
                            </p>
                        </div>
                        {/* Display Advance Amount */}


                        {confirmationAction === 'Final'  && (
  <div className="alert alert-info mb-3">
    <div className="form-group">
      <label className="font-weight-bold mb-2">PI Type:</label>
      <div className="d-flex">
        <div className="form-check mr-3">
          <input
            type="radio"
            id="Part Wise"
            name="paymentType"
            className="form-check-input"
            value="Part Wise"
            checked={paymentType === 'Part Wise'}
            onChange={() => setPaymentType('Part Wise')}
          />
          <label className="form-check-label" htmlFor="partWise">Part Wise</label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="All"
            name="paymentType"
            className="form-check-input"
            value="All"
            checked={paymentType === 'All'}
            onChange={() => setPaymentType('All')}
          />
          <label className="form-check-label" htmlFor="final">All</label>
        </div>
      </div>
    </div>
  </div>
)}


                        {/* Form rows for Final action */}
                        {confirmationAction === 'Final' &&   paymentType === 'Part Wise'&&(
                            <div className="panel-form mb-4">
                                {formData.map((row, index) => (
                                    <div key={index} className="panel-row mb-4 p-3 border rounded">
                                        <div className="row mb-2">
                                            {/* Row label with remove button */}
                                            <div className="col-12 d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="m-0">Panel #{index + 1}</h6>
                                                {formData.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(index)}
                                                        className="btn btn-sm btn-outline-danger"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row">
                                            {/* Replacement Checkbox */}
                                            <div className="col-md-4 mb-4">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`replacement-${index}`}
                                                        name="Replacement"
                                                        checked={row.Replacement}
                                                        onChange={(e) => handleChange(index, e)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`replacement-${index}`}>
                                                        <strong>Replacement</strong>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Panel Type */}
                                            <div className="col-md-9 mb-3">
                                                <label className="form-label"> <strong>Panel Type</strong> <span className="text-danger">*</span></label>
                                                <select
                                                    className={`form-control ${formErrors[index]?.PanelType ? 'is-invalid' : ''}`}
                                                    name="PanelType"
                                                    value={row.PanelType}
                                                    onChange={(e) => handleChange(index, e)}
                                                // disabled={loading}
                                                >
                                                    <option value="">Select Panel Type</option>
                                                    {panelTypeOptions.map((option) => (
                                                        <option key={option.salesOrderItemId} value={option.combinedKey}>
                                                            {option.combinedKey}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formErrors[index]?.PanelType && (
                                                    <div className="invalid-feedback">{formErrors[index].PanelType}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row">
                                            {/* Quantity */}
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label"> <strong>Quantity</strong> <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${formErrors[index]?.Quantity ? 'is-invalid' : ''}`}
                                                    name="Quantity"
                                                    value={row.Quantity}
                                                    placeholder="Enter Quantity"
                                                    onChange={(e) => handleChange(index, e)}

                                                />
                                                {formErrors[index]?.Quantity && (
                                                    <div className="invalid-feedback">{formErrors[index].Quantity}</div>
                                                )}
                                            </div>

                                            {/* Unit Price */}
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label"> <strong>Unit Price</strong> <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${formErrors[index]?.ActualUnitPrice ? 'is-invalid' : ''}`}
                                                    name="ActualUnitPrice"
                                                    value={row.ActualUnitPrice}
                                                    placeholder="Enter Unit Price"
                                                    onChange={(e) => handleChange(index, e)}
                                                    disabled
                                                    readOnly={row.Replacement || (row.PanelType && !row.Replacement)}
                                                />
                                                {formErrors[index]?.ActualUnitPrice && (
                                                    <div className="invalid-feedback">{formErrors[index].ActualUnitPrice}</div>
                                                )}
                                            </div>

                                            {/* Total Amount */}
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label"> <strong>Amount</strong> </label>
                                                <input
                                                    type="text"
                                                    className={`form-control `}
                                                    // className={`form-control ${formErrors[index]?.TotalAmount ? 'is-invalid' : ''}`}
                                                    name="TotalAmount"
                                                    value={row.TotalAmount}
                                                    placeholder="Auto-calculated"
                                                    readOnly
                                                    disabled
                                                />
                                                {/* {formErrors[index]?.TotalAmount && (
                                                    <div className="invalid-feedback">{formErrors[index].TotalAmount}</div>
                                                )} */}
                                            </div>
                                        </div>
                                        {confirmationAction === 'Final'  && row.PanelType && (
                                            <div className="alert alert-info mb-3">
                                                <p><strong>Available Quantity:</strong> {
                                                    panelTypeOptions
                                                        .filter((item) => item.combinedKey === row.PanelType) // Filter by selected panel type
                                                        .reduce((total, item) => total + (parseFloat(item.quantity) || 0), 0) // Sum the quantity
                                                }</p>

                                            </div>
                                        )}
                                        {formErrors[index]?.TotalAmount && (
                                            <div className="alert alert-danger mb-3 p-3 rounded shadow-sm" style={{backgroundColor: '#ffe6e6',color: '#b00020',borderLeft: '5px solid #b00020',display: 'flex',alignItems: 'center'}}>                                                                                                                                            
                                                <i className="bi bi-exclamation-triangle-fill me-2"
                                                    style={{ fontSize: '1.2rem', color: '#b00020' }}>
                                                </i>
                                                <p className="mb-0"><strong>{formErrors[index].TotalAmount}</strong> </p>
                                            </div>
                                        )}

                                    </div>
                                ))}



                                {/* Add Row Button */}
                                <div className="d-flex justify-content-center mt-3">
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="btn btn-success"
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Add Row
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-center gap-3">
                            <Button
                                onClick={handleCancelModal}
                                className="px-4 py-2"
                                style={{
                                    backgroundColor: '#6c757d',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '120px',
                                    fontWeight: '600',
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    handleConfirmAction();
                                    // emptyAllStates();

                                }}


                                className="px-4 py-2"
                                style={{
                                    backgroundColor:
                                        confirmationAction === 'Final'
                                            ? '#28a745'
                                            : confirmationAction === 'Approved'
                                                ? '#689F38'
                                                : '#dc3545',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '120px',
                                    fontWeight: '600',
                                }}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                ) : (
                                    "Confirm"
                                )}
                            </Button>

                        </div>
                    </div>
                </Modal.Body>

            </Modal>

        </div>

    );
};

export default SalesListTable;