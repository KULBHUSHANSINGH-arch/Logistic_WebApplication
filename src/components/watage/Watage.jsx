import React, { useState, useEffect } from "react";
import logo from "../../assets/logo/logo.png";
import { dev } from "../../utils/ApiUrl";
import {
  Button as Buton,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { json } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import the plus icon
import { watageListRows } from "../../utils/row";
import { getColumns } from "../../utils/column";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Watage() {
  const { user } = useSelector((state) => state.user);
  const [watage, setWatage] = useState("");
  const [watageId, setWatageId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [watageList, setWatageList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const rows = watageListRows(watageList);
    setRows(rows);
    const columns = getColumns(handleEdit);
    // console.log("columns", columns);
    setColumns(columns);
  }, [watageList]);
  // fetching watage list-----
  const fetchWatageList = async () => {
    try {
      setListLoading(true);
      const resp = await fetch(`${dev}/watage/getWatageList`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      const result = await resp.json();
      console.log("data", result);
      if (!resp.ok) {
        setListLoading(false);
        toast.error(result.message || "Data Could Not fetch");
        return;
      }
      setListLoading(false);
      setWatageList(result.data);
    } catch (error) {
      setListLoading(false);
      toast.error("Something Went Wrong");
      console.log("Something Went wrong", error);
    }
  };
  useEffect(() => {
    fetchWatageList();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWatage(value);

    // Check the new value instead of the current state
    if (value) {
      setError(""); // Clear error if the new value is truthy
    }
  };

  const handleCancel = () => {
    setOpen(false); // Close modal first
    setTimeout(() => {
      setWatage(""); // Clear watage field
      setWatageId(""); // Clear watageId
      setError(""); // Clear any errors
    }, 300); // Delay clearing states to allow the modal to fully close
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleAdd = () => {};
  // console.log("watage id", watageId);
  const handleEdit = (edit) => {
    // console.log("edit data", edit);
    setWatage(edit?.watageName ? edit.watageName : "");
    setWatageId(edit?.watageId ? edit.watageId : "");
    setOpen(true);
  };

  const CustomPagination = (props) => {
    return (
      <Pagination
        {...props}
        count={Math.ceil(props.rowCount / props.pageSize)}
        onChange={props.onPageChange}
        color="primary"
      />
    );
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!watage) {
      return setError("Please Add Value");
    }
    try {
      setLoading(true);
      const resp = await fetch(`${dev}/watage/addWatage`, {
        method: "POST",
        body: JSON.stringify({
          personId: user.personId,
          watageName: watage,
          watageId: watageId || "",
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const result = await resp.json();
      if (!resp.ok) {
        setLoading(false);
        toast.error(result.message || "Please try again ");
        return;
      }
      handleCancel();
      setLoading(false);
      setOpen(false);
      toast.success(result.message || "Watage Added!");

      fetchWatageList();
    } catch (error) {
      setLoading(false);
      console.log("watage add failed", error);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <>
   <Box
  sx={{
    height: 500,
    width: "60%",
    position: "relative",
    margin: "40px auto",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: "20px",
    overflow: "hidden", // Keep this for card effect
  }}
>
  {/* Header Section */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 40px",
      backgroundColor: "#ffffff",
      color: "#666464",
      borderBottom: "1px solid #ddd",
      borderRadius: "10px 10px 0 0",
    }}
  >
    <Typography className="font-bold" variant="h6" sx={{ textAlign: "center", flex: 1 }}>
      Watage List
    </Typography>
    <Tooltip title="Add Watage" placement="top" arrow>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: "#ffffff",
          backgroundColor: "#e63f3f",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          "&:hover": {
            backgroundColor: "#d32f2f",
            color: "#ffffff",
          },
        }}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>
  </Box>

  {listLoading ? (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CircularProgress size={40} sx={{ color: "red" }} />
    </Box>
  ) : rows.length === 0 ? (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="body1">No data available.</Typography>
    </Box>
  ) : (
    <Box sx={{ height: "calc(100% - 80px)", overflow: "auto" }}> {/* Adjust height here */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={2}
        pagination
        paginationMode="client"
        rowsPerPageOptions={[2, 10, 20]}
        disableSelectionOnClick
        checkboxSelection={false}
        loading={false}
        components={{
          Pagination: CustomPagination,
        }}
        sx={{
          height: "100%",
          width: "100%",
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f97474",
            color: "#fff",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            padding: "8px 10px",
            fontSize: "14px",
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            whiteSpace: "normal",
            wordWrap: "break-word",
          },
          "& .MuiDataGrid-cell": {
            padding: "5px 6px",
            fontSize: "13px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            wordWrap: "break-word",
            color: "#343333",
            border: "1px solid #ddd",
          },
        }}
      />
    </Box>
  )}
</Box>

  
    {/* Modal for Adding Watage */}
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        {watageId ? "Edit Watage" : "Add Watage"}
        <IconButton
          onClick={handleCancel}
          sx={{ position: "absolute", right: 8, top: 8, color: "grey" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
  
      <DialogContent
        sx={{
          transition: "height 0.3s ease",
          height: error ? "auto" : "fit-content", // Adjust height based on error state
        }}
      >
        <TextField
          value={watage}
          onChange={handleChange}
          name="watage"
          type="text"
          placeholder="Enter Watage"
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
          error={!!error}
          helperText={error || ""}
        />
      </DialogContent>
  
      <DialogActions>
        <Buton onClick={handleCancel} color="default">
          Cancel
        </Buton>
        <Buton
          onClick={handleSubmit}
          type="submit"
          color="error"
          disabled={loading}
          sx={{
            position: "relative",
          }}
        >
          {loading ? (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
              }}
            />
          ) : watageId ? (
            "Update"
          ) : (
            "Submit"
          )}
        </Buton>
      </DialogActions>
    </Dialog>
  </>
  
  
  );
}
