"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<OrderHistoryPage />}
    </main>
  );
}

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      var username = localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false;
    }
    displayOrders(username);

  }, []);

  const displayOrders = async (username) => {
    try {
      // get discounts
      var user = {getOrders: username}
      const queryParams = new URLSearchParams(user).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setOrders(result);
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  {
    return (
      <main style={{width: '100%'}}>
         <div className='admin-panel-details' style={{margin: '10px 0', paddingTop: '10px'}}>
            <table style={{width: '80%'}}>
              <tbody>
                <tr>
                  <th>Date Of Purchase</th>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Delivery Date</th>
                </tr>
                {orders.map((order) => (
                <tr key={order.id}>                  
                  <td>{new Date(order.orderdate).toISOString().split('T')[0]}</td>
                  <td dangerouslySetInnerHTML={{ __html: order.products.replace(/,/g, "<br>") }} /> {/* dangerouslySetInnerHTML turns data raw */}
                  <td>£ {order.price}</td>
                  <td>{new Date(order.deliverydate).toISOString().split('T')[0]}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
      </main>
    );
  }
}

export default LoadPage;
