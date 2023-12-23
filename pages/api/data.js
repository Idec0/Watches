import { db } from '@vercel/postgres';

export default async function handler(request, response) {
  const client = await db.connect();
  let result;

  try {
    const discountCode = request.query.discount_code;

    if (!discountCode) {
      return response.status(400).json({ error: 'Discount code is required.' });
    }
    // $1 prevents SQL injections
    if(discountCode === "Brands"){
       result = await client.query('SELECT * FROM brands');
    }
    else{
       result = await client.query('SELECT * FROM discounts WHERE Discount_code = $1', [discountCode]);
    }

    const discounts = result.rows;

    return response.status(200).json({ discounts });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
}
