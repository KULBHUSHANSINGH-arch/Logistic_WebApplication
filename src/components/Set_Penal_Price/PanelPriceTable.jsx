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
import PanelModal from './PanelModal';


const PanelListTable = () => {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [personId, setPersonId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    // const [selectedStatus, setSelectedStatus] = useState(designation === 'Accountant' ? 'Final' : 'Pending');
    const navigate = useNavigate();

    const [designation, setDesignation] = useState('');
    // panel price modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [panelModalData, setPanelModalData] = useState({})



    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        const userDesignation = localStorage.getItem('designation');
        // const department = localStorage.getItem('department');
        // setDepartment(department);
        setPersonId(currentUser);
        setDesignation(userDesignation);
    }, []);

    useEffect(() => {
        const personId = localStorage.getItem("currentUser");
        setPersonId(personId);
    }, []);

    useEffect(() => {
        if (designation) {
            setSelectedStatus(designation === 'Accountant' ? 'Final' : 'Pending');
        }
    }, [designation]);




    const getSalesDetailsList = async (status) => {
        setLoading(true);
        const personId = localStorage.getItem('currentUser');
        try {
            const response = await axios.post(`${dev}/sales/getPanelDetails`, {
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
        getSalesDetailsList(selectedStatus);
    }, [selectedStatus]);



    const handleEditClick = (panelDetailsId) => {
        navigate("/setpanelprice", { state: { panelDetailsId, Type: "" } });
    };


    // panel price modal



    const handleOpenModal = (data) => {
        setPanelModalData(data);
        setIsModalVisible(true);

    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };





    const actionBodyTemplate = (rowData) => {
        const { status, designation } = rowData;
        // console.log('checking roe data', rowData);
        const userDesignation = localStorage.getItem('designation');

        return (
            <React.Fragment>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Show actions based on status */}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: '10px' }}>
                        {userDesignation !== "Accountant" && (
                            <>
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button p-button custom-tooltip-button"
                                    data-pr-tooltip="Edit"
                                    style={{ backgroundColor: '#2ccadd', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                    onClick={() => handleEditClick(rowData.panelDetailsId)}
                                />

                                <Button
                                    icon="pi pi-plus"
                                    className="p-button p-button custom-tooltip-button"
                                    data-pr-tooltip="Set New Panel Price"
                                    style={{ backgroundColor: 'blue', width: '40px', color: '#FFFFFF', height: '40px', borderRadius: '0' }}
                                    onClick={() => handleOpenModal(rowData)}
                                />
                            </>
                        )}
                    </div>








                    <Tooltip target=".custom-tooltip-button" position="top" className="custom-tooltip" />
                </div>
            </React.Fragment>
        );
    };

    const getPerWattPrice = (rowData) => {
        const { wattage, PanelPrice } = rowData
        let value = (Number(Number(PanelPrice) / wattage.match(/\d+/)[0])).toFixed(2)

        return (
            <div>
                {/* <Typography variant="h6" component="div" style={{ fontWeight: 'bold', color: '#2ccadd' }}>
                        Per Watt Price
                    </Typography> */}
                <Typography variant="body2" component="div" style={{ color: '#000000' }}>
                    {value}
                </Typography>
            </div>
        )
    }

    const HeaderRow = () => {
        return (
            <div className="container" style={{ width: '100%', padding: '10px' }}>
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



                    {/* Actions (Link and Button) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '20%' }}>
                        <Link to="/setpanelprice" className="plus" data-pr-tooltip="Add Set Panel Price" style={{ marginRight: '10px' }}>
                            <Image src={img1} alt="plus" rounded style={{ width: '40px', height: '40px' }} />
                        </Link>


                        <Button
                            label="Export"
                            icon="pi pi-file-excel"
                            className="p-button-success export-button custom-button"
                            onClick={exportExcel}
                            style={{ marginRight: '10px' }}
                        />
                        <Tooltip target=".custom-button" content="Download Report" position="top" className="custom-tooltip" />
                        <Tooltip target=".plus" content="Add Set Panel Price" position="top" className="custom-tooltip" />
                    </div>

                </div>
            </div>
        );
    };

    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Panel Price List');
        worksheet.columns = [
            { header: 'Wattage', key: 'wattage', width: 25 },
            { header: 'Dcr/Non-Dcr', key: 'PanelDcr_nondcr', width: 25 },
            { header: 'ModuleType', key: 'moduleType', width: 25 },
            { header: 'Monofacial/Bifacial', key: 'monobi', width: 25 },

            { header: 'Per Watt Price', key: 'perWattPrice', width: 35 },
            { header: 'PanelPrice', key: 'PanelPrice', width: 35 },

        ];

        worksheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getRow(1).height = 35;
        const processedData = data.map(item => ({
            wattage: item.wattage,
            PanelDcr_nondcr: item.PanelDcr_nondcr,
            moduleType: item.moduleType,
            monobi: item.monobi,
            perWattPrice: (Number(Number(item.PanelPrice) / item.wattage.match(/\d+/)[0])).toFixed(2),
            PanelPrice: `₹ ${new Intl.NumberFormat('en-IN').format(item.PanelPrice || 0)}`,

        }));
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
                <td><Skeleton width="100%" height="4em" /></td>
                <td><Skeleton width="100%" height="4em" /></td>
                <td><Skeleton width="100%" height="4em" /></td>
                <td><Skeleton width="100%" height="4em" /></td>
                <td><Skeleton width="100%" height="4em" /></td>
                <td>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Skeleton width="30%" height="4em" />
                        <Skeleton width="30%" height="4em" />
                        <Skeleton width="30%" height="4em" />
                    </div>
                </td>
            </tr>
        ));
    };


    return (
        <div className="datatable-filter-demo">
            <div className="card">

                <DataTable
                    value={loading ? [] : data}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    scrollable
                    scrollHeight="300px"
                    header={header}
                    globalFilter={globalFilter}
                    emptyMessage={loading ? null : "No items found."}

                >
                    <Column style={{ border: "0.5px dotted black" }} field="wattage" header="Wattage" sortable />
                    <Column style={{ border: "0.5px dotted black" }} field="PanelDcr_nondcr" header="Dcr/Non-Dcr" sortable />
                    <Column style={{ border: "0.5px dotted black" }} field="moduleType" header="Module Type" sortable />
                    <Column style={{ border: "0.5px dotted black" }} field="monobi" header="Monofacial/Bifacial" sortable />
                    <Column style={{ border: "0.5px dotted black" }} header="Per Watt Price" body={getPerWattPrice} sortable />

                    {/* <Column style={{ border: "0.5px dotted black" }} field="destination" header="Destination" sortable /> */}
                    <Column
                        style={{ border: "0.5px dotted black" }}
                        field="PanelPrice"
                        body={(rowData) => {
                            return `₹ ${new Intl.NumberFormat('en-IN').format(rowData?.PanelPrice || 0)}`;
                        }}
                        header="Panel Price"
                        sortable
                    />


                    <Column style={{ border: "0.5px dotted black" }} header="Actions" body={actionBodyTemplate} />
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
                {
                    isModalVisible && (
                        <PanelModal selectedStatus={selectedStatus} getSalesDetailsList={getSalesDetailsList} rowData={panelModalData} isVisible={isModalVisible} onClose={handleCloseModal} />
                    )
                }



            </div>
        </div>
    );
};

export default PanelListTable;