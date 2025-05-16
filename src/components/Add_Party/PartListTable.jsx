import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import { Link } from "react-router-dom";
import img1 from "../../assets/Images/plus.png";
import { Image } from "react-bootstrap";
import "../Add_Party/table.css";
import { Tooltip } from "primereact/tooltip";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { dev } from "../../utils/ApiUrl";
import "../Add_Party/table.css";
import { useSelector } from "react-redux";

const PartyListTable = () => {
  const { user } = useSelector((state) => state.user);

  const [data, setData] = useState([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [personId , setPersonId ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const string = localStorage.getItem("value")
    if (string) {
      setGlobalFilter(string)
    } else {
      setGlobalFilter('')
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      // console.log('person iddddddddddd', user.personId)
      try {
        const response = await axios.post(`${dev}/party/getSalesParty`,{personId: user.personId}, {
        // const response = await axios.post(`${dev}/party/getParty`, {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        });

        if (response.status === 200 && Array.isArray(response.data.data)) {
          // console.log("Fetched data:", response.data);
          setData(response.data.data);
        } else {
          console.error("Check your Internet:", response);
          toast("Failed to fetch party list. Please Check your Internet");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching party list:", error.message);
        toast(
          "Failed to fetch party list. Please Check Your Internet"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [personId]);

  const handleEditClick = (PartyNameId) => {
    navigate("/newParty", { state: { PartyNameId, Type: "" } });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          <Button
            icon="pi pi-pencil"
            className="p-button p-button-success p-button-icon-only custom-tooltip-button"
            data-pr-tooltip="Edit Party"
            style={{
              marginLeft: "15px",
              backgroundColor: "#689F38",
              width: "40px",
              color: "#FFFFFF",
              height: "40px",
              borderRadius: "0",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            onClick={() => handleEditClick(rowData.PartyNameId)}
          />
        </div>
        {/* <Tooltip target=".p-button-rounded" position="top" className="custom-tooltip" /> */}
        <Tooltip
          target=".custom-tooltip-button"
          position="top"
          className="custom-tooltip"
        />
      </React.Fragment>
    );
  };


  const renderHeader = () => {
    return (


      <div className="container" style={{ width: "100%", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", }}>
        {/* Left Section: Search Bar */}
        <div style={{ display: "flex", flex: 1, alignItems: "center", }} >
          <span className="p-input-icon-left" style={{ width: "100%" }}>
            <InputText placeholder="Search...."
              style={{ border: "1px solid black", width: "30%", padding: "8px", borderRadius: "4px", }} type="search" value={globalFilter}
              onInput={(e) => { const value = e.target.value; setGlobalFilter(value); localStorage.setItem("value", value); }} />
          </span>
        </div>

        {/* Right Section: Add New Party and Export */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "15px", }}>
          <Link to="/newParty" className="plus" data-pr-tooltip="Add New Party" style={{ marginRight: "10px" }}  >
            <Image src={img1} alt="plus" rounded style={{ width: "35px", height: "35px" }} />
          </Link>
          <Button label="Export" icon="pi pi-file-excel" className="p-button-success export-button custom-button" onClick={exportExcel} />
          <Tooltip target=".plus" content="Add New Party" position="top" className="custom-tooltip" />
        </div>
      </div>
    );
  };

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Party List");
    worksheet.columns = [
      { header: "Party Name", key: "PartyName", width: 25 },
      { header: "Mobile Number", key: "MobileNumber", width: 25 },
      { header: "Email", key: "Email", width: 35 },
      { header: "Country", key: "Country", width: 25 },
      { header: "State", key: "State", width: 25 },
      { header: "City", key: "City", width: 25 },
      { header: "Address", key: "Address", width: 35 },
      { header: "Pin Code", key: "PinCode", width: 15 },
    ];
    worksheet.getRow(1).font = {
      bold: true,
      size: 14,
      color: { argb: "FFFFFFFF" },
    };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getRow(1).height = 35;

    // Add data
    const processedData = data.map((item) => ({
      PartyName: item.PartyName,
      MobileNumber: item.MobileNumber,
      Email: item.Email,
      Country: item.Country,
      State: item.State,
      City: item.City,
      Address: item.Address,
      PinCode: item.PinCode,
      // Latitude: item.Latitude,
      // Longitude: item.Longitude,
    }));

    worksheet.addRows(processedData);
    const totalRows = worksheet.rowCount;
    const totalCols = worksheet.columnCount;

    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= totalCols; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (row > 1) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };
          cell.font = { size: 12 };
        }
      }
    }

    worksheet.eachRow({ includeEmpty: true }, (row) => {
      let maxRowHeight = 0;
      row.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        const colWidth = worksheet.getColumn(cell.col).width || 10; 
        const words = cellValue.split(" ");
        let currentLineLength = 0;
        let lineCount = 1;

        words.forEach((word) => {
          const wordLength = word.length;
          if (currentLineLength + wordLength + 1 > colWidth) {
            // +1 for space
            lineCount++;
            currentLineLength = wordLength;
          } else {
            currentLineLength += wordLength + 1;
          }
        });

        const baseLineHeight = 15; 
        const padding = 4; 
        const estimatedRowHeight = lineCount * baseLineHeight + padding;
        maxRowHeight = Math.max(maxRowHeight, estimatedRowHeight);
      });

      if (maxRowHeight > 0) {
        row.height = maxRowHeight;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PartyList.xlsx";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const header = renderHeader();

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <tr key={i}>
        <td>
          <Skeleton width="100%" height="4em" />
        </td>
        <td>
          <Skeleton width="100%" height="4em" />
        </td>
        <td>
          <Skeleton width="100%" height="4em" />
        </td>
        <td>
          <Skeleton width="100%" height="4em" />
        </td>
        <td>
          <Skeleton width="100%" height="4em" />
        </td>
        <td>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Skeleton width="30%" height="4em" />
            <Skeleton width="30%" height="4em" />
            <Skeleton width="30%" height="4em" />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="datatable-filter-demo ">
      <div className="card">
        <DataTable
          value={loading ? [] : data}
          paginator
          rows={50}
          rowsPerPageOptions={[5, 10, 20, 50]}
          scrollable
          scrollHeight="60vh"
          header={header}
          globalFilter={globalFilter}
          emptyMessage={loading ? null : "No items found."}
        >
          <Column
            style={{ border: "0.5px dotted black" }}
            field="PartyName"
            header="Party Name"
            filterPlaceholder="Search by Party Name"
            sortable
          />
          <Column
            style={{ border: "0.5px dotted black" }}
            field="MobileNumber"
            header="Mobile Number"
            sortable
          />
          <Column
            style={{ border: "0.5px dotted black" }}
            field="Email"
            header="Email"
            sortable
          />
          <Column
            style={{ border: "0.5px dotted black" }}
            field="Country"
            header="Country"
            sortable
          />
          <Column
            style={{ border: "0.5px dotted black" }}
            field="State"
            header="State"
            sortable
          />
          <Column
            style={{ border: "0.5px dotted black", alignItems: "center" }}
            header="Actions"
            body={actionBodyTemplate}
          />
        </DataTable>
        {loading && (
          <div className="p-p-3">
            <table className="p-datatable-table">
              <tbody>{renderSkeletonRows()}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyListTable;
