import React from 'react';
import { Button, TextField } from '@mui/material';

const CheckoutForm = ({ amount, setAmount }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, locale: 'lv' }), // Передаем locale
    });

    if (response.ok) {
      const { url } = await response.json();
      window.location.href = url;
    } else {
      const error = await response.json();
      console.error('Error creating checkout session:', error);
      alert(`Error: ${error.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Maksājuma summa (EUR)"
        variant="outlined"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{ marginBottom: '1rem' }}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
        Apmaksāt {amount} EUR
      </Button>
    </form>
  );
};

export default CheckoutForm;
