import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, TextField } from "@mui/material";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { toast } from "react-toastify";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
import { dev } from "../../utils/ApiUrl";
import { useSelector } from "react-redux";
const FileUploadModal = ({
  open,
  onClose,
  type,
  vehcileData,
  getDataByStatus,
}) => {
  const { user } = useSelector((state) => state.user);
  const { singleVehicleData } = useSelector((state) => state.singleVehicle);

  // console.log('id',singleVehicleData.id)

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  // console.log('vehcileData',vehcileData)

  // console.log("file", file);
  useEffect(() => {
    if (!open) {
      setFile(null);
    }
  }, [open]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (
      type === "upload-material-list" &&
      selectedFile &&
      selectedFile.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      selectedFile.type !== "application/vnd.ms-excel"
    ) {
      toast.error("Please select a valid Excel file (.xlsx or .csv).");
      return;
    }
    if (
      (type === "upload-e-bill" || type === "upload-invoice") &&
      selectedFile &&
      selectedFile.type !== "application/pdf"
    ) {
      toast.error("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    // /uploadEway'
    // /uploadMaterialList
    const formData = new FormData();
    formData.append("vehicleId", singleVehicleData.id); // Add vehicleId to the form data
    formData.append("file", file); // Add the file (PDF or Excel) to the form data

    const endPoint =
      type === "upload-material-list"
        ? "uploadMaterialList"
        : type === "upload-e-bill"
        ? "uploadEway"
        : "uploadChalan";

    // Upload logic here
    try {
      setLoading(true);

      const resp = await fetch(
        `${dev}/vehicleIN/${endPoint}`, // API endpoint for vehicle entry
        {
          method: "POST",
          body: formData, // Use FormData for file upload
          headers: {
            // No need to set 'Content-Type', fetch will automatically set the appropriate boundary for FormData
          },
        }
      );

      const result = await resp.json(); // Parse the response JSON

      console.log("upload reuslt", result);
      // Check if response is not OK (status code other than 200-299)
      if (!resp.ok) {
        setLoading(false);
        toast.error(result.message || "Failed To Upload"); // Show error message in toast
        return; // Exit if vehicle entry creation failed
      }
      toast.success("Uploaded Sucessfully");
      getDataByStatus();
    } catch (error) {
      toast.error("something went wrong");
      console.log("uploading file failed", error);
    } finally {
      setLoading(false);
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={modalStyle}>
        {/* Title */}
        <Typography variant="h5" style={headingStyle}>
          {type === "upload-e-bill"
            ? "Upload E-wayBill"
            : type === "upload-invoice"
            ? "Upload Invoice"
            : "Upload Material List"}
        </Typography>

        {/* File input */}
        <TextField
          type="file"
          fullWidth
          variant="outlined"
          onChange={handleFileChange}
          inputProps={{
            accept: type === "upload-material-list" ? ".xlsx, .csv" : ".pdf", // Excel for Material List, PDF for others
          }}
          style={inputStyle}
        />

        {/* Show PDF preview if it's a PDF */}
        {file && file.type === "application/pdf" && (
          <div style={pdfContainerStyle}>
            <embed
              src={URL.createObjectURL(file)}
              type="application/pdf"
              width="100%"
              height="400px"
              style={pdfPreviewStyle}
            />
          </div>
        )}

        {/* Buttons */}
        <div style={buttonContainerStyle}>
        <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            style={cancelButtonStyle}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            style={uploadButtonStyle}
          >
            Upload
          </Button>
          
        </div>
      </div>
    </Modal>
  );
};

// Styles
const modalStyle = {
  padding: "20px",
  backgroundColor: "#fff",
  margin: "10px auto",
  width: "50%",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  maxHeight: "100vh", // Ensure it doesn't overflow screen height
  overflow: "auto",
};

const headingStyle = {
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
  marginBottom: "20px",
  fontWeight: "bold",
};

const inputStyle = {
  marginBottom: "20px",
};

const pdfContainerStyle = {
  marginBottom: "20px",
  maxHeight: "300px", // Limit height for PDF container
  overflow: "auto", // Allow scroll if PDF is too large
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const pdfPreviewStyle = {
  width: "100%",
};

const extractedTextStyle = {
  marginTop: "20px",
  backgroundColor: "#f1f1f1",
  padding: "10px",
  borderRadius: "5px",
  maxHeight: "200px",
  overflowY: "auto",
};

const extractedDataStyle = {
  marginTop: "20px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginTop: "20px",
};

const uploadButtonStyle = {
  width: "45%",
  padding: "10px",
};

const cancelButtonStyle = {
  width: "45%",
  padding: "10px",
};

export default FileUploadModal;
