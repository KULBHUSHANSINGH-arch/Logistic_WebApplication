import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, TextField, Grid, Autocomplete, Typography, IconButton } from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, Input } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { dev } from '../../utils/ApiUrl';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
const PanelModal = ({ rowData, isVisible, onClose,selectedStatus,getSalesDetailsList }) => {
    const {user}=useSelector(state=>state.user)
    const [prices, setPrices] = useState([{ perWattPrice: '', salesPerson: [], panelPrice: '' }]);
    const [errors, setErrors] = useState([{ perWattPrice: false, salesPerson: false }]);
    const [personList, setSalesPersonList] = useState([])
    const [loading, setLoading] = useState(null)
    const [salesPerson, setSalesPerson] = useState('')
    const handleAddNewPrice = () => {
        setPrices([...prices, { perWattPrice: '', salesPerson: [] }]);
    };



    const { PanelDcr_nondcr, PanelPrice, moduleType, monobi, panelDetailsId, wattage } = rowData
    const numericValue = wattage.match(/\d+/g)?.join('') || "";



    let heading = `${wattage} - ${PanelDcr_nondcr} - ${moduleType} - ${monobi}`;

    const handleRemovePrice = (index) => {
        const updatedPrices = [...prices];
        updatedPrices.splice(index, 1);
        setPrices(updatedPrices);
    };

    const handlePanelOptionChange = (index, event) => {
        const updatedPrices = [...prices];
        updatedPrices[index].panelOptions = event.target.value;
        setPrices(updatedPrices);
    };

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
            console.log('fetching sales person failed', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchSalesPersnLists()
    }, [])

    const handleSalesPersonChange = (index, newValue) => {
        const newPrices = [...prices];
        newPrices[index].salesPerson = newValue.map((person) => person.personId);
        setPrices(newPrices);

        // Remove error when a value is selected
        const newErrors = [...errors];
        if (newErrors[index]) {
            newErrors[index].salesPerson = newValue?.length === 0;
        }

        setErrors(newErrors);
    };

    const handlePanelPerWattPriceChange = (index, event) => {

        const newPrices = [...prices];
        newPrices[index].perWattPrice = event.target.value;
        newPrices[index].panelPrice = Number(event.target.value) * Number(numericValue);
        setPrices(newPrices);

        // Remove error when a value is entered
        const newErrors = [...errors];
        if (newErrors[index]) {
            newErrors[index].perWattPrice = event.target.value.trim() === '';
        }


        setErrors(newErrors);
    };
    const getAvailableSalesPersons = (index) => {
        // Get all selected salespersons from all rows except the current one
        const selectedSalesPersons = prices.flatMap((price, i) =>
            i !== index ? price.salesPerson : []
        );

        // Filter out the salespersons that are already selected in other rows
        return personList.filter(person => !selectedSalesPersons.includes(person.personId));
    };

    const validateForm = () => {
        let hasErrors = false;
        const newErrors = prices.map(price => {
            const panelPriceError = price.perWattPrice.trim() === '';
            const salesPersonError = price.salesPerson.length === 0;

            if (panelPriceError || salesPersonError) {
                hasErrors = true;
            }

            return { perWattPrice: panelPriceError, salesPerson: salesPersonError };
        });

        setErrors(newErrors);
        return !hasErrors;
    };
    const handleSubmit = async () => {
        if (!validateForm()) {
            return; // No need for a general toast, errors are shown under each field
        }

        const requestData = {
            PanelDcr_nondcr,
            moduleType,
            wattage,
            monobi,
            panelDetailsId: panelDetailsId,
            createdBy:user?.personId,
            prices: prices.map(price => ({
                perWattPrice: price.perWattPrice,
                panelPrice: price.panelPrice,
                salesPerson: price.salesPerson
            }))
        };
        console.log('payload', requestData);

        try {
            setLoading(true);
            const resp = await fetch(`${dev}/sales/addPanelDetails`, {
                method: "POST",
                body: JSON.stringify(requestData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await resp.json()
            console.log('response', result)
            if (!resp.ok) {
                setLoading(false);
                toast.error(result?.message || "Failed to set new panel price");
                return;
            }

            setLoading(false);
            toast.success(result?.message || "New panel price set successfully");
            getSalesDetailsList(selectedStatus)
            onClose();
        } catch (error) {
            setLoading(false);
            console.error('Setting panel price failed', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (rowData?.prices && personList.length > 0) {
            console.log('prices', rowData.prices);
            console.log('personlist', personList);
    
            const updatedPrices = rowData.prices.map((price) => {
               
                return {
                    perWattPrice: price.perWattPrice,
                    salesPerson: price.salesPerson.map(personId => 
                        personList.find(person => person.personId === personId)?.personId || []
                    ), // Ensure it doesn't return undefined
                    panelPrice: price.panelPrice
                };
               
            });
    
            setPrices(updatedPrices);
        }
    }, [rowData?.prices, personList]); // Added rowData?.prices dependency
    

    return (
        <Modal
            open={isVisible}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}
        >
            <div className=' lg:w-1/2' style={{ width: '50%', maxHeight: '80vh', overflowY: 'auto', margin: 'auto', padding: '20px', backgroundColor: 'white' }}>
                <Typography id="modal-title" variant="h6" align="center" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    Set New Panel Price By Sales Executive
                </Typography>
                <Typography id="modal-title" variant="h6" align="center" sx={{ fontFamily: 'serif', fontWeight: 'bold', marginBottom: '20px', color: 'red' }}>
                    {heading || ''}
                </Typography>


                {prices.map((price, index) => (
                    <Grid container direction="column" spacing={2} key={index} sx={{ marginTop: '14px' }}>
                        <Grid container alignItems="" wrap="nowrap" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* Sales Executive Autocomplete */}
                            <Grid item xs={4}>
                                <Autocomplete
                                    className="min-w-44 w-full"
                                    id="salesPerson"
                                    multiple
                                    value={personList.filter(option => price.salesPerson.includes(option.personId))}
                                    options={getAvailableSalesPersons(index)}
                                    getOptionLabel={(option) => option?.userName || ''}
                                    isOptionEqualToValue={(option, value) => option?.personId === value?.personId}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sales Executive"
                                            error={errors[index]?.salesPerson}
                                            helperText={errors[index]?.salesPerson ? "Required field" : ""}
                                        />
                                    )}
                                    onChange={(event, newValue) => handleSalesPersonChange(index, newValue)}
                                />
                            </Grid>

                            {/* Per Watt Price Input */}
                            <Grid item xs={2}>
                                <TextField
                                    label="Per Watt Price"
                                    fullWidth
                                    type="number"
                                    value={price?.perWattPrice}
                                    onChange={(e) => handlePanelPerWattPriceChange(index, e)}
                                    variant="outlined"
                                    error={errors[index]?.perWattPrice}
                                    helperText={errors[index]?.perWattPrice ? "Required field" : ""}
                                />
                            </Grid>

                            {/* Panel Price Input (Read Only) */}
                            <Grid item xs={2}>
                                <TextField
                                    // label="Panel Price"
                                    fullWidth
                                    value={price.panelPrice}
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                    placeholder='Panel Price'
                                />
                            </Grid>

                            {/* Remove Button (if more than one row exists) */}
                            {/* Remove Button (if more than one row exists) */}
                            {prices.length > 1 && (
                                <Grid item display="flex" justifyContent="flex-end" sx={{ alignSelf: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleRemovePrice(index)}
                                        size="small"
                                    >
                                        Remove
                                    </Button>
                                </Grid>
                            )}

                        </Grid>


                        {/* Add Button */}
                        {prices.length - 1 === index && (
                            <Grid item container justifyContent="flex-end">
                                <Button
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddNewPrice}
                                    size="small"
                                >
                                    Add New Price
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                ))}

                {/* Cancel and Submit Buttons */}

                <Grid item container justifyContent="flex-end" spacing={2} sx={{ marginTop: '20px' }}>
                    <Grid item>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onClose} // Replace with your cancel function
                            size="small"
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit} // Replace with your submit function
                            size="small"
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>

            </div>
        </Modal>
    );
};

export default PanelModal
