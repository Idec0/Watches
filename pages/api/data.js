import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(request, response) {
  const client = await db.connect();
  let result;

  try {
    const discountCode = request.query.discount_code;
    if (!discountCode) {
      return response.status(400).json({ error: 'Discount code is required.' });
    }

    // check if new user should be added
    if(discountCode.length > 8 && discountCode.slice(0, 8) === "username"){
      const queryParams = new URLSearchParams(discountCode);
      const password = queryParams.get("password");
      // Hash the password before storing it
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      console.log('Hashed Password:', hash);
      await client.query('BEGIN');
      await client.query(
        "INSERT INTO users (username, password, firstname, surname, admin, email) VALUES ($1, $2, $3, $4, $5, $6)",[queryParams.get("username"), hash, queryParams.get("firstname"), queryParams.get("lastname"), false, queryParams.get("email")]
      );
      await client.query('COMMIT');
      return;
    }
    // login info
    if(discountCode.length > 5 && discountCode.slice(0, 5) === "email"){
      const queryParams = new URLSearchParams(discountCode);
      const email = queryParams.get("email");
      const password = queryParams.get("password");
      result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows;
      const passwordMatch = await bcrypt.compare(password, user[0].password);
      if (passwordMatch) {
        console.log('Password is correct');
        return response.status(200).json({ user });
      } else {
        console.log('Password is incorrect');
        return response.status(401).json('Unauthorized');
      } 
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
    console.error('Error fetching data:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
}