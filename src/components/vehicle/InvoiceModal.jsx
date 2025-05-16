import React, { useEffect, useState } from 'react';
import {
    Modal, Box, Typography, Button, Table, TableHead, TableRow, TableCell,
    TableBody, CircularProgress, Alert, Collapse
} from '@mui/material';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import generateExcelReportOfInvoice from '../../utils/invoiceExcelReport';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
};

const HeaderBox = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
});

function InvoiceModal({ openn, onClosee, InvoiceNo }) {
    const [expandedBarcodes, setExpandedBarcodes] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const callApiForInvoice = async (invoiceNo) => {
        const payload = { invoice_no: invoiceNo };

        try {
            setLoading(true);
            setError(null);

            const resp = await fetch(`https://packdisp.umanmrp.in/dispatch/get_dispatch_detailsAPI.php`, {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await resp.json();

            if (!resp.ok || result?.status === 'error') {
                toast.error(result?.message || 'Something went wrong.');
                setError(result?.message || 'Something went wrong.');
                return;
            }

            if (!result?.data) {
                toast.warning('No data found for the invoice.');
                return;
            }

            setData(result.data);
        } catch (apiError) {
            console.error('API call failed:', apiError);
            setError('Please check your internet connection or try again.');
            toast.error('API failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBarcode = (index) => {
        setExpandedBarcodes(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleExport = () => {
        toast.info("Excel export functionality goes here.");
    };

    useEffect(() => {
        if (InvoiceNo) {
            callApiForInvoice(InvoiceNo);
        }
    }, [InvoiceNo]);

    const dispatchInfo = data?.dispatch_info;
    const pallets = data?.pallets || [];

    return (
        <Modal open={openn} onClose={onClosee}>
            <Box sx={{ ...style, position: 'relative' }}>
                {/* Close Button in Top-Right */}
                <Button
                    onClick={onClosee}
                    sx={{ position: 'absolute', top: 15, right: 15, minWidth: 0, padding: '6px' }}
                    variant="contained"
                    color="error"
                >
                    X
                </Button>

                <HeaderBox>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Dispatch Details
                        </Typography>
                        <Typography><strong>Dispatch No:</strong> {dispatchInfo?.dispatch_no}</Typography>
                        <Typography><strong>Invoice No:</strong> {dispatchInfo?.invoice_no}</Typography>
                        <Typography><strong>Party Name:</strong> {dispatchInfo?.party_name}</Typography>
                        <Typography><strong>Factory Name:</strong> {dispatchInfo?.factory_name}</Typography>
                        <Typography><strong>Vehicle No:</strong> {dispatchInfo?.vehicle_no}</Typography>
                        <Typography><strong>Date:</strong> {dispatchInfo?.dispatch_date}</Typography>
                        <Typography><strong>Quantity:</strong> {dispatchInfo?.dispatch_qty}</Typography>
                    </Box>

                    <Button variant="contained" color="secondary" onClick={() => generateExcelReportOfInvoice(data)}>
                        Export Excel
                    </Button>
                </HeaderBox>

                {loading && (
                    <Box my={4} display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Box my={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {!loading && !error && pallets.length > 0 && (
                    <Box mt={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Pallet No</TableCell>
                                    <TableCell>Model No</TableCell>
                                    <TableCell align="right">Pallet Qty</TableCell>
                                    <TableCell>Barcodes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pallets.map((pallet, index) => {
                                    const barcodes = pallet.barcodes?.[0]?.split(" ") || [];
                                    const isExpanded = expandedBarcodes[index];

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{pallet.pallet_no}</TableCell>
                                            <TableCell>{pallet.model_no}</TableCell>
                                            <TableCell align="right">{pallet.pallet_qty}</TableCell>
                                            <TableCell>
                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <Box>
                                                        {barcodes.map((code, i) => (
                                                            <Typography key={i} variant="body2">{code}</Typography>
                                                        ))}
                                                    </Box>
                                                </Collapse>
                                                {!isExpanded && (
                                                    <Typography variant="body2">{barcodes[0]}</Typography>
                                                )}
                                                <Button
                                                    size="small"
                                                    onClick={() => handleToggleBarcode(index)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    {isExpanded ? 'Hide' : 'See more'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Box>
        </Modal>

    );
}

export default InvoiceModal;
