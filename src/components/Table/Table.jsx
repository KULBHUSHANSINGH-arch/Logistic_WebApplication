
import { useEffect, useState } from 'react';
import { Container, Table, Form, Col, Button, Row } from 'react-bootstrap';
import axios from 'axios';
import { dev } from '../../utils/ApiUrl';
import 'bootstrap/dist/css/bootstrap.min.css';
import { border } from '@chakra-ui/react';

const ItemTable = ({ fetchChildData, fetchPanelPrice, setItems, items, setAmount, totalAmount, setErrors, errors, advanceAmount, panelPrice, setPrice }) => {
  const [url, setUrl] = useState("");
  const [balanceAmount, setBalanceAmount] = useState('');


  // console.log("Items in render:", items.MBT);


  const [watageList, setWatageList] = useState([]);
  const [MonofacialBifacialList, setMonofacialBifacialList] = useState([]);
  // const [panelPrice,setPrice] = useState();

  // console.log("panelPrice", panelPrice);
// 

  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement.type === "number") {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  useEffect(() => {
    if (items.watage && items.MonofacialBifacial && items.dcr_nondcr && items.MBT) {
      log("hiiiiiiii,", items.dcr_nondcr, items.watage, items.MonofacialBifacial, items.MBT, items.id)
      fetchPanelPrice(items.dcr_nondcr, items.watage, items.MonofacialBifacial, items.MBT, items.id, items.personId)
    }
  }, [items]);

  useEffect(() => {
    const url = localStorage.getItem('url');
    setUrl(url);
  }, []);

  const handleAddRow = () => {
    const newItem = {
      id: Date.now(),
      salesOrderItemId: '',
      HS: '85414300',
      watage: '',
      dcr_nondcr: '',
      MonofacialBifacial: '',
      isReplacement: 'false',
      quantity: '',
      unitPrice: '',
      value: '',
      GST: '',
      IGST: '',
      CGST: '',
      SGST: '',
      totalAmount: '',

    };
    setItems([...items, newItem]);
  };

  const validateUnitPriceForItem = (itemId, panelPrice) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          // Create a new errors object for this specific item
          const newErrors = { ...errors };
          if (!newErrors.items) newErrors.items = {};
          if (!newErrors.items[itemId]) newErrors.items[itemId] = {};

          // Check if unit price is less than panel price
          if (item.isReplacement !== "true" && item.unitPrice < panelPrice) {
            newErrors.items[itemId].unitPrice = `Unit price cannot be less than ${panelPrice}`;
          } else {
            // Remove the error if price is valid
            if (newErrors.items[itemId].unitPrice) {
              delete newErrors.items[itemId].unitPrice;
            }
          }

          // Update the errors state
          setErrors(newErrors);

          return { ...item, panelPrice };
        }
        return item;
      });

      return updatedItems;
    });
  };


  const handleItemChange = (e, id) => {
    if (items.length === 0) return;
    const { name, value } = e.target;

    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [name]: value };


        if (name === 'unitPrice' && item.panelPrice) {
          const panelPrice = item.panelPrice;

          // Create a new errors object
          const newErrors = { ...errors };
          if (!newErrors.items) newErrors.items = {};
          if (!newErrors.items[id]) newErrors.items[id] = {};

          // Check if unit price is less than panel price
          if (item.isReplacement !== "true" && Number(value) < panelPrice) {
            newErrors.items[id].unitPrice = `Unit price cannot be less than ${panelPrice}`;
          } else {
            if (newErrors.items[id].unitPrice) {
              delete newErrors.items[id].unitPrice;
            }
          }
          setErrors(newErrors);
        }
        if (name === "MBT") {
          updatedItem.MonofacialBifacial = value;
        }
        if (
          (name === 'dcr_nondcr' && updatedItem.watage) ||
          (name === 'watage' && updatedItem.dcr_nondcr) ||
          (name === 'MonofacialBifacial' && updatedItem.MonofacialBifacial) ||
          (name === 'MBT' && updatedItem.MBT)
        ) {
          fetchPanelPrice(updatedItem.dcr_nondcr, updatedItem.watage, updatedItem.MonofacialBifacial, updatedItem.MBT, id, updatedItem.personId);
        }
        if (

          ['dcr_nondcr', 'watage', 'MonofacialBifacial', 'MBT', 'isReplacement'].includes(name)
        ) {
          updatedItem.unitPrice = ''; 
        }
        if (name === 'quantity' || name === 'unitPrice') {
          const quantity = name === 'quantity' ? Number(value) : Number(item.quantity);
          const unitPrice = name === 'unitPrice' ? Number(value) : Number(item.unitPrice);
          updatedItem.value = quantity * unitPrice;

        }
        // Calculate totalAmount
        const itemValue = Number(updatedItem.value) || 0;
        const gstAmount = itemValue * (Number(updatedItem.GST) / 100) || 0;
        const igstAmount = itemValue * (Number(updatedItem.GST) / 100) || 0     
        if (updatedItem.GST) {
          updatedItem.IGST = igstAmount.toFixed(2);  
        } else {
          updatedItem.IGST = ''; 
      }
        updatedItem.totalAmount = (
          itemValue +
          gstAmount
        ).toFixed(2);
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
    validateField(updatedItems, name, value);
    fetchChildData(updatedItems);
  };

  const validateField = (updatedItems, name) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'isReplacement':
      case 'MonofacialBifacial':
      case 'dcr_nondcr':
      case 'watage':
      case 'HS':
      case 'quantity':
        if (!updatedItems.quantity) {
          return 'this is required ';
        }
        break;
      case 'value':
      case 'unitPrice':
      case 'GST':
      case 'IGST':
      case 'CGST':
      case 'SGST':
      case 'totalAmount':
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };
  const handleDeleteRow = id => {
    const updatedItems = items.filter((item, index) => index === 0 || item.id !== id);
    setItems(updatedItems);
  };

  const MBTList = [
    { value: 'Monofacial', label: 'Monofacial' },
    { value: 'Bifacial', label: 'Bifacial' }
  ];

  const dcr_nondcrList = [
    { value: 'DCR', label: 'DCR' },
    { value: 'Non DCR', label: 'Non DCR' }
  ];

  useEffect(() => {
    fetchWatageList();
    fetchMonoficial();
  }, []);

  const fetchWatageList = async () => {
    try {
      const response = await axios.get(`${dev}/watage/getWatageList`);
      const { data } = response.data;
      setWatageList(data);
    } catch (error) {
      console.error("Error fetching watage list:", error);
    }
  };

  const fetchMonoficial = async () => {
    try {
      const response = await axios.get(`${dev}/sales/panelTypes`);
      setMonofacialBifacialList(response.data || []);
    } catch (error) {
      console.error("Error fetching panel types:", error);
      setMonofacialBifacialList([]);
    }
  };

  const styles = {
    customInput: {
      border: '2px solid black',
      borderRadius: '4px',
      padding: '8px',
      width: '100%',
    },
  };

  return (
    <Container className="my-9" >
      <Table striped bordered hover className="table" style={{ border: "2px solid black" }}>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Details</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td >
                <Row>
                  <Col md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Form.Group style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Form.Label style={{ marginBottom: '10px', textAlign: 'center' }}>Replacement</Form.Label>
                      <Form.Check
                        type="checkbox"
                        id={`replacement-${item.id}`}
                        checked={item.isReplacement === "true"}
                        name="isReplacement"
                        style={{
                          transform: 'scale(1.5)',
                          marginBottom: '10px'
                        }}
                        onChange={(e) =>
                          handleItemChange(
                            { target: { name: "isReplacement", value: e.target.checked ? "true" : "false" } },
                            item.id
                          )
                        }
                      />
                    </Form.Group>
                    {errors.items && errors.items[item.id] && errors.items[item.id].isReplacement && (
                      <div className="text-danger" style={{ textAlign: 'center', marginTop: '5px' }}>
                        {errors.items[item.id].isReplacement}
                      </div>
                    )}
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="fw ">Monofacial Bifacial</Form.Label>
                      <Form.Select
                        name="MBT"
                        value={item.MBT || ''}
                        style={{
                          ...styles.customInput,
                          border: errors.items && errors.items[item.id] && errors.items[item.id].MBT
                            ? '2px solid red' : '2px solid black'
                        }}
                        onChange={(e) => handleItemChange(e, item.id)}
                      >
                        <option value="">Select Data</option>
                        {MBTList.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}

                      </Form.Select>
                      {errors.items && errors.items[item.id] && errors.items[item.id].MBT && (
                        <div className="text-danger">
                          {errors.items[item.id].MBT}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="fw ">Module Type</Form.Label>
                      <Form.Select
                        style={{
                          ...styles.customInput,
                          border: errors.items && errors.items[item.id] && errors.items[item.id].MonofacialBifacial
                            ? '2px solid red' : '2px solid black'
                        }}
                        className="common-input"
                        name="MonofacialBifacial"
                        value={item.MonofacialBifacial || ''}
                        onChange={(e) => handleItemChange(e, item.id)}
                        aria-placeholder="Enter the Monofacial or Bifacial"
                      >
                        <option value="">Select Data</option>
                        {MonofacialBifacialList.map((option) => (
                          <option key={option.id} value={option.id}>{option.name}</option>
                        ))}

                      </Form.Select>
                      {errors.items && errors.items[item.id] && errors.items[item.id].MonofacialBifacial && (
                        <div className="text-danger">
                          {errors.items[item.id].MonofacialBifacial}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>DCR OR Non-DCR</Form.Label>
                      <Form.Select
                        style={{
                          ...styles.customInput,
                          border: errors.items && errors.items[item.id] && errors.items[item.id].dcr_nondcr
                            ? '2px solid red' : '2px solid black'
                        }}
                        className="common-input"
                        name="dcr_nondcr"
                        value={item.dcr_nondcr}
                        onChange={(e) => handleItemChange(e, item.id)}
                      >
                        <option value="">Select DCR Non DCR</option>
                        {dcr_nondcrList.map((option) => (
                          <option key={option.id} value={option.value}>{option.label}</option>
                        ))}
                      </Form.Select>
                      {errors.items && errors.items[item.id] && errors.items[item.id].dcr_nondcr && (
                        <div className="text-danger">
                          {errors.items[item.id].dcr_nondcr}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Wattage</Form.Label>
                      <Form.Select
                        style={{
                          ...styles.customInput,
                          border: errors.items && errors.items[item.id] && errors.items[item.id].watage
                            ? '2px solid red' : '2px solid black'
                        }}
                        className="common-input"
                        name="watage"
                        value={item.watage}
                        onChange={(e) => handleItemChange(e, item.id)}
                      >
                        <option value="">Select Wattage</option>
                        {watageList.map((option) => (
                          <option key={option.watageId} value={option.watageName}>{option.watageName}</option>
                        ))}
                      </Form.Select>
                      {errors.items && errors.items[item.id] && errors.items[item.id].watage && (
                        <div className="text-danger">
                          {errors.items[item.id].watage}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>HSN Code</Form.Label>
                      <Form.Control
                        style={styles.customInput}
                        className="common-input"
                        type="text"
                        name="HS"
                        value={item.HS}
                        onChange={(e) => handleItemChange(e, item.id)}
                        readOnly
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        style={{
                          ...styles.customInput,
                          border: errors.items && errors.items[item.id] && errors.items[item.id].quantity
                            ? '2px solid red' : '2px solid black'
                        }}
                        className="common-input"
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(e, item.id)}
                      />
                    </Form.Group>
                    {errors.items && errors.items[item.id] && errors.items[item.id].quantity && (
                      <div className="text-danger">
                        {errors.items[item.id].quantity}
                      </div>
                    )}
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Unit Price</Form.Label>
                      <Form.Control
                        style={{
                          ...styles.customInput,
                          border: errors.items && errors.items[item.id] && errors.items[item.id].unitPrice
                            ? '2px solid red' : '2px solid black'
                        }}
                        className="common-input"
                        type="number"
                        name="unitPrice"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(e, item.id)}
                        disabled={
                          !item.MonofacialBifacial ||
                          !item.watage ||
                          !item.MBT ||
                          !item.dcr_nondcr
                        }
                      />
                    </Form.Group>
                    {errors.items && errors.items[item.id] && errors.items[item.id].unitPrice && (
                      <div className="text-danger">
                        {errors.items[item.id].unitPrice}
                      </div>
                    )}
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Value</Form.Label>
                      <Form.Control
                        style={styles.customInput}
                        className="common-input"
                        type="number"
                        name="value"
                        value={item.value}
                        readOnly
                        disabled
                        onChange={(e) => handleItemChange(e, item.id)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {/* Conditional Rendering for Second Row of Fields with Labels */}
                <Row className="mt-3">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>GST (%)</Form.Label>
                      <Form.Control
                        style={styles.customInput}
                        className="common-input"
                        type="number"
                        name="GST"
                        value={item.GST}
                        onChange={(e) => handleItemChange(e, item.id)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>IGST(%)</Form.Label>
                      <Form.Control
                        style={styles.customInput}
                        className="common-input"
                        type="number"
                        name="IGST"
                        value={item.IGST}
                        disabled
                        readOnly
                        onChange={(e) => handleItemChange(e, item.id)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>CGST(%)</Form.Label>
                      <Form.Control
                        style={styles.customInput}
                        className="common-input"
                        type="number"
                        name="CGST"
                        value={item.CGST}
                        onChange={(e) => handleItemChange(e, item.id)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>SGST (%)</Form.Label>
                      <Form.Control
                        style={styles.customInput}
                        className="common-input"
                        type="number"
                        name="SGST"
                        value={item.SGST}
                        onChange={(e) => handleItemChange(e, item.id)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        style={{
                          ...styles.customInput,
                          border: errors.items && errors.items[item.id] && errors.items[item.id].totalAmount
                            ? '2px solid red' : '2px solid black'
                        }}
                        className="common-input"
                        type="number"
                        name="totalAmount"
                        value={item.totalAmount}

                        readOnly
                        disabled
                      />
                    </Form.Group>
                    {errors.items && errors.items[item.id] && errors.items[item.id].totalAmount && (
                      <div className="text-danger">
                        {errors.items[item.id].totalAmount}
                      </div>
                    )}
                  </Col>
                </Row>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteRow(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end">
        <Button
          variant="primary"
          className="mt-3"
          onClick={handleAddRow}
        >
          Add Row
        </Button>
      </div>
    </Container>
  );
}
export default ItemTable;