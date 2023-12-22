// connect to database
// db.js

import { createPool, SQL } from 'pyodbc';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.POSTGRES_URL;

// Create a connection pool
const pool = createPool({
  connectionString: databaseUrl,
});

// security to prevent SQL injections
export async function queryDatabase(discountCode) {
  try {
    const connection = await connect(databaseUrl);
    const result = await connection.query(SQL`SELECT * FROM discounts WHERE Discount_code = ${discountCode}`);
    connection.close();
    return result;
  } catch (error) {
    console.error('Error querying the database:', error);
    throw error;
  }
}
