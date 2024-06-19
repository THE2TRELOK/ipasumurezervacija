import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { message } from 'antd';

const CheckoutForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [sameAddress, setSameAddress] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, amount } = location.state || {};

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const formattedValue = value.replace(/(.{4})/g, '$1 ');
    setCardNumber(formattedValue.trim());
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 2) {
      setExpiryDate(value);
    } else if (value.length === 2) {
      setExpiryDate(value + '/');
    } else if (value.length > 2 && value.length <= 4) {
      setExpiryDate(value.slice(0, 2) + '/' + value.slice(2, 4));
    }
  };

  const handleCvvChange = (e) => setCvv(e.target.value);
  const handleSameAddressChange = (e) => setSameAddress(e.target.checked);

  const handleSubmit = async () => {
    // 1. Trim spaces from all relevant fields
    const trimmedCardNumber = cardNumber.trim();
    const trimmedExpiryDate = expiryDate.trim();
    const trimmedCvv = cvv.trim();

    // 2. Check if fields are not empty after trimming
    if (!trimmedCardNumber || !trimmedExpiryDate || !trimmedCvv) {
      message.error('Aizpildiet visus laukus');
      return;
    }

    // 3. Proceed with the payment if all fields are valid
    try {
      await updateDoc(doc(db, "Users", auth.currentUser.uid), {
        balance: userData.balance + parseFloat(amount),
      });

      message.success("Maksājums veiksmīgi veikts!");
      navigate('/profils');
    } catch (error) {
      message.error("Kluda maksājuma apstrādes laikā");
      console.error(error);
    }
  };

  return (
    <Box sx={{
      mt: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: '#f0f2f5',
    }}>
      <Box sx={{
        width: '80%',
        maxWidth: '700px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '3rem',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '2rem',
      }}>
        <Box sx={{ width: '45%' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
            Maksājuma informācija
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>Kartes informācija</Typography>
          <TextField
            label="Kartes numurs"
            value={cardNumber}
            onChange={handleCardNumberChange}
            fullWidth
            sx={{ mb: 1 }}
            inputProps={{
              maxLength: 19,
              style: { backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }
            }}
          />
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="MM / YY"
                fullWidth
                sx={{ mb: 1 }}
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                inputProps={{
                  maxLength: 5,
                  style: { backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="CVC"
                fullWidth
                sx={{ mb: 1 }}
                type="text"
                inputProps={{
                  maxLength: 4,
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                  style: { backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }
                }}
              />
            </Grid>
          </Grid>
          <Button variant="contained" sx={{ backgroundColor: '#007bff', color: '#fff', padding: '1rem 2rem', borderRadius: '10px', mt: 2 }} onClick={handleSubmit}>
            <CheckCircleOutline sx={{ mr: 1 }} />
            Apstiprināt {amount} EUR
          </Button>
        </Box>

        {/* Right Side - Order Summary */}
        <Box sx={{ width: '45%' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
            Konta papildināšana
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
            {amount} EUR
          </Typography>
          <Divider sx={{ marginY: '1rem' }} />
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Kopā
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
            {amount} EUR
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutForm;