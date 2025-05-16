import React, { useState } from "react";
import { Dialog, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DownloadIcon from "@mui/icons-material/Download";

const ImageSlider = ({ open, onClose, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle previous image click
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Handle next image click
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle image download
  const handleDownload = async () => {
    const imageUrl = images[currentIndex];

    // Check if the image URL is from an external platform or localhost
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      try {
        const response = await fetch(imageUrl, { mode: "cors" }); // For external URLs, fetch the image data
        const blob = await response.blob();
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(blob); // Create a local URL for the image blob
        link.href = url;
        link.download = `image-${currentIndex + 1}.jpg`; // Set the file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up the URL object
      } catch (error) {
        console.error("Error downloading the image:", error);
      }
    } else {
      // Localhost images can be downloaded directly
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `image-${currentIndex + 1}.jpg`; // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Filter out invalid images
  const validImages = images.filter(
    (image) => image !== null && image !== undefined
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {validImages.length > 0 ? (
          <img
            src={validImages[currentIndex]}
            alt={`Vehicle ${currentIndex + 1}`} // Alt text for image
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        ) : (
          <h1 className="p-10 text-red-500 font-sans font-bold capitalize">
            No Images Available
          </h1>
        )}

        {validImages.length > 0 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: "2%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "black",
                "&:hover": { backgroundColor: "gray" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: "2%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "black",
                "&:hover": { backgroundColor: "gray" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}

        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "2%",
            right: "2%",
            color: "white",
            backgroundColor: "red",
            "&:hover": { backgroundColor: "darkred" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Download Button */}
        {validImages.length > 0 && (
          <IconButton
            onClick={handleDownload}
            sx={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              backgroundColor: "green",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
            }}
          >
            <DownloadIcon />
          </IconButton>
        )}
      </Box>
    </Dialog>
  );
};

export default ImageSlider;
