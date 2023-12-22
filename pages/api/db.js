import { Pool } from 'pg';
import dotenv from 'dotenv';

//export const outputs = "asd";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// export async function queryDatabase(discountCode) {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM discounts WHERE Discount_code = $1', [discountCode]);
//     client.release();
//     return result.rows;
//   } catch (error) {
//     console.error('Error querying the database:', error);
//     throw error;
//   }
// }


