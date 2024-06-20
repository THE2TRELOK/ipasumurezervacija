import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { message } from 'antd';
import moment from 'moment';

const CheckoutForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, amount } = location.state || {};

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const formattedValue = value.replace(/(.{4})/g, '$1 ');
    setCardNumber(formattedValue.trim());
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/[^0-9\/]/g, '');
    const currentDate = moment();
    const currentMonth = currentDate.month() + 1; // moment().month() is zero-based
    const currentYear = currentDate.year() % 100; // Get last two digits of the year

    if (value.length <= 2) {
      setExpiryDate(value);
    } else if (value.length === 3 && value.charAt(2) !== '/') {
      setExpiryDate(value.slice(0, 2) + '/' + value.slice(2));
    } else if (value.length === 5) {
      const [month, year] = value.split('/');

      if (parseInt(month, 10) > 12) {
        message.error('Mēnesis nevar būt lielāks par 12');
        return;
      }

      if (parseInt(year, 10) < currentYear) {
        message.error('Gads nevar būt mazāks par pašreizējo gadu');
        return;
      }

      if (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth) {
        message.error('Karte ir beigusies derīguma termiņš');
        return;
      }

      setExpiryDate(value);
    } else {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e) => setCvv(e.target.value);

  const handleSubmit = async () => {
    // 1. Check if fields are not empty
    if (!cardNumber || !expiryDate || !cvv) {
      message.error('Aizpildiet visus laukus');
      return;
    }

  

    // 3. Show loading indicator
    setIsLoading(true);

    // 4. Simulate a 3-second loading delay (replace with your actual payment logic)
    await new Promise((resolve) => setTimeout(resolve, 3000)); 

    // 5. Proceed with the payment if all fields are valid
    try {
      // Update the user's balance in the database
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {
        balance: userData.balance + parseFloat(amount),
      });

      message.success('Maksājums veiksmīgi veikts!');
      // Navigate back to the profile page
      navigate('/profils');
    } catch (error) {
      message.error('Kluda maksājuma apstrādes laikā');
      console.error(error);
    } finally {
      // Hide loading indicator after payment processing (success or error)
      setIsLoading(false);
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
                value={cvv}
                onChange={handleCvvChange}
                inputProps={{
                  maxLength: 4,
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                  style: { backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }
                }}
              />
            </Grid>
          </Grid>
          {isLoading ? ( // Show loading spinner if isLoading is true
            <CircularProgress sx={{ mt: 2 }} />
          ) : (
            <Button variant="contained" sx={{ backgroundColor: '#007bff', color: '#fff', padding: '1rem 2rem', borderRadius: '10px', mt: 2 }} onClick={handleSubmit}>
              <CheckCircleOutline sx={{ mr: 1 }} />
              Apstiprināt {amount} EUR
            </Button>
          )}
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