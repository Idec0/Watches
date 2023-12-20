"use client";

import React, { useEffect, useState } from "react";
import Navbar from "components/base.jsx";
import viewWatchURL from "app/watches/page.jsx";
import dynamic from 'next/dynamic';

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  const BasketPageNoSSR = dynamic(() => import('basket/page.jsx'), {
    ssr: false,
  });

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <BasketPage />
    </main>
  );
}

const Bin = (watch) => {
  if (typeof window !== 'undefined') {
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
  }
};

function BasketPage() {
  const [total, setTotal] = useState(0);
  const [basketItems, setBasketItems] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  const postgresUrl = process.env.POSTGRES_URL;
  console.log(postgresUrl);

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
