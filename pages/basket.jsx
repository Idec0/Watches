"use client";

import 'styles/globals.css';
import React, { useEffect, useState } from "react";
import Navbar from "components/base.jsx";
import viewWatchURL from "pages/watches.jsx";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  const [data, setData] = useState(null);

  useEffect(() => {
    const discountCode = 'DISCOUNT123';
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(discountCode)}`);
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  console.log(JSON.stringify(data, null, 2));

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <BasketPage />
    </main>
  );
}

const Bin = (watch) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    let basketList = [];
    const storedBasket = localStorage.getItem("Basket");
    basketList = JSON.parse(storedBasket) || [];
    const watchToRemoveIndex = basketList.findIndex((subarray) =>
      subarray.includes(watch[2])
    );
    if (watchToRemoveIndex !== -1) {
      basketList.splice(watchToRemoveIndex, 1);
      localStorage.setItem("Basket", JSON.stringify(basketList));
    }
    window.location.reload();
  }
};

function BasketPage() {
  const [total, setTotal] = useState(0);
  const [basketItems, setBasketItems] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedBasket = localStorage.getItem("Basket");
      const parsedBasket = JSON.parse(storedBasket) || [];
      setBasketItems(parsedBasket);
  
      let calculatedTotal = 0;
      parsedBasket.forEach((watch) => {
        calculatedTotal += parseInt(watch[3]);
      });
  
      setTotal(calculatedTotal);
    }
  }, []);

  return (
    <main style={{ display: "contents" }}>
      <div>{/* Your page content here */}</div>
      {basketItems.map((watch, index) => (
        <div className="grid-container" key={index}>
          <div>
            <img
              className="item1 displayWatch"
              src={watch[4]}
              alt={watch[2]}
              onClick={() => viewWatchURL(watch)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="item2 items-center justify-between">
            <div>
              <div style={{ float: "left" }}>
                <h1>
                  <u>
                    <b>{watch[2]}</b>
                  </u>
                </h1>
              </div>
              <div>
                <p onClick={() => Bin(watch)} style={{ cursor: "pointer" }}>
                  🗑️
                </p>
              </div>
            </div>
            <p>£{watch[3]}</p>
          </div>
          {index === 0 && (
            <div className="item3">
              <p>Total: £{total}</p>
              <input type="text" id="discountInput" placeholder="Apply Discount Code:" style={{ textAlign: "center", color: "black" }} />
              <button style={{ color: "black" }}>Proceed to Checkout</button>
            </div>
          )}
        </div>
      ))}
    </main>
  );
}

export default LoadPage;
