const stripe = require('stripe')('sk_test_51ObI6xHCqLwHfBqfXm0TNjs4mVmHXPGCIApz5ChSscMSw4U1NvU9b4qLvGL4EwCLWj8XB9gQYTnwt2yYMrJMo3zJ00YTvQlfcP');

app.post('/api/create-checkout-session', async (req, res) => {
  const { amount, userId, offerId, startDate, endDate } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Reservation',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });

  res.json({ id: session.id });
});
