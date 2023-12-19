"use client";

import React, { useEffect, useState } from "react";
import Navbar from "components/base.jsx";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <ViewWatchPage />
    </main>
  );
}

function ViewWatchPage() {
  const [img, setImg] = useState([]);

  let variable;

  if (typeof window !== "undefined") {
    const search = window.location.search;
    variable = new URLSearchParams(search).get("watch");
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setImg(variable ? variable.split(",") : []);
    }
  }, []);

  const AddToBasket = (watchPos) => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      let basketList = [];
      const storedBasket = localStorage.getItem("Basket");

      basketList = JSON.parse(storedBasket) || [];

      if (!basketList.some((subarray) => subarray.includes(watchPos[2]))) {
        basketList.push(watchPos);
      }

      localStorage.setItem("Basket", JSON.stringify(basketList));
      console.log(localStorage.getItem("Basket"));
    }
  };

  return (
    <main>
      <img className="displayWatch" src={img[4]} alt="Watch"></img>
      <div className="flex flex-col items-center justify-between">
        <h1>
          <u>
            <b>
              {img[1]
                ? img[1].charAt(0).toUpperCase() + img[1].slice(1)
                : "N/A"}{" "}
            </b>
          </u>
        </h1>
        <p>{img[2]}</p>
        <p>£{img[3]}</p>
        <button style={{ color: "black" }} onClick={() => AddToBasket(img)}>
          Add To Basket
        </button>
      </div>
    </main>
  );
}

export default LoadPage;
