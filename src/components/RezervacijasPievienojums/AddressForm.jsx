import * as React from "react";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import { useState } from "react";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm({ handleFormChange, formData }) {
  const { bookName, address1, address2, city, zip } = formData;

  const [localBookName, setLocalBookName] = useState(bookName);
  const [localAddress1, setLocalAddress1] = useState(address1);
  const [localAddress2, setLocalAddress2] = useState(address2);
  const [localCity, setLocalCity] = useState(city);
  const [localZip, setLocalZip] = useState(zip);


  const handleBookNameChange = (e) => {
    setLocalBookName(e.target.value);
    handleFormChange("bookName", e.target.value);
  };

  const handleAddress1Change = (e) => {
    setLocalAddress1(e.target.value);
    handleFormChange("address1", e.target.value);
  };

  const handleAddress2Change = (e) => {
    setLocalAddress2(e.target.value);
    handleFormChange("address2", e.target.value);
  };

  const handleCityChange = (e) => {
    setLocalCity(e.target.value);
    handleFormChange("city", e.target.value);
  };

  const handleZipChange = (e) => {
    setLocalZip(e.target.value);
    handleFormChange("zip", e.target.value);
  };

  return (
    <Grid container spacing={3}>
      <FormGrid item xs={12}>
        <OutlinedInput
          id="BookName"
          name="bookName"
          value={localBookName}
          onChange={handleBookNameChange}
          type="nosaukums"
          placeholder="Piedavajuma nosaukums"
          autoComplete="Piedavajuma nosaukums"
          required
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <OutlinedInput
          id="address1"
          name="address1"
          type="address1"
          value={localAddress1}
          onChange={handleAddress1Change}
          placeholder="Ielas nosaukums un nummurs"
          autoComplete="Ielas nosaukums un nummurs"
          required
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <OutlinedInput
          id="address2"
          name="address2"
          type="address2"
          value={localAddress2}
          onChange={handleAddress2Change}
          placeholder="Dzivoklis, korpuss u.c."
          autoComplete="Dzivoklis, korpuss u.c."
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <OutlinedInput
          id="city"
          name="city"
          type="city"
          value={localCity}
          onChange={handleCityChange}
          placeholder="Rīga"
          autoComplete="City"
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <OutlinedInput
          id="zip"
          name="zip"
          value={localZip}
          onChange={handleZipChange}
          type="zip"
          placeholder="LV-4092"
          autoComplete="shipping postal-code"
          required
        />
      </FormGrid>
    </Grid>
  );
}
