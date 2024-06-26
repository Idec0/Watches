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
    // get watch details
    if(discountCode.length > 15 && discountCode.slice(0, 15) === "getWatchDetails"){
      const queryParams = new URLSearchParams(discountCode);
      const product_name = queryParams.get("product_name");
      result = await client.query('SELECT * FROM watch_details WHERE product_name = $1', [product_name]);
      const details = result.rows;
      return response.status(200).json({ details });
    }
    
    // get selected address
    if(discountCode.length > 18 && discountCode.slice(0, 18) === "getSelectedAddress"){
      const queryParams = new URLSearchParams(discountCode);
      const address_id = queryParams.get("getSelectedAddress");
      result = await client.query('SELECT * FROM addresses WHERE id = $1', [address_id]);
      const details = result.rows;
      return response.status(200).json({ details });
    }
    
    // delete selected address
    if(discountCode.length > 15 && discountCode.slice(0, 15) === "addressToDelete"){
      const queryParams = new URLSearchParams(discountCode);
      const address_id = queryParams.get("addressToDelete");
      result = await client.query('DELETE FROM addresses WHERE id = $1', [address_id]);
      const details = result.rows;
      return response.status(200).json({ details });
    }

    // save address
    if(discountCode.length > 9 && discountCode.slice(0, 9) === "firstname"){
      const queryParams = new URLSearchParams(discountCode);
      const firstname = queryParams.get("firstname");
      const lastname = queryParams.get("lastname");      
      const addressLine1 = queryParams.get("addressLine1");
      const addressLine2 = queryParams.get("addressLine2");
      const city = queryParams.get("city");
      const postcode = queryParams.get("postcode");
      const phoneNumber = queryParams.get("phoneNumber");
      const email = queryParams.get("email");
      const username = queryParams.get("username");
      await client.query('BEGIN');
      await client.query(
        'INSERT INTO addresses (firstname, lastname, addressLine1, addressLine2, city, postcode, phoneNumber, email, username) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[firstname, lastname, addressLine1, addressLine2, city, postcode, phoneNumber, email, username]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    } 

    // get watches image 2 and 3
    if(discountCode.length > 9 && discountCode.slice(0, 9) === "getImages"){
      const queryParams = new URLSearchParams(discountCode);
      const product_name = queryParams.get("product_name");
      result = await client.query('SELECT * FROM brands WHERE product_name = $1', [product_name]);
      const imgs = result.rows;
      return response.status(200).json({ imgs });
    }

    // checks if user is admin 
    if(discountCode.length > 7 && discountCode.slice(0, 7) === "isAdmin"){
      const queryParams = new URLSearchParams(discountCode);
      const username = queryParams.get("isAdmin");
      result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows;
      return response.status(200).json({ user });
    }

    // get all discounts
    if(discountCode === "get_discounts"){
      result = await client.query('SELECT * FROM discounts');
      const discounts = result.rows;
      return response.status(200).json(discounts);
    }
    // get all sales
    if(discountCode === "get_sales"){
      result = await client.query('SELECT * FROM sales');
      const sales = result.rows;
      return response.status(200).json(sales);
    }
    // get all orders
    if(discountCode.length > 9 && discountCode.slice(0, 9) === "getOrders"){
      const queryParams = new URLSearchParams(discountCode);
      const user = queryParams.get("getOrders");
      result = await client.query('SELECT * FROM orders WHERE "user" = $1', [user]);
      const orders = result.rows;
      return response.status(200).json(orders);
    }
    // get all addresses
    if(discountCode.length > 12 && discountCode.slice(0, 12) === "getAddresses"){
      const queryParams = new URLSearchParams(discountCode);
      const user = queryParams.get("getAddresses");
      result = await client.query('SELECT * FROM addresses WHERE "username" = $1', [user]);
      const orders = result.rows;
      return response.status(200).json(orders);
    }

    // add new order
    if(discountCode.length > 8 && discountCode.slice(0, 8) === "newOrder"){
      const queryParams = new URLSearchParams(discountCode);
      const user = queryParams.get("user");
      const orderDate = queryParams.get("orderDate");
      const products = queryParams.get("products");
      const price = queryParams.get("price");
      const deliveryDate = queryParams.get("deliveryDate");
      const chargeId = queryParams.get("charge_id");
      await client.query('BEGIN');
      await client.query(
        'INSERT INTO orders ("user", orderDate, products, price, deliveryDate, charge_id) VALUES ($1, $2, $3, $4, $5, $6)',[user, orderDate, products, price, deliveryDate, chargeId]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    }

    // save discount changes
    if(discountCode.length > 21 && discountCode.slice(0, 21) === "save_discount_changes"){
      const queryParams = new URLSearchParams(discountCode);
      const discount_code = queryParams.get("discount_code");
      const discount_amount = queryParams.get("discount_amount");
      const end_date = queryParams.get("end_date");

      var date = new Date(end_date);
      var formattedDate = date.toDateString() + " " + date.toTimeString() + " GMT+0000 (Greenwich Mean Time)";
      await client.query('BEGIN');
      await client.query(
        "UPDATE discounts SET discount_amount = $2, end_date = $3 WHERE discount_code = $1", [discount_code, discount_amount, date]
      );
      await client.query('COMMIT')
      return;
    }
    // save watches changes
    if(discountCode.length > 18 && discountCode.slice(0, 18) === "save_watch_changes"){
      const queryParams = new URLSearchParams(discountCode);
      const product_name = queryParams.get("product_name");
      const brand = queryParams.get("brand");
      const image_url = queryParams.get("image_url");
      const image_url_2 = queryParams.get("image_url_2");
      const image_url_3 = queryParams.get("image_url_3");
      const price = queryParams.get("price");
      await client.query('BEGIN');
      await client.query(
        "UPDATE brands SET product_name = $1, brand_name = $2, image_url = $3, image_url_2 = $4, image_url_3 = $5, price = $6 WHERE product_name = $1", [product_name, brand, image_url, image_url_2, image_url_3, price]
      );
      await client.query('COMMIT')
      return;
    }
    // save sale changes
    if(discountCode.length > 17 && discountCode.slice(0, 17) === "save_sale_changes"){
      const queryParams = new URLSearchParams(discountCode);
      const sale_id = queryParams.get("sale_id");
      const banner_url = queryParams.get("banner_url");
      const sale_amount = queryParams.get("sale_amount");
      const start_date = queryParams.get("start_date");
      const end_date = queryParams.get("end_date");

      var date1 = new Date(start_date);
      var date2 = new Date(end_date);
      await client.query('BEGIN');
      await client.query(
        "UPDATE sales SET sale_banner_url = $2, sale_amount = $3, sale_start_date = $4, sale_end_date = $5 WHERE id = $1", [sale_id, banner_url, sale_amount, date1, date2]
      );
      await client.query('COMMIT')
      return;
    }

    // delete discount
    if(discountCode.length > 15 && discountCode.slice(0, 15) === "delete_discount"){
      const queryParams = new URLSearchParams(discountCode);
      const discount_code = queryParams.get("delete_discount");
      await client.query('BEGIN');
      await client.query(
        'DELETE FROM discounts WHERE discount_code = $1',[discount_code]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    }
    // delete sale
    if(discountCode.length > 11 && discountCode.slice(0, 11) === "delete_sale"){
      const queryParams = new URLSearchParams(discountCode);
      const sale_id = queryParams.get("delete_sale");
      await client.query('BEGIN');
      await client.query(
        'DELETE FROM sales WHERE id = $1',[sale_id]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    }
    // delete order
    if(discountCode.length > 12 && discountCode.slice(0, 12) === "delete_order"){
      const queryParams = new URLSearchParams(discountCode);
      const order_id = queryParams.get("delete_order");
      await client.query('BEGIN');
      await client.query(
        'DELETE FROM orders WHERE id = $1',[order_id]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    }

    // add new discount
    if(discountCode.length > 12 && discountCode.slice(0, 12) === "add_discount"){
      const queryParams = new URLSearchParams(discountCode);
      const discount_code = queryParams.get("discount_code");
      const discount_amount = queryParams.get("discount_amount");
      const end_date = queryParams.get("end_date");
      await client.query('BEGIN');
      await client.query(
        "INSERT INTO discounts (discount_code, discount_amount, end_date) VALUES ($1, $2, $3)",[discount_code, discount_amount, end_date]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    }

    // add new sale
    if(discountCode.length > 8 && discountCode.slice(0, 8) === "add_sale"){
      const queryParams = new URLSearchParams(discountCode);
      const sale_banner_url = queryParams.get("banner_url");
      const sale_amount = queryParams.get("sale_amount");
      const start_date = queryParams.get("start_date");
      const end_date = queryParams.get("end_date");
      await client.query('BEGIN');
      await client.query(
        "INSERT INTO sales (sale_banner_url, sale_amount, sale_start_date, sale_end_date) VALUES ($1, $2, $3, $4)",[sale_banner_url, sale_amount, start_date, end_date]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    }

    // add new watch
    if(discountCode.length > 10 && discountCode.slice(0, 10) === "brand_name"){
      const queryParams = new URLSearchParams(discountCode);
      const brand_name = queryParams.get("brand_name");
      const image_url = queryParams.get("image_url");
      const image_url2 = queryParams.get("image_url2");
      const image_url3 = queryParams.get("image_url3");
      const product_name = queryParams.get("product_name");
      const price = queryParams.get("price");
      await client.query('BEGIN');
      await client.query(
        "INSERT INTO brands (brand_name, image_url, product_name, price) VALUES ($1, $2, $3, $4)",[brand_name, [image_url, image_url2, image_url3], product_name, price]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    }

    // check if username is already taken
    if(discountCode.length > 13 && discountCode.slice(0, 13) === "usernameCheck"){
      const queryParams = new URLSearchParams(discountCode);
      const username = queryParams.get("usernameCheck");
      result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

      const user = result.rows;

      if(user.length > 0){
        return response.status(200).json('true');
      }
      return response.status(200).json('false');
    }

    // check if email is already taken
    if(discountCode.length > 10 && discountCode.slice(0, 10) === "emailCheck"){
      const queryParams = new URLSearchParams(discountCode);
      const email = queryParams.get("emailCheck");
      result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

      const user = result.rows;

      if(user.length > 0){
        return response.status(200).json('true');
      }
      return response.status(200).json('false');
    }

    // check if new user should be added
    if(discountCode.length > 8 && discountCode.slice(0, 8) === "username"){
      const queryParams = new URLSearchParams(discountCode);
      const password = queryParams.get("password");
      // Hash the password before storing it
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      //const passwordMatch = await bcrypt.compare(password, hash);

      await client.query('BEGIN');
      console.log(queryParams.get("email"));
      await client.query(
        "INSERT INTO users (username, password, firstname, surname, admin, email, suspended_date, ban) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",[queryParams.get("username"), hash, queryParams.get("firstname"), queryParams.get("lastname"), false, queryParams.get("email"), "none", "false"]
      );
      await client.query('COMMIT');
      return response.status(200).json('User Added Successfully');
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
        return response.status(200).json({ user });
      } else {
        return response.status(200).json('Unauthorized');
      } 
    }
    if(discountCode === "get_users"){
      result = await client.query('SELECT * FROM users');
      const users = result.rows;
      return response.status(200).json({ users });
    }
    // delete user
    if(discountCode.length > 11 && discountCode.slice(0, 11) === "delete_user"){
      const queryParams = new URLSearchParams(discountCode);
      const user_id = queryParams.get("delete_user");
      await client.query('BEGIN');
      await client.query(
        'DELETE FROM user WHERE id = $1',[user_id]
      );
      await client.query('COMMIT')
      return response.status(200).json("Successful");
    }
    // save user changes
    if(discountCode.length > 17 && discountCode.slice(0, 17) === "save_user_changes"){
      const queryParams = new URLSearchParams(discountCode);
      const user_id = queryParams.get("user_id");
      const user_suspended_until = queryParams.get("user_suspended_until");
      const user_ban = queryParams.get("user_ban");
      const user_admin = queryParams.get("user_admin");

      await client.query('BEGIN');
      await client.query(
        "UPDATE users SET suspended_date = $2, ban = $3, admin = $4 WHERE id = $1", [user_id, user_suspended_until, user_ban, user_admin]
      );
      await client.query('COMMIT')
      return;
    }

    // reset users suspension
    if(discountCode.length > 16 && discountCode.slice(0, 16) === "reset_suspension"){
      const queryParams = new URLSearchParams(discountCode);
      const username = queryParams.get("reset_suspension");

      await client.query('BEGIN');
      await client.query(
        "UPDATE users SET suspended_date = $2 WHERE username = $1", [username, "none"]
      );
      await client.query('COMMIT')
      return;
    }

    // checks users suspension
    if(discountCode.length > 14 && discountCode.slice(0, 14) === "userSuspension"){
      const queryParams = new URLSearchParams(discountCode);
      const username = queryParams.get("userSuspension");
      result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows;
      return response.status(200).json({ user });
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