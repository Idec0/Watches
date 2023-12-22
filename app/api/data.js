import { queryDatabase } from 'app/db.js';

export default async function handler(req, res) {
  const discountCode = "DISCOUNT123";
  try {
    const data = await queryDatabase(discountCode); // Fetch data from database
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}