import stripePackage from 'stripe';

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { chargeId, amount } = req.body;
    const new_amount = parseInt((amount * 100) , 10);
    console.log(new_amount);
    try {
      // Create a refund for the charge
      const refund = await stripe.refunds.create({
        charge: chargeId,
        amount: new_amount,
      });

      res.status(200).json(refund);
    } catch (error) {
      console.error('Error creating refund:', error);
      res.status(500).json({ error: 'An error occurred while processing the refund.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
