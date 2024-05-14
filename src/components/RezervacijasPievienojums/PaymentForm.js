import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/system';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function PaymentForm() {
  return (
    <Grid container spacing={3}>
        <FormGrid item xs={12}>
        <FormLabel htmlFor="address1" required>
          Nosaukums
        </FormLabel>
        <OutlinedInput
          id="BookName"
          name="BookName"
          type="nosaukums"
          placeholder="Piedavajuma nosaukums"
          autoComplete="Piedavajuma nosaukums"
          required
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address1" required>
          Adrese
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="address1"
          type="address1"
          placeholder="Ielas nosaukums un nummurs"
          autoComplete="Ielas nosaukums un nummurs"
          required
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address2">Adrese 2</FormLabel>
        <OutlinedInput
          id="address2"
          name="address2"
          type="address2"
          placeholder="Dzivoklis, korpuss u.c."
          autoComplete="Dzivoklis, korpuss u.c."
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="pilseta" required>
        Pilseta
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          type="city"
          placeholder="Rīga"
          autoComplete="City"
          required
        />
      </FormGrid>
    
      <FormGrid item xs={6}>
        <FormLabel htmlFor="zip" required>
          Pasta indekss
        </FormLabel>
        <OutlinedInput
          id="zip"
          name="zip"
          type="zip"
          placeholder="LV-4092"
          autoComplete="shipping postal-code"
          required
        />
      </FormGrid>
   
    </Grid>
  );
}
