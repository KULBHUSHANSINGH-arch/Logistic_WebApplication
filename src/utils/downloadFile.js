const downloadImage = async (imageUrl) => {
  try {
    // Check if the image is hosted locally or on a third-party server
    const isLocal = imageUrl.startsWith("http://localhost") || imageUrl.startsWith("/");

    if (isLocal) {
      // Handle local images
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = imageUrl.split('/').pop(); // Get the image name from the URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Handle third-party images
      const response = await fetch(imageUrl);
      const blob = await response.blob(); // Get the image as a blob
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = imageUrl.split('/').pop(); // Get the image name from the URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  } catch (error) {
    console.error('Failed to download image:', error);
  }
};

export default downloadImage


export const validateGST = (gstValue) => {
  // Convert the input to uppercase since GSTIN is case-insensitive
  const gst = gstValue.toUpperCase();

  // GSTIN regex pattern
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  // Validate the length (GSTIN should be 15 characters)
  if (gst.length !== 15) {
    return 'GST NO must be 15 characters long';
  }

  // Validate the GSTIN format
  if (!gstRegex.test(gst)) {
    return 'Invalid GST NO ';
  }

  // Return null if no errors (GSTIN is valid)
  return null;
};
