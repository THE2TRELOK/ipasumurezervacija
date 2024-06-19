import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../index.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { addDays, isAfter, isBefore, startOfDay, endOfDay, format, parseISO } from "date-fns";
import { lv } from "date-fns/locale"; 

// Define amenitiesText globally
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
  veļas_mazgātava: "Veļas mazgātava",
  grils: "Grils",
  sporta_inventārs: "Sporta inventārs",
  sauna: "Pirts",
  duša: "Duša",
  kamīns: "Kamīns",
  mūzika: "Mūzika",
};

export default function Apartamenti() {
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPriceFrom, setSelectedPriceFrom] = useState("");
  const [selectedPriceTo, setSelectedPriceTo] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchOffersAndCities = async () => {
      try {
        const offersRef = collection(db, "Houses");
        const q = query(offersRef, where("Status", "==", "Apstiprināts"));
        const querySnapshot = await getDocs(q);

        const offersData = [];
        const uniqueCities = new Set(); 

        querySnapshot.forEach((doc) => {
          const offerData = doc.data();
          offersData.push({
            id: doc.id,
            ...offerData,
            reservations: (offerData.reservations || []).map((res) => ({
              startDate: startOfDay(res.startDate.toDate()),
              endDate: endOfDay(res.endDate.toDate()),
            })),
          });

          uniqueCities.add(offerData.City); 
        });

        setOffers(offersData);
        setFilteredOffers(offersData);
        setCities([...uniqueCities]); 
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffersAndCities();
  }, []);

  useEffect(() => {
    const filtered = offers.filter((offer) => {
      const isCityMatch =
        selectedCity === "" ||
        offer.City.toLowerCase().includes(selectedCity.toLowerCase());

      const isPriceMatch =
        (selectedPriceFrom === "" || offer.Price >= selectedPriceFrom) &&
        (selectedPriceTo === "" || offer.Price <= selectedPriceTo);

      const isAmenitiesMatch =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) =>
          offer.Amenities.map((a) => a.toLowerCase()).includes(amenity.toLowerCase())
        );

      const isDateMatch = 
        !startDate || 
        !endDate ||
        offer.reservations.some((reservation) => {
          const reservationStart = startOfDay(reservation.startDate);
          const reservationEnd = endOfDay(reservation.endDate);
          const selectedStart = startOfDay(startDate);
          const selectedEnd = endOfDay(endDate);

          // Check if there is at least one day BEFORE the start of the reservation 
          // or AFTER the end of the reservation
          const isDayBeforeReservation = isBefore(selectedEnd, reservationStart);
          const isDayAfterReservation = isAfter(selectedStart, reservationEnd);

          return isDayBeforeReservation || isDayAfterReservation;
        }); 

      return isCityMatch && isPriceMatch && isAmenitiesMatch && isDateMatch;
    });

    setFilteredOffers(filtered);
    setPage(1); 
  }, [
    offers,
    selectedCity,
    selectedPriceFrom,
    selectedPriceTo,
    selectedAmenities,
    startDate,
    endDate,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = filteredOffers.slice(startIndex, endIndex);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box flex="1" bgcolor="#f0f0f0" p={10}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}
        >
          Visi piedāvājumi
        </Typography>

        <Grid container spacing={2} mb={4} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="city-select-label">Pilsēta</InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <MenuItem value="">Visas</MenuItem>
                {cities.map((city) => ( 
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Cena (no)"
              type="number"
              value={selectedPriceFrom}
              onChange={(e) =>
                setSelectedPriceFrom(e.target.value === "" ? "" : Number(e.target.value))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Cena (līdz)"
              type="number"
              value={selectedPriceTo}
              onChange={(e) =>
                setSelectedPriceTo(e.target.value === "" ? "" : Number(e.target.value))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="amenities-select-label">Ērtības</InputLabel>
              <Select
                labelId="amenities-select-label"
                id="amenities-select"
                multiple
                value={selectedAmenities}
                onChange={(e) => setSelectedAmenities(e.target.value)}
                renderValue={(selected) =>
                  selected
                    .map((value) => amenitiesText[value.toLowerCase()])
                    .join(", ")
                }
              >
                {Object.keys(amenitiesText).map((amenity) => (
                  <MenuItem key={amenity} value={amenity}>
                    {amenitiesText[amenity.toLowerCase()]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Ierašanās datums"
              type="date"
              value={startDate ? format(startDate, "yyyy-MM-dd", { locale: lv }) : ""}
              onChange={(e) => {
                setStartDate(e.target.value ? parseISO(e.target.value) : null);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Izrakstīšanās datums"
              type="date"
              value={endDate ? format(endDate, "yyyy-MM-dd", { locale: lv }) : ""}
              onChange={(e) => {
                setEndDate(e.target.value ? parseISO(e.target.value) : null);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={5} justifyContent="center">
          {currentOffers.map((offer, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link to={`/offer/${offer.id}`} style={{ textDecoration: "none" }}>
                <Card
                  style={{
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <CardActionArea>
                    <img
                      src={offer.Images[0]}
                      alt={offer.Name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ color: "#333" }}
                      >
                        {offer.Name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Pilseta: {offer.City}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Cena: {offer.Price} €
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Ietilpiba: {offer.PeopleCount} cilveki
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>

        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredOffers.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}