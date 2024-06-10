// Import function triggers from their respective submodules:
const {onCall, onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const stripe = require("stripe")("sk_test_51ObI6xHCqLwHfBqfXm0TNjs4mVmHXPGCIApz5ChSscMSw4U1NvU9b4qLvGL4EwCLWj8XB9gQYTnwt2yYMrJMo3zJ00YTvQlfcP"); // replace with your Stripe secret key

admin.initializeApp();
const db = admin.firestore();

// Create a callable function to create a payment intent
exports.createPaymentIntent = onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition", "The function must be called while authenticated.");
  }

  const amount = data.amount;
  const userId = context.auth.uid;

  if (amount <= 0) {
    throw new functions.https.HttpsError("invalid-argument", "The amount must be greater than zero.");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe amount is in cents
    currency: "usd",
    metadata: {userId},
  });

  return {clientSecret: paymentIntent.client_secret};
});

// Create an HTTP function to handle Stripe webhook events
exports.updateUserBalance = onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = "your-stripe-webhook-secret"; // replace with your Stripe webhook secret

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    logger.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata.userId;
    const amount = paymentIntent.amount / 100;

    const userRef = db.collection("Users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const newBalance = (userData.balance || 0) + amount;

      await userRef.update({balance: newBalance});
      logger.info(`User ${userId} balance updated to ${newBalance}`);
    }
  }

  res.json({received: true});
});
