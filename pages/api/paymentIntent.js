import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {

  const { amount } = req.body;
  try {
    console.log(amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000,  // Amount in cents
      currency: 'GBP',
      description: 'Example Payment',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
