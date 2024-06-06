import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icon configuration
const customIcon = L.icon({
  iconUrl: "https://img.icons8.com/color/48/000000/marker.png", // icon URL
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const LocationMarker = ({ handleLocationSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(event) {
      setPosition(event.latlng);
      handleLocationSelect(event.latlng);
    },
  });

  return position === null ? null : <Marker position={position} icon={customIcon}></Marker>;
};

export default function Lokacija({ handleLocationChange }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4} >
    <Stack
  spacing={2}
  
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width:"800px"
  }}
>
  <Typography variant="h6" style={{ textAlign: "center" }}>
    Izvēlieties atrašanās vietu kartē
  </Typography>
  <MapContainer
    center={[56.946, 24.105]}
    zoom={13}
    style={{ height: "400px", width: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <LocationMarker handleLocationSelect={handleLocationChange} />
  </MapContainer>
</Stack>

    </Box>
  );
}
