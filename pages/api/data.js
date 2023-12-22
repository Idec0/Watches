import { db } from '@vercel/postgres';

export default async function handler(request, response) {
  const client = await db.connect();

  try {
    const result = await client.query('SELECT * FROM discounts');
    const discounts = result.rows;

    return response.status(200).json({ discounts });
  } finally {
    client.release();
  }
}