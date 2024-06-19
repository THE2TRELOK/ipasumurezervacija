import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd"; 
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db, auth } from "../../firebase";
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  TextField,
  Avatar,
  Rating,
  Paper,
  DialogTitle,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
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
import SpeakerIcon from "@mui/icons-material/Speaker";
import { DateRange } from "react-date-range";
import {
  addDays,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
} from "date-fns";
import { lv } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Menu, Dropdown } from "antd";
import Chat from "../Chat/Chat";

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
  Muzika: <SpeakerIcon />,
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
  Muzika: "Mūzika",
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
  const customIcon = L.icon({
    iconUrl: "https://img.icons8.com/color/48/000000/marker.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
  const [showChat, setShowChat] = useState(false);
  const [ownerData, setOwnerData] = useState(null);
  const [showOwnerProfile, setShowOwnerProfile] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);
  const [showReservationError, setShowReservationError] = useState(false);
  const [ownerHouses, setOwnerHouses] = useState([]);

  useEffect(() => {
    const fetchOfferAndData = async () => {
      const offerRef = doc(collection(db, "Houses"), id);
      const offerDoc = await getDoc(offerRef);

      if (offerDoc.exists()) {
        const offerData = offerDoc.data();
        setOffer({ id: offerDoc.id, ...offerData });
        setOwnerId(offerData.Owner);

        // Fetch owner data and houses
        const ownerRef = doc(collection(db, "Users"), offerData.Owner);
        const ownerDoc = await getDoc(ownerRef);

        if (ownerDoc.exists()) {
          setOwnerData(ownerDoc.data());

          const housesRef = collection(db, "Houses");
          const q = query(housesRef, where("Owner", "==", offerData.Owner));
          const querySnapshot = await getDocs(q);
          const houses = querySnapshot.docs.map((doc) => {
            const houseData = doc.data();
            return {
              id: doc.id,
              name: houseData.Name,
              image: houseData.Images[0],
              price: houseData.Price,
            };
          });
          setOwnerHouses(houses);
        }
      }
    };

    fetchOfferAndData();
  }, [id]);

  useEffect(() => {
    const unsubscribeReservations = onSnapshot(
      collection(db, "Reservations"),
      (snapshot) => {
        const updatedReservations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate.toDate(), // Convert to Date object
          endDate: doc.data().endDate.toDate(), // Convert to Date object
        }));
        setReservations(updatedReservations);
      }
    );

    return () => unsubscribeReservations();
  }, []);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleApartamentiClick = () => {
    navigate("/Apartamenti");
  };

  const handleDateChange = (item) => {
    setSelectedDates([item.selection]);
    // If a single day is selected, make the endDate the next day
    if (item.selection.startDate.getTime() === item.selection.endDate.getTime()) {
      setSelectedDates([
        {
          startDate: item.selection.startDate,
          endDate: addDays(item.selection.endDate, 1), // Add one day
          key: "selection",
        },
      ]);
    }
  };

  const handleReserveClick = async () => {
    const uid = auth.currentUser.uid;
    const userRef = doc(collection(db, "Users"), uid);
    const userDoc = await getDoc(userRef);
    const offerRef = doc(collection(db, "Houses"), id);

    if (peopleCount < 1 || peopleCount > offer.PeopleCount) {
      setShowReservationError(true);
      return;
    }

    const isDateAvailable = !reservations.some(
      (reservation) =>
        reservation.houseId === offer.id &&
        ((isBefore(
          selectedDates[0].startDate,
          new Date(reservation.endDate)
        ) &&
          isAfter(
            selectedDates[0].startDate,
            new Date(reservation.startDate)
          )) ||
          (isBefore(
            selectedDates[0].endDate,
            new Date(reservation.endDate)
          ) &&
            isAfter(
              selectedDates[0].endDate,
              new Date(reservation.startDate)
            )))
    );

    if (isDateAvailable) {
      if (userDoc.exists() && userDoc.data().balance >= totalCost) {
        try {
          const reservationRef = doc(collection(db, "Reservations"));

          await Promise.all([
            updateDoc(userRef, {
              balance: userDoc.data().balance - totalCost,
            }),
            setDoc(reservationRef, {
              userId: uid,
              houseId: offer.id,
              startDate: selectedDates[0].startDate,
              endDate: selectedDates[0].endDate,
              totalCost: totalCost,
              peopleCount: peopleCount,
              OwnerId: offer.Owner,
            }),
            updateDoc(offerRef, {
              reservations: arrayUnion({
                startDate: selectedDates[0].startDate,
                endDate: selectedDates[0].endDate,
              }),
            }),
          ]);

          setReservations([
            ...reservations,
            {
              id: reservationRef.id,
              userId: uid,
              houseId: offer.id,
              startDate: selectedDates[0].startDate,
              endDate: selectedDates[0].endDate,
              totalCost: totalCost,
              peopleCount: peopleCount,
              OwnerId: offer.Owner,
            },
          ]);

          setPeopleCount(1);

          message.success("Rezervācija veiksmīga!"); // Use antd message
          setIsReserved(true);
        } catch (error) {
          console.error("Kļūda, apstrādājot rezervāciju:", error);
          message.error(
            "Kļūda, apstrādājot rezervāciju. Lūdzu, mēģiniet vēlreiz vēlāk."
          ); // Use antd message
        }
      } else {
        message.error("Nepietiek līdzekļu!"); // Use antd message
      }
    } else {
      message.error("Datumi nav pieejami!"); // Use antd message
    }
  };

  const getDisabledDates = () => {
    const disabledDates = [];
    reservations.forEach((reservation) => {
      if (reservation.houseId === id) {
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);

        for (
          let date = startOfDay(startDate);
          isBefore(date, endDate);
          date = addDays(date, 1)
        ) {
          disabledDates.push(date);
        }
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
    setIsReserved(false);
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

  const handleOwnerMenuClick = (e) => {
    if (e.key === "profile") {
      setShowOwnerProfile(true);
    } else if (e.key === "chat") {
      handleContactsClick();
    }
  };

  const ownerMenu = (
    <Menu onClick={handleOwnerMenuClick}>
      <Menu.Item key="profile">Profils</Menu.Item>
      <Menu.Item key="chat"> Čats</Menu.Item>
    </Menu>
  );

  const handleContactsClick = async () => {
    try {
      const uid = auth.currentUser.uid;
      const userRef = doc(collection(db, "Users"), uid);

      await updateDoc(userRef, {
        contacts: arrayUnion({ id: offer.Owner }),
      });

      setContacts((prevContacts) => [...prevContacts, { id: offer.Owner }]);

      setShowChat(true);
    } catch (error) {
      console.error(
        "Kļūda, pievienojot saimnieku kontaktu sarakstam:",
        error
      );
      message.error(
        "Kļūda, pievienojot saimnieku kontaktu sarakstam. Lūdzu, mēģiniet vēlreiz vēlāk."
      ); // Use antd message
    }
  };

  return (
    <Box
      p={4}
      sx={{
        backgroundColor: "#f2f2f2",
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
            alt="Galvenais"
            style={{
              maxWidth: "100%",
              height: "500px",
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
        <Grid item xs={12} md={3}>
          {ownerData && (
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 8 }}>
              <div style={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ fontWeight: "bold" }}
                >
                  Saimnieks
                </Typography>
                <Avatar
                  src={ownerData.Image}
                  alt={ownerData.Name}
                  sx={{ width: 80, height: 80, margin: "0 auto" }}
                />
                <Typography variant="body1" gutterBottom>
                  {ownerData.Name}
                </Typography>
                <Dropdown overlay={ownerMenu} placement="bottomRight" arrow>
                  <Button variant="outlined" type="primary">
                    Darbības
                  </Button>
                </Dropdown>
              </div>
            </Paper>
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
      <Grid container spacing={2} alignItems="center" mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
            Cena
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: "#007bff" }}>
            {offer.Price} €{" "}
            <span style={{ fontSize: "1rem" }}>par nakti</span>
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange} 
            moveRangeOnFirstSelection={false}
            ranges={selectedDates}
            minDate={new Date()}
            locale={lv}
            disabledDates={getDisabledDates()}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={4} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={12}>
          <TextField
            label="Cilvēku skaits"
            type="number"
            value={peopleCount}
            onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
            fullWidth
            inputProps={{ min: 1, max: offer.PeopleCount }}
          />
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} style={{ marginTop: "20px" }}>
        <Typography variant="h6" gutterBottom style={{ fontWeight: "bold" }}>
          Kopējā cena:
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#333", fontWeight: 600 }}
        >
          {totalCost.toFixed(2)} €
        </Typography>
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

      <Snackbar
        open={showReservationError}
        autoHideDuration={6000}
        onClose={() => setShowReservationError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowReservationError(false)}
          severity="error"
        >
          Nederīgs cilvēku skaits!
        </Alert>
      </Snackbar>

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

      {showOwnerProfile && (
        <Dialog
          open={showOwnerProfile}
          onClose={() => setShowOwnerProfile(false)}
        >
          <DialogTitle>Saimnieka profils</DialogTitle>
          <DialogContent>
            <div style={{ textAlign: "center" }}>
              <Avatar src={ownerData.Image} alt={ownerData.Name} />
              <Typography
                variant="h6"
                gutterBottom
                style={{ fontWeight: "bold" }}
              >
                {ownerData.Name}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Mājas:
              </Typography>
              <Grid container spacing={2}>
                {ownerHouses.map((house) => (
                  <Grid item xs={12} sm={6} md={4} key={house.id}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={house.image}
                          alt={house.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {house.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {house.price} € par nakti
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowOwnerProfile(false)}>
              Aizvērt 
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {showChat && (
        <Chat ownerId={ownerId} onClose={() => setShowChat(false)} />
      )}
    </Box>
  );
};

export default OfferDetails;