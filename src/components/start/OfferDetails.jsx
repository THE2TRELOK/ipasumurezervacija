import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Room } from "@mui/icons-material";
import PlaceIcon from "@mui/icons-material/Place";
import L from "leaflet";
import { db, auth } from "../../firebase";
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  TextField,
  Avatar,
  Rating,
  Stack,
  Divider,
  Paper,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import { DateRange } from "react-date-range";
import {
  addDays,
  isBefore,
  isAfter,
  format,
  startOfDay,
  endOfDay,
} from "date-fns";
import { lv } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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
  const [isReserved, setIsReserved] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [reservations, setReservations] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [reviews, setReviews] = useState([
    {
      authorAvatar: "https://via.placeholder.com/150",
      authorName: "Jānis Bērziņš",
      rating: 4,
      text: "Lieliska vieta! Ļoti tīra un ērta. Noteikti ieteikšu draugiem.",
    },
    {
      authorAvatar: "https://via.placeholder.com/150",
      authorName: "Anna Kalniņa",
      rating: 5,
      text: "Viss bija perfekti! Ļoti jauka saimniece un brīnišķīga vieta.",
    },
  ]);
  const [reservationData, setReservationData] = useState([]); // State for reservation table data
  const customIcon = L.icon({
    iconUrl: "https://img.icons8.com/color/48/000000/marker.png", // icon URL
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
  useEffect(() => {
    const fetchOffer = async () => {
      const offerRef = doc(collection(db, "Houses"), id);
      const offerDoc = await getDoc(offerRef);
      if (offerDoc.exists()) {
        setOffer({ id: offerDoc.id, ...offerDoc.data() });
      }
    };
    const fetchReservations = async () => {
      const reservationRef = collection(db, "Reservations");
      const snapshot = await getDocs(reservationRef);
      const reservationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(reservationsData);
    };

    const fetchReservationData = async () => {
      const reservationDataRef = collection(db, "ReservationData");
      const snapshot = await getDocs(reservationDataRef);
      const reservationData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservationData(reservationData);
    };

    fetchOffer();
    fetchReservations();
    fetchReservationData();
  }, [id]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleApartamentiClick = () => {
    navigate("/Apartamenti");
  };

  const handleReserveClick = async () => {
    const uid = auth.currentUser.uid; // Get the UID of the logged-in user
    const userRef = doc(collection(db, "Users"), uid);
    const userDoc = await getDoc(userRef);

    const isDateAvailable = !reservations.some(
      (reservation) =>
        reservation.houseId === offer.id && // Match house ID
        ((isBefore(selectedDates[0].startDate, new Date(reservation.endDate)) &&
          isAfter(
            selectedDates[0].startDate,
            new Date(reservation.startDate)
          )) ||
          (isBefore(selectedDates[0].endDate, new Date(reservation.endDate)) &&
            isAfter(selectedDates[0].endDate, new Date(reservation.startDate))))
    );

    if (
      userDoc.exists() &&
      userDoc.data().balance >= totalCost &&
      isDateAvailable
    ) {
      try {
        // 1. Update user balance
        await Promise.all([
          updateDoc(userRef, { balance: userDoc.data().balance - totalCost }),
          // 2. Create reservation (can be done in parallel)
          setDoc(doc(collection(db, "Reservations"), offer.id), {
            userId: uid,
            houseId: offer.id,
            startDate: selectedDates[0].startDate,
            endDate: selectedDates[0].endDate,
            OwnerId: offer.Owner,
          }),
        ]);

        // 4. Confirmation
        alert("Reservation successful! Your balance has been updated.");

        setIsReserved(true);
      } catch (error) {
        console.error("Error updating balance or creating reservation:", error);
        alert("Error processing reservation. Please try again later.");
      }
    } else {
      alert("Insufficient funds or dates are not available!");
    }
  };

  const getDisabledDates = () => {
    const disabledDates = [];
    reservations.forEach((reservation) => {
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      for (
        let date = startOfDay(startDate);
        isBefore(date, endDate);
        date = addDays(date, 1)
      ) {
        disabledDates.push(date);
      }
    });
    return disabledDates;
  };

  useEffect(() => {
    if (offer && selectedDates[0].startDate && selectedDates[0].endDate) {
      const days = Math.ceil(
        (selectedDates[0].endDate - selectedDates[0].startDate) /
          (1000 * 3600 * 24)
      );
      const baseCost = days * offer.Price;
      const tax = baseCost * 0.12;
      setTotalCost(baseCost + tax);
    } else {
      setTotalCost(0);
    }
  }, [selectedDates, offer]);

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
        <Grid item xs={12} md={5}>
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

      <Grid container spacing={2} mb={4} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={12}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setSelectedDates([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={selectedDates}
            minDate={new Date()}
            locale={lv}
            disabledDates={getDisabledDates()} // Pass disabled dates to DateRange
          />
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} style={{ marginTop: "20px" }}>
        <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
          Kopējā cena
        </Typography>
        <Typography gutterBottom>{totalCost.toFixed(2)} €</Typography>
      </Grid>

      <Box textAlign="right" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApartamentiClick}
          style={{ marginRight: "10px" }}
        >
          Atpakaļ
        </Button>
        {isReserved ? (
          <Button variant="contained" disabled>
            Rezervēts
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleReserveClick}
          >
            Rezervēt
          </Button>
        )}
      </Box>

      <div style={{ height: "400px", marginTop: "30px" }}>
        <MapContainer
          center={[offer.Location.latitude, offer.Location.longitude]}
          zoom={13}
          style={{ height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            icon={customIcon}
            position={[offer.Location.latitude, offer.Location.longitude]}
          >
            <Popup>{offer.Name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <Typography
        variant="h6"
        gutterBottom
        style={{ fontWeight: "bold", marginTop: "30px" }}
      >
        Atsauksmes
      </Typography>
      <Grid container spacing={2} mt={2}>
        {reviews.map((review, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar src={review.authorAvatar} alt={review.authorName} />
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1" gutterBottom>
                    {review.authorName}
                  </Typography>
                  <Rating name="read-only" value={review.rating} readOnly />
                  <Typography variant="body2" gutterBottom>
                    {review.text}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

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
