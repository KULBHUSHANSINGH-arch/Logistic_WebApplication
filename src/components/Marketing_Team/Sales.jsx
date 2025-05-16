
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Form, Container, Col, Button, Row, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import '../Loader/Loader.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import img1 from '../../assets/logo/logo.png';
import Table from '../Table/Table';
import { dev } from "../../utils/ApiUrl";
import { Toast } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select';

const date = new Date().toDateString();
const Sales = () => {
  const { user } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [PartyNameId, setPartyNameId] = useState('');
  const [piNo, setPiNo] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [purchaseOrderNo, setPurchaseOrderNo] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("LC");
  const [deliveryTerms, setDeliveryTerms] = useState("");
  const [placeOfDispatch, setPlaceOfDispatch] = useState("");
  const [destination, setDestination] = useState("");
  const [isAdvancePayment, setIsAdvancePayment] = useState("Yes");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [expectedDateOfPayment, setExpectedPaymentDate] = useState("");
  const [poDate, setPoDate] = useState("");
  const [personId, setPersonId] = useState('');
  const [deliveryStateCode, setDeliveryStateCode] = useState('');
  const [partyStateCode, setPartyStateCode] = useState('');
  const [partyList, setPartyList] = useState([]);
  const [deliveryAddressList, setDeliveryList] = useState([]);
  const navigate = useNavigate();
  const [salesID, setSalesID] = useState('');
  let location = useLocation();
  const { salesOrderId, Type, selectedStatus } = location.state || {};
  const { salesOrderItemId } = location.state || {};
  const [totalAmount, setTotalAmount] = useState('');
  const [BillingId, setBillingId] = useState('');


  const [errors, setErrors] = useState({});
  const [DispatchList, setDispatchList] = useState([]);
  const [paymentTerms1, setPaymentTerm1] = useState("100% before dispatch");
  const [incoTerms, setIncoTerms] = useState("Freight charges is inclusive");
  const [insurance, setInsurance] = useState("Transit insurance inclusive");
  const [productwarranty, setProductwarranty] = useState("");
  const [warranty, setWarranty] = useState("25");
  const [WarrantyList, setWarrantyList] = useState([]);

  const [companyName, setCompanyName] = useState("");
  const [bank, setBankName] = useState("");
  const [lcNumber, setLcNumber] = useState("");
  const [lcDate, setLcDate] = useState("");
  const [setStatus] = useState(null);

  const [salesPersonList, setSalesPersonList] = useState([])
  const [createdBy, setCreatedBy] = useState('');
  const [createdByError, setCreatedByError] = useState('');

  const [panelPrice, setPrice] = useState();

  const [FullAddress, setFullAddress] = useState("");
  const [fullCustomerAddress, setFullCustomerAddress] = useState('');
  const [fullCustomerAddressList, setFullCustomerAddressList] = useState([]);



  // console.log('createdBy', createdBy )

  // fetching sales person list---------
  const fetchSalesPersnLists = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/user/dropdownSalesPerson`, {
        method: "POST",
        body: JSON.stringify({ partyNameId: '' }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        setLoading(false);
        setSalesPersonList([])
        // toast.error("Sales Person list fetching failed");
        return;
      }
      setLoading(false);
      const data = await resp.json()
      // console.log('Person data', data)
      setSalesPersonList(data.allList);
    } catch (error) {
      setLoading(false);
      // console.log('fetching sales person failed', error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchSalesPersnLists()
  }, [])



  // const [salesOrderData,setSalesOrderData] = useState([])
  // const [selectedDeliveryId, setSelectedDeliveryId] = useState("");

  // checking user status-------------------------------
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${dev}/user/checkActive`, {
          method: "POST",
          body: JSON.stringify({ personId: user?.personId }),
          headers: {
            "content-type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data?.status?.toLowerCase() === "inactive") {
          handleClick();
        }

        // setError('');
      } catch (err) {
        setStatus(null);
        console.log("error", err);
        // setError('Employee not found or an error occurred.');
      }
    };
    checkStatus();
  }, []);

  useEffect(() => {
    getWarranty();
  }, []);

  const getWarranty = async () => {
    try {
      const response = await axios.get(`${dev}/sales/getWaranty`);
      const { data } = response;

      // console.log("Checking the warranty List", data);
      setWarrantyList(data);
    } catch (error) {
      console.error("Error fetching warranty list:", error);
    }
  };


  useEffect(() => {
    getPlaceOfDispatchData();
  }, []);

  const getPlaceOfDispatchData = async () => {
    try {
      const response = await axios.post(`${dev}/vehicleIN/getDispatchLocations`);
      const { data } = response;

      // console.log("Checking the Dispatch List", data);
      setDispatchList(data); // Set the fetched dispatch list data
    } catch (error) {
      console.error("Error fetching dispatch list:", error);
    }
  };


  const CompanyList = [
    { value: 'Gautam Solar Pvt Ltd', label: 'Gautam Solar Pvt Ltd' },
    { value: 'Galo Energy Pvt Ltd', label: 'Galo Energy Pvt Ltd' }

  ];

  const BankList = [
    { value: 'HDFC', label: 'HDFC' },
    { value: 'ICICI', label: 'ICICI' }

  ];

  const [items, setItems] = useState([{
    id: 1,
    salesOrderItemId: '',
    HS: '85414300',
    watage: '',
    dcr_nondcr: '',
    MonofacialBifacial: '',
    MBT: "",

    isReplacement: false,
    quantity: '',
    unitPrice: '',
    // panelPrice:'',
    value: '',
    GST: '',
    IGST: '',
    CGST: '',
    SGST: '',
    totalAmount: '',
  }]);

  // console.log("itemssssss", partyList);//

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    setPersonId(currentUser);
    // console.log('currentUser data ID ', salesOrderId);/
  }, []);

  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toDateString(); // Returns format like "Tue Nov 05 2024"
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // console.log('personId data', personId);

  const notifySuccess = () =>
    toast.success(
      salesOrderId
        ? "Sales Order Updated Successfully!"
        : "Sales Order Generated Successfully!",
      { autoClose: 5000 }
    );

  const fetchPartyList = async () => {
    const personId = localStorage.getItem('currentUser')
    // console.log('PERSONiDDDDDDDDD', personId);
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/party/getSalesParty`, {
        method: "POST",
        body: JSON.stringify({ personId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        Toast.error("Party list fetching failed");
        return;
      }
      const data = await resp.json();
      const partyData = data.data || [];

      setPartyList(partyData);
      // console.log('checking party list data', partyData);

    } catch (error) {
      Toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // const getDeliveryAddressByPartyName = async () => {    
  //   if (!customerName) return;
  //   try {
  //     setLoading(true);
  //     const resp = await fetch(`${dev}/party/getDeliveryAddByPartyName`, {
  //       method: 'POST',
  //       body: JSON.stringify({ PartyNameId: customerName }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const result = await resp.json();
  //     if (!resp.ok) {
  //       setDeliveryList([]);
  //       setLoading(false);
  //       notifySuccess();
  //       return Toast.error('Delivery address not found');
  //     }

  //     const deliveryData = result.data || [];
  //     setDeliveryList(deliveryData);
  //     console.log("hiiiiii");

  //     if (deliveryData.length > 0) {
  //       console.log("Delivery Address List:", deliveryData);
  //       const selectedDelivery = deliveryData.find(
  //         (deliv) => deliv.deliveryId === deliveryAddress
  //       );
  //       setDeliveryStateCode(selectedDelivery?.deliveryStateCode || '');
  //       console.log("Selected Delivery:", selectedDelivery?.deliveryStateCode);
  //     } else {

  //       // toast.warn('Delivery list is empty or undefined, or selectedDeliveryId is not set.');
  //     }
  //     // if (deliveryData.length > 0) {
  //     //   const { deliveryStateCode } = deliveryData[0];
  //     //   setDeliveryStateCode(deliveryStateCode);
  //     // }
  //   } catch (error) {
  //     Toast.error('Fetching delivery address failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getDeliveryAddressByBilling = async () => {
    if (!customerName) return;
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/party/getDeliveryAddByPartyName`, {
        method: 'POST',
        body: JSON.stringify({ PartyNameId: customerName, type: 'Billing' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await resp.json();
      if (!resp.ok) {
        setFullCustomerAddressList([]);
        setLoading(false);
        notifySuccess();
        return Toast.error('Delivery address not found');
      }

      const billingData = result.data || [];
      // console.log('checking the Billing Type', billingData);

      setFullCustomerAddressList(billingData);
      // console.log("hiiiiii");

      if (billingData.length > 0) {
        // console.log("Delivery Address List:", billingData);
        const selectedfullCustomerAddress = billingData.find(
          (deliv) => deliv.deliveryId === fullCustomerAddress
        );


        console.log('checking the Billing id', selectedfullCustomerAddress.deliveryId);

        if (selectedfullCustomerAddress) {
          // setFullCustomerAddress(selectedfullCustomerAddress.Address);
          // setBillingId(selectedfullCustomerAddress.deliveryId);
          // setBillingId(selectedfullCustomerAddress.deliveryId);
          console.log('checking the Billing Customer Id', selectedfullCustomerAddress.deliveryId);
        }
      }
    } catch (error) {
      Toast.error('Fetching delivery address failed');
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryAddressByDelivery = async () => {
    if (!customerName) return;
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/party/getDeliveryAddByPartyName`, {
        method: 'POST',
        body: JSON.stringify({ PartyNameId: customerName, type: 'Delivery' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await resp.json();
      if (!resp.ok) {
        setDeliveryList([]);
        setLoading(false);
        notifySuccess();
        return Toast.error('Delivery address not found');
      }

      const deliveryData = result.data || [];
      setDeliveryList(deliveryData);
      // console.log("hiiiiii");

      if (deliveryData.length > 0) {
        // console.log("Delivery Address List:", deliveryData);
        const selectedDelivery = deliveryData.find(
          (deliv) => deliv.deliveryId === deliveryAddress
        );
        setDeliveryStateCode(selectedDelivery?.deliveryStateCode || '');
        // console.log("Selected Delivery:", selectedDelivery?.deliveryStateCode);
      }
    } catch (error) {
      Toast.error('Fetching delivery address failed');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getDeliveryAddressByPartyName();
  // }, [customerName]);
  useEffect(() => {
    getDeliveryAddressByBilling();
    getDeliveryAddressByDelivery();
  }, [customerName]);

  useEffect(() => {
    // console.log('checking the PI Api', Type);
    fetchPartyList();
    if ((salesOrderId === "" || salesOrderId === undefined || salesOrderId === null) || (Type === 'Resend')) {
      // console.log("naveeeeen 11");
      getPINumber();



    }
    // console.log('party all ', PurchaseData)
  }, []);
  useEffect(() => {
    // console.log('checking the PI Api', Type);
    if (companyName && Type == "Resend") {
      getPINumbers();

    }
    // console.log('party all ', PurchaseData)
  }, [companyName]);

  const getPINumbers = async () => {
    // Check if companyName is selected
    // if (!companyName) {
    //   console.error("Error: No company name selected");

    //   setErrors((prevErrors) => ({ ...prevErrors, piNo: "Please select a company name" }));
    //   return;
    // }

    try {
      // console.log('checking Get PI Number');
      const response = await axios.post(`${dev}/sales/getPiNo`, {
        companyName: companyName.trim(),
      });
      const piNo = response.data.piNo;
      // console.log('checking Get PI Number Response', response.data.piNo);
      if (companyName === "Gautam Solar Pvt Ltd") {
        setPiNo(`GSPL/25-26/${piNo}`);
      } else if (companyName === "Galo Energy Pvt Ltd") {
        setPiNo(`GEPL/25-26/${piNo}`);
      }

      // console.log("Company Name", companyName);
    } catch (error) {
      console.error("Error Fetching in PI number:", error);
      setErrors((prevErrors) => ({ ...prevErrors, piNo: "Error fetching PI number" }));
    }
  };


  const getPINumber = async () => {
    // Check if companyName is selected
    if (!companyName) {
      // console.error("Error: No company name selected");

      setErrors((prevErrors) => ({ ...prevErrors, piNo: "Please select a company name" }));
      return;
    }

    try {
      // console.log('checking Get PI Number');
      const response = await axios.post(`${dev}/sales/getPiNo`, {
        companyName: companyName.trim(),
      });
      const piNo = response.data.piNo;
      // console.log('checking Get PI Number Response', response.data.piNo);
      if (companyName === "Gautam Solar Pvt Ltd") {
        setPiNo(`GSPL/25-26/${piNo}`);
      } else if (companyName === "Galo Energy Pvt Ltd") {
        setPiNo(`GEPL/25-26/${piNo}`);
      }

      // console.log("Company Name", companyName);
    } catch (error) {
      console.error("Error Fetching in PI number:", error);
      setErrors((prevErrors) => ({ ...prevErrors, piNo: "Error fetching PI number" }));
    }
  };

  useEffect(() => {
    if (companyName && (salesOrderId === "" || salesOrderId === undefined || salesOrderId === null)) {
      // console.log("naveeeeen 12");
      getPINumber();
    }
  }, [companyName]);



  const handleCancel = () => {
    navigate('/sales-order');
  }

  const handlePoDateChange = (e) => {
    const inputDate = e.target.value;
    setPoDate(inputDate);
  };

  const handleExpectedPaymentDateChange = (e) => {
    const inputDate = e.target.value;
    setExpectedPaymentDate(inputDate);
  };

  const fetchChildData = (data) => {
    // console.log('Data received in fetchChildData:', data);
    // setChildData(data);
    setItems(data);      // Also updates items
  };
  const fetchPanelPrice = async (dcr_nondcr, wattage, MonofacialBifacial, MBT, itemId) => {
    try {
      const response = await axios.post(`${dev}/sales/getPanelPrice`, {
        PanelDcr_nondcr: dcr_nondcr,
        wattage: wattage,
        moduleType: MonofacialBifacial,
        monobi: MBT,
        personId: user.designation === 'Super Admin' ? createdBy : personId,
      });

      const { data } = response.data;
      const panelPrice = data[0].PanelPrice;

      // Update the specific item with its panelPrice
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, panelPrice } : item
        )
      );

      validateUnitPriceForItem(itemId, panelPrice);
    } catch (error) {
      console.error("Error fetching panel price:", error);
    }
  };


  const validateForm = () => {
    const newErrors = {};
    if (!customerName) newErrors.customerName = 'Customer Name is required.';
    if (!deliveryAddress) newErrors.deliveryAddress = 'Delivery Address is required.';
    if (!fullCustomerAddress) newErrors.fullCustomerAddress = 'Billing Address is required.';
    if (!companyName) newErrors.companyName = 'Company Name is required.';
    if (user.designation === 'Super Admin' && !createdBy) newErrors.createdBy = 'Select Sales Person'

    // if (!bank) newErrors.bank = 'Bank Name is required.';
    if (companyName === "Gautam Solar Pvt Ltd" && !bank && paymentTerms === "RTGS/NEFT") {
      newErrors.bank = 'Bank Name is required.';
    }

    if (!paymentTerms) newErrors.paymentTerms = 'Payment Mode is required.';
    // if (!destination) newErrors.destination = 'Destination is required.';
    // if (!purchaseOrderNo) newErrors.purchaseOrderNo = 'PO Number  is required.';
    if (!placeOfDispatch) newErrors.placeOfDispatch = 'Place of Dispatch is required.';

    if (!paymentTerms1) newErrors.paymentTerms1 = 'Place of paymentTerms1 is required.';
    if (!incoTerms) newErrors.incoTerms = 'Place of incoTerms is required.';
    if (!insurance) newErrors.insurance = 'Place of insurance is required.';
    if (!warranty) newErrors.warranty = 'Place of warranty is required.';
    // if (!productwarranty) newErrors.productwarranty = 'Place of productwarranty is required.';


    if (!deliveryTerms) newErrors.deliveryTerms = 'Delivery Term is required.';
    if (!isAdvancePayment) newErrors.isAdvancePayment = 'Advance Payment is required.';
    if (purchaseOrderNo && !poDate) {
      newErrors.poDate = 'Purchase Order Date is required ';
    } else if (!purchaseOrderNo && !poDate) {
      delete newErrors.poDate;
    }

    // if (!poDate) newErrors.poDate = 'PO Date is required.';
    // if (purchaseOrderNo && !poDate) {
    //   newErrors.poDate = 'Purchase Order Date is required ';
    // }

    if (isAdvancePayment === "Yes") {
      if (!advanceAmount) {
        newErrors.advanceAmount = 'Amount is required for Advance Payment.';
      }
    }
    if (isAdvancePayment === "No") {
      if (paymentTerms === "RTGS/NEFT" && !expectedDateOfPayment) {
        newErrors.expectedDateOfPayment = 'Expected Payment Date is required.';
      }
      if (paymentTerms === "LC") {
        delete newErrors.expectedDateOfPayment;
      }
    }
    // if (isAdvancePayment === "No") {
    //   if (!expectedDateOfPayment) {
    //     newErrors.expectedDateOfPayment = 'Expected Payment Date is required.';
    //   }
    // }

    const itemErrors = items.reduce((acc, item) => {
      const itemError = {};
      if (!item.quantity) itemError.quantity = 'Quantity is required';

      if (!item.MonofacialBifacial) itemError.MonofacialBifacial = 'Module Type is required';
      if (!item.MBT) itemError.MBT = 'Monofacial Bifacial  is required';

      if (!item.dcr_nondcr) itemError.dcr_nondcr = 'DCR Non Dcr is required';
      if (!item.watage) itemError.watage = 'Watage is required';
      // if (!item.unitPrice) itemError.unitPrice = 'Unit Price is required';
      if (!item.totalAmount) itemError.totalAmount = 'Total Amount is required';
      if (item.isReplacement !== "true" && !item.unitPrice) {
        itemError.unitPrice = 'Unit Price is required';
      }
      // console.log("panelPricesstttt", item.panelPrice, item.unitPrice, item.isReplacement);
      const panelPrice = Number(item.panelPrice) || 0;
      const unitPrice = Number(item.unitPrice) || 0;

      // Ensure isReplacement is treated as a boolean
      const isReplacement = String(item.isReplacement).toLowerCase() === 'true';

      // Debugging Logs
      // console.log("Panel Price:", panelPrice);
      // console.log("Unit Price:", unitPrice);
      // console.log("Is Replacement (Parsed):", isReplacement);
      // console.log("!isReplacement:", !isReplacement);
      // console.log("panelPrice > unitPrice:", panelPrice > unitPrice);

      if (!isReplacement && panelPrice > unitPrice) {
        // console.log("✅ Validation Triggered");
        itemError.unitPrice = `Please Enter Minimum Price of ${panelPrice}`;
      } else {
        // console.log("❌ Validation Failed");
      }






      if (Object.keys(itemError).length > 0) {
        acc[item.id] = itemError;
      }
      return acc;
    }, {});

    if (Object.keys(itemErrors).length > 0) {
      newErrors.items = itemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect((e) => {

    if (items?.[0]?.quantity || items?.[0]?.qty || items?.[0]?.price) {
      validateForm();
    }
  }, [items]);




  const handleSubmit = async (e) => {
    // console.log('ccccccccccccccccccccccccccccc');
    // console.log('checking all data',PurchaseData )


    if ((salesOrderId === "" || salesOrderId === undefined || salesOrderId === null) || (Type === 'Resend')) {
      // console.log("naveeeeen");
      getPINumber();
    }
    e.preventDefault();


    if (!validateForm()) {
      return;
    }

    /**   Clear LC fields when payment mode is RTGS/NEFT  **/
    const lcData = paymentTerms === "LC"
      ? {
        lcDate: lcDate ? new Date(lcDate).toDateString() : "",
        lcNumber
      }
      : { lcDate: "", lcNumber: "" };

    /** when advanceAmount will be cleared if isAdvancePayment is "No" ::::
     
    JB isAdvancePayment  amount No Hoga tb advanceAmount Null ho jayega
     
     */
    if (isAdvancePayment === "No") {
      setAdvanceAmount("");
    }


    const processedItems = items.map(item => ({
      ...item,
      MonofacialBifacial: `${item.MonofacialBifacial || ""} ${item.MBT || ""}`,
    }));


    const withoutIgst = processedItems.map((item) => {
      const { IGST, ...rest } = item;
      return rest;
    });

    const selectedDelivery = fullCustomerAddressList.find(
      (deliv) => deliv.Address === fullCustomerAddress
    );

    const finalDeliveryId = selectedDelivery ? selectedDelivery.deliveryId : "";

    console.log("Selected Delivery ID:", finalDeliveryId);

    const PurchaseData = {
      salesID: salesOrderId && (Type != 'Resend') ? salesOrderId : "",
      salesOrderItemId,
      customerName,
      customerId: BillingId,
      deliveryAddress,
      companyName,
      bank,
      ...lcData,
      // lcNumber,
      // lcDate,
      piNo,
      purchaseOrderNo,
      paymentTerms,
      deliveryTerms,
      deliveryStateCode,
      partyStateCode,
      placeOfDispatch,
      paymentTerms1,
      incoTerms,
      insurance,
      warranty,
      productwarranty,
      destination,
      isAdvancePayment,
      advanceAmount,  /** when  advanceAmount will be cleared if isAdvancePayment is "No" */
      expectedDateOfPayment: formatDateForBackend(expectedDateOfPayment),
      poDate: formatDateForBackend(poDate),
      date,
      personId: user.designation === 'Super Admin' ? createdBy : personId,
      salesItems: withoutIgst,
      totalAmount,
      fullCustomerAddress

    };

    // console.log("Payload Data ", PurchaseData);




    setLoading(true);
    try {
      const response = await axios.post(
        `${dev}/sales/addSalesDetails`,
        PurchaseData,
        { headers: { 'Content-Type': 'application/json; charset=UTF-8', } }
      );
      if (response.status === 200) {
        // console.log('Form submitted successfully:', response.data);
        notifySuccess();
        setTimeout(() => {
          setLoading(false);
          navigate('/sales-order');
        }, 1000);
      } else {
        setLoading(false);
        console.error('Unexpected response:', response);
        setErrors(prevErrors => ({ ...prevErrors, form: 'Failed to submit form. Unexpected response from server.' }));
      }
    } catch (error) {
      setLoading(false);
      console.error('Error submitting form:', error.message);
      setErrors(prevErrors => ({ ...prevErrors, form: 'Failed to submit form. Please check the server configuration.' }));
    }
  };

  const formatLcDateForInput = (dateString) => {
    const date = new Date(dateString);
    if (date instanceof Date && !isNaN(date)) {
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adds leading zero for month
      const day = ("0" + date.getDate()).slice(-2); // Adds leading zero for day
      return `${year}-${month}-${day}`; // Return in "yyyy-mm-dd" format
    }
    return ''; // Return empty string if invalid date
  };




  /**Binding the data */
  useEffect(() => {
    // console.log('Child data:', childData);
    const personId = localStorage.getItem('currentUser');
    // console.log('Binding the Person Id checking', personId);
    if (salesOrderId && partyList.length > 0) {
      setLoading(true);
      axios.post(`${dev}/sales/getSalesDetails`, { salesID: salesOrderId, personId, status: selectedStatus })
        .then((response) => {
          const salesDataArray = response.data.data;
          // console.log("API Response:", salesDataArray);
          const salesOrderData = salesDataArray.find(item => item.salesOrderId === salesOrderId);
          // const salesOrderData = salesDataArray.find(item => item.salesOrderId === salesOrderId);
          console.log('checking Status', selectedStatus);


          // console.log('RE Check Full Customer Address : ', salesOrderData.fullCustomerAddress);

          if (salesOrderData) {
            setCustomerName(salesOrderData.customerName || '');
            setPartyNameId(salesOrderData.PartyNameId || '');
            setDeliveryAddress(salesOrderData.deliveryAddress || '');
            setFullCustomerAddress(salesOrderData?.fullCustomerAddress || '');
            setBillingId(salesOrderData?.customerId || '');

            console.log('checking Customer full address', salesOrderData.fullCustomerAddress);
            console.log('checking Customer 444444', salesOrderData.customerId);

            setCompanyName(salesOrderData.companyName || '');
            setBankName(salesOrderData.bank || '');
            setLcNumber(salesOrderData.lcNumber || '');
            // setLcDate(salesOrderData.lcDate || '');
            // setLcDate(formatLcDateForInput(salesOrderData.lcDate || ''));
            setLcDate(formatLcDateForInput(salesOrderData.lcDate || ''));

            setPiNo(salesOrderData.piNo || '');
            setPurchaseOrderNo(salesOrderData.purchaseOrderNo || '');
            setPaymentTerms(salesOrderData.paymentTerms || 'LC');
            setDeliveryTerms(salesOrderData.deliveryTerms || '');
            setPlaceOfDispatch(salesOrderData.placeOfDispatch || '');

            setPaymentTerm1(salesOrderData.paymentTerms1 || '100% before dispatch');
            setIncoTerms(salesOrderData.incoTerms || 'Freight charges is inclusive');
            setInsurance(salesOrderData.insurance || 'Transit insurance inclusive');
            setProductwarranty(salesOrderData.warranty || '');
            setWarranty(salesOrderData.productwarranty || '25');

            setDestination(salesOrderData.destination || '');
            setIsAdvancePayment(salesOrderData.isAdvancePayment || 'Yes');
            setAdvanceAmount(salesOrderData.advanceAmount || '');
            setExpectedPaymentDate(formatDateForInput(salesOrderData.expectedDateOfPayment || ''));
            setPoDate(formatDateForInput(salesOrderData.poDate || ''));

            if (user?.designation == 'Super Admin') {
              setCreatedBy(salesOrderData?.createdBy)
            }

            if (partyList.length > 0) {
              const selectedParty = partyList.find(party => party.PartyNameId === salesOrderData.PartyNameId);

              // console.log('Selected Party:', selectedParty);
              // console.log('partyStateCode:', selectedParty.partyStateCode);
              setPartyStateCode(selectedParty.partyStateCode || '');


            }
            else {
              console.warn("PartyNameId not provided or partyList is empty.");
            }


            // Attempt to bind salesItems array
            if (salesOrderData.salesItems?.length > 0) {

              const mappedItems = salesOrderData.salesItems.map((item, index) => {

                // const keywords = ["Monofacial", "Bifacial"];
                // let beforeKeyword = "";
                // let keyword = "";

                // Find the keyword in the string
                // const foundKeyword = keywords.find((key) => item?.MonofacialBifacial?.includes(key));
                // if (foundKeyword) {
                //   // Split the string at the found keyword
                //   const parts = item?.MonofacialBifacial.split(foundKeyword);
                //   beforeKeyword = parts[0]?.trim() || "";
                //   keyword = foundKeyword;
                // } else {
                //   console.warn(`No matching keyword found in: ${item.MonofacialBifacial}`);
                //   beforeKeyword = item?.MonofacialBifacial || "Unknown";
                // }




                // console.log('sales order data', salesOrderData);
                return {

                  id: index + 1 || '',
                  salesOrderItemId: item.salesOrderItemId && (Type != 'Resend') || '',
                  HS: item.HS || '',
                  watage: item.watage || '',
                  dcr_nondcr: item.dcr_nondcr || '',
                  // MonofacialBifacial: beforeKeyword, 
                  // MBT: keyword,
                  // Category: MonofacialBifacial,
                  // Category: MBT,
                  MBT: item.Category || '',
                  MonofacialBifacial: item.TypeMono || '',

                  isReplacement: item.isReplacement === "true" || item.isReplacement === 'true' ? "true" : "false",
                  quantity: item.quantity || '',
                  unitPrice: item.unitPrice || '',
                  value: item.value || '',
                  GST: item.GST || '',
                  IGST: item.value && item.GST
                    ? (Number(item.value) + Number(item.value) * (Number(item.GST) / 100)).toFixed(2)
                    : '', // Calculate IGST or set empty string if value or GST is missing
                  CGST: item.CGST || '',
                  SGST: item.SGST || '',
                  totalAmount: item.totalAmount || '',
                  itemDescription: item.itemDescription || '',



                };


              });

              // console.log('igst coming', salesOrderData.salesItems)
              setItems(mappedItems);

              mappedItems.forEach((item) => {
                fetchPanelPrice(item.dcr_nondcr, item.watage, item.MonofacialBifacial, item.MBT, item.id, item.personId);
              });
              // console.log("Mapped Items set to state:", mappedItems);
            }


            else {
              console.warn("No sales items found in the salesOrderData.");
              toast.warn("No sales items found in this sales order.");
            }
          } else {
            console.warn("Sales order not found for the provided salesOrderId");
            // toast.warn("Sales order not found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching sales order data:", error);
          // toast.error("Failed to fetch sales order data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [salesOrderId, partyList]);

  const clearError = (fieldName) => {
    setErrors((prevErrors) => {
      const { [fieldName]: _, ...rest } = prevErrors; // Remove the specific field's error
      return rest;
    });
  };

  const salesOptions = salesPersonList && salesPersonList.map(option => ({
    value: option?.personId,
    label: option?.userName
  }));

  const handleSelectChange = (selectedOption) => {
    setCreatedBy(selectedOption ? selectedOption.value : '');

    if (selectedOption) {
      setErrors(prevErrors => ({ ...prevErrors, createdBy: '' }));
    }
  };



  return (
    <Container className="fullPage py-5"
      style={{
        background: "linear-gradient(to top, rgb(241, 144, 144) 0%, rgb(137, 126, 221) 100%)",
        minHeight: "100vh", marginTop: "-1%", width: "100%", maxWidth: "1500px",
        padding: "0 20px", boxSizing: "border-box", zIndex: 1
      }}
    >
      <div className="form-detail" style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', position: 'relative' }} >
        {loading && (
          <div className="loader-overlay">
            <Loader type="ThreeDots" color="#006bff" height={80} width={80} />
          </div>
        )}
        <div className={`form-content ${loading ? 'blurred' : ''}`}>
          <Image src={img1} alt="" className="text-center" rounded style={{ width: '25%', marginLeft: "36%" }} />
          <h2 className="text-center" style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '24px', marginTop: "12px", marginBottom: '12px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }}>
            {/* {salesOrderId ? "Edit  Sales Order" : "Sales Order" }  */}
            {salesOrderId ? (Type !== 'Resend' ? "Edit Sales Order" : "Make PI with Same Data") : "Sales Order"}

          </h2>

          <div className="container mt-5">
            <div className="card" style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px', borderBottom: '0px' }}>
              <div className="card-body">
                <form
                >

                  {/* Select sales for Only Super admin */}

                  <div className="row g-3 mb-3">
                    {
                      user.designation === 'Super Admin' && (
                        // <div className="col-md-4">
                        //   <label htmlFor="companyName" className="form-label">
                        //     Sales Executive<span className="star" style={{ color: 'red' }}>*</span>
                        //   </label>
                        //   <select
                        //     style={{ border: errors?.createdBy ? '2px solid red' : '2px solid black' }}
                        //     id="salesExecutive"
                        //     className="form-select"
                        //     value={createdBy}
                        //     // onChange={handleCompanyChange}
                        //     onChange={(e) => {

                        //       setCreatedBy(e.target.value)

                        //       if (e.target.value) {
                        //         setErrors((prevErrors) => ({...prevErrors, createdBy: '' }));
                        //       }

                        //     }}
                        //     required

                        //   >
                        //     <option value="">Select Sales Executive</option>
                        //     {salesPersonList.map((option) => (
                        //       <option key={option.personId} value={option.personId}>
                        //         {option.userName}
                        //       </option>
                        //     ))}
                        //   </select>
                        //   {errors?.createdBy && <div className="text-danger">{errors?.createdBy}</div>}
                        // </div>
                        <div className="col-md-4">
                          <label htmlFor="salesExecutive" className="form-label">
                            Sales Executive<span className="star" style={{ color: 'red' }}>*</span>
                          </label>
                          <Select
                            id="salesExecutive"
                            options={salesOptions}
                            value={salesOptions.find(option => option.value === createdBy) || ''}
                            onChange={handleSelectChange}
                            styles={{
                              control: (base) => ({
                                ...base,
                                border: errors?.createdBy ? '2px solid red' : '2px solid black'
                              })
                            }}
                            isSearchable
                          />
                          {errors?.createdBy && <div className="text-danger">{errors?.createdBy}</div>}
                        </div>
                      )

                    }
                    <div className="col-md-4">
                      <label htmlFor="companyName" className="form-label">
                        PI For<span className="star" style={{ color: 'red' }}>*</span>
                      </label>
                      <select
                        style={{ border: errors.companyName ? '2px solid red' : '2px solid black' }}
                        id="companyName"
                        className="form-select"
                        value={companyName}
                        // onChange={handleCompanyChange}
                        onChange={(e) => {
                          const selectedCompanyName = e.target.value;
                          clearError('companyName')
                          setCompanyName(selectedCompanyName);
                          if (selectedCompanyName !== "Gautam Solar Pvt Ltd") {
                            setBankName("");
                          }
                        }}
                        required
                        disabled={salesOrderId && (Type != 'Resend')}
                      >
                        <option value="">Select Company Name</option>
                        {CompanyList.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.companyName && <div className="text-danger">{errors.companyName}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="piNo" className="form-label">
                        PI Number<span className="star" style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        style={{ border: '2px solid black' }}
                        type="text"
                        id="piNo"
                        className="form-control"
                        value={piNo}
                        onChange={(e) => setPiNo(e.target.value)}
                        readOnly
                        disabled
                      />
                    </div>




                  </div>

                  <div className="row g-3 mb-3">

                    <div className="col-md-4">
                      <label htmlFor="date" className="form-label">Date<span className="star" style={{ color: 'red' }}>*</span></label>
                      <input
                        style={{ border: '2px solid black' }}
                        type="text"
                        id="date"
                        className="form-control"
                        value={date}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label htmlFor="purchaseOrderNo" className="form-label">Purchase Order Number</label>
                      <Form.Control
                        type="text"
                        placeholder="Enter purchaseOrderNo"
                        value={purchaseOrderNo}
                        onChange={(e) => setPurchaseOrderNo(e.target.value)}
                        required
                        style={{ border: errors.purchaseOrderNo ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.purchaseOrderNo && <div className="text-danger">{errors.purchaseOrderNo}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="poDate" className="form-label">
                        Purchase Order Date
                      </label>
                      <Form.Control
                        type="date"
                        id="poDate"
                        value={poDate}

                        // onChange={(e) => handlePoDateChange(e)}
                        onChange={(e) => {
                          setPoDate(e.target.value);
                          clearError('poDate'); // Clear error on change
                        }}
                        required
                        style={{ border: errors.poDate ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.poDate && <div className="text-danger">{errors.poDate}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="customerName" className="form-label">
                        Customer Name<span className="star" style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id="customerName"
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: errors.customerName ? '2px solid red' : '2px solid black',
                          }),
                        }}
                        value={
                          customerName
                            ? partyList
                              .map((party) => ({
                                value: party.PartyNameId,
                                label: party.PartyName,
                              }))
                              .find((option) => option.value === customerName)
                            : null
                        }
                        options={partyList.map((party) => ({
                          value: party.PartyNameId,
                          label: party.PartyName,
                        }))}
                        isSearchable
                        onChange={(selectedOption) => {
                          clearError('customerName')
                          const selectedParty = partyList.find(
                            (party) => party.PartyNameId === selectedOption.value
                          );
                          setCustomerName(selectedOption.value); // Set only the ID
                          // setPartyStateCode(selectedParty ? selectedParty.partyStateCode : '');
                          setDeliveryAddress('');                 
                          setFullCustomerAddress('');
                          setDestination('');
                          // console.log('Selected Party State Code:', selectedParty?.partyStateCode);
                          // console.log('Selected Party:', selectedParty);
                          // setFullAddress(selectedParty ? selectedParty.FullAddress : '');
                        }}
                        placeholder="Select a Customer"
                      />
                      {errors.customerName && (
                        <div className="text-danger">{errors.customerName}</div>
                      )}
                    </div>

                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label htmlFor="FullAddress" className="form-label">
                        Billing Address<span className="star" style={{ color: 'red' }}>*</span>
                      </label>


                      <select
                        id="fullCustomerAddress"
                        className="form-select"
                        value={fullCustomerAddress}
                        onChange={(e) => {
                          const selectedfullCustomerAddress = fullCustomerAddressList.find(
                            (deliv) => deliv.Address === e.target.value
                            // (deliv) => deliv.deliveryId === e.target.value
                          );
                          console.log('changing data', selectedfullCustomerAddress);

                          // setFullCustomerAddress(e.target.value); // Update selected billing address
                          setFullCustomerAddress(selectedfullCustomerAddress ? selectedfullCustomerAddress.Address : '');
                          // setDeliveryStateCode(selectedfullCustomerAddress ? selectedfullCustomerAddress.deliveryStateCode : '');
                          setPartyStateCode(selectedfullCustomerAddress ? selectedfullCustomerAddress.deliveryStateCode : '');
                          // setDeliveryStateCode(selectedfullCustomerAddress ? selectedfullCustomerAddress.deliveryStateCode : '');
                          setDestination(selectedfullCustomerAddress ? selectedfullCustomerAddress.dispatchAddress : '');
                          console.log('ttttttttttttttttt', selectedfullCustomerAddress.deliveryStateCode);
                          // ✅ Set Delivery ID to Customer ID
                          setBillingId(selectedfullCustomerAddress ? selectedfullCustomerAddress.deliveryId : '');

                          // ✅ Console Log for Debugging
                          console.log("Selected Delivery ID:", selectedfullCustomerAddress ? selectedfullCustomerAddress.deliveryId : '');
                          console.log("Updated Customer ID:", selectedfullCustomerAddress ? selectedfullCustomerAddress.deliveryId : '');


                          clearError('fullCustomerAddress');
                        }}
                        disabled={loading}
                        style={{ border: errors.fullCustomerAddress ? '2px solid red' : '2px solid black' }}
                      >
                        <option value="" disabled>Select Billing Address</option>
                        {fullCustomerAddressList.length > 0 ? (
                          fullCustomerAddressList.map((bill) => (
                            <option key={bill.deliveryId} value={bill.Address}>
                              {bill.Address}
                            </option>
                          ))
                        ) : (
                          <option disabled>No billing addresses available</option>
                        )}
                      </select>

                      {errors.fullCustomerAddress && <div className="text-danger">{errors.fullCustomerAddress}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="companyName" className="form-label">
                        Delivery Address<span className="star" style={{ color: 'red' }}>*</span>
                      </label>
                      <select
                        style={{ border: errors.deliveryAddress ? '2px solid red' : '2px solid black' }}
                        id="companyName"
                        className="form-select"
                        value={deliveryAddress}
                        onChange={(e) => {
                          const selectedDelivery = deliveryAddressList.find(deliv => deliv.deliveryId === e.target.value);
                          setDeliveryAddress(e.target.value);
                          setDeliveryStateCode(selectedDelivery ? selectedDelivery.deliveryStateCode : "");
                          // deliveryStateCode
                          console.log('Checking Delivery Address', selectedDelivery);
                          console.log('checking code', selectedDelivery.deliveryStateCode)

                          // setSelectedDeliveryId(selectedDeliveryId)
                          setDestination(selectedDelivery ? selectedDelivery.dispatchAddress : ""); // Automatically set Place of Dispatch
                          clearError('deliveryAddress');
                        }}
                        disabled={loading}
                      >
                        <option value="" disabled>Select Delivery Address</option>
                        {deliveryAddressList.length > 0 ? (
                          deliveryAddressList.map((delivAdd) => (
                            <option key={delivAdd.deliveryId} value={delivAdd.deliveryId}>
                              {delivAdd.Address}
                            </option>
                          ))
                        ) : (
                          <option disabled>No delivery addresses available</option>
                        )}
                      </select>
                      {errors.deliveryAddress && <div className="text-danger">{errors.deliveryAddress}</div>}
                    </div>

                    {/* <div className="col-md-4">
                      <label htmlFor="placeOfDispatch" className="form-label">Place of Dispatch<span className="star" style={{ color: 'red' }}>*</span></label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Place of Dispatch "
                        value={placeOfDispatch}
                        onChange={(e) => setPlaceOfDispatch(e.target.value)}
                        required                       
                        style={{ border: errors.placeOfDispatch ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.placeOfDispatch && <div className="text-danger">{errors.placeOfDispatch}</div>}
                    </div> */}
                    <div className="col-md-4">
                      <label htmlFor="placeOfDispatch" className="form-label">
                        Place of Dispatch<span className="star" style={{ color: 'red' }}>*</span>
                      </label>
                      <select
                        style={{ border: errors?.placeOfDispatch ? "2px solid red" : "2px solid black" }}
                        id="placeOfDispatch"
                        className="form-select"
                        value={placeOfDispatch}
                        onChange={(e) => {
                          clearError('placeOfDispatch')
                          setPlaceOfDispatch(e.target.value);
                        }}
                      >
                        <option value="" disabled>
                          Select a Dispatch
                        </option>
                        {DispatchList.map((dispatch) => (
                          <option key={dispatch.id} value={dispatch.id}>
                            {dispatch.name}
                          </option>
                        ))}
                      </select>
                      {errors?.placeOfDispatch && <div className="text-danger">{errors.placeOfDispatch}</div>}
                    </div>


                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label htmlFor="deliveryTerms" className="form-label">Delivery Terms<span className="star" style={{ color: 'red' }}>*</span></label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Delivery Term"
                        value={deliveryTerms}
                        // onChange={(e) => setDeliveryTerms(e.target.value)}
                        onChange={(e) => {
                          setDeliveryTerms(e.target.value);
                          clearError('deliveryTerms'); // Clear error on change
                        }}
                        required
                        style={{ border: errors.deliveryTerms ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.deliveryTerms && <div className="text-danger">{errors.deliveryTerms}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="destination" className="form-label" >Destination<span className="star" style={{ color: 'red' }}>*</span></label>
                      <Form.Control
                        type="text"
                        placeholder="Enter destination "
                        value={destination}
                        // onChange={(e) => setDestination(e.target.value)}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          clearError('destination'); // Clear error on change
                        }}
                        required
                        disabled
                        style={{ border: errors.destination ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.destination && <div className="text-danger">{errors.destination}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="paymentTerms" className="form-label d-flex align-items-center">
                        Payment Mode<span className="star" style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="d-flex align-items-center">
                        <Form.Check
                          className="me-3"
                          type="radio"
                          id="paymentTermsLC"
                          label="LC"
                          name="paymentTerms"
                          value="LC"
                          checked={paymentTerms === "LC"}
                          // onChange={(e) => setPaymentTerms(e.target.value)}
                          // onChange={handlePaymentTermssss}
                          onChange={(e) => {
                            setPaymentTerms(e.target.value);
                            // clearError('paymentTerms'); // Clear error on change

                            setBankName("");

                          }}
                          style={{ borderColor: errors.paymentTerms ? 'red' : 'black' }}
                        />

                        <Form.Check
                          type="radio"
                          id="paymentTermsRTCS"
                          label="RTGS/NEFT"
                          name="paymentTerms"
                          value="RTGS/NEFT"
                          checked={paymentTerms === "RTGS/NEFT"}
                          // onChange={(e) => setPaymentTerms(e.target.value)}

                          // onChange={handlePaymentTermssss}

                          onChange={(e) => {
                            setPaymentTerms(e.target.value);
                            // if (selectedValue === "RTGS/NEFT") {
                            setLcNumber("");
                            setLcDate("");
                            // }
                            // clearError('paymentTerms'); // Clear error on change
                          }}
                          style={{ borderColor: errors.paymentTerms ? 'red' : 'black' }}
                        />
                      </div>
                      {errors.paymentTerms && (
                        <div className="text-danger">{errors.paymentTerms}</div>
                      )}
                    </div>

                    {(paymentTerms === "LC" && <div className="col-md-4">
                      <label htmlFor="lcNumber" className="form-label">LC Number</label>
                      <Form.Control
                        type="text"
                        placeholder="Enter LC Number"
                        value={lcNumber}
                        // onChange={(e) => setDeliveryTerms(e.target.value)}
                        onChange={(e) => {
                          setLcNumber(e.target.value);
                          clearError('lcNumber');
                        }}
                        required
                        style={{ border: errors.lcNumber ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.lcNumber && <div className="text-danger">{errors.lcNumber}</div>}
                    </div>)}

                    {(paymentTerms === "LC" && <div className="col-md-4">
                      <label htmlFor="lcDate" className="form-label">LC Date</label>
                      <Form.Control
                        type="date"
                        placeholder="Enter LC Date"
                        value={lcDate}
                        // onChange={(e) => setDeliveryTerms(e.target.value)}
                        onChange={(e) => {
                          setLcDate(e.target.value);
                          clearError('lcDate');
                        }}
                        required
                        style={{ border: errors.lcDate ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.lcDate && <div className="text-danger">{errors.lcDate}</div>}
                    </div>)}

                    {(companyName === "Gautam Solar Pvt Ltd" && paymentTerms === "RTGS/NEFT" && <div className="col-md-4">
                      <label htmlFor="bank" className="form-label">
                        Payment Bank<span className="star" style={{ color: 'red' }}>*</span>
                      </label>
                      <select
                        style={{ border: errors.bank ? '2px solid red' : '2px solid black' }}
                        id="bank"
                        className="form-select"
                        value={bank}
                        onChange={(e) => {
                          const selectBank = e.target.value;
                          setBankName(selectBank);
                        }}
                        required
                      // disabled={salesOrderId}
                      >
                        <option value="">Select Bank Name</option>
                        {BankList.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.bank && <div className="text-danger">{errors.bank}</div>}
                    </div>)}

                    <div className="col-md-4">
                      <label htmlFor="Advance Payment" className="form-label">Advance Payment <span className="star" style={{ color: 'red' }}>*</span></label>
                      <div className="d-flex align-items-center">
                        <div className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="advancePayment"
                            id="advancePaymentYes"
                            value="Yes"
                            checked={isAdvancePayment === "Yes"}
                            onChange={(e) => {
                              setIsAdvancePayment(e.target.value)
                              setExpectedPaymentDate("")
                            }}
                            required
                          />
                          <label className="form-check-label" htmlFor="advancePaymentYes">
                            Yes
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="advancePayment"
                            id="advancePaymentNo"
                            value="No"
                            checked={isAdvancePayment === "No"}
                            onChange={(e) => {
                              setIsAdvancePayment(e.target.value)
                              setAdvanceAmount("")
                            }}
                            required
                          />
                          <label className="form-check-label" htmlFor="advancePaymentNo">
                            No
                          </label>
                        </div>
                      </div>

                      {errors.isAdvancePayment && <div className="text-danger">{errors.isAdvancePayment}</div>}
                    </div>



                    {isAdvancePayment === "Yes" && (
                      <div className="col-md-4">
                        <label htmlFor="Amount" className="form-label">Amount Enter <span className="star" style={{ color: 'red' }}>*</span></label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Amount"
                          value={advanceAmount}
                          // onChange={(e) => setAdvanceAmount(e.target.value)}
                          onChange={(e) => {
                            setAdvanceAmount(e.target.value);
                            clearError('advanceAmount');
                          }}
                          required
                          style={{ border: errors.advanceAmount ? '2px solid red' : '2px solid black' }}
                        />
                        {errors.advanceAmount && <div className="text-danger">{errors.advanceAmount}</div>}
                      </div>
                    )}

                    {isAdvancePayment === "No" && (
                      <div className="col-md-4">
                        <label htmlFor="expectedPaymentDate" className="form-label">
                          Expected payment Date <span className="star" style={{ color: 'red' }}>*</span>
                        </label>

                        <Form.Control
                          type="date"
                          id="expectedPaymentDate"
                          value={expectedDateOfPayment}
                          onChange={(e) => handleExpectedPaymentDateChange(e)}
                          required
                          style={{ border: errors.expectedDateOfPayment ? '2px solid red' : '2px solid black' }}
                          min={new Date().toISOString().split("T")[0]}
                        />

                        {errors.expectedDateOfPayment && <div className="text-danger">{errors.expectedDateOfPayment}</div>}
                      </div>
                    )}

                    <div className="col-md-4">
                      <label htmlFor="deliveryTerms" className="form-label">Payment Terms<span className="star" style={{ color: 'red' }}>*</span></label>
                      <Form.Control
                        type="text"
                        placeholder="Enter payment Terms"
                        value={paymentTerms1}
                        // onChange={(e) => setDeliveryTerms(e.target.value)}
                        onChange={(e) => {
                          setPaymentTerm1(e.target.value);
                          clearError('paymentTerms1'); // Clear error on change
                        }}
                        required
                        style={{ border: errors.paymentTerms1 ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.paymentTerms1 && <div className="text-danger">{errors.paymentTerms1}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="incoTerms" className="form-label">Inco Terms<span className="star" style={{ color: 'red' }}>*</span></label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Inco Terms"
                        value={incoTerms}
                        // onChange={(e) => setDeliveryTerms(e.target.value)}
                        onChange={(e) => {
                          setIncoTerms(e.target.value);
                          clearError('incoTerms'); // Clear error on change
                        }}
                        required
                        style={{ border: errors.incoTerms ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.incoTerms && <div className="text-danger">{errors.incoTerms}</div>}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="insurance" className="form-label">Insurance Terms<span className="star" style={{ color: 'red' }}>*</span></label>
                      <Form.Control
                        type="text"
                        placeholder="Enter insurance Terms"
                        value={insurance}
                        // onChange={(e) => setDeliveryTerms(e.target.value)}
                        onChange={(e) => {
                          setInsurance(e.target.value);
                          clearError('insurance'); // Clear error on change
                        }}
                        required
                        style={{ border: errors.insurance ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.insurance && <div className="text-danger">{errors.insurance}</div>}
                    </div>
                    {/* <div className="col-md-4">
                      <label htmlFor="productwarranty" className="form-label">Productwarranty Terms<span className="star" style={{ color: 'red' }}>*</span></label>
                      <Form.Control
                        type="text"
                        placeholder="Enter productwarranty Terms"
                        value={productwarranty}
                        // onChange={(e) => setDeliveryTerms(e.target.value)}
                        onChange={(e) => {
                          setProductwarranty(e.target.value);
                          clearError('productwarranty'); // Clear error on change
                        }}
                        required
                        style={{ border: errors.productwarranty ? '2px solid red' : '2px solid black' }}
                      />
                      {errors.productwarranty && <div className="text-danger">{errors.productwarranty}</div>}
                    </div> */}

                    <div className="col-md-4">
                      <label htmlFor="warranty" className="form-label">
                        Warranty<span className="star" style={{ color: 'red' }}>*</span>
                      </label>
                      <select
                        style={{ border: errors?.warranty ? "2px solid red" : "2px solid black" }}
                        id="warranty"
                        className="form-select"
                        value={warranty}
                        onChange={(e) => {
                          setWarranty(e.target.value);
                        }}
                      >
                        <option value="" disabled>
                          Select a Waranty
                        </option>
                        {WarrantyList.map((warrantylist) => (
                          <option key={warrantylist.id} value={warrantylist.id}>
                            {warrantylist.name}
                          </option>
                        ))}
                      </select>
                      {errors?.warranty && <div className="text-danger">{errors.warranty}</div>}
                    </div>

                  </div>

                  <section className="mt-5">
                    <Row>
                      <Col md={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Table fetchChildData={fetchChildData} fetchPanelPrice={fetchPanelPrice} setAmount={setTotalAmount} totalAmount={totalAmount} items={items} setItems={setItems} setErrors={setErrors} errors={errors} advanceAmount={advanceAmount} panelPrice={panelPrice} setPrice={setPrice} />
                      </Col>
                    </Row>
                  </section>

                  <section className="mt-5">
                    <Row>
                      <Col md={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="button" className="register" onClick={handleCancel} style={{ width: '150px', height: '43px', background: '#545454', margin: '10px' }}>Cancel</Button>
                        <Button type="submit" className="register" onClick={handleSubmit} style={{ width: '150px', height: '43px', background: '#006bff', margin: '10px' }}>Submit</Button>
                      </Col>
                    </Row>
                  </section>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </Container>

  );
};

export default Sales;