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
      payment_method: 'pm_card_visa',
      confirm: true,
    });
    console.log("a");
    console.log(paymentIntent);
    console.log("b");
    console.log(paymentIntent.latest_charge);

    res.status(200).json({ clientSecret: paymentIntent.client_secret, paymentIntent: paymentIntent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

