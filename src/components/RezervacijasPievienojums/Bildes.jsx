import React, { useState } from "react";
import { Button, Typography, Grid, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
const Bildes = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [...images, ...files];

    if (newImages.length > 10) {
      setError("Jus nevarat lejupladet vairak par 10 atteliem");
    } else {
      setImages(newImages);
      setError(null);
      onImagesChange(newImages);
    }
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div>
      <Stack
        spacing={2}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "800px",
        }}
      >
        <Typography variant="h6">Pievienot fotoattelus (minimum 3)</Typography>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          multiple
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <Button
            variant="contained"
            component="span"
            style={{ backgroundColor: "#151f28" }}
          >
            Augšpieladet attelus
          </Button>
        </label>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={0} xs={12}>
          {images.map((image, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`upload-${index}`}
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleImageRemove(index)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    minWidth: "24px",
                    padding: "2px",
                  }}
                >
                  X
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </div>
  );
};

export default Bildes;
