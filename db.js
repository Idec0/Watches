// database
import { connect, SQL } from 'pyodbc';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.POSTGRES_URL;

export async function queryDatabase() {
  const connection = await connect(databaseUrl);
  const result = await connection.query(SQL`SELECT * FROM your_table`);
  connection.close();
  return result;
}