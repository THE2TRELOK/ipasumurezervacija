const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51ObI6xHCqLwHfBqfXm0TNjs4mVmHXPGCIApz5ChSscMSw4U1NvU9b4qLvGL4EwCLWj8XB9gQYTnwt2yYMrJMo3zJ00YTvQlfcP');

const app = express();
app.use(cors());
app.use(express.json());

const YOUR_DOMAIN = 'http://localhost:3001';

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, locale } = req.body; 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Custom Payment',
            },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      locale: locale || 'lv', 
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));