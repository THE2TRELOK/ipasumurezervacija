import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Wifi as WifiIcon,
  Tv as TvIcon,
  Bed as BedIcon,
  Laptop as LaptopIcon,
  AcUnit as AcIcon,
  LocalParking as ParkingIcon,
  Pool as PoolIcon,
  Kitchen as KitchenIcon,
  Videocam as VideocamIcon,
  LocalLaundryService as LaundryIcon,
  OutdoorGrill as OutdoorGrillIcon,
  FitnessCenter as FitnessCenterIcon,
  Bathtub as BathtubIcon,
  Shower as ShowerIcon,
  Fireplace as FireplaceIcon,
} from "@mui/icons-material";

const amenitiesIcons = {
  wifi: <WifiIcon />,
  televizors: <TvIcon />,
  gulta: <BedIcon />,
  portatīvais_dators: <LaptopIcon />,
  kondicionieris: <AcIcon />,
  autostāvvieta: <ParkingIcon />,
  baseins: <PoolIcon />,
  virtuve: <KitchenIcon />,
  kamera: <VideocamIcon />,
  laundry: <LaundryIcon />,
  grils: <OutdoorGrillIcon />,
  sporta_inventārs: <FitnessCenterIcon />,
  sauna: <BathtubIcon />,
  duša: <ShowerIcon />,
  kamins: <FireplaceIcon />,
};

const amenitiesText = {
  wifi: "Bezmaksas Wi-Fi",
  televizors: "Televizors",
  gulta: "Gulta",
  portatīvais_dators: "Portatīvais dators",
  kondicionieris: "Kondicionieris",
  autostāvvieta: "Autostāvvieta",
  baseins: "Baseins",
  virtuve: "Virtuve",
  kamera: "Kamera",
  laundry: "Veļas mazgātava",
  grils: "Grils",
  sporta_inventārs: "Sporta inventārs",
  sauna: "Pirts",
  duša: "Duša",
  kamins: "Kamīns",
};

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      const offerRef = doc(collection(db, "Houses"), id);
      const offerDoc = await getDoc(offerRef);
      if (offerDoc.exists()) {
        setOffer({ id: offerDoc.id, ...offerDoc.data() });
      }
    };

    fetchOffer();
  }, [id]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleApartamentiClick = () => {
    navigate("/Apartamenti");
  };

  if (!offer) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      p={4}
      style={{
        backgroundColor: "#f7f7f7",
        color: "#333",
        maxWidth: "1200px",
        margin: "0 auto",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{
          color: "#333",
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        {offer.Name}
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid  item xs={12} md={5}>
          <img
            src={offer.Images[0]}
            alt="Main"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => setSelectedImage(offer.Images[0])}
          />
        </Grid>
        <Grid item xs={12} md={4} container spacing={2}>
          {offer.Images.slice(1, 5).map((image, index) => (
            <Grid item xs={6} key={index}>
              <img
                src={image}
                alt={`Image ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedImage(image)}
              />
            </Grid>
          ))}
          {offer.Images.length > 5 && (
            <Grid item xs={12} textAlign="center">
              <Button
                variant="outlined"
                onClick={() => console.log("View all images")}
              >
                Skatīt visus
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
        Apraksts
      </Typography>
      <Typography gutterBottom>
        {showFullDescription
          ? offer.Description
          : `${offer.Description.substring(0, 150)}...`}
        {offer.Description.length > 150 && (
          <Button
            onClick={toggleDescription}
            style={{
              color: "#007bff",
              textDecoration: "underline",
              marginLeft: "10px",
            }}
          >
            {showFullDescription ? "Parādīt mazāk" : "Parādīt vairāk"}
          </Button>
        )}
      </Typography>
      <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
        Ērtības
      </Typography>
      <Grid container spacing={2} mb={4}>
        {offer.Amenities.map((amenity, index) => (
          <Grid
            item
            xs={6}
            md={4}
            key={index}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Box mr={1}>{amenitiesIcons[amenity.toLowerCase()]}</Box>
            <Typography>{amenitiesText[amenity.toLowerCase()]}</Typography>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
        Cena
      </Typography>
      <Typography gutterBottom>{offer.Price} € par nakti</Typography>
      <Box textAlign="right" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApartamentiClick}
          style={{ marginRight: "10px" }}
        >
          Atpakaļ
        </Button>
        <Button variant="contained" color="secondary">
          Rezervēt
        </Button>
      </Box>
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent style={{ padding: 0, position: "relative" }}>
            <IconButton
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={selectedImage}
              alt="Selected"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default OfferDetails;
