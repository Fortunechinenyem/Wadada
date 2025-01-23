import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, currency } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      res.status(200).json(paymentIntent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
