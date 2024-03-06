import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {

  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,  // Amount in cents
      currency: 'GBP',
      description: 'Example Payment',
    });

    let chargeId = makePayment();
    res.status(200).json({ clientSecret: paymentIntent.client_secret, chargeId: chargeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to confirm PaymentIntent and extract Charge ID
async function makePayment() {
  try {
    // Create PaymentIntent
    const paymentIntent = await createPaymentIntent();
    
    // Confirm PaymentIntent
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa', // Use a test payment method here
    });

    // Extract Charge ID
    const chargeId = confirmedPaymentIntent.charges.data[0].id;
    console.log('Charge ID:', chargeId);
    return chargeId;
  } catch (error) {
    console.error('Error making payment:', error);
  }
}
