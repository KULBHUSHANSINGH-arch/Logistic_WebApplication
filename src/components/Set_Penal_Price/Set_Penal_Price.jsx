import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, FormControl, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader/Loader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { dev } from '../../utils/ApiUrl';
import { useSelector } from 'react-redux';

const SetPenalPrice = () => {
    const { user } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({
        watage: '',
        PanelDcr_nondcr: '',
        PanelPrice: '',
        MBT: '',
        ModuleType: '',
        perWattPrice: ""
    });
    let location = useLocation();
    const { panelDetailsId, Type } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [watageList, setWatageList] = useState([]);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    // const [ModuleType,setModuleType] = useState('');
    // const [MBT,setMBT] = useState('');
    const [MonofacialBifacialList, setMonofacialBifacialList] = useState([]);

    const validateField = (name, value) => {
        let error = '';
        if (name === 'PanelDcr_nondcr' && !value) {
            error = 'DCR/Non-Dcr is required';
        }
        if (name === 'watage' && !value) {
            error = 'Watage is required';
        }
        if (name === 'PanelPrice' && !value) {
            error = 'Minimum Panel Price is required';
        }
        if (name === 'perWattPrice' && !value) {
            error = 'Per Watt  Price  Price is required';
        }
        if (name === 'MBT' && !value) {
            error = 'Monofacial/Bifacial  is required';
        }
        if (name === 'ModuleType' && !value) {
            error = 'ModuleType is required';
        }
        return error;
    };
    const MBTList = [
        { value: 'Monofacial', label: 'Monofacial' },
        { value: 'Bifacial', label: 'Bifacial' }
    ];
    const fetchMonoficial = async () => {
        try {
            const response = await axios.get(`${dev}/sales/panelTypes`);
            setMonofacialBifacialList(response.data || []);
        } catch (error) {
            console.error("Error fetching panel types:", error);
            setMonofacialBifacialList([]);
        }
    };
    console.log('formdata', formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'perWattPrice' || name === 'watage') {
            setFormData(prevState => {
                const updatedState = { ...prevState, [name]: value }; // Update the current value

                const wattageMatch = updatedState.watage?.match(/\d+/); // Extract numeric value from updated `watage`
                const perWattPrice = Number(updatedState.perWattPrice); // Convert `perWattPrice` to a number

                // Calculate `PanelPrice` only if both values are valid
                const panelPrice =
                    wattageMatch && perWattPrice
                        ? perWattPrice * Number(wattageMatch[0])
                        : prevState.PanelPrice;

                return {
                    ...updatedState,
                    PanelPrice: panelPrice,
                };
            });
        }



        // Validate the field immediately when it's changed
        const error = validateField(name, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const fetchPanelDetails = async () => {
        if (!panelDetailsId) {
            alert('Please enter a PanelDetailsId!');
            return;
        }
   

        try {
            const response = await axios.post(
                `${dev}/sales/getPanelDetails`,
                { panelDetailsId: panelDetailsId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.data) {
                const data = response.data.data;
                setFormData({

                    panelDetailsId: data.panelDetailsId || '',
                    watage: data.wattage || 'N/A',
                    PanelDcr_nondcr: data.PanelDcr_nondcr || 'N/A',
                    PanelPrice: data.PanelPrice || 'N/A',
                    MBT: data.monobi || 'N/A',
                    ModuleType: data.moduleType || 'N/A',
                    perWattPrice:(Number(Number(data.PanelPrice)/data.wattage.match(/\d+/)[0])).toFixed(2)
                });
            } else {
                alert('No data found for the provided PanelDetailsId');
            }
        } catch (error) {
            console.error('Error fetching panel details:', error);
            alert('An error occurred while fetching panel details');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = {};

        // Validate the entire form before submission
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                formErrors[field] = error;
            }
        });

        // If there are errors, set them and do not submit the form
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Proceed to submit the form if no errors7 88
        setLoading(true); // Show loader when submission starts

        const PurchaseData = {
            createdBy: user.personId,
            panelDetailsId: panelDetailsId ? panelDetailsId : "",
            wattage: formData.watage,
            PanelDcr_nondcr: formData.PanelDcr_nondcr,
            PanelPrice: formData.PanelPrice,
            moduleType: formData.ModuleType,
            monobi: formData.MBT
        };

        console.log("Submitted Data", PurchaseData);

        try {
            const response = await axios.post(
                `${dev}/Sales/addPanelDetails`,
                PurchaseData,
                { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
            );

            if (response.status === 200) {
                console.log('Form submitted successfully:', response.data);
                panelDetailsId ? toast.success('Form Updated successfully!') : toast.success('Form submitted successfully!');
                setTimeout(() => {
                    setLoading(false); // Hide loader after successful submission
                    navigate('/panelpricelist'); // Implement navigation here if needed
                }, 1000);
            } else {
                setLoading(false); // Hide loader in case of an error
                console.error('Unexpected response:', response);
                toast.error('Failed to submit form. Unexpected response from server.');
            }
        } catch (error) {
            setLoading(false); // Hide loader if an error occurs
            console.error('Error submitting form:', error.message);
        }
    };

    const setPanelDcr_nindcrList = [
        { value: 'DCR', label: 'DCR' },
        { value: 'Non DCR', label: 'Non DCR' }
    ];

    const fetchWatageList = async () => {
        try {
            const response = await axios.get(`${dev}/watage/getWatageList`);
            const { data } = response.data;
            setWatageList(data);
        } catch (error) {
            console.error("Error fetching watage list:", error);
        }
    };

    useEffect(() => {
        fetchWatageList();
        fetchMonoficial();
        if (panelDetailsId) {
            fetchPanelDetails();

        }

    }, []);

    const handleBack = () => {
        navigate('/panelpricelist');
    }

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card
                style={{
                    width: '50rem',
                    padding: '30px',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
            >
                <Card.Body>
                    <Card.Title className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                        {panelDetailsId ? "Edit Set Panel Price" : "Add Set Panel Price"}
                    </Card.Title>

                    {/* First Row */}
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw ">Monofacial/Bifacial</Form.Label>
                                <Form.Select
                                    name="MBT"
                                    value={formData?.MBT}
                                    style={{
                                        border: errors?.MBT ? '2px solid red' : '2px solid black'
                                    }}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Data</option>
                                    {MBTList.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}

                                </Form.Select>
                                {errors?.MBT && (
                                    <div className="text-danger">{errors.MBT}</div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>DCR/Non-DCR</Form.Label>
                                <Form.Select
                                    style={{
                                        border: errors?.PanelDcr_nondcr ? '2px solid red' : '2px solid black'
                                    }}
                                    name="PanelDcr_nondcr"
                                    value={formData?.PanelDcr_nondcr || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Select DCR/Non-DCR</option>
                                    {setPanelDcr_nindcrList.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </Form.Select>
                                {errors?.PanelDcr_nondcr && (
                                    <div className="text-danger">{errors.PanelDcr_nondcr}</div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Wattage</Form.Label>
                                <Form.Select
                                    style={{
                                        border: errors?.watage ? '2px solid red' : '2px solid black'
                                    }}
                                    name="watage"
                                    value={formData?.watage || ''}
                                    onChange={handleChange}
                                    disabled={!!panelDetailsId}
                                >
                                    <option value="">Select Wattage</option>
                                    {watageList.map((option) => (
                                        <option key={option.watageId} value={option.watageName}>{option.watageName}</option>
                                    ))}
                                    disabled={!!panelDetailsId}
                                </Form.Select>
                                {errors?.watage && (
                                    <div className="text-danger">{errors.watage}</div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Second Row */}
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw ">Module Type</Form.Label>
                                <Form.Select
                                    style={{
                                        border: errors?.ModuleType ? '2px solid red' : '2px solid black'
                                    }}
                                    className="common-input"
                                    name="ModuleType"
                                    value={formData?.ModuleType}
                                    onChange={handleChange}
                                    aria-placeholder="Enter the Monofacial or Bifacial"
                                >
                                    <option value="">Select Module Type</option>
                                    {MonofacialBifacialList.map((option) => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}

                                </Form.Select>
                                {errors?.ModuleType && (
                                    <div className="text-danger">{errors.ModuleType}</div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Enter Per Watt Price (₹)</Form.Label>
                                <FormControl
                                    type="number"
                                    style={{
                                        border: errors?.PanelPrice ? '2px solid red' : '2px solid black'
                                    }}
                                    name="perWattPrice"
                                    value={formData?.perWattPrice || ''}
                                    placeholder='Enter Per Watt Price'
                                    onChange={handleChange}
                                />
                                {errors?.perWattPrice && (
                                    <div className="text-danger">{errors.perWattPrice}</div>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Minimum Panel Price (₹)</Form.Label>
                                <FormControl
                                    type="number"
                                    readOnly
                                    style={{
                                        border: errors?.PanelPrice ? '2px solid red' : '2px solid black'
                                    }}
                                    name="PanelPrice"
                                    value={formData?.PanelPrice || ''}
                                    placeholder='Enter Minimum Panel Price'
                                    onChange={handleChange}
                                />
                                {errors?.PanelPrice && (
                                    <div className="text-danger">{errors.PanelPrice}</div>
                                )}
                            </Form.Group>
                        </Col>




                    </Row>

                    {/* Submit and Back Buttons */}
                    <div className="d-flex justify-content-center mt-4" style={{ gap: '20px' }}>
                        <Button
                            type="button"
                            onClick={handleBack}
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px'
                            }}
                        >
                            Back
                        </Button>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            style={{
                                backgroundColor: 'green',
                                color: 'white',

                                padding: '10px 20px',
                                borderRadius: '5px'
                            }}
                        >
                            Submit
                        </Button>
                    </div>

                </Card.Body>
            </Card>
        </Container>
    );
};

export default SetPenalPrice;