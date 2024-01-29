"use client";

import 'styles/globals.css';
import React, { useEffect, useState } from "react";
import Navbar from "components/base.jsx";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <ViewWatchPage />
    </main>
  );
}

function ViewWatchPage() {
  const [img, setImg] = useState([]);
  const [goToBasketElement, setGoToBasketElement] = useState(null);

  let variable;


  if (typeof window !== "undefined") {
    const search = window.location.search;
    variable = new URLSearchParams(search).get("watch");
  }

  useEffect(() => {
    if (variable) {
      setImg(variable.split(","));
    }
    setGoToBasketElement("none");
  }, [variable]);

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
    var element = document.getElementById("goTobasket-container");    
    element.style.display = "flex";
    setGoToBasketElement(element.style.display);
  };

  const continueShopping = () => {
    var element = document.getElementById("goTobasket-container");    
    element.style.display = "none";
    setGoToBasketElement(element.style.display);
  }

  return (
    <main>
      <div id="goTobasket-container" className='goTobasket-container'>
        <div className='goTobasket'>
          <p>Item added to your basket</p>
          <button>Go To Basket</button>
          <p onClick={() => continueShopping()}><u style={{cursor: 'pointer'}}>Continue Shopping</u></p>
        </div>
      </div>
      
      {goToBasketElement === "none" && (
        <>
          <img className="displayWatch" src={img[4]} alt="Watch"></img>
          <div className="displayWatchInfo">
            <h1>
              <u>
                <b style={{textTransform: 'capitalize'}}>
                  {img ? img[1] : "N/A"}{" "}
                </b>
              </u>
            </h1>
            <p>{img[2]}</p>
            <p>£{img[3]}</p>
            <button style={{ color: "black" }} onClick={() => AddToBasket(img)}>
              Add To Basket
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default LoadPage;
